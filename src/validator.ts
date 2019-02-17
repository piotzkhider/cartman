import { APIGatewayProxyResult } from 'aws-lambda';
import { verify as verifySignature } from './verification';
import Body from './body';

export default class Validator {
  private readonly headers: Headers;
  private readonly body: Body;

  private result: APIGatewayProxyResult;

  private constructor(headers: Headers, body: Body) {
    this.headers = headers;
    this.body = body;
  }

  static create(headers: Headers, body: Body) {
    return new Validator(headers, body);
  }

  fails(): boolean {
    const signature = this.headers['X-Hub-Signature'] as string;
    const guid = this.headers['X-GitHub-Delivery'] as string;
    const event = this.headers['X-GitHub-Event'] as string;

    if (!signature) {
      this.result = {
        statusCode: 401,
        headers: { 'Content-Type': 'text/plain' },
        body: 'No X-Hub-Signature found on request'
      };

      return true;
    }

    if (!guid) {
      this.result = {
        statusCode: 401,
        headers: { 'Content-Type': 'text/plain' },
        body: 'No X-Github-Delivery found on request'
      };

      return true;
    }

    if (!event) {
      this.result = {
        statusCode: 422,
        headers: { 'Content-Type': 'text/plain' },
        body: 'No X-Github-Event found on request'
      };

      return true;
    }

    if (event !== 'organization') {
      this.result = {
        statusCode: 422,
        headers: { 'Content-Type': 'text/plain' },
        body: `Unexpected X-GitHub-Event: ${event}`
      };
    }

    if (!verifySignature(signature, JSON.stringify(this.body))) {
      this.result = {
        statusCode: 401,
        headers: { 'Content-Type': 'text/plain' },
        body: "X-Hub-Signature incorrect. Github webhook token doesn't match"
      };

      return true;
    }

    if (this.body.action !== 'member_added') {
      this.result = {
        statusCode: 422,
        headers: { 'Content-Type': 'text/plain' },
        body: `Unexpected action: ${this.body.action}`
      };
    }

    return false;
  }

  error(): APIGatewayProxyResult {
    return this.result;
  }
}

interface Headers {
  [name: string]: string;
}

import { APIGatewayProxyEvent } from 'aws-lambda';
import * as crypto from 'crypto';

export class Request {
  private readonly event;

  constructor(event: APIGatewayProxyEvent) {
    this.event = event;
  }

  isOrganizationEvent(): boolean {
    return this.headers['X-GitHub-Event'] === 'organization';
  }

  verifySignature(): boolean {
    return this.headers['X-Hub-Signature'] === this.calculateSignature();
  }

  private calculateSignature(): string {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    const calculated = crypto
      .createHmac('sha1', secret)
      .update(this.body, 'utf8')
      .digest('hex');

    return `sha1=${calculated}`;
  }

  get body(): string | null {
    return this.event.body;
  }

  get headers(): { [name: string]: string } {
    return this.event.headers;
  }

  get user(): string {
    return JSON.parse(this.body).membership.user.login;
  }

  get organization(): string {
    return JSON.parse(this.body).organization.login;
  }
}

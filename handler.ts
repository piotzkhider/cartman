import { APIGatewayProxyHandler } from 'aws-lambda';
import { addUserToOrganizationTeams } from './src/addition';
import { Request } from './src/request';

const defaultTeams: string[] = ['<your_default_team1>', '<your_default_team2>'];

export const hello: APIGatewayProxyHandler = async event => {
  const request = new Request(event);

  if (!request.isOrganizationEvent()) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Unexpected X-GitHub-Event received.'
      })
    };
  }

  if (!request.verifySignature()) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "X-Hub-Signature incorrect. Github webhook token doesn't match"
      })
    };
  }

  await addUserToOrganizationTeams(request.user, request.organization, defaultTeams);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success!',
      input: event
    })
  };
};

import { APIGatewayProxyHandler } from 'aws-lambda';
import Validator from './src/validator';
import { addUserToOrganizationTeams } from './src/addition';
import Body from './src/body';

const organization: string = '<your_organization>';
const defaultTeams: string[] = ['<your_default_team1>', '<your_default_team2>'];

export const hello: APIGatewayProxyHandler = async event => {
  const headers = event.headers;
  const body: Body = JSON.parse(event.body);
  const user = body.membership.user;

  const validator = Validator.create(headers, body);

  if (validator.fails()) {
    return validator.error();
  }

  await addUserToOrganizationTeams(user, organization, defaultTeams);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success!',
      input: event
    })
  };
};

import { APIGatewayProxyHandler } from 'aws-lambda';
import * as dotenv from 'dotenv';
import Validator from './src/validator';
import { addUserToOrganizationTeams } from './src/addition';
import Body from './src/body';

dotenv.config();

const organization: string = '<your_organization>';
const defaultTeams: string[] = ['<your_default_teams>'];

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

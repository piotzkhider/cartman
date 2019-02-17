import * as Octkit from '@octokit/rest';

const octokit = new Octkit({
  auth: `token ${process.env.GITHUB_ACCESS_TOKEN}`
});

export async function addUserToOrganizationTeams(
  user: User,
  organization: string,
  teamNames: string[]
) {
  const teams = await retrieveTeamsByCriteria({
    organization: organization,
    names: teamNames
  });

  await addUserToTeams(user, teams);
}

async function retrieveTeamsByCriteria(criteria: Criteria): Promise<Team[]> {
  const response = await octokit.teams.list({ org: criteria.organization });

  return response.data.filter(team => criteria.names.includes(team.name));
}

async function addUserToTeams(user: User, teams: Team[]) {
  return Promise.all(teams.map(team => addUserToTeam(user, team)));
}

async function addUserToTeam(user: User, team: Team) {
  return octokit.teams.addOrUpdateMembership({
    team_id: team.id,
    username: user.login
  });
}

export interface User {
  login: string;
}

interface Team {
  id: number;
  name: string;
}

interface Criteria {
  organization: string;
  names: string[];
}

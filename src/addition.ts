import * as Octkit from '@octokit/rest';

const octokit = new Octkit({
  auth: `token ${process.env.GITHUB_ACCESS_TOKEN}`
});

export async function addUserToOrganizationTeams(
  user: string,
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

async function addUserToTeams(user: string, teams: Team[]) {
  return Promise.all(teams.map(team => addUserToTeam(user, team.id)));
}

async function addUserToTeam(user: string, team: number) {
  return octokit.teams.addOrUpdateMembership({
    team_id: team,
    username: user
  });
}

interface Team {
  id: number;
  name: string;
}

interface Criteria {
  organization: string;
  names: string[];
}

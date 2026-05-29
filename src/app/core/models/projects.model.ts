import { Team } from "./teams-model"

export interface Projects {
    projectId: string,
    name: string,
    provider: string,
    repoOwner: string,
    repoName: string,
    defaultBranch: string,
    accessToken: string,
    createdBy: string,
    createdAt: string,
    totalUsers: string,
    totalTasks: string,
    isAssigned: string,
    hasConfig:string,
    teams: Team[]
}
export interface Project {
    name: string,
    provider: string,
    repoName: string,
    repoOwner: string,
    defaultBranch: string,
    accessToken: string,
    teams: []
}

export interface Boards{
    id: string,
    key: string,
    name: string,
    type: string
}

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
    hasConfig:string
}
export interface Project {
    name: string,
    provider: string,
    repoName: string,
    repoOwner: string,
    defaultBranch: string,
    accessToken: string,
}
export interface Boards{
    id: string,
    key: string,
    name: string,
    type: string
}
export interface Projects {
    projectId: string,
    name: string,
    platform: string,
    repoURl: string,
    createdBy: string,
    createdAt: string,
    totalUsers: string,
    totalTasks: string,
    isAssigned: string,
    hasConfig:string
}
export interface Project {
    name: string,
    platform: string,
    repoURl: string,
}
export interface Boards{
    id: string,
    key: string,
    name: string,
    type: string
}
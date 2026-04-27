import { User } from "./auth-models";

export interface TasksQuery {
    pageNumber: number,
    pageSize: number,
    companyId: string,
    projectIds?: number[];
    assignedToIds?: string[];
    status: string,
    priority: string,
    search: string,

}
export interface PagedResult {
    items: Tasks[];
    totalCount: number;
}
export interface Tasks {
    taskId: number,
    projectName: string,
    title: string,
    description: string,
    status: string,
    importStatus: string,
    projectId: number,
    companyId: number,
    members: Members[],
    priority: string,
}
export interface Members{
    id:string
}
export interface TaskMembersResponse {
  assignedMembers: User[];
  availableMembers: User[];
}
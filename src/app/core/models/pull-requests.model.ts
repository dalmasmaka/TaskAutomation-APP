export interface PagedPrResult {
    items: PRsQuery[];
    totalCount: number;
}
export interface PRsQuery{
 pageNumber: number,
    pageSize: number,
    companyId: string,
    projectIds?: number[];
    taskIds?: number[];
    createdByIds?: string[];
    status: string,
    priority: string,
    search: string,

}

export interface PullRequest {
    taskId: string;
    projectId: number;
    projectName: string;
    createdById: string;
    branchName: string;
    prUrl: string;
    prName: string;
    prDescription?: string;
    status?: string;
    createdBy?: string;
}
export interface PrSelections {
    createdById: string[];
    status: string[];
    project: number[];
    task: number[];
}
export interface Review {
    prId: number;
    taskId: string;
    projectId: number;
    comment: string;
    decision: string;
}
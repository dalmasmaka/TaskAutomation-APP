export interface CompanyUser {
    id: string,
    fullName: string
}
export interface CompanyProject {
    projectId: number,
    name: string
}
export interface CompanyAssets {
    assigners: CompanyUser[],
    projects: CompanyProject[]
}
export interface Team {
    teamId: number | 0;
    teamName: string,
    companyId: number,
    createdAt: string,
    actionByUserId: string,
    createdByUser: string
}
export interface ProjectTeam {
    teamId: number,
    teamName: string,
    companyId: number,
    assignedAt: string,
}
export interface TeamMember {
    id: string,
    teamId: number
    fullName: string,
    email: string,
    role: string,
    userId: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    invitedBy: string,
    updatedBy: string,
    teamName: string
}
export interface TeamMembers {
    activeMembers: TeamMember[],
    declinedMembers: TeamMember[],
    pendingMembers: TeamMember[]
}
export interface MemberTeams{
    activeTeams: TeamMember[];
    pendingInvitations: TeamMember[]
    teamLogs: TeamMember[]
}
export enum MembershipStatus {
  PendingApproval = 0,
  Active = 1,
  Declined = 2
}
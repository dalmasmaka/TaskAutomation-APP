export interface InvitationCodes{
    invitationCode: string,
    expirationStatus: string,
    stringRole: string
}
export interface GenerateInvitation {
    expiryDate: string;
    role: number; 
}
export interface InvitationCodes{
    invitationCode: string,
    expirationStatus: string,
    stringRole: string
}
export interface GenerateInvitation {
    expiryDate: string;
    role: number; // Or a specific type/enum if you have it defined
}
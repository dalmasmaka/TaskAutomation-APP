export interface Login{
    email: string;
    password: string;
}
export interface Register{
    fullname: string;
    username: string;
    email: string;
    password: string;
    role: string
}
export interface User{
    id:string;
    fullName: string;
    email: string, 
    role: string,
    phoneNumber: string,
    passwordHash: string
}
export interface UserGitHub{
    id: number;
    username: string;
    accessToken: string;
}
export interface Role{
    roleId:string;
    roleName:string;
}
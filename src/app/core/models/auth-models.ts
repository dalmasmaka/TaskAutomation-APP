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
    name: string;
    lastname: string,
    email: string, 
    role: string,
    phoneNumber: string,
    passwordHash: string
}
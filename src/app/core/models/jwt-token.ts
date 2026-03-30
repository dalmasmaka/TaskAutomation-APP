export interface JwtToken {
    sub: string
    email: string
    role: string
    exp: number
    iat: number
}
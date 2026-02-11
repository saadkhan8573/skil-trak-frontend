import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
    email: string
    id: number
    role: string
    document: number
    iat: number
    exp: number
}

export const extractTokenData = (token: string): JwtPayload => {
    return jwtDecode<JwtPayload>(token)
}

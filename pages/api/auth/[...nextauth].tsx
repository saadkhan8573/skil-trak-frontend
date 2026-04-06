import axios from 'axios'
import { jwtDecode as jwt } from 'jwt-decode'
import mem from 'mem'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

interface User {
    id: string
    name: string
    email: string
    role: string
    accessToken: string
    refreshToken: string
}

interface Token {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error: string
    user: User
}

interface ExtendedCredentials extends Record<'email' | 'password', string> {
    url?: string
}

const REFRESH_TOKEN_THRESHOLD = 60 * 5 // seconds
const THROTTLE_INTERVAL = 30 * 1000

const getUserCredentials = (access_token: string) => {
    try {
        return jwt(access_token) as { exp: number }
    } catch (error) {
        return null
    }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_END_POINT}/auth/refresh/token`,
            {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token?.refreshToken}`,
                    'Content-Type': 'application/json',
                },
                // The body might be empty or contain additional information as required by your auth server
                body: JSON.stringify({}),
            }
        )

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        const decodedData = getUserCredentials(refreshedTokens.access_token)

        if (!decodedData) {
            throw ''
        }

        return {
            ...token,
            accessToken: refreshedTokens?.access_token,
            accessTokenExpires: decodedData?.exp * 1000,
            refreshToken: refreshedTokens?.refreshToken ?? token.refreshToken,
        }
    } catch (error) {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

// const throttledRefreshAccessToken = throttle(
//     refreshAccessToken,
//     THROTTLE_INTERVAL
// )

const memoizedRefreshAccessToken = mem(refreshAccessToken, {
    maxAge: 30 * 1000, // Cache for 30 seconds
    cacheKey: (args) => args[0].refreshToken, // Use the refreshToken as the cache key
})

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                url: { label: 'Login URL', type: 'text' },
            },
            async authorize(credentials) {
                const { url, ...restCredentials } =
                    credentials as ExtendedCredentials

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required')
                }

                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_END_POINT}/auth/${
                            url || 'login'
                        }`,
                        restCredentials
                    )

                    const decodedData = getUserCredentials(
                        response.data.access_token
                    )

                    if (response?.data) {
                        return {
                            id: response.data.id,
                            role: response.data.role,
                            status: response.data.status,
                            name: response.data.name,
                            email: response.data.email,
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refreshToken,
                            accessTokenExpires: decodedData
                                ? decodedData?.exp * 1000
                                : null,
                        }
                    }
                    return null
                } catch (error: any) {
                    throw new Error(JSON.stringify(error?.response?.data))
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }: any) {
            // Initial sign in
            if (account && user) {
                return { ...user }
                // return {
                //     accessToken: account.access_token,
                //     accessTokenExpires: Date.now() + account.expires_in * 1000,
                //     refreshToken: account.refresh_token,
                //     user,
                // }
            }

            // Return previous token if the access token has not expired yet
            if (
                token.accessTokenExpires &&
                Date.now() <
                    token.accessTokenExpires - REFRESH_TOKEN_THRESHOLD * 1000
            ) {
                return token
            }

            // Access token has expired, try to update it
            const refreshToken = await memoizedRefreshAccessToken(token)
            return refreshToken
        },
        async session({ session, token }: any) {
            session = token

            return session
        },
    },
    events: {
        async signOut({ token }) {
            await memoizedRefreshAccessToken(token)
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
}

export default NextAuth(authOptions)

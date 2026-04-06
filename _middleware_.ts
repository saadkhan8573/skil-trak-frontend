import { UserRoles } from '@constants'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Create a global event emitter

// Define protected routes and their required roles
const protectedRoutes: Record<string, UserRoles[]> = {
    '/portals/admin': [UserRoles.ADMIN],
    '/portals/rto': [UserRoles.RTO],
    '/portals/student': [UserRoles.STUDENT],
    '/portals/industry': [UserRoles.INDUSTRY],
    '/portals/sub-admin': [UserRoles.SUBADMIN],
    '/portals/management': [UserRoles.MANAGER, UserRoles.MARKETING],
}

async function checkSubadminStatus(token: string): Promise<boolean> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_END_POINT}/subadmin/me/profile`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
                cache: 'no-store', // Disable caching for this request
            }
        )
        if (!response.ok) {
            throw new Error('Failed to fetch subadmin status')
        }
        const data = await response.json()
        return data?.isAdmin || false
    } catch (error) {
        return false
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const user = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })
    const userRole: UserRoles = user?.role as UserRoles

    // Check if the path starts with '/portals/'
    if (path.startsWith('/portals/')) {
        if (!user) {
            return NextResponse.redirect(
                new URL('/auth/login-auth', request.url)
            )
        }

        let isSubadminAdmin = false

        if (userRole === UserRoles.SUBADMIN) {
            isSubadminAdmin = await checkSubadminStatus(
                user?.accessToken as string
            )
        }

        const matchingRoute = Object.keys(protectedRoutes).find((route) =>
            path.startsWith(route)
        )

        if (matchingRoute) {
            if (userRole === UserRoles.SUBADMIN) {
                if (isSubadminAdmin) {
                    // Subadmin with admin privileges can access admin routes
                    if (matchingRoute.startsWith('/portals/admin')) {
                        return NextResponse.next()
                    } else if (matchingRoute.startsWith('/portals/sub-admin')) {
                        return NextResponse.redirect(
                            new URL('/portals/admin', request.url)
                        )
                    }
                } else {
                    // Regular subadmin can only access subadmin routes
                    if (!matchingRoute.startsWith('/portals/sub-admin')) {
                        return NextResponse.redirect(
                            new URL('/portals/sub-admin', request.url)
                        )
                    }
                }
            } else if (userRole === UserRoles.MARKETING) {
                if (path.startsWith('/portals/management/blogs')) {
                    return NextResponse.next()
                } else {
                    return NextResponse.redirect(
                        new URL(
                            `/portals/management/blogs?tab=published&page=1&pageSize=50`,
                            request.url
                        )
                    )
                }
            } else if (userRole === UserRoles.MANAGER) {
                if (
                    path.startsWith('/portals/management') &&
                    !path.startsWith('/portals/management/blogs')
                ) {
                    return NextResponse.next()
                } else {
                    return NextResponse.redirect(
                        new URL(`/portals/management/dashboard`, request.url)
                    )
                }
            } else {
                // For other roles, check if the user's role is allowed for this route
                if (!protectedRoutes[matchingRoute].includes(userRole)) {
                    return NextResponse.redirect(
                        new URL(`/portals/${userRole}`, request.url)
                    )
                }
            }
        } else {
            // If no matching route is found, redirect to unauthorized
            return NextResponse.redirect(
                new URL('/auth/login-auth', request.url)
            )
        }
    }
    return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/portals/:path*'],
}

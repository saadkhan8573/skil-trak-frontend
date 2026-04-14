import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { usePermissions } from './usePermissions'
import { useUserPermissions } from '@hooks/useUserPermissions'
import { LoadingAnimation } from '@components/LoadingAnimation'
import { PermissionType } from '@types'
import { UserRoles } from '@constants'

interface WithPermissionOptions {
    permissions?: PermissionType | PermissionType[]
    redirectUrl?: string | ((query: any) => string)
}

/**
 * HOC to protect components based on permissions and/or roles
 * Redirects to dashboard if user doesn't have required permissions or roles
 * @param Component - The component to wrap
 * @param options - Configuration with permissions and/or roles (string or array of strings)
 */
export const withPermission = <P extends object>(
    Component: React.ComponentType<P> & {
        getLayout?: (page: React.ReactElement) => React.ReactNode
    },
    options: WithPermissionOptions
): React.ComponentType<P> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
} => {
    function ProtectedComponent(props: P) {
        const router = useRouter()
        const user = getUserCredentials()

        const nextDestination = () => {
            switch (user?.role) {
                case UserRoles.ADMIN:
                    return '/portals/admin'
                case UserRoles.INDUSTRY:
                    return '/portals/industry'
                case UserRoles.RTO:
                    return '/portals/rto/dashboard'
                case UserRoles.STUDENT:
                    return '/portals/student'
                case UserRoles.SUBADMIN:
                    return '/portals/sub-admin'
                case UserRoles.OBSERVER:
                    return '/portals/observer'
                default:
                    return '/'
            }
        }

        const requiredPermissions = options.permissions
            ? Array.isArray(options.permissions)
                ? options.permissions
                : [options.permissions]
            : undefined

        const { allPermissions, myPermissions } = useUserPermissions()
        const isPermissionsLoading =
            allPermissions?.isLoading ||
            allPermissions?.isFetching ||
            myPermissions?.isLoading ||
            myPermissions?.isFetching

        const checkResult = usePermissions(requiredPermissions)
        const isError = allPermissions?.isError || myPermissions?.isError

        // If loading or fetching, and no error, assume true to prevent redirect
        // Once success or error, use the actual result
        const hasAccess = isPermissionsLoading && !isError ? true : checkResult

        useEffect(() => {
            // Wait for user data to load
            if (user?.loading) return

            // Redirect to dashboard if no access (or error)
            if (!hasAccess) {
                const destination =
                    typeof options.redirectUrl === 'function'
                        ? options.redirectUrl(router.query)
                        : options.redirectUrl || nextDestination()
                router.push(destination)
            }
        }, [user, router, hasAccess, options.redirectUrl])

        // Show loading while checking permissions
        if (user?.loading || isPermissionsLoading) {
            return (
                <div className="flex h-[65vh] items-center justify-center">
                    <LoadingAnimation />
                </div>
            )
        }

        // Don't render if no access
        if (!hasAccess) {
            return null
        }

        return <Component {...props} />
    }

    ProtectedComponent.displayName = `withPermission(${
        Component.displayName || Component.name || 'Component'
    })`

    // Copy all static properties (like getLayout, displayName, etc.) from the original component
    Object.assign(ProtectedComponent, Component)

    return ProtectedComponent
}

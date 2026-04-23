import { getUserCredentials } from '@utils'
import { useUserPermissions } from '@hooks/useUserPermissions'
import { IAssignedPermission, IPermission, PermissionType } from '@types'

export const usePermissionCheck = ({
    userId,
    anotherUserId,
    shouldCheckRole = true,
}: {
    userId?: number
    anotherUserId?: number
    shouldCheckRole?: boolean
}) => {
    const { allPermissions, userPermissions, anotherUserPermissions } =
        useUserPermissions({ anotherUserId, userId })
    const role = getUserCredentials()?.role

    const hasAnotherUser = !!anotherUserId

    // ✅ THE FIX: use !isSuccess instead of isLoading/isFetching flags.
    // RTK Query has an "uninitialized" phase on first render where:
    //   isLoading: false, isFetching: false, isSuccess: false
    // The old check (isLoading || isFetching) reads false during this phase,
    // so the component skips the blur and briefly shows unprotected content.
    // Using !isSuccess treats uninitialized, pending, and error all as "not ready".
    const isLoading = !!(
        !allPermissions?.isSuccess ||
        allPermissions?.isFetching ||
        !userPermissions?.isSuccess ||
        userPermissions?.isFetching ||
        (hasAnotherUser &&
            (!anotherUserPermissions?.isSuccess ||
                anotherUserPermissions?.isFetching))
    )

    const isError = !!(
        allPermissions?.isError ||
        userPermissions?.isError ||
        (hasAnotherUser && anotherUserPermissions?.isError)
    )

    const checkSinglePermission = (permCode: PermissionType): boolean => {
        // isLoading now also covers uninitialized — fail-secure in all non-ready states
        if (isLoading || isError) {
            return false
        }

        if (
            allPermissions?.isSuccess &&
            userPermissions?.isSuccess &&
            !allPermissions?.isFetching &&
            !userPermissions?.isFetching
        ) {
            // If anotherUserId is provided, we also need anotherUserPermissions to be successful
            if (hasAnotherUser && !anotherUserPermissions?.isSuccess) {
                return false
            }

            // allPermissions.data is PaginatedResponse<IPermission>, so we need .data.data
            const systemPerms: IPermission[] = allPermissions?.data?.data || []

            // Check if the permission exists in the system (all permissions list)
            // If systemPerms is empty, we treat it as "not created" per user request
            const systemPerm = systemPerms.find((sp) => sp.code === permCode)

            // If permission is not created/found in the system, return true (grant access)
            if (!systemPerm) return true

            // If a roles list exists and the current user's role is NOT in it,
            // then the permission is allowed by default (not restricted for this role)
            if (
                role &&
                systemPerm.roles &&
                systemPerm.roles.length > 0 &&
                shouldCheckRole
            ) {
                if (!systemPerm.roles.includes(role)) {
                    return true
                }
            }

            // If anotherUserId is provided, merge both permissions
            if (hasAnotherUser) {
                const userPerms: IAssignedPermission[] =
                    userPermissions?.data || []
                const anotherUserPerms: IAssignedPermission[] =
                    anotherUserPermissions?.data || []
                const mergedPerms = [...userPerms, ...anotherUserPerms]

                const assignedPermission = mergedPerms.find(
                    (up) => up.permission.code === permCode
                )

                return !!assignedPermission?.isActive || false
            } else {
                // Original logic: check only user permissions
                const userPerms: IAssignedPermission[] =
                    userPermissions?.data || []

                const assignedPermission = userPerms.find(
                    (up) => up.permission.code === permCode
                )

                return !!assignedPermission?.isActive || false
            }
        }

        return false
    }

    const checkPermission = (
        permission?: PermissionType | PermissionType[],
        mode: 'AND' | 'OR' | 'allSame' = 'OR'
    ): boolean => {
        if (!permission) return true

        if (Array.isArray(permission)) {
            if (mode === 'allSame') {
                const results = permission.map((p) => checkSinglePermission(p))
                return results.every((r) => r === results[0])
            }

            if (mode === 'OR') {
                return permission.some((p) => checkSinglePermission(p))
            }

            // AND logic
            return permission.every((p) => checkSinglePermission(p))
        }

        return checkSinglePermission(permission)
    }

    return { checkPermission, checkSinglePermission, isLoading, isError }
}

export const usePermissions = ({
    permission,
    anotherUserId,
    mode,
    userId,
    shouldCheckRole,
}: {
    shouldCheckRole?: boolean
    userId?: number
    permission?: PermissionType | PermissionType[]
    anotherUserId?: number
    mode?: 'AND' | 'OR' | 'allSame'
}): boolean => {
    const { checkPermission } = usePermissionCheck({
        anotherUserId,
        userId,
        shouldCheckRole,
    })
    return checkPermission(permission, mode)
}

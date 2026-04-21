import { useUserPermissions } from '@hooks/useUserPermissions'
import { IAssignedPermission, IPermission, PermissionType } from '@types'
import { getUserCredentials } from '@utils'

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

    const checkSinglePermission = (permCode: PermissionType): boolean => {
        // Check if anotherUserId is provided - include its loading/error states
        const hasAnotherUser = !!anotherUserId

        if (
            allPermissions?.isLoading ||
            allPermissions?.isFetching ||
            userPermissions?.isLoading ||
            userPermissions?.isFetching ||
            userPermissions?.isError ||
            allPermissions?.isError ||
            (hasAnotherUser &&
                (anotherUserPermissions?.isLoading ||
                    anotherUserPermissions?.isFetching ||
                    anotherUserPermissions?.isError))
        ) {
            return false
        }

        if (allPermissions?.isSuccess && userPermissions?.isSuccess) {
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

                // Check if permission exists in merged data
                const assignedPermission = mergedPerms.find(
                    (up) => up.permission.code === permCode
                )

                // If permission exists in merged data, check isActive; otherwise false
                return !!assignedPermission?.isActive || false
            } else {
                // Original logic: check only user permissions
                const userPerms: IAssignedPermission[] =
                    userPermissions?.data || []

                // If permission exists in system and role matches (if restricted), find it in user's permissions
                const assignedPermission = userPerms.find(
                    (up) => up.permission.code === permCode
                )

                // Return isActive status if found, otherwise false
                return !!assignedPermission?.isActive || false
            }
        }

        return false
    }

    const checkPermission = (
        permission?: PermissionType | PermissionType[],
        mode: 'AND' | 'OR' | 'allSame' = 'OR' // 👈 add mode param, default keeps existing behavior
    ): boolean => {
        if (!permission) return true

        if (Array.isArray(permission)) {
            if (mode === 'allSame') {
                // ✅ Return true if ALL permissions resolve to the same value (all true OR all false)
                const results = permission.map((p) => checkSinglePermission(p))
                return results.every((r) => r === results[0])
            }

            if (mode === 'OR') {
                // OR logic — true if at least one is true
                return permission.some((p) => checkSinglePermission(p))
            }

            // Default: 'every' — AND logic (original behavior)
            return permission.every((p) => checkSinglePermission(p))
        }

        return checkSinglePermission(permission)
    }

    return { checkPermission, checkSinglePermission }
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

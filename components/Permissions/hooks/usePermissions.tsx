import { useUserPermissions } from '@hooks/useUserPermissions'
import { IAssignedPermission, IPermission, PermissionType } from '@types'
import { getUserCredentials } from '@utils'

export const usePermissionCheck = () => {
    const { allPermissions, myPermissions } = useUserPermissions()
    const role = getUserCredentials()?.role

    const checkSinglePermission = (permCode: PermissionType): boolean => {
        if (
            allPermissions?.isLoading ||
            allPermissions?.isFetching ||
            myPermissions?.isLoading ||
            myPermissions?.isFetching ||
            myPermissions?.isError ||
            allPermissions?.isError
        ) {
            return false
        }

        if (allPermissions?.isSuccess && myPermissions?.isSuccess) {
            // allPermissions.data is PaginatedResponse<IPermission>, so we need .data.data
            const systemPerms: IPermission[] = allPermissions?.data?.data || []

            // Check if the permission exists in the system (all permissions list)
            // If systemPerms is empty, we treat it as "not created" per user request
            const systemPerm = systemPerms.find((sp) => sp.code === permCode)

            // If permission is not created/found in the system, return true (grant access)
            if (!systemPerm) return true

            // If a roles list exists and the current user's role is NOT in it,
            // then the permission is allowed by default (not restricted for this role)
            if (role && systemPerm.roles && systemPerm.roles.length > 0) {
                if (!systemPerm.roles.includes(role)) {
                    return true
                }
            }

            // myPermissions.data is IAssignedPermission[]
            const userPerms: IAssignedPermission[] = myPermissions?.data || []

            // If permission exists in system and role matches (if restricted), find it in user's permissions
            const assignedPermission = userPerms.find(
                (up) => up.permission.code === permCode
            )

            // Return isActive status if found, otherwise false
            return !!assignedPermission?.isActive
        }

        return false
    }

    const checkPermission = (
        permission?: PermissionType | PermissionType[]
    ): boolean => {
        if (!permission) return true
        if (Array.isArray(permission)) {
            // If array, return true if ANY of the permissions satisfy the condition (OR logic)
            return permission.some((p) => checkSinglePermission(p))
        }
        return checkSinglePermission(permission)
    }

    return { checkPermission, checkSinglePermission }
}

export const usePermissions = (
    permission?: PermissionType | PermissionType[]
): boolean => {
    const { checkPermission } = usePermissionCheck()
    return checkPermission(permission)
}

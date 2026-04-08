import { useUserPermissions } from '@hooks/useUserPermissions'
import { IAssignedPermission, IPermission, PermissionType } from '@types'

export const usePermissions = (
    permission?: PermissionType | PermissionType[]
): boolean => {
    const { allPermissions, myPermissions } = useUserPermissions()

    if (!permission) return false

    const checkSinglePermission = (permCode: PermissionType): boolean => {
        // allPermissions.data is PaginatedResponse<IPermission>, so we need .data.data
        const systemPerms: IPermission[] = allPermissions?.data?.data || []

        // Check if the permission exists in the system (all permissions list)
        // If systemPerms is empty (e.g. still loading), we treat it as "not created" per user request
        const isPermissionCreated = systemPerms.some(
            (sp) => sp.code === permCode
        )

        // If permission is not created/found in the system, return true (grant access)
        if (!isPermissionCreated) return true

        // myPermissions.data is IAssignedPermission[]
        const userPerms: IAssignedPermission[] = myPermissions?.data || []

        // If permission exists in system, find it in user's permissions
        const assignedPermission = userPerms.find(
            (up) => up.permission.code === permCode
        )

        // Return isActive status if found, otherwise false
        return !!assignedPermission?.isActive
    }

    if (Array.isArray(permission)) {
        // If array, return true if ANY of the permissions satisfy the condition (OR logic)
        return permission.some((p) => checkSinglePermission(p))
    }

    return checkSinglePermission(permission)
}

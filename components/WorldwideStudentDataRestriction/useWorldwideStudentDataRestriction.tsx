import { PermissionType } from '@types'
import { usePermissions } from '@components/Permissions'

export const useWorldwideStudentDataRestriction = ({
    userId,
}: {
    userId?: number
}) => {
    const checkPermission = usePermissions({
        userId,
        shouldCheckRole: false,
        permission: [PermissionType.RESTRICT_WORLDWIDE_STUDENT_INFORMATION],
    })

    const hasPermission = usePermissions({
        permission: PermissionType.ACCESS_WORLDWIDE_STUDENT_INFORMATION,
    })

    return {
        checkPermission,
        hasPermission: !checkPermission ? true : hasPermission,
    }
}

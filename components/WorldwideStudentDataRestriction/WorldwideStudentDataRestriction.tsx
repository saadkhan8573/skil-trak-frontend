import { BlurOverlay } from '@components/BlurOverlay'
import { Permissions, usePermissions } from '@components/Permissions'
import { PermissionType } from '@types'
import { useWorldwideStudentDataRestriction } from './useWorldwideStudentDataRestriction'

export const WorldwideStudentDataRestriction = ({
    anotherUserId,
    children,
    fallbackOptions = {
        height: '20px',
        width: '20px',
    },
}: {
    children: any
    anotherUserId: number
    fallbackOptions?: {
        height?: string
        width?: string
    }
}) => {
    const { checkPermission } = useWorldwideStudentDataRestriction({
        userId: anotherUserId,
    })

    if (!checkPermission) {
        return children
    }

    return (
        <Permissions
            permission={PermissionType.ACCESS_WORLDWIDE_STUDENT_INFORMATION}
            fallback={<BlurOverlay {...fallbackOptions} />}
        >
            {children}
        </Permissions>
    )
}

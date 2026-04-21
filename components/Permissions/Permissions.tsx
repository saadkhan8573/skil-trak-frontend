import { PermissionType } from '@types'
import { ReactNode } from 'react'
import { usePermissions } from './hooks'

type PermissionCheckType = 'OR' | 'AND'

interface IPermissionsProps {
    permission: PermissionType | PermissionType[]
    children: ReactNode
    Component?: React.ComponentType | null
    userId?: number
    anotherUserId?: number
    permissionType?: PermissionCheckType
    mode?: 'AND' | 'OR' | 'allSame'
    fallback?: ReactNode
}

export const Permissions = ({
    permission,
    children,
    userId,
    anotherUserId,
    mode = 'OR',
    fallback,
}: IPermissionsProps) => {
    const hasPermission = usePermissions({
        permission,
        anotherUserId,
        userId,
        mode,
    })

    if (hasPermission) {
        return <>{children}</>
    }

    if (fallback) {
        return fallback
    }

    return null
}

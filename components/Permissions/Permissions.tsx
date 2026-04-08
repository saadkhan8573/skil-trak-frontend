import { PermissionType } from '@types'
import { ReactNode } from 'react'
import { usePermissions } from './hooks'

interface IPermissionsProps {
    permission: PermissionType | PermissionType[]
    children: ReactNode
}

export const Permissions = ({ permission, children }: IPermissionsProps) => {
    const hasPermission = usePermissions(permission)

    if (hasPermission) {
        return <>{children}</>
    }

    return null
}

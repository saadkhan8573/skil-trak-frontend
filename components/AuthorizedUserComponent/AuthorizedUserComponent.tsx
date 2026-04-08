import { ReactNode } from 'react'
import { useAuthorizedUserComponent } from './useAuthorizedUserComponent'

export const AuthorizedUserComponent = ({
    isHod,
    isManager,
    roles,
    children,
    excludeRoles,
    isAssociatedWithRto,
    customUserIds,
    customCondition,
}: {
    isHod?: boolean
    isManager?: boolean
    roles?: string[]
    excludeRoles?: string[]
    children: ReactNode
    isAssociatedWithRto?: boolean
    customUserIds?: number[]
    customCondition?: boolean
}) => {
    const hasPermission = useAuthorizedUserComponent({
        roles,
        excludeRoles,
        isHod: !!isHod,
        isManager: !!isManager,
        isAssociatedWithRto,
        customUserIds,
        customCondition,
    })

    return hasPermission ? <>{children}</> : null
}

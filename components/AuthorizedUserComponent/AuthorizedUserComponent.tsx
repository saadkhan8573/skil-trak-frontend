import { Activity, ReactNode } from 'react'
import { useAuthorizedUserComponent } from './useAuthorizedUserComponent'
import { checkJsxVisibility } from '@utils'

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

    return (
        <Activity mode={checkJsxVisibility(hasPermission)}>{children}</Activity>
    )
}

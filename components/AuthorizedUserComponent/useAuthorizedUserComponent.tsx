import { useSubadminProfile } from '@hooks'
import { getUserCredentials } from '@utils'

export const useAuthorizedUserComponent = ({
    roles,
    isHod,
    isManager,
    excludeRoles,
    isAssociatedWithRto,
    customUserIds,
    customCondition,
}: {
    isHod?: boolean
    isManager?: boolean
    roles?: string[]
    excludeRoles?: string[]
    isAssociatedWithRto?: boolean
    customUserIds?: number[]
    customCondition?: boolean
}) => {
    const user = getUserCredentials()
    const role = user?.role
    const userId = user?.id

    const subadmin = useSubadminProfile()

    const hasPermission = !roles?.length || (role && roles.includes(role))

    // If excludeRoles is provided, check if user is not excluded
    const isNotExcluded =
        !excludeRoles?.length || (role && !excludeRoles.includes(role))

    const checkIsHod = isHod ? subadmin?.departmentMember?.isHod : false

    const checkIsManager = isManager ? subadmin?.isManager : false

    const isCustomUser =
        customUserIds && userId ? customUserIds.includes(userId) : false

    return (
        ((hasPermission && isNotExcluded) ||
            checkIsHod ||
            checkIsManager ||
            isCustomUser ||
            customCondition) &&
        (isAssociatedWithRto
            ? subadmin?.isAssociatedWithRto
            : isAssociatedWithRto === false
              ? !subadmin?.isAssociatedWithRto
              : true)
    )
}

import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { CommonApi } from '@queries'
import { TAGS } from '../components'

export const useSupportTicketPermissions = () => {
    const user = getUserCredentials()
    const userTeam = CommonApi.Teams.useUserTeam()

    const isAdmin = user?.role === UserRoles.ADMIN

    const isQATeamMember = Boolean(
        userTeam?.data?.some((team: any) =>
            team?.tags?.includes(TAGS.QUALITY_ASSURANCE)
        )
    )

    /**
     * Capabilities (NOT roles)
     */
    const canSeeAssignedFilter = isAdmin || isQATeamMember
    const canSeeAdminTabs = isAdmin || isQATeamMember

    return {
        isAdmin,
        isQATeamMember,
        canSeeAssignedFilter,
        canSeeAdminTabs,
    }
}

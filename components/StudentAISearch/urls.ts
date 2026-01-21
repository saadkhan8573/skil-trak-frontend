import { UserRoles } from '@constants'
export const searchAiUrls = (role: UserRoles, id: number) => {
    switch (role) {
        case UserRoles.ADMIN:
            return {
                ticket: `/portals/admin/tickets/add-ticket?student=${id}`,
                detail: `/portals/admin/student-ai-search/${id}`,
            }
        case UserRoles.SUBADMIN:
            return {
                detail: `/portals/sub-admin/student-ai-search/${id}`,
                ticket: `/portals/sub-admin/tickets/add-ticket?student=${id}`,
            }
        case UserRoles.RTO:
            return {
                ticket: `/portals/rto/tickets/add-ticket?student=${id}`,
                detail: `/portals/rto/dashboard/student-ai-search/${id}`,
            }

        default:
            break
    }
}

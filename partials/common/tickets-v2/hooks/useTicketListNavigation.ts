import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

interface UseTicketListNavigationProps {
    defaultTeamTab: string
}

export const useTicketListNavigation = ({
    defaultTeamTab,
}: UseTicketListNavigationProps) => {
    const router = useRouter()
    const queryPage = router.query.page ? Number(router.query.page) : 1
    const [page, setPage] = useState(queryPage)
    const role = getUserCredentials()?.role

    // Sync page with URL
    useEffect(() => {
        setPage(queryPage)
    }, [queryPage])

    // Clear old session storage on mount
    useEffect(() => {
        sessionStorage.removeItem('ticketListState')
    }, [])

    const handleTicketClick = (ticketId: number) => {
        // Always read FRESH values from router.query
        sessionStorage.setItem(
            'ticketListState',
            JSON.stringify({
                tab: router.query.tab || 'active',
                teamTab: router.query.teamTab || defaultTeamTab,
                page: router.query.page || 1,
            })
        )

        // Navigate based on role
        if (role === UserRoles.RTO) {
            router.push(`/portals/rto/communications/tickets/${ticketId}`)
        } else if (role === UserRoles.ADMIN) {
            router.push(`/portals/admin/support-tickets/${ticketId}`)
        } else if (role === UserRoles.SUBADMIN) {
            router.push(`/portals/sub-admin/support-tickets/${ticketId}`)
        }
    }

    const updatePageInUrl = (newPage: number) => {
        setPage(newPage)
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, page: newPage },
            },
            undefined,
            { shallow: true }
        )
    }

    return {
        page,
        setPage: updatePageInUrl,
        handleTicketClick,
    }
}

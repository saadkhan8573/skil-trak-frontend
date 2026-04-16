import { ReactElement, useEffect, useState } from 'react'

import { SubAdminLayout } from '@layouts'
import {
    AppointmentTypeFilterType,
    NextPageWithLayout,
    PermissionType,
} from '@types'

// query
import { AdminApi } from '@queries'

// components

import {
    AppointmentTypeFilters,
    Filter,
    PageTitle,
    TabNavigation,
    TabProps,
    withPermission,
} from '@components'
import { useNavbar } from '@hooks'
import {
    ApprovedRequests,
    PendingRequests,
    RejectedVolunteerRequests,
} from '@partials'
import {
    ApprovedVolunteers,
    PendingVolunteers,
    RejectedVolunteers,
} from '@partials/sub-admin'

type Props = {}

const VolunteerRequests: NextPageWithLayout = (props: Props) => {
    const navBar = useNavbar()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState<AppointmentTypeFilterType>(
        {} as AppointmentTypeFilterType
    )
    const { isLoading, data, isError } = AdminApi.Volunteer.useList({
        search: `${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    useEffect(() => {
        navBar.setTitle('Volunteer Request')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'Pending',
            href: {
                pathname: 'volunteer-requests',
                query: { tab: 'pending', page: 1, pageSize: 50 },
            },
            element: <PendingVolunteers />,
        },
        {
            label: 'Approved',
            href: {
                pathname: 'volunteer-requests',
                query: { tab: 'approved', page: 1, pageSize: 50 },
            },
            element: <ApprovedVolunteers />,
        },
        {
            label: 'Rejected',
            href: {
                pathname: 'volunteer-requests',
                query: { tab: 'rejected', page: 1, pageSize: 50 },
            },
            element: <RejectedVolunteers />,
        },
    ]

    return (
        <div className="">
            {modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Filter<AppointmentTypeFilterType>
                    component={AppointmentTypeFilters}
                    initialValues={filter}
                    setFilterAction={setFilterAction}
                    setFilter={setFilter}
                />
                <PageTitle title={'Volunteer Request'} />

                <TabNavigation tabs={tabs}>
                    {({ header, element }: any) => {
                        return (
                            <div>
                                <div>{header}</div>
                                <div className="p-4">{element}</div>
                            </div>
                        )
                    }}
                </TabNavigation>
            </div>
        </div>
    )
}
VolunteerRequests.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}
export default withPermission(VolunteerRequests, {
    permissions: [PermissionType.MANAGE_VOLUNTEERS],
})

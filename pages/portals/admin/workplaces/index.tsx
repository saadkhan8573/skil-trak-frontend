import { ReactElement, useEffect, useState } from 'react'

import { AdminLayout } from '@layouts'
import { AdminWorkplaceFiltersType, NextPageWithLayout } from '@types'

import {
    AdminWorkplaceFilters,
    Card,
    Filter,
    SetDetaultQueryFilteres,
    TabNavigation,
    TabProps,
} from '@components'

// query
import { AdminApi } from '@queries'

// components
import { LoadingAnimation, TechnicalError } from '@components'
import { useNavbar } from '@hooks'
import {
    AdminBlockedStudentsWorkplaces,
    AdminPlacementStartedWorkplaces,
    AdminScheduleCompletedWorkplaces,
    NeedAdminWorkplaces,
    UpdatedAdminFilteredWorkplace,
    UpdatedAllStudentProvidedWorkplace,
    UpdatedAssignedRequest,
    UpdatedCancelledRequests,
    UpdatedUnAssignedRequest,
} from '@partials'
import { checkFilteredDataLength } from '@utils'
import { useRouter } from 'next/router'

const filterKeys = [
    'studentId',
    'name',
    'depId',
    'email',
    'location',
    'status',
    'subAdminId',
    'rtoId',
    'industryId',
    'courseId',
]

const Workplace: NextPageWithLayout = () => {
    const router = useRouter()

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<AdminWorkplaceFiltersType>(
        {} as AdminWorkplaceFiltersType
    )
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)
    const navBar = useNavbar()

    useEffect(() => {
        navBar.setTitle('Workplace Request')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    const count = AdminApi.Workplace.workplacesCount()
    const filteredWorkplaces = AdminApi.Workplace.useFilteredWorkplaces(
        {
            search: `${JSON.stringify(filter)
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        { skip: !Object.keys(filter).length, refetchOnMountOrArgChange: true }
    )

    const tabs: TabProps[] = [
        {
            label: 'Student Provided Workplaces',
            href: {
                pathname: 'workplaces',
                query: { tab: 'all-student-provided-workplace' },
            },
            badge: {
                text: count?.data?.studentProvided,
                loading: count?.isLoading,
            },
            element: <UpdatedAllStudentProvidedWorkplace />,
        },
        {
            label: 'Student Need Workplace',
            href: {
                pathname: 'workplaces',
                query: { tab: 'all-requested-workplace' },
            },
            badge: {
                text: count?.data?.requested,
                loading: count?.isLoading,
            },
            element: <NeedAdminWorkplaces />,
        },
        {
            label: 'Assigned Requests',
            href: {
                pathname: 'workplaces',
                query: { tab: 'assigned-request' },
            },
            badge: {
                text: count?.data?.assigned,
                loading: count?.isLoading,
            },
            element: <UpdatedAssignedRequest />,
        },
        {
            label: 'Un Assigned Requests',
            href: {
                pathname: 'workplaces',
                query: { tab: 'un-assigned-request' },
            },
            badge: {
                text: count?.data?.unAssigned,
                loading: count?.isLoading,
            },
            element: <UpdatedUnAssignedRequest />,
        },
        {
            label: 'Placement Started Requests',
            href: {
                pathname: 'workplaces',
                query: { tab: 'placement-started' },
            },
            badge: {
                text: count?.data?.placementStarted,
                loading: count?.isLoading,
            },
            element: <AdminPlacementStartedWorkplaces />,
        },
        {
            label: 'Schedule Completed',
            href: {
                pathname: 'workplaces',
                query: { tab: 'schedule-completed' },
            },
            badge: {
                text: count?.data?.completed,
                loading: count?.isLoading,
            },
            element: <AdminScheduleCompletedWorkplaces />,
        },
        {
            label: 'Blocked Students Workplaces',
            href: {
                pathname: 'workplaces',
                query: { tab: 'blocked-workplaces' },
            },
            badge: {
                text: count?.data?.blocked,
                loading: count?.isLoading,
            },
            element: <AdminBlockedStudentsWorkplaces />,
        },
        {
            label: 'Cancelled Workplaces',
            href: {
                pathname: 'workplaces',
                query: { tab: 'cancelled-workplace' },
            },
            badge: {
                text: count?.data?.cancelled,
                loading: count?.isLoading,
            },
            element: <UpdatedCancelledRequests />,
        },
    ]

    const filteredDataLength = checkFilteredDataLength(filter)

    return (
        <>
            <SetDetaultQueryFilteres<AdminWorkplaceFiltersType>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="p-3">
                <div>
                    <div className="flex justify-end mb-2">{filterAction}</div>
                    <Filter<AdminWorkplaceFiltersType>
                        component={AdminWorkplaceFilters}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={filterKeys}
                    />
                </div>
                {filteredDataLength && filteredWorkplaces.isError && (
                    <TechnicalError />
                )}
                {filteredWorkplaces.isLoading ||
                filteredWorkplaces.isFetching ? (
                    <div className="mt-5">
                        <Card>
                            <LoadingAnimation />
                        </Card>
                    </div>
                ) : filteredDataLength && filteredWorkplaces.isSuccess ? (
                    <UpdatedAdminFilteredWorkplace
                        setPage={setPage}
                        setItemPerPage={setItemPerPage}
                        workplace={filteredWorkplaces}
                        itemPerPage={itemPerPage}
                    />
                ) : (
                    !filteredDataLength && (
                        <TabNavigation tabs={tabs}>
                            {({ header, element }: any) => {
                                return (
                                    <div>
                                        <div>{header}</div>
                                        <div className="mt-3">{element}</div>
                                    </div>
                                )
                            }}
                        </TabNavigation>
                    )
                )}
            </div>
        </>
    )
}
Workplace.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default Workplace

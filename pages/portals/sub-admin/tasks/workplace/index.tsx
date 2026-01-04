import { ReactElement, useEffect, useState } from 'react'

import {
    Filter,
    LoadingAnimation,
    Modal,
    SetDetaultQueryFilteres,
    TabNavigation,
    TabProps,
    TechnicalError,
    WorkplaceFilters,
} from '@components'
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, SubadminWorkplaceFiltersType } from '@types'

// query
import {
    AdminApi,
    SubAdminApi,
    useGetSubAdminFilteredWorkplacesQuery,
} from '@queries'

// components
import {
    NeedSubAdminWorkplaces,
    UpdatedBlockedStudentWorkplaces,
    UpdatedCancelledWorkplaces,
    UpdatedFilteredWorkplaces,
    UpdatedMyWorkplaces,
    UpdatedPlacementStartedWorkplaces,
    UpdatedScheduleCompletedWorkplaces,
    UpdatedStudentAddedWorkplaces,
} from '@partials/sub-admin/workplace/updatedworkplaces'
import { checkFilteredDataLength } from '@utils'
import { useRouter } from 'next/router'

const filterKeys = [
    'studentId',
    'name',
    'email',
    'status',
    'rtoId',
    'industryId',
    'courseId',
    'subAdminId',
    'currentStatus',
    'nowp',
]

type Props = {}

const Workplace: NextPageWithLayout = (props: Props) => {
    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<SubadminWorkplaceFiltersType>(
        {} as SubadminWorkplaceFiltersType
    )
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)
    const [modal, setModal] = useState<any | null>(null)

    const router = useRouter()

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 10))
    }, [router])

    const count = SubAdminApi.Workplace.count(undefined, {
        refetchOnMountOrArgChange: true,
    })
    const profile = SubAdminApi.SubAdmin.useProfile(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const filteredWorkplaces = useGetSubAdminFilteredWorkplacesQuery(
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

    const onCancel = () => {
        setModal(null)
    }
    useEffect(() => {
        if (
            profile?.isSuccess &&
            profile.data &&
            !profile.data?.receiveWorkplaceRequest
        ) {
            setModal(
                <Modal
                    onConfirmClick={onCancel}
                    title={'Workplace'}
                    subtitle={'Workplace'}
                    onCancelClick={onCancel}
                    showActions={false}
                >
                    You need to enable recive workplace from Setting to recive
                    workplace
                </Modal>
            )
        }
        return () => {
            setModal(null)
        }
    }, [profile])

    const tabs: TabProps[] = [
        {
            label: 'Active Workplace Request',
            href: { pathname: 'workplace', query: { tab: 'all' } },
            badge: {
                text: count?.data?.all,
                loading: count?.isLoading,
            },
            element: <NeedSubAdminWorkplaces counts={count?.data} />,
        },
        // {
        //     label: 'Need Workplaces',
        //     href: {
        //         pathname: 'workplace',
        //         query: { tab: 'all', subTab: 'case-officer-not-assigned' },
        //     },
        //     badge: {
        //         text: count?.data?.all,
        //         loading: count?.isLoading,
        //     },
        //     element: <NeedWorkplaces />,
        // },
        {
            label: 'My Requests',
            badge: {
                text: count?.data?.myWorkplace,
                loading: count?.isLoading,
            },
            href: { pathname: 'workplace', query: { tab: 'my-workplaces' } },
            element: <UpdatedMyWorkplaces />,
        },
        {
            label: 'Placement Started Workplaces',
            badge: {
                text: count?.data?.placementStarted,
                loading: count?.isLoading,
            },
            href: {
                pathname: 'workplace',
                query: { tab: 'placement-started-workplaces' },
            },
            element: <UpdatedPlacementStartedWorkplaces />,
        },
        {
            label: 'Schedule Completed Workplaces',
            badge: {
                text: count?.data?.completed,
                loading: count?.isLoading,
            },
            href: {
                pathname: 'workplace',
                query: { tab: 'schedule-completed-workplaces' },
            },
            element: <UpdatedScheduleCompletedWorkplaces />,
        },
        {
            label: 'Student Provided Workplace',
            badge: {
                text: count?.data?.studentProvided,
                loading: count?.isLoading,
            },
            href: { pathname: 'workplace', query: { tab: 'student-added' } },
            element: <UpdatedStudentAddedWorkplaces />,
        },
        {
            label: 'Blocked Students Workplace',
            badge: {
                text: count?.data?.blocked,
                loading: count?.isLoading,
            },
            href: { pathname: 'workplace', query: { tab: 'blocked-students' } },
            element: <UpdatedBlockedStudentWorkplaces />,
        },
        {
            label: 'Cancelled Requests',
            badge: {
                text: count?.data?.cancelled,
                loading: count?.isLoading,
            },
            href: { pathname: 'workplace', query: { tab: 'cancelled' } },
            // element: <CancelledWorkplaces />,
            element: <UpdatedCancelledWorkplaces />,
        },
    ]

    const filteredDataLength = checkFilteredDataLength(filter)

    return (
        <>
            {modal}
            <SetDetaultQueryFilteres<SubadminWorkplaceFiltersType>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div>
                <div>
                    <div className="flex justify-end mb-2">{filterAction}</div>
                    <Filter<SubadminWorkplaceFiltersType>
                        component={WorkplaceFilters}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={filterKeys}
                    />
                </div>
                {filteredDataLength && filteredWorkplaces.isError && (
                    <TechnicalError />
                )}
                {filteredDataLength ? (
                    filteredWorkplaces.isLoading ? (
                        <LoadingAnimation />
                    ) : (
                        filteredWorkplaces.isSuccess && (
                            // <FilteredWorkplaces
                            //     workplace={filteredWorkplaces}
                            //     setPage={setPage}
                            //     setItemPerPage={setItemPerPage}
                            //     itemPerPage={itemPerPage}
                            // />
                            <UpdatedFilteredWorkplaces
                                subAdminWorkplace={filteredWorkplaces}
                                setPage={setPage}
                                setItemPerPage={setItemPerPage}
                                itemPerPage={itemPerPage}
                            />
                        )
                    )
                ) : null}
                {!filteredDataLength && (
                    <TabNavigation tabs={tabs}>
                        {({ header, element }: any) => (
                            <div>
                                <div>{header}</div>
                                <div className="mt-3">{element}</div>
                            </div>
                        )}
                    </TabNavigation>
                )}
            </div>
        </>
    )
}
Workplace.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Workplace' }}>
            {page}
        </SubAdminLayout>
    )
}

export default Workplace

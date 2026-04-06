//Layouts
import { SubadminIndustryFilter, UserStatus } from '@types'

//components
import {
    Filter,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    SubAdminIndustryFilter,
    TabNavigation,
    TabProps,
    TechnicalError,
} from '@components'
// queries

import {
    AllIndustries,
    ArchivedIndustries,
    BlockedIndustries,
    FavoriteIndustries,
    FavoritMonthlyCallsIndustries,
    FilteredIndustry,
    RejectedIndustries,
    SnoozedIndustrySubAdmin,
} from '@partials/sub-admin/Industries'
import { checkFilteredDataLength } from '@utils'
//query
import { PendingIndustries } from '@partials/common'
import {
    SubAdminApi,
    useGetSubadminIndustriesCountQuery,
    useGetSubAdminIndustriesQuery,
} from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

type Props = {}
const filterKeys = [
    'name',
    'email',
    'phone',
    'address',
    'suburb',
    'state',
    'abn',
    'wpType',
    'courseId',
    'isHiring',
    'isPartner',
    'subAdminId',
    'feature',
]
export const SubadminIndustries = () => {
    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState<SubadminIndustryFilter>(
        {} as SubadminIndustryFilter
    )

    const router = useRouter()

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    const filteredIndustries = useGetSubAdminIndustriesQuery({
        search: `status:${UserStatus.Approved},${JSON.stringify(filter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })
    const profile = SubAdminApi.SubAdmin.useProfile()
    const isHod = profile?.data?.departmentMember?.isHod

    const count = useGetSubadminIndustriesCountQuery()
    const rejectedCount =
        SubAdminApi.Industry.useRejectedDepartmentIndustryCount()
    const pendingCount =
        SubAdminApi.Industry.usePendingDepartmentIndustryCount()

    const tabs: TabProps[] = useMemo(() => {
        const baseTabs = [
            {
                label: 'Pending',
                href: {
                    pathname: 'industries',
                    query: { tab: UserStatus.Pending },
                },
                badge: {
                    text: pendingCount?.data,
                    loading: pendingCount.isLoading,
                },
                element: <PendingIndustries />,
            },
            {
                label: 'All',
                href: { pathname: 'industries', query: { tab: 'all' } },
                element: <AllIndustries isHod={isHod} />,
                badge: {
                    text: count.data?.approved,
                    loading: count.isLoading,
                },
            },
            {
                label: 'Snoozed',
                href: { pathname: 'industries', query: { tab: 'snoozed' } },
                element: <SnoozedIndustrySubAdmin />,
                badge: {
                    text: count.data?.snoozed,
                    loading: count.isLoading,
                },
            },
            {
                label: 'Favourite Industries',
                href: { pathname: 'industries', query: { tab: 'favorite' } },
                element: <FavoriteIndustries />,
                badge: {
                    text: count.data?.favorite,
                    loading: count.isLoading,
                },
            },
            {
                label: 'Monthly Calls Industries List',
                href: {
                    pathname: 'industries',
                    query: { tab: 'monthly-calls' },
                },
                element: <FavoritMonthlyCallsIndustries />,
                badge: {
                    text: count.data?.monthlyCalled,
                    loading: count.isLoading,
                },
            },
            {
                label: 'Blocked',
                href: {
                    pathname: 'industries',
                    query: { tab: UserStatus.Blocked },
                },
                element: <BlockedIndustries />,
                badge: {
                    text: count.data?.blocked,
                    loading: count.isLoading,
                },
            },
            {
                label: 'Archived',
                href: {
                    pathname: 'industries',
                    query: { tab: UserStatus.Archived },
                },
                element: <ArchivedIndustries />,
                badge: {
                    text: count.data?.archived,
                    loading: count.isLoading,
                },
            },

            {
                label: 'Rejected',
                href: {
                    pathname: 'industries',
                    query: { tab: UserStatus.Rejected },
                },
                element: <RejectedIndustries />,
                badge: {
                    text: rejectedCount?.data,
                    loading: rejectedCount.isLoading,
                },
            },
        ]
        // if (isHod) {
        //     baseTabs.push({
        //         label: 'Industries Sector Approval',
        //         href: {
        //             pathname: 'industries',
        //             query: { tab: UserStatus.Pending },
        //         },
        //         badge: {
        //             text: pendingCount?.data,
        //             loading: pendingCount.isLoading,
        //         },
        //         element: <PendingIndustries />,
        //     }),
        //         baseTabs.push({
        //             label: 'Rejected',
        //             href: {
        //                 pathname: 'industries',
        //                 query: { tab: UserStatus.Rejected },
        //             },
        //             element: <RejectedIndustries />,
        //             badge: {
        //                 text: rejectedCount?.data,
        //                 loading: rejectedCount.isLoading,
        //             },
        //         })
        // }
        return baseTabs
    }, [count, isHod, rejectedCount, pendingCount])

    const filteredDataLength = checkFilteredDataLength(filter)
    return (
        <>
            <SetDetaultQueryFilteres<SubadminIndustryFilter>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="px-4">
                <div className="flex justify-end mb-2">{filterAction}</div>
                <Filter<SubadminIndustryFilter>
                    component={SubAdminIndustryFilter}
                    initialValues={filter}
                    setFilterAction={setFilterAction}
                    setFilter={setFilter}
                    filterKeys={filterKeys}
                />
            </div>
            {filteredDataLength && filteredIndustries.isError && (
                <TechnicalError />
            )}
            {filteredDataLength ? (
                filteredIndustries.isLoading ? (
                    <LoadingAnimation />
                ) : (
                    filteredIndustries.isSuccess && (
                        <FilteredIndustry
                            setPage={setPage}
                            itemPerPage={itemPerPage}
                            industry={filteredIndustries}
                            setItemPerPage={setItemPerPage}
                        />
                    )
                )
            ) : null}
            {!filteredDataLength && (
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
            )}
        </>
    )
}

import {
    Card,
    Filter,
    LoadingAnimation,
    PageSize,
    Pagination,
    TechnicalError,
    TextInput,
} from '@components'
import { PlacementsFilters } from '@components/Filters'
import { RtoApi } from '@queries'
import { RtoApprovalWorkplaceRequest, RTOWorkplaceFormFilter } from '@types'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import { PendingPlacementCard } from './card'
import { WorkplaceCurrentStatus } from '@utils'

export const ReadyForApprovalPlacement = () => {
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<RTOWorkplaceFormFilter>(
        {} as RTOWorkplaceFormFilter
    )
    const [studentName, setStudentName] = useState<any | null>(null)
    const [studentNameValue, setStudentNameValue] = useState<string>('')

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const delayedNameSearch = useCallback(
        debounce((value) => {
            setStudentName({ name: value })
        }, 700),
        []
    )

    const getSearchQuery = () => {
        const baseFilter = {
            ...filter,
            ...studentName,
            isReady: true,
        }

        return `${JSON.stringify(baseFilter)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`
    }

    const wpApprovalRequests = RtoApi.Workplace.wpApprovalRequest(
        {
            search: getSearchQuery(),
            limit: itemPerPage,
            skip: itemPerPage * page - itemPerPage,
        },
        {
            refetchOnMountOrArgChange: 30,
        }
    )

    return (
        <div className="space-y-4">
            <div className="bg-background/50 rounded-xl border border-border/40 p-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-60">
                            <TextInput
                                name={'name'}
                                placeholder={'Search by Student Name'}
                                value={studentNameValue}
                                onChange={(e: any) => {
                                    setStudentNameValue(e.target.value)
                                    delayedNameSearch(e.target.value)
                                }}
                                showError={false}
                            />
                        </div>
                        <div className="shrink-0">{filterAction}</div>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-4">
                    <Filter<RTOWorkplaceFormFilter>
                        component={PlacementsFilters}
                        initialValues={filter}
                        setFilterAction={setFilterAction}
                        setFilter={setFilter}
                        filterKeys={['name', 'courseId']}
                    />
                </div>
            </div>

            {wpApprovalRequests?.isError && <TechnicalError />}
            {wpApprovalRequests?.isLoading || wpApprovalRequests?.isFetching ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : wpApprovalRequests?.data &&
              wpApprovalRequests?.data?.data.length &&
              wpApprovalRequests?.isSuccess ? (
                <>
                    <div className="flex justify-between items-center px-2">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={wpApprovalRequests?.data?.data?.length}
                        />
                        <Pagination
                            pagination={wpApprovalRequests?.data?.pagination}
                            setPage={setPage}
                        />
                    </div>
                    {wpApprovalRequests?.data?.data?.map(
                        (approval: RtoApprovalWorkplaceRequest) => (
                            <PendingPlacementCard
                                key={approval.id}
                                approval={approval}
                            />
                        )
                    )}
                    <div className="flex justify-between items-center px-2 border-t pt-4">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={wpApprovalRequests?.data?.data?.length}
                        />
                        <Pagination
                            pagination={wpApprovalRequests?.data?.pagination}
                            setPage={setPage}
                        />
                    </div>
                </>
            ) : (
                !wpApprovalRequests?.isError && (
                    <Card className="border-border/60">
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-success" />
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">
                                        {studentNameValue ||
                                        Object.keys(filter).length > 0
                                            ? 'No matching placements found!'
                                            : 'All caught up! 🎉'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {studentNameValue ||
                                        Object.keys(filter).length > 0
                                            ? 'Try adjusting your filters'
                                            : 'No placements ready for approval'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )
            )}
        </div>
    )
}

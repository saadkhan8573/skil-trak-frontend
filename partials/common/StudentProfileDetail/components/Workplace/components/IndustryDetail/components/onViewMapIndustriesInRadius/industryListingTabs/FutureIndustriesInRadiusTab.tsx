import {
    LoadingAnimation,
    NoData,
    PageSize,
    Pagination,
    Typography,
} from '@components'
import { SubAdminApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FutureIndustryInRadiusListCard } from '../industriesListCards'

const TAB_KEY = 'future'

export const FutureIndustriesInRadiusTab = ({
    workplaceId,
    courseId,
    studentLocation,
    setSelectedBox,
}: any) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)

    const router = useRouter()

    useEffect(() => {
        setPage(Number(router.query.page || 1))
    }, [router.query.page])

    const workplaceCourseIndustries =
        SubAdminApi.Workplace.useWorkplaceListedIndustries(
            {
                id: courseId,
                wpId: workplaceId,
                params: {
                    skip: itemPerPage * page - itemPerPage,
                    limit: itemPerPage,
                },
            },
            { skip: !courseId && !workplaceId, refetchOnMountOrArgChange: true }
        )

    const processedIndustries = useMemo(() => {
        return workplaceCourseIndustries?.data?.data ?? []
    }, [workplaceCourseIndustries?.data?.data])

    const preserveScroll = () => {
        const y = window.scrollY
        requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: 'auto' })
        })
    }

    return (
        <div className="h-100 overflow-auto remove-scrollbar space-y-4">
            {workplaceCourseIndustries?.isError ? (
                <NoData isError text="there is some technical issue!" />
            ) : null}
            {workplaceCourseIndustries.isLoading ? (
                <LoadingAnimation />
            ) : processedIndustries.length > 0 ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-x-2">
                            <PageSize
                                itemPerPage={itemPerPage}
                                setItemPerPage={setItemPerPage}
                            />
                            <div className="bg-gray-100 rounded-md p-2 flex items-center gap-1">
                                <Typography
                                    variant="muted"
                                    color="text-gray-500"
                                >
                                    Records
                                </Typography>
                                <Typography
                                    variant="muted"
                                    color="text-gray-500"
                                >
                                    {workplaceCourseIndustries?.data?.data
                                        ?.length ?? 0}
                                </Typography>
                            </div>
                        </div>

                        <Pagination
                            pagination={
                                workplaceCourseIndustries?.data?.pagination
                            }
                            // setPage={setPage}
                            setPage={(p: number) => {
                                preserveScroll()
                                setPage(p)
                                router.push(
                                    {
                                        query: {
                                            ...router.query,
                                            tab: TAB_KEY,
                                            page: p,
                                        },
                                    },
                                    undefined,
                                    { shallow: true, scroll: false }
                                )
                            }}
                        />
                    </div>
                    {processedIndustries.map((item: any) => (
                        <div
                            key={`future-${item?.id}`}
                            className="flex items-center justify-between bg-white border rounded-2xl shadow-sm p-4"
                        >
                            <FutureIndustryInRadiusListCard
                                item={item}
                                studentLocation={studentLocation}
                                onSelect={(selected: any) => {
                                    router.push(
                                        {
                                            query: {
                                                ...router.query,
                                                tab: TAB_KEY,
                                                page,
                                            },
                                        },
                                        undefined,
                                        { shallow: true, scroll: false }
                                    )
                                    setSelectedBox(selected)
                                }}
                            />
                        </div>
                    ))}
                </>
            ) : (
                !workplaceCourseIndustries.isError && (
                    <NoData text={'No Data found'} />
                )
            )}
        </div>
    )
}

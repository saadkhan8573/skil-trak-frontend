import {
    NoData,
    PageSize,
    Pagination,
    Typography,
    LoadingAnimation,
} from '@components'
import { SubAdminApi } from '@queries'
import React, { useState, useMemo, useEffect } from 'react'
import { IndustryInRadiusListCard } from '../industriesListCards'
import { useRouter } from 'next/router'

const TAB_KEY = 'signed'
export const SignedUpIndustriesInRadiusTab = ({
    courseId,
    workplaceId,
    setSelectedBox,
}: any) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(5)

    const router = useRouter()
    useEffect(() => {
        setPage(Number(router.query.page || 1))
    }, [router.query.page])
    const workplaceCourseIndustries =
        SubAdminApi.Workplace.useWorkplaceCourseIndustries(
            {
                id: courseId,
                wpId: workplaceId,
                params: {
                    skip: itemPerPage * page - itemPerPage,
                    limit: itemPerPage,
                },
            },
            {
                skip: !courseId && !workplaceId,
                refetchOnMountOrArgChange: 30,
            }
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
        <div className="h-[25rem] overflow-auto remove-scrollbar space-y-4">
            {workplaceCourseIndustries?.isError ? (
                <NoData isError text="there is some technical issue!" />
            ) : null}

            {workplaceCourseIndustries?.isLoading ? (
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
                        <React.Fragment key={item?.id}>
                            <IndustryInRadiusListCard
                                item={item}
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
                            {item?.locations?.length > 0 &&
                                item?.locations?.map((branch: any) => (
                                    <IndustryInRadiusListCard
                                        key={`${item?.id}-${branch?.id}`}
                                        item={{ ...item, ...branch }}
                                        onSelect={setSelectedBox}
                                        branch
                                    />
                                ))}
                        </React.Fragment>
                    ))}
                </>
            ) : (
                !workplaceCourseIndustries.isError && (
                    <NoData text="No Industry Found" />
                )
            )}
        </div>
    )
}

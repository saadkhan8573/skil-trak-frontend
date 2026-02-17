import { useRouter } from 'next/router'

// components
import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps
} from '@components'

import { TechnicalError } from '@components/ActionAnimations/TechnicalError'
import { useGetFavouriteIndustryStudentsQuery } from '@queries'
import { useEffect, useState } from 'react'

import { useColumns } from './hooks'

export const FavouriteIndustryStudents = () => {
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [isRouting, setIsRouting] = useState(true)

    useEffect(() => {
        if (!isRouting) return
        const newPage = Number(router.query.page)
        const newItemPerPage = Number(router.query.pageSize)
        if (router.query.page) {
            setPage(newPage)
        }
        if (router.query.pageSize) {
            setItemPerPage(newItemPerPage)
        }
    }, [router.query.page, router.query.pageSize, isRouting])

    const { isLoading, isFetching, data, isError } =
        useGetFavouriteIndustryStudentsQuery(
            {
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            {
                refetchOnMountOrArgChange: 30,
            }
        )

    const { columns, modal } = useColumns()

    return (
        <div>
            {modal}
            <Card noPadding>
                {isError && <TechnicalError />}

                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data.length ? (
                    <Table
                        columns={columns}
                        data={data?.data}
                        enableRowSelection
                    >
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: TableChildrenProps) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                (e) => {
                                                    setItemPerPage(e)
                                                    setIsRouting(false)
                                                },
                                                data?.data?.length
                                            )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination &&
                                                pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto remove-scrollbar">
                                        <div
                                            className="px-6 w-full"
                                            id={'studentScrollId'}
                                        >
                                            {table}
                                        </div>
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    (e) => {
                                                        setItemPerPage(e)
                                                        setIsRouting(false)
                                                    },
                                                    data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        data?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Students'}
                            description={'No students found for your favorite industries.'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

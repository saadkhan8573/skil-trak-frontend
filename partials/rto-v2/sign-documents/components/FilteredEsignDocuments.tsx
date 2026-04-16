import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'

import { UserRoles } from '@constants'
import { CommonApi } from '@queries'
import { Eye, Building2, FileText, User } from 'lucide-react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEsignColumns } from '../hooks/useEsignColumns'

export const FilteredEsignDocuments = ({
    documents,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    documents: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    const { columns } = useEsignColumns({
        isFiltered: true,
    })

    return (
        <div className="flex flex-col gap-y-4 p-4 mt-4">
            <Card noPadding>
                {documents?.isError && <TechnicalError />}
                {documents?.isLoading || documents?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : documents?.data && documents?.data?.data?.length ? (
                    <Table columns={columns} data={documents?.data.data}>
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
                                                setItemPerPage,
                                                documents?.data?.data?.length
                                            )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination &&
                                                pagination(
                                                    documents?.data?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6 overflow-auto">
                                        {table}
                                    </div>
                                    {documents?.data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    documents?.data?.data
                                                        ?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        documents?.data
                                                            ?.pagination,
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
                    <EmptyData
                        title={'No Documents in your Search!'}
                        description={'No Documents in your Search yet'}
                        height={'50vh'}
                    />
                )}
            </Card>
        </div>
    )
}

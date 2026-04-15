import React, { useEffect, useMemo, useState } from 'react'
import { usePermissionColumns } from '../hooks'
import { EmptyData, Table, TableChildrenProps } from '@components'
import { Paginate } from '@types'

export interface PermissionTableTabProps {
    data: any[] | undefined | null
}

export const PermissionTableTab = ({ data }: PermissionTableTabProps) => {
    const columns = usePermissionColumns()
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    useEffect(() => {
        setPage(1)
    }, [data])

    const paginatedData = useMemo(() => {
        if (!data) return []
        const start = (page - 1) * itemPerPage
        return data.slice(start, start + itemPerPage)
    }, [data, page, itemPerPage])

    const paginationData: Paginate = {
        totalPage: Math.ceil((data?.length || 0) / itemPerPage) || 1,
        currentPage: page,
        hasNext: page < Math.ceil((data?.length || 0) / itemPerPage),
        hasPrevious: page > 1,
        itemPerPage: itemPerPage,
        totalResult: data?.length || 0,
    }

    if (!data || !data.length) {
        return (
            <EmptyData
                title="No Permissions Found!"
                description="There are no permissions in this section."
                height="40vh"
            />
        )
    }

    return (
        <div className="bg-white rounded-lg pt-4 border-0">
            <Table columns={columns} data={paginatedData}>
                {({ table, pagination, pageSize }: TableChildrenProps) => (
                    <div>
                        <div className="px-6 mb-2 flex justify-between">
                            {pageSize &&
                                pageSize(
                                    itemPerPage,
                                    setItemPerPage,
                                    data?.length || 0
                                )}
                            <div className="flex gap-x-2">
                                {pagination &&
                                    pagination(paginationData, setPage)}
                            </div>
                        </div>
                        <div className="overflow-x-auto remove-scrollbar">
                            <div className="px-6 w-full">{table}</div>
                        </div>
                        {data && data.length > 10 && (
                            <div className="px-6 mb-2 flex justify-between">
                                {pageSize &&
                                    pageSize(
                                        itemPerPage,
                                        setItemPerPage,
                                        data?.length || 0
                                    )}
                                <div className="flex gap-x-2">
                                    {pagination &&
                                        pagination(
                                            paginationData,
                                            setPage
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Table>
        </div>
    )
}

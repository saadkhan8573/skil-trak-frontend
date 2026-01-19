import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { SubAdminApi } from '@queries'
import { removeEmptyValues } from '@utils'
import React, { useState } from 'react'
import { UserStatus } from '@types'
import { useSubAdminIndustryColumns } from '../hooks/useSubAdminIndustryColumns'

interface YourPartnerIndustriesProps {
    baseFilter: any
}

export const StateWiseIndustries = ({
    baseFilter,
}: YourPartnerIndustriesProps) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    const industries = SubAdminApi.Industry.getAllStateWiseSubAdminIndustries({
        search: JSON.stringify(removeEmptyValues({ ...baseFilter }))
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim(),
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const { getTableConfig, modal } = useSubAdminIndustryColumns()

    const { columns } = getTableConfig({
        columnKeys: [
            'name',
            'contactPerson',
            'profileCompletionPercentage',
            'createdAt',
            'favouriteBy',
            'action',
        ],
    })

    return (
        <div className="space-y-4">
            {modal}
            <Card noPadding>
                {industries?.isError && <TechnicalError />}
                {industries?.isLoading || industries?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : industries?.data?.data?.length ? (
                    <Table columns={columns} data={industries?.data?.data}>
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            industries?.data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                industries?.data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 w-full overflow-x-scroll remove-scrollbar">
                                        {table}
                                    </div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !industries?.isError && (
                        <EmptyData
                            title={'No Partner Industries!'}
                            description={
                                'You have no partner industries listed.'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { RtoV2Api } from '@redux'
import { Industry, UserStatus } from '@types'
import { removeEmptyValues } from '@utils'
import React, { useState } from 'react'
import { useYourIndustriesColumns } from '../component/columns'
// import { removeEmptyValues } from '@utils'

interface YourPartnerIndustriesProps {
    baseFilter: any
}

export const YourPartnerIndustries: React.FC<YourPartnerIndustriesProps> = ({
    baseFilter,
}) => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    const filter = {
        isPartner: true,
        ...baseFilter,
    }

    const industries = RtoV2Api.Industries.getAllIndustriesList({
        search: JSON.stringify(removeEmptyValues(filter))
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim(),
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const { getTableConfig, modal } = useYourIndustriesColumns()
    const { columns } = getTableConfig({
        columnKeys: [
            'name',
            'contact',
            'workplaceType',
            'contactPerson',
            'placementReady',
            'enrolledStudents',
        ],
    })

    return (
        <div className="space-y-4">
            {modal}

            <Card noPadding>
                {industries?.isError && <TechnicalError />}
                {industries?.isLoading || industries?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : industries &&
                  industries?.data?.data &&
                  industries?.data?.data?.length ? (
                    <Table<Industry>
                        columns={columns}
                        data={industries?.data?.data}
                    >
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
                            title={'No Approved RTO!'}
                            description={
                                'You have not approved any RTO request yet'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

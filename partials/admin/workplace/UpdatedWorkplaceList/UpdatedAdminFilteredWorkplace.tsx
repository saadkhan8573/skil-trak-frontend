// components
import { Card, EmptyData, Table } from '@components'

// queries
import { useColumns } from './hooks'

export const UpdatedAdminFilteredWorkplace = ({
    setPage,
    workplace,
    setItemPerPage,
    itemPerPage,
}: {
    setPage: any
    workplace: any
    itemPerPage: number
    setItemPerPage: any
}) => {
    const Columns = useColumns()
    return (
        <div className="p-4">
            <Card noPadding>
                {workplace?.data?.data &&
                    workplace?.data?.data?.length &&
                    !workplace?.isError ? (
                    <Table
                        columns={Columns}
                        data={workplace?.data?.data}
                        enableRowSelection
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
                                            workplace?.data?.data.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                workplace?.data?.pagination,
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
                                    {workplace?.data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                workplace?.data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    workplace?.data?.pagination,
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
                    !workplace?.isError && (
                        <EmptyData
                            title={'No Workplace request yet'}
                            description={'No workplace request were found'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
} from '@components'
import { PageHeading } from '@components/headings'

import { useColumns } from './hooks'

export const FilteredStudents = ({
    student,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    student: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    const { getTableConfig, modal } = useColumns()

    const { columns } = getTableConfig({
        actionKeys: ['block'],
        removeColumnKeys: ['assigned', "batch", "sectors"],
    })

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered Students'}
                    subtitle={'List of Filtered Students'}
                />

                <Card noPadding>
                    {student?.isLoading || student?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : student?.data && student?.data?.data?.length ? (
                        <Table columns={columns} data={student?.data.data}>
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
                                                    student?.data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        student?.data
                                                            ?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                        <div className="px-6 overflow-auto">
                                            {table}
                                        </div>
                                        {student?.data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize &&
                                                    pageSize(
                                                        itemPerPage,
                                                        setItemPerPage,
                                                        student?.data?.data
                                                            ?.length
                                                    )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination &&
                                                        pagination(
                                                            student?.data
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
                            title={'No Students in your Search!'}
                            description={'No Students in your Search yet'}
                            height={'50vh'}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}

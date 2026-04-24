import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { PageHeading } from '@components/headings'
import { useRouter } from 'next/router'
import { useColumns } from './hooks'

export const FilteredAssessments = ({
    assessments,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    assessments: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    const { columns, modal } = useColumns()
    const router = useRouter()

    return (
        <div>
            {modal}
            <PageHeading
                title={'Filtered Assessments'}
                subtitle={'List of Filtered Assessments'}
            />

            <Card noPadding>
                {assessments.isError && <TechnicalError />}
                {assessments.isLoading || assessments?.isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : assessments.data && assessments.data?.data.length ? (
                    <Table
                        columns={columns}
                        data={assessments.data.data}
                        // quickActions={quickActionsElements}
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
                                            assessments?.data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                assessments.data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6">{table}</div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !assessments.isError && (
                        <EmptyData
                            title={'No Pending Assessment Evidence!'}
                            description={
                                'There is no Pending Assessment were found'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

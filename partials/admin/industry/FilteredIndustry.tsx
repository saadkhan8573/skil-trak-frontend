import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { Industry } from '@types'
import { useColumns } from './hooks'
import { PageHeading } from '@components/headings'

export const FilteredIndustry = ({
    industry,
    setPage,
    itemPerPage,
    setItemPerPage,
}: {
    industry: any
    setPage: any
    itemPerPage: any
    setItemPerPage: any
}) => {
    // hooks
    const { getTableConfig, modal: hookModal, passwordModal } = useColumns()

    const { columns } = getTableConfig({
        columnKeys: [
            'businessName',
            'abn',
            'contactPerson',
            'status',
            'address',
            'createdBy',
            'action',
            'placementStatus',
            'favoriteBy',
        ],
        actionKeys: [
            'view',
            'edit',
            'viewPassword',
            'archive',
            'unarchive',
            'block',
            'unblock',
            'delete',
            'accept',
            'reject',
        ],
        useDynamicActions: true,
    })

    const quickActionsElements = {
        id: 'id',
        individual: (id: Industry) => (
            <div className="flex gap-x-2">
                <ActionButton>Edit</ActionButton>
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton variant="error">Block</ActionButton>
            </div>
        ),
        common: (ids: Industry[]) => (
            <ActionButton variant="error">Block</ActionButton>
        ),
    }

    return (
        <>
            {hookModal && hookModal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 p-4">
                <PageHeading
                    title={'Filtered Industries'}
                    subtitle={'List of Filtered Industries'}
                />

                <Card noPadding>
                    {industry?.isError && <TechnicalError />}
                    {industry?.isLoading || industry?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : industry?.data && industry?.data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={industry?.data?.data}
                            quickActions={quickActionsElements}
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
                                                industry.data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    industry?.data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-6">{table}</div>
                                        {industry.data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    industry.data?.data?.length
                                                )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination(
                                                        industry?.data
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
                        !industry?.isError && (
                            <EmptyData
                                title={'No Industries in your Search!'}
                                description={'No Industries in your Search yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}

import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { AdminApi } from '@queries'
import { Industry } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { useColumns } from './hooks'
import { MultiBlockModal } from './modals'

export const SnoozedIndustry = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    // hooks
    const { getTableConfig, modal: hookModal, passwordModal } = useColumns()

    const { columns } = getTableConfig({
        columnKeys: [
            'businessName',
            'abn',
            'contactPerson',
            'address',
            'snoozedBy',
            'snoozedAt',
            'snoozedDate',
        ],
        actionKeys: ['view', 'edit', 'viewPassword', 'unsnooze', 'block'],
    })

    const { isLoading, data, isError } = AdminApi.Industries.useSnoozedIndustry(
        {
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        }
    )

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onMultiBlockClicked = (industries: Industry[]) => {
        setModal(
            <MultiBlockModal
                industries={industries}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const quickActionsElements = {
        id: 'id',
        individual: (id: Industry) => (
            <div className="flex gap-x-2">
                <ActionButton>Edit</ActionButton>
                <ActionButton variant="error">Block</ActionButton>
            </div>
        ),
        common: (industries: Industry[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        onMultiBlockClicked(industries)
                    }}
                    variant="error"
                >
                    Block
                </ActionButton>
            </div>
        ),
    }

    return (
        <>
            {modal && modal}
            {hookModal && hookModal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: any) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(
                                            itemPerPage,
                                            setItemPerPage,
                                            data?.data?.length
                                        )}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className=" overflow-x-scroll remove-scrollbar">
                                        <div className="px-6 w-full">
                                            {table}
                                        </div>
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Snoozed Industry!'}
                                description={
                                    'You have not Snoozed any Industry request yet'
                                }
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}

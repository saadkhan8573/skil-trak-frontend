import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { AdminApi } from '@queries'
import { Industry, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { useColumns } from './hooks'
import { MultiAcceptModal, MultiRejectModal } from './modals'

export const PendingIndustry = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks
    const { getTableConfig, modal: hookModal, passwordModal } = useColumns()

    const { columns } = getTableConfig({
        columnKeys: [
            'businessName',
            'abn',
            'studentCount',
            'contactPerson',
            'favoriteBy',
            'sectors',
            'createdBy',
            'action',
        ],
        actionKeys: [
            'view',
            'viewOldProfile',
            'viewPassword',
            'edit',
            'accept',
            'reject',
        ],
    })

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const { isLoading, data, isError } = AdminApi.Industries.useListQuery({
        search: `status:${UserStatus.Pending}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const onMultiAcceptClicked = (industries: Industry[]) => {
        setModal(
            <MultiAcceptModal
                industries={industries}
                onCancel={() => {
                    onModalCancelClicked()
                }}
            />
        )
    }

    const onMultiRejectClicked = (industries: Industry[]) => {
        setModal(
            <MultiRejectModal
                industries={industries}
                onCancel={() => {
                    onModalCancelClicked()
                }}
            />
        )
    }

    const quickActionsElements = {
        id: 'id',
        individual: (id: Industry) => (
            <div className="flex gap-x-2">
                <ActionButton variant="success" onClick={() => {}}>
                    Accept
                </ActionButton>
                <ActionButton variant="error" onClick={() => {}}>
                    Reject
                </ActionButton>
            </div>
        ),
        common: (industries: Industry[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        onMultiAcceptClicked(industries)
                    }}
                    variant="success"
                >
                    Accept
                </ActionButton>
                <ActionButton
                    onClick={() => {
                        onMultiRejectClicked(industries)
                    }}
                    variant="error"
                >
                    Reject
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
                            data={data?.data}
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
                                        <div className="px-6">{table}</div>
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
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Pending Industry!'}
                                description={'You have no pending Industry'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}

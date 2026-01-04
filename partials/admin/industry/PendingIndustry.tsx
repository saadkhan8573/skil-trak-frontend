import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    UserCreatedAt,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { UserRoles } from '@constants'
import { useActionModal, useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Industry, UserStatus } from '@types'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { RiLockPasswordFill } from 'react-icons/ri'
import { IndustryCell, SectorCell } from './components'
import { useChangeStatus } from './hooks'
import {
    AcceptModal,
    MultiAcceptModal,
    MultiRejectModal,
    RejectModal,
} from './modals'

export const PendingIndustry = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()
    const role = getUserCredentials()?.role
    const { notification } = useNotification()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, data, isError } = AdminApi.Industries.useListQuery({
        search: `status:${UserStatus.Pending}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const { changeStatusResult } = useChangeStatus()
    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onAcceptClicked = (industry: Industry) => {
        setModal(
            <AcceptModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
        // setModal(
        //     <ApproveIndustryWithQuestionsModal
        //         industry={industry}
        //         onCancel={() => onModalCancelClicked()}
        //     />
        // )
    }
    const onRejectClicked = (industry: Industry) => {
        setModal(
            <RejectModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

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

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (industry: any) => {
                router.push(`/portals/admin/industry/${industry.id}`)
            },
            Icon: FaEye,
        },
        {
            text: 'View Old Profile',
            onClick: (industry: any) =>
                router.push(
                    `/portals/admin/industry/${industry?.id}/old-detail`
                ),
            Icon: FaEye,
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: 'View Password',
                      onClick: (industry: Industry) => onViewPassword(industry),
                      Icon: RiLockPasswordFill,
                  }
                : {}),
        },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/industry/edit-industry/${row.id}`)
            },
            Icon: FaEdit,
        },
    ]

    const columns: ColumnDef<Industry>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => <IndustryCell industry={info.row.original} />,
            header: () => <span>Business Name</span>,
        },
        {
            accessorKey: 'abn',
            header: () => <span>ABN Number</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'contactPerson',
            header: () => <span>Contact Person</span>,
            cell: (info) => {
                return (
                    <div>
                        <p>{info.row.original.contactPerson}</p>
                        <p className="text-xs text-gray-500">
                            {info.row.original.contactPersonNumber}
                        </p>
                    </div>
                )
            },
        },
        // {
        //     accessorKey: 'sectors',
        //     header: () => <span>Sectors</span>,
        //     cell: (info) => {
        //         return <SectorCell industry={info.row.original} />
        //     },
        // },
        {
            accessorKey: 'channel',
            header: () => <span>Registered By</span>,
            cell: (info) => (
                <div>
                    {info.row.original?.createdBy !== null ? (
                        <p>{info?.row?.original?.createdBy?.name}</p>
                    ) : (
                        <p>{info?.row?.original?.channel}</p>
                    )}
                    <UserCreatedAt createdAt={info.row.original?.createdAt} />
                </div>
            ),
        },
        // {
        //     accessorKey: 'createdAt',
        //     header: () => <span>Created At</span>,
        //     cell: (info) => (
        //         <UserCreatedAt createdAt={info.row.original?.createdAt} />
        //     ),
        // },
        {
            accessorKey: 'action',
            header: () => <span>Manage</span>,
            cell: (info: any) => {
                return (
                    <div className="flex gap-x-1 items-center">
                        <ActionButton
                            variant="success"
                            onClick={() => onAcceptClicked(info.row.original)}
                            loading={changeStatusResult.isLoading}
                            disabled={changeStatusResult.isLoading}
                        >
                            Accept
                        </ActionButton>
                        <ActionButton
                            variant="error"
                            onClick={() => onRejectClicked(info.row.original)}
                            loading={changeStatusResult.isLoading}
                            disabled={changeStatusResult.isLoading}
                        >
                            Reject
                        </ActionButton>

                        <TableAction
                            options={tableActionOptions}
                            rowItem={info.row.original}
                        />
                    </div>
                )
            },
        },
    ]

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
                        // const arrayOfIds = ids.map((id: any) => id?.user.id)
                        // bulkAction({ ids: arrayOfIds, status: 'rejected' })
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
            {passwordModal && passwordModal}

            <div className="flex flex-col gap-y-4 mb-32">
                {/* <PageHeading
                    title={'Pending Industries'}
                    subtitle={'List of Pending Industries'}
                >
                    {data && data?.data.length ? (
                        <>
                            <Button
                                text="Export"
                                variant="action"
                                Icon={FaFileExport}
                            />
                        </>
                    ) : null}
                </PageHeading> */}

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

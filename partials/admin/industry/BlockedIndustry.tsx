import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    TruncatedTextWithTooltip,
    Typography,
    UserCreatedAt,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye, FaFileExport, FaTrash } from 'react-icons/fa'

import { AdminApi, commonApi } from '@queries'
import { Industry } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { CgUnblock } from 'react-icons/cg'
import { IndustryCell, SectorCell } from './components'
import { DeleteModal, MultiAcceptModal, UnblockModal } from './modals'

// hooks
import { useActionModal } from '@hooks'
import { RiLockPasswordFill } from 'react-icons/ri'

import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

export const BlockedIndustry = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const role = getUserCredentials()?.role
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, data, isError } = AdminApi.Industries.useListQuery({
        search: `status:blocked`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })
    const [bulkAction, resultBulkAction] = commonApi.useBulkStatusMutation()

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onUnblockClicked = (industry: Industry) => {
        setModal(
            <UnblockModal
                industry={industry}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onDeleteClicked = (industry: Industry) => {
        setModal(
            <DeleteModal
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

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (industry: any) => {
                router.push(`/portals/admin/industry/${industry.id}`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (row: any) => {
                router.push(`/portals/admin/industry/edit-industry/${row.id}`)
            },
            Icon: FaEdit,
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
            text: 'Unblock',
            onClick: (industry: Industry) => onUnblockClicked(industry),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                      text: `Delete`,
                      onClick: (industry: any) => {
                          onDeleteClicked(industry)
                      },
                      Icon: FaTrash,
                      color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
                  }
                : {}),
        },
        // {
        //     text: 'Delete',
        //     onClick: (industry: Industry) => onDeleteClicked(industry),
        //     Icon: FaTrash,
        //     color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        // },
    ]

    const columns: ColumnDef<Industry>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => {
                return <IndustryCell industry={info.row.original} />
            },
            header: () => <span>Industry</span>,
        },
        {
            accessorKey: 'abn',
            header: () => <span>ABN</span>,
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
            accessorKey: 'addressLine1',
            header: () => <span>Address</span>,
            cell: (info) => (
                <TruncatedTextWithTooltip
                    text={info?.row?.original?.addressLine1}
                />
            ),
        },
        {
            accessorKey: 'channel',
            header: () => <span>Created By</span>,
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => (
                <UserCreatedAt createdAt={info.row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                return (
                    <div className="flex gap-x-1 items-center">
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
                <ActionButton>Sub Admins</ActionButton>
                <ActionButton Icon={CgUnblock} variant="warning">
                    Unblock
                </ActionButton>
                {role === UserRoles.ADMIN && (
                    <ActionButton Icon={FaTrash} variant="error">
                        Delete
                    </ActionButton>
                )}
            </div>
        ),
        common: (industries: Industry[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        onMultiAcceptClicked(industries)
                    }}
                    Icon={CgUnblock}
                    variant="warning"
                >
                    Unblock
                </ActionButton>
                {role === UserRoles.ADMIN && (
                    <ActionButton Icon={FaTrash} variant="error">
                        Delete
                    </ActionButton>
                )}
            </div>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Blocked Industries'}
                    subtitle={'List of Blocked Industries'}
                >
                    {data && data?.data.length ? (
                        <Button
                            text="Export"
                            variant="action"
                            Icon={FaFileExport}
                        />
                    ) : null}
                </PageHeading>

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
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
                                        <div className="px-6 overflow-auto remove-scrollbar">
                                            {table}
                                        </div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Blocked Industry!'}
                                description={
                                    'You have not blocked any Industry request yet'
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

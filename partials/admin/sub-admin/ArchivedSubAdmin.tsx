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
} from '@components'
import { PageHeading } from '@components/headings'
import { useActionModal, useContextBar } from '@hooks'
import { AdminApi, commonApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { SubAdmin, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { FaEdit, FaEye, FaFileExport, FaTrash } from 'react-icons/fa'
import { MdUnarchive } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { SubAdminCell } from './components'
import { AddSubAdminCB } from './contextBar'
import { DeleteModal, UnArchiveModal } from './modals'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'

export const ArchivedSubAdmin = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()
    const contextBar = useContextBar()
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query?.page || 1))
        setItemPerPage(Number(router.query?.pageSize || 50))
    }, [router])
    const role = getUserCredentials()?.role

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, data, isError, refetch } =
        AdminApi.SubAdmins.useListQuery({
            search: `status:${UserStatus.Archived}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })
    const [bulkAction, resultBulkAction] = commonApi.useBulkStatusMutation()

    const onEditSubAdmin = (subAdmin: SubAdmin) => {
        contextBar.setContent(<AddSubAdminCB edit subAdmin={subAdmin} />)
        contextBar.setTitle('Edit SubAdmin')
        contextBar.show()
    }

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onUnArchivedClicked = (subAdmin: SubAdmin) => {
        setModal(
            <UnArchiveModal
                subadmin={subAdmin}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onDeleteClicked = (subAdmin: SubAdmin) => {
        setModal(
            <DeleteModal subAdmin={subAdmin} onCancel={onModalCancelClicked} />
        )
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (subAdmin: any) => {
                router.push(
                    `/portals/admin/sub-admin/${subAdmin?.id}?tab=notes`
                )
            },
            Icon: FaEye,
        },
        {
            text: 'New Profile',
            onClick: (subAdmin: any) => {
                router.push(`/portals/admin/sub-admin/${subAdmin?.id}/detail`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (subadmin: SubAdmin) => {
                onEditSubAdmin(subadmin)
            },
            Icon: FaEdit,
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                    text: 'View Password',
                    onClick: (subAdmin: SubAdmin) => onViewPassword(subAdmin),
                    Icon: RiLockPasswordFill,
                }
                : {}),
        },
        {
            text: 'Unarchive',
            onClick: (subadmin: SubAdmin) => onUnArchivedClicked(subadmin),
            Icon: MdUnarchive,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
        },
        {
            ...(role === UserRoles.ADMIN
                ? {
                    text: `Delete`,
                    onClick: (subAdmin: SubAdmin) => {
                        onDeleteClicked(subAdmin)
                    },
                    Icon: FaTrash,
                    color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
                }
                : {}),
        },
    ]

    const columns: ColumnDef<SubAdmin>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => {
                return <SubAdminCell subAdmin={info.row.original} />
            },
            header: () => <span>Industry</span>,
        },
        {
            accessorKey: 'id',
            header: () => <span>Coordinator ID</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'contactPerson',
            header: () => <span>Contact Person</span>,
            cell: (info) => {
                return (
                    <div>
                        {/* <p>{info.row.original.contactPerson}</p>
            <p className="text-xs text-gray-500">
              {info.row.original.contactPersonNumber}
            </p> */}
                    </div>
                )
            },
        },
        {
            accessorKey: 'studentCount',
            header: () => <span>Assigned Students</span>,
        },
        {
            accessorKey: 'addressLine1',
            header: () => <span>Address</span>,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'Created By',
            header: () => <span>Created By</span>,
            cell: (info) => info.getValue(),
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
        individual: (id: SubAdmin) => (
            <div className="flex gap-x-2">
                <ActionButton Icon={MdUnarchive} variant="warning">
                    Unarchive
                </ActionButton>
                <ActionButton Icon={FaTrash} variant="error">
                    Delete
                </ActionButton>
            </div>
        ),
        common: (ids: SubAdmin[]) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        const arrayOfIds = ids.map((id: any) => id?.user.id)
                        bulkAction({
                            ids: arrayOfIds,
                            status: UserStatus.Approved,
                        })
                    }}
                    Icon={MdUnarchive}
                    variant="warning"
                >
                    Unarchive
                </ActionButton>
                <ActionButton Icon={FaTrash} variant="error">
                    Delete
                </ActionButton>
            </div>
        ),
    }

    return (
        <>
            {modal}
            {passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
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
                                                setItemPerPage
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
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Archived SubAdmin!'}
                                description={
                                    'You have not archived any SubAdmin request yet'
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

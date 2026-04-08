import {
    ActionButton,
    Badge,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    PageHeading,
    Table,
    TableAction,
    TableChildrenProps,
    TechnicalError,
    TruncatedTextWithTooltip,
    Typography,
} from '@components'
import { AdminApi } from '@queries'
import { PermissionFormType } from '@types'
import { useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { DeletePermissionModal } from './modals/DeletePermissionModal'
import { PermissionModal } from './modals/PermissionModal'

export const PermissionList = () => {
    const [modal, setModal] = useState<React.ReactNode>(null)
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const { data, isLoading, isFetching, isError } =
        AdminApi.Permissions.useListQuery({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })
    const onAddPermission = () => {
        setModal(<PermissionModal onCancel={() => setModal(null)} />)
    }

    const onEditPermission = (permission: any) => {
        setModal(
            <PermissionModal
                edit
                permission={permission}
                onCancel={() => setModal(null)}
            />
        )
    }

    const onDeletePermission = (permission: any) => {
        setModal(
            <DeletePermissionModal
                permission={permission}
                onCancel={() => setModal(null)}
            />
        )
    }

    const columns: any[] = [
        {
            accessorKey: 'name',
            id: 'name',
            header: () => <span>Name</span>,
        },
        {
            accessorKey: 'code',
            id: 'code',
            header: () => <span>Code</span>,
            cell: (info: any) => (
                <div className="flex">
                    <Badge variant="primaryNew" text={info.getValue()} />
                </div>
            ),
        },
        {
            accessorKey: 'description',
            id: 'description',
            header: () => <span>Description</span>,
            cell: (info: any) => (
                <TruncatedTextWithTooltip text={info.getValue() || 'N/A'} />
            ),
        },
        {
            id: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => {
                const permission = info.row.original
                const actions = [
                    {
                        text: 'Edit',
                        Icon: FaEdit,
                        onClick: () => onEditPermission(permission),
                    },
                    {
                        text: 'Delete',
                        Icon: FaTrash,
                        color: 'text-red-500 hover:bg-red-100',
                        onClick: () => onDeletePermission(permission),
                    },
                ]
                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction options={actions} rowItem={permission} />
                    </div>
                )
            },
        },
    ]

    return (
        <>
            {modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading title="Permissions Management">
                    <Button
                        variant="primaryNew"
                        Icon={FaPlus}
                        onClick={onAddPermission}
                    >
                        Add Permission
                    </Button>
                </PageHeading>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data.data?.length ? (
                        <Table columns={columns} data={data.data}>
                            {({
                                table,
                                pagination,
                                pageSize,
                            }: TableChildrenProps) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                        <div className="flex gap-x-2">
                                            {pagination &&
                                                pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto remove-scrollbar">
                                        <div className="px-6 py-4 w-full">
                                            {table}
                                        </div>
                                    </div>

                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                {pagination &&
                                                    pagination(
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
                                title={'No Permissions Found!'}
                                description={
                                    'There are no permissions created yet. Click "Add Permission" to create one.'
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

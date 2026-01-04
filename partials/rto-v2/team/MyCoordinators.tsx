import {
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import React, { ReactElement, useEffect, useState } from 'react'
import { CoursesCell } from '@partials/rto/coordinators'
import { RtoApi } from '@queries'
import { useRouter } from 'next/router'
import { UserRoles } from '@constants'
import { AllowAllStudentsAccessModal, DeleteRtoCoordinatorModal, EditCoordinatorModal } from './modal'
import { SubAdmin } from '@types'

export const MyCoordinators = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()

    const { isLoading, data, isError } = RtoApi.Coordinator.useList({
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })


    const onCancelModal = () => setModal(null)

    const onDeleteCoordinator = (coordinator: SubAdmin) => {
        setModal(
            <DeleteRtoCoordinatorModal
                onCancel={onCancelModal}
                coordinator={coordinator}
            />
        )
    }
    const onHasAllowAllStudentsAccess = (coordinator: any) => {
        setModal(
            <AllowAllStudentsAccessModal
                coordinator={coordinator}
                onCancel={onCancelModal}
            />
        )
    }

    const onEditClicked = (coordinator: SubAdmin) => {
        setModal(
            <EditCoordinatorModal
                onCancel={onCancelModal}
                coordinator={coordinator}
            />
        )
    }

    const tableActionOptions = (coordinator: any) => [
        {
            text: 'View',
            onClick: (coordinator: any) => {
                router.push(`/portals/rto/coordinators/${coordinator?.id}`)
            },
            Icon: '',
        },
        {
            text: 'Edit',
            onClick: (coordinator: any) => {
                onEditClicked(coordinator)
            },
            Icon: '',
        },
        {
            ...(coordinator?.createdBy?.role === UserRoles.RTO
                ? {
                    text: 'Delete',
                    onClick: (coordinator: any) => {
                        onDeleteCoordinator(coordinator)
                        //   removeCoordinator(coordinator?.user?.id)
                    },
                    Icon: '',
                }
                : null),
        },
        {
            text: 'Allow All Students Access',
            onClick: (coordinator: any) => {
                onHasAllowAllStudentsAccess(coordinator)
            },
            Icon: '',
        },
    ]

    const Columns: ColumnDef<any>[] = [
        {
            header: () => 'Coordinator',
            accessorKey: 'title',
            cell: ({ row }: any) => {
                const {
                    user: { name, email, avatar },
                } = row.original
                return (
                    <Link
                        legacyBehavior
                        href={`/portals/rto/coordinators/${row.original.id}`}
                        className="flex items-center gap-x-2 relative"
                    >
                        <a className="flex items-center gap-x-1">
                            <InitialAvatar name={name} imageUrl={avatar} />
                            <div>
                                <Typography color={'black'}>
                                    {' '}
                                    {name}{' '}
                                </Typography>
                                <Typography variant={'muted'} color={'gray'}>
                                    {email}
                                </Typography>
                            </div>
                        </a>
                    </Link>
                )
            },
        },
        {
            header: () => 'Phone',
            accessorKey: 'phone',
        },
        {
            header: () => 'Courses',
            accessorKey: 'course',
            cell: (info) => (
                <CoursesCell
                    showAction={false}
                    coordinator={info.row.original}
                />
            ),
        },
        {
            header: () => 'Address',
            accessorKey: 'addressLine1',
        },
        {
            header: () => 'Created By',
            accessorKey: 'createdBy.role',
            cell: (info) => (
                <Typography variant="small" semibold uppercase>
                    {info.row.original?.createdBy?.role}
                </Typography>
            ),
        },

        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }: any) => {
                const tableActionOption = tableActionOptions(row?.original)
                return (
                    <TableAction
                        rowItem={row?.original}
                        options={tableActionOption?.filter(
                            (action) => action?.text
                        )}
                    />
                )
            },
        },
    ]
    return (
        <div>
            {modal}
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data.length ? (
                    <Table
                        columns={Columns}
                        data={data.data}
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
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Coordinator!'}
                            description={'You have not any Coordinator yet'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

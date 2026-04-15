import {
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'

import { AdminApi } from '@queries'
import { Student } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { useActionModal, useContextBar } from '@hooks'
import { AddObserverCB, EditObserverCB } from './contextBar'
import { RtoCellInfo } from '../rto/components'
import { RiLockPasswordFill } from 'react-icons/ri'
import { RtoObserCellInfo } from './components'
import { DeleteModal } from './modal'
import { MdOutlinePassword } from 'react-icons/md'

export const RtoObserverList = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const contextBar = useContextBar()
    const { passwordModal, onViewPassword, onUpdatePassword } = useActionModal()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({})

    useEffect(() => {
        setPage(Number(router.query.page) || 1)
        setItemPerPage(Number(router.query.pageSize) || 50)
    }, [router])

    // hooks

    const { isLoading, isFetching, data, isError, isSuccess } =
        AdminApi.RtoObserver.useObserList({
            search: ``,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const onCancel = () => setModal(null)

    const onAddObserver = () => {
        contextBar.show()
        contextBar.setTitle('Add Rto Contact Person')
        contextBar.setContent(<AddObserverCB />)
    }

    const onEditObserver = (observer: any) => {
        const initialValues = {
            id: observer?.id,
            name: observer?.user?.name,
            email: observer?.user?.email,
            phone: observer?.phone,
            rto: { label: observer?.rto?.user?.name, value: observer?.rto?.id },
        }
        contextBar.show()
        contextBar.setTitle('Edit Rto Contact Person')
        contextBar.setContent(
            <EditObserverCB edit initialValues={initialValues} />
        )
    }

    const onRemoveObserver = (rtoObserver: any) => {
        setModal(<DeleteModal onCancel={onCancel} rtoObserver={rtoObserver} />)
    }

    const tableActionOptions = [
        {
            text: 'Edit',
            onClick: (observer: any) => onEditObserver(observer),
            Icon: RiLockPasswordFill,
        },
        {
            text: 'View Password',
            onClick: (observer: any) =>
                onViewPassword({ user: observer?.user }),
            Icon: RiLockPasswordFill,
        },
        {
            text: 'Change Password',
            onClick: (observer: any) => {
                onUpdatePassword(observer)
            },
            Icon: MdOutlinePassword,
        },
        {
            text: 'Delete',
            onClick: (observer: any) => onRemoveObserver(observer),
            Icon: RiLockPasswordFill,
        },
    ]

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'contactPerson',
            header: () => <span>Contact Person</span>,
            cell: (info) => <RtoObserCellInfo observer={info?.row?.original} />,
        },
        {
            accessorKey: 'rto',
            header: () => <span>Rto</span>,
            cell: (info) => <RtoCellInfo rto={info?.row?.original?.rto} />,
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => {
                return (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'Do MMM YYYY'
                                )}
                            </span>
                        </Typography>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'hh:mm:ss a'
                                )}
                            </span>
                        </Typography>
                    </>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => (
                <div className="flex gap-x-1 items-center">
                    <TableAction
                        options={tableActionOptions}
                        rowItem={info?.row?.original}
                    />
                </div>
            ),
        },
    ]
    return (
        <>
            {modal}
            {passwordModal}
            <div className="flex flex-col gap-y-4 mb-32 p-5">
                <PageHeading
                    title={'All Students'}
                    subtitle={'List of All Students'}
                >
                    <Button
                        text="Add Rto Contact Person"
                        onClick={() => {
                            onAddObserver()
                        }}
                    />
                </PageHeading>

                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length && isSuccess ? (
                        <Table columns={columns} data={data?.data}>
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
                                        <div
                                            className="px-6"
                                            id={'studentScrollId'}
                                        >
                                            {table}
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
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Pending Student!'}
                                description={
                                    'You have no pending Student request yet'
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

import {
    ActionButton,
    Badge,
    Button,
    Card,
    CreatedAtDate,
    TableAction,
    TableActionOption,
    Typography,
} from '@components'
import { DataKpiTable } from '@partials/common'
import { AdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import moment, { Moment } from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { RiUserLine } from 'react-icons/ri'
import {
    ChangeStatusModal,
    ConfirmAllPaymentModal,
    ConfirmPaymentModal,
    ToggleDuplicateModal,
} from '../modals'
import { paymentStatusData } from './InvoiceStatusData'
import { FaEye } from 'react-icons/fa'
import { BiSolidPencil } from 'react-icons/bi'
import Link from 'next/link'
import { ellipsisText } from '@utils'

export const InvoiceDataListing = ({
    startDate,
    endDate,
}: {
    startDate: string | null
    endDate: string | null
}) => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const invoice = AdminApi.Invoice.invoiceRtoDataList(
        {
            limit: itemPerPage,
            id: Number(router.query.id),
            skip: itemPerPage * page - itemPerPage,
            search:
                startDate && endDate
                    ? `startDate:${moment(startDate).format(
                          'YYYY-MM-DD'
                      )},endDate:${moment(endDate).format('YYYY-MM-DD')}`
                    : '',
        },
        {
            skip: !router.query.id,
        }
    )

    const onCancelModal = () => setModal(null)

    const onPaymentConfirm = (invoice: any) => {
        setModal(
            <ConfirmPaymentModal onCancel={onCancelModal} invoice={invoice} />
        )
    }

    const onPaymentAllConfirm = (ids: number[]) => {
        setModal(<ConfirmAllPaymentModal ids={ids} onCancel={onCancelModal} />)
    }

    const onStatusChangeClicked = (id: any) => {
        setModal(<ChangeStatusModal onCancel={onCancelModal} id={id} />)
    }

    const onToggleDuplicate = (invoice: any) => {
        setModal(
            <ToggleDuplicateModal onCancel={onCancelModal} invoice={invoice} />
        )
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'Student Profile',
            onClick: (invoice: any) => {
                router.push(`/portals/admin/student/${invoice?.stdId}/detail`)
            },
            Icon: FaEye,
        },
    ]

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => (
                <Link
                    href={`/portals/admin/student/${info?.row?.original?.stdId}/detail`}
                    className="flex flex-col"
                >
                    <Typography variant="small" color="text-gray-500" normal>
                        {ellipsisText(info.row?.original?.studentId, 8)}
                    </Typography>
                    <Typography variant="label" normal cursorPointer>
                        {info.row?.original?.studentName}
                    </Typography>
                </Link>
            ),
        },
        {
            accessorKey: 'courses',
            header: 'COURSE',
            cell: (info) => (
                <div>
                    <Typography variant="small" normal>
                        {info?.row?.original?.courseCode}
                    </Typography>
                    <Typography variant="label" normal>
                        {info?.row?.original?.courseTitle}
                    </Typography>
                </div>
            ),
        },
        {
            accessorKey: 'invoiceAction',
            header: 'Invoice Action',
            cell: (info) => (
                <div>
                    <Badge
                        variant="success"
                        text={info?.row?.original?.invoiceAction}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'currentStatus',
            header: 'WP Current Status',
            cell: (info) => (
                <div>
                    <Badge
                        variant="success"
                        text={info?.row?.original?.currentStatus || '---'}
                    />
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const paymentStatus = paymentStatusData(
                    info.row?.original?.paymentStatus || '---'
                )
                return (
                    <div className="flex items-center gap-2">
                        <Badge
                            text={paymentStatus?.text + ''}
                            variant={
                                paymentStatus?.variant || ('primary' as any)
                            }
                        />
                        <ActionButton
                            variant="info"
                            onClick={() => {
                                onStatusChangeClicked(info.row?.original?.id)
                            }}
                            disabled={info.row?.original?.isDuplicated}
                            Icon={BiSolidPencil}
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: 'confirmation',
            header: 'Confirm',
            cell: (info) => (
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        text={
                            info?.row?.original?.isConfirmed
                                ? 'Confirmed'
                                : 'Confirm'
                        }
                        onClick={() => {
                            onPaymentConfirm(info?.row?.original)
                        }}
                        disabled={
                            info?.row?.original?.isConfirmed ||
                            info?.row?.original?.isDuplicated
                        }
                    />
                    {info?.row?.original?.isConfirmed && (
                        <div>
                            <Typography variant="small" normal bold>
                                Confirmed At
                            </Typography>
                            <CreatedAtDate
                                createdAt={info.row?.original?.confirmationDate}
                            />
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'isDuplicated',
            header: 'Duplicated',
            cell: (info) => (
                <div className="flex flex-col gap-y-2.5">
                    <ActionButton
                        variant="info"
                        onClick={() => onToggleDuplicate(info?.row?.original)}
                    >
                        {info?.row?.original?.isDuplicated
                            ? 'Remove Duplicated'
                            : 'Mark as Duplicate'}
                    </ActionButton>
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: (info) => (
                <CreatedAtDate createdAt={info.row?.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => (
                <TableAction
                    options={tableActionOptions}
                    rowItem={info.row.original}
                />
            ),
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (invoice: any) => (
            <Button
                text={invoice?.isConfirmed ? 'Confirmed' : 'Confirm'}
                onClick={() => {
                    onPaymentConfirm(invoice)
                }}
                disabled={invoice?.isConfirmed}
            />
        ),
        common: (invoices: any) => {
            return (
                <div className="flex gap-x-2">
                    <Button
                        text={'Confirm All Selected'}
                        onClick={() => {
                            onPaymentAllConfirm(
                                invoices?.map((invoice: any) => invoice?.id)
                            )
                        }}
                    />
                </div>
            )
        },
    }

    return (
        <>
            {modal && modal}
            <Card noPadding>
                <DataKpiTable
                    setPage={setPage}
                    colors="[blue]"
                    Icon={RiUserLine}
                    title="Invoice Data"
                    columns={columns}
                    data={invoice}
                    enableRowSelection
                    quickActions={quickActionsElements}
                    setItemPerPage={(itemPerPage: number) => {
                        setPage(1)
                        setItemPerPage(itemPerPage)
                    }}
                />
            </Card>
        </>
    )
}

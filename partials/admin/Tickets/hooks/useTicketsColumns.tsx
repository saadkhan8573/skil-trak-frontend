import { Portal, TableAction, TableActionOption, Typography } from '@components'
import { RtoCellInfo } from '@partials/admin/rto/components'
import { StudentCellInfo } from '@partials/admin/student/components'
import { TicketSubject } from '@partials/common/Tickets'
import { TicketUser } from '@partials/common/Tickets/components'
import { ColumnDef } from '@tanstack/react-table'
import { TicketTypes } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsFillEyeFill } from 'react-icons/bs'
import { CloseTicketModal } from '../modals'

export const useTicketsColumns = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancelClicked = () => setModal(null)

    const onCloseClicked = (ticket: any) => {
        setModal(
            <Portal>
                <CloseTicketModal onCancel={onCancelClicked} ticket={ticket} />
            </Portal>
        )
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (ticket: any) =>
                router.push(`/portals/admin/tickets/detail/${ticket?.id}`),
            Icon: BsFillEyeFill,
        },
        {
            text: 'Close',
            onClick: (ticket: any) => onCloseClicked(ticket),
            Icon: AiFillCloseCircle,
        },
    ]

    const columns: ColumnDef<TicketTypes>[] = [
        {
            accessorKey: 'subject',
            cell: (info) => <TicketSubject ticket={info?.row?.original} />,
            header: () => <span>Subject</span>,
        },
        {
            accessorKey: 'user.name',
            cell: (info) => {
                return info?.row?.original?.student ? (
                    <StudentCellInfo
                        student={info?.row?.original?.student}
                        call
                    />
                ) : (
                    'N/A'
                )
            },
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            cell: (info) => {
                return info?.row?.original?.student ? (
                    <RtoCellInfo rto={info?.row?.original?.student?.rto} />
                ) : (
                    'N/A'
                )
            },
            header: () => <span>RTO</span>,
        },
        {
            accessorKey: 'createdBy',
            cell: (info) => <TicketUser ticket={info?.row?.original} />,
            header: () => <span>Created By</span>,
        },
        {
            accessorKey: 'assignedTo',
            cell: (info) => (
                <TicketUser ticket={info?.row?.original?.assignedTo} />
            ),
            header: () => <span>Assigned To</span>,
        },
        {
            accessorKey: 'course',
            header: () => <span>Course</span>,
            cell: (info) => (
                <Typography variant="muted" capitalize>
                    {info?.row?.original?.course?.title || 'N/A'}
                </Typography>
            ),
        },
        // {
        //     accessorKey: 'priority',
        //     header: () => <span>Priority</span>,
        //     cell: (info) => (
        //         <Typography variant="label" capitalize semibold>
        //             {info.row.original?.priority}
        //         </Typography>
        //     ),
        // },
        {
            accessorKey: 'lastActivity',
            cell: (info) => (
                <Typography variant={'label'} capitalize>
                    <span className="whitespace-pre">
                        {moment(info.row.original?.updatedAt).fromNow()}
                    </span>
                </Typography>
            ),
            header: () => <span>Last Activity</span>,
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
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
    return { columns, modal }
}

import {
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { TicketSubject, TicketUser } from '@partials/common/Tickets/components'
import { CommonApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { AiFillCloseCircle, AiFillDelete } from 'react-icons/ai'
import { StudentCellInfo } from '../student/components'
import { TicketStatus } from '@partials/common/Tickets'

export const ClosedTickets = ({ layoutV2 = false }: { layoutV2?: boolean }) => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const router = useRouter()

    const { isLoading, isFetching, data, isError } =
        CommonApi.Tickets.useGetTicket(
            {
                search: `status:${TicketStatus.CLOSED}`,
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
            { refetchOnMountOrArgChange: true }
        )

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (ticket: any) =>
                router.push(layoutV2 ? `/portals/rto/communications/tickets/${ticket?.id}` : `/portals/sub-admin/tickets/detail/${ticket?.id}`),
            Icon: AiFillCloseCircle,
        },
        {
            text: 'Delete',
            onClick: () => { },
            Icon: AiFillDelete,
        },
    ]
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'subject',
            cell: (info) => {
                return <TicketSubject ticket={info?.row?.original} />
            },
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
            accessorKey: 'createdBy',
            cell: (info) => (
                <TicketUser ticket={info?.row?.original?.createdBy} />
            ),
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
            accessorKey: 'closedAt',
            cell: (info) => (
                <Typography variant="small" semibold>
                    <span className="whitespace-pre">
                        {moment(info.row.original?.closedAt).format(
                            'DD, MMM YYYY'
                        )}
                    </span>
                </Typography>
            ),
            header: () => <span>Closed At</span>,
        },
        {
            accessorKey: 'priority',
            header: () => <span>Priority</span>,
            cell: (info) => (
                <Typography variant="label" capitalize semibold>
                    {info.row.original?.priority}
                </Typography>
            ),
        },
        {
            accessorKey: 'replies',
            header: () => <span>Replies</span>,
        },
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
    return (
        <div>
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading || isFetching ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data.length ? (
                    <Table columns={columns} data={data.data}>
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
                                    <div className=" overflow-x-scroll remove-scrollbar">
                                        <div className="px-6 w-full">
                                            {table}
                                        </div>
                                    </div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Tickets!'}
                            description={'You have no Tickets request yet'}
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </div>
    )
}

import {
    ActionButton,
    Badge,
    Button,
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'

import { AdminApi } from '@queries'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { WpCancelationReqFilter } from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { StudentCellInfo } from '../../admin/student/components'
import {
    ApproveRequestModal,
    RejectRequestModal,
    ViewWpRequestNoteModal,
} from './modals'

export const WpTerminationRequest = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({} as WpCancelationReqFilter)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, isFetching, data, isError } =
        AdminApi.Workplace.wpTerminationRequestsList({
            search: `${JSON.stringify(filter)
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const onCancelClicked = () => setModal(null)

    const onViewNoteClicked = (note: string) => {
        setModal(
            <ViewWpRequestNoteModal note={note} onCancel={onCancelClicked} />
        )
    }
    const onApproveRequestClicked = (workplace: IWorkplaceIndustries) => {
        setModal(
            <ApproveRequestModal
                workplace={workplace}
                onCancel={onCancelClicked}
            />
        )
    }
    const onRejectRequestClicked = (workplace: IWorkplaceIndustries) => {
        setModal(
            <RejectRequestModal
                workplace={workplace}
                onCancel={onCancelClicked}
            />
        )
    }

    const columns: ColumnDef<IWorkplaceIndustries>[] = [
        {
            accessorKey: 'student',
            header: () => <span>Student</span>,
            cell: (info) =>
                info.row.original?.student ? (
                    <StudentCellInfo student={info.row.original.student} />
                ) : (
                    <span>-</span>
                ),
        },
        {
            accessorKey: 'requestedBy',
            header: () => <span>Requested By</span>,
            cell: (info) => {
                const request = info.row.original?.terminatedByUser
                if (!request) return <span>-</span>

                return (
                    <a className="flex items-center gap-x-2">
                        <div className="shadow-inner-image rounded-full scale-75 origin-left">
                            {request?.name && (
                                <InitialAvatar
                                    name={request?.name}
                                    imageUrl={request?.avatar}
                                />
                            )}
                        </div>
                        <div className="-ml-1">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                                {request?.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium leading-tight">
                                {request?.email}
                            </p>
                        </div>
                    </a>
                )
            },
        },
        {
            accessorKey: 'currentStatus',
            header: () => (
                <span className="whitespace-pre">Workplace Status</span>
            ),
            cell: (info) => (
                <Badge
                    variant="success"
                    text={info.row.original?.currentStatus}
                />
            ),
        },
        {
            accessorKey: 'comment',
            header: () => <span>Comment</span>,
            cell: (info) => {
                const comment = info.row.original?.terminationComment
                return (
                    <ActionButton
                        onClick={() => {
                            onViewNoteClicked(comment || '')
                        }}
                        variant="info"
                        simple
                    >
                        View Note
                    </ActionButton>
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => {
                const date = info.row.original?.terminatedAt

                return (
                    <div className="flex flex-col -gap-y-1">
                        <p className="text-[11px] font-bold text-slate-700">
                            {moment(date).format('Do MMM YYYY')}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                            {moment(date).format('hh:mm A')}
                        </p>
                    </div>
                )
            },
        },
        {
            accessorKey: 'actions',
            header: () => <span>Actions</span>,
            cell: (info) => {
                const workplace = info.row.original
                return (
                    <div className="flex items-center gap-x-2">
                        <Button
                            text={'Approve'}
                            variant="success"
                            disabled={
                                workplace?.currentStatus ===
                                WorkplaceCurrentStatus.Terminated
                            }
                            onClick={() => {
                                onApproveRequestClicked(info.row.original)
                            }}
                        />
                        <Button
                            disabled={
                                workplace?.currentStatus ===
                                WorkplaceCurrentStatus.Terminated
                            }
                            text={'Reject'}
                            variant="error"
                            onClick={() => {
                                onRejectRequestClicked(info.row.original)
                            }}
                        />
                    </div>
                )
            },
        },
    ]

    return (
        <>
            {modal}

            <div className="flex flex-col gap-y-4 mb-20 px-4">
                <PageHeading
                    title={'Workplace Termination Requests'}
                    subtitle={'List of Workplace Termination Requests'}
                ></PageHeading>

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
                                        <div className="px-4 py-3 border-b flex justify-between items-center bg-slate-50/30">
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
                                            className="px-4 py-1.5 overflow-auto remove-scrollbar"
                                            id={'studentScrollId'}
                                        >
                                            {table}
                                        </div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Termination Requests!'}
                                description={
                                    'There are no pending termination requests at the moment.'
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

import {
    ActionButton,
    Badge,
    Button,
    Card,
    EmptyData,
    Filter,
    InitialAvatar,
    LoadingAnimation,
    SetDetaultQueryFilteres,
    Table,
    TechnicalError,
    Typography,
    WPCancelationReqFilters,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'

import { AdminApi } from '@queries'
import { WpCancelationReqFilter } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { StudentCellInfo } from '../../admin/student/components'
import { CancelationRequestEnum } from './enum'
import {
    ApproveRequestModal,
    IndustryRejectedWpAcceptModal,
    IndustryRejectedWpDeclineModal,
    RejectRequestModal,
    ViewWpRequestNoteModal,
} from './modals'
import { IndustryCellInfo } from '@partials/sub-admin/Industries'

const filterKeys = [
    'name',
    'email',
    'phone',
    'status',
    'courseId',
    'studentId',
    'coordinatorId',
]

export const WpIndustryRejectedRequest = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [filterAction, setFilterAction] = useState(null)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({} as WpCancelationReqFilter)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const { isLoading, isFetching, data, isError } =
        AdminApi.Workplace.useIndustryRejectedWpList({
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
    const onApproveRequestClicked = (wpRequest: any) => {
        setModal(
            <IndustryRejectedWpAcceptModal
                wpReq={wpRequest}
                onCancel={onCancelClicked}
            />
        )
    }
    const onRejectRequestClicked = (wpRequest: any) => {
        setModal(
            <IndustryRejectedWpDeclineModal
                wpReq={wpRequest}
                onCancel={onCancelClicked}
            />
        )
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'student',
            header: () => <span>Student</span>,
            cell: (info) => (
                <StudentCellInfo student={info.row.original?.student} />
            ),
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <IndustryCellInfo industry={info?.row?.original?.industry} />
            ),
        },
        {
            accessorKey: 'cancelledBy',
            header: () => <span>Cancelled By</span>,
            cell: (info) => {
                console.log('info.row.original', info?.row?.original)
                return (
                    <a className="flex items-center gap-x-2">
                        <div className="shadow-inner-image rounded-full">
                            {info.row.original?.industryRejectionUser?.name && (
                                <InitialAvatar
                                    name={
                                        info.row.original?.industryRejectionUser
                                            ?.name
                                    }
                                    imageUrl={
                                        info.row.original?.industryRejectionUser
                                            ?.avatar
                                    }
                                />
                            )}
                        </div>
                        <div>
                            <p className={`font-semibold`}>
                                {info.row.original?.industryRejectionUser?.name}
                            </p>
                            <div className="font-medium text-xs text-gray-500">
                                <p className="flex items-center gap-x-1">
                                    <span>
                                        <MdEmail />
                                    </span>
                                    {
                                        info.row.original?.industryRejectionUser
                                            ?.email
                                    }
                                </p>
                            </div>
                        </div>
                    </a>
                )
            },
        },
        // {
        //     accessorKey: 'currentStatus',
        //     header: () => (
        //         <span className="whitespace-pre">Workplace Status</span>
        //     ),
        //     cell: (info) => (
        //         <Badge
        //             variant="success"
        //             text={info.row.original?.workplaceRequest?.currentStatus}
        //         />
        //     ),
        // },
        // {
        //     accessorKey: 'status',
        //     header: () => (
        //         <span className="whitespace-pre">Canelation Status</span>
        //     ),
        //     cell: (info) => (
        //         <Badge
        //             variant={
        //                 info.row.original?.status ===
        //                 CancelationRequestEnum.Rejected
        //                     ? 'error'
        //                     : 'success'
        //             }
        //             text={info.row.original?.status}
        //         />
        //     ),
        // },
        // {
        //     accessorKey: 'comment',
        //     header: () => <span>Comment</span>,
        //     cell: (info) => (
        //         <ActionButton
        //             onClick={() => {
        //                 onViewNoteClicked(info.row.original?.comment)
        //             }}
        //             variant="info"
        //             simple
        //         >
        //             View Comment
        //         </ActionButton>
        //     ),
        // },
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
            accessorKey: 'actions',
            header: () => <span>Actions</span>,
            cell: (info) => (
                <div className="flex items-center gap-x-2">
                    <Button
                        text={'Approve'}
                        variant="success"
                        onClick={() => {
                            onApproveRequestClicked(info.row.original)
                        }}
                    />
                    <Button
                        text={'Reject'}
                        variant="error"
                        onClick={() => {
                            onRejectRequestClicked(info.row.original)
                        }}
                    />
                </div>
            ),
        },
    ]

    return (
        <>
            {modal}
            <SetDetaultQueryFilteres<WpCancelationReqFilter>
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="flex flex-col gap-y-4 mb-32 px-4">
                <PageHeading
                    title={'Workplace Cancellation Requests'}
                    subtitle={'List of Workplace Cancellation Requests'}
                >
                    <div className="shrink-0">{filterAction}</div>
                </PageHeading>
                <Filter<WpCancelationReqFilter>
                    setFilter={setFilter}
                    initialValues={filter}
                    filterKeys={filterKeys}
                    component={WPCancelationReqFilters}
                    setFilterAction={setFilterAction}
                />

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
                                        <div
                                            className="px-6 overflow-auto remove-scrollbar"
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
                                title={'No rejected request!'}
                                description={'There is no industry rejected yet'}
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}

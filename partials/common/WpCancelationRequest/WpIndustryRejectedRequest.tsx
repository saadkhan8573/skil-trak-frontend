import {
    Button,
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    Table,
    TechnicalError,
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'

import { IndustryCellInfo } from '@partials/sub-admin/Industries'
import { AdminApi } from '@queries'
import { WpCancelationReqFilter } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { StudentCellInfo } from '../../admin/student/components'
import {
    IndustryRejectedWpAcceptModal,
    IndustryRejectedWpDeclineModal,
} from './modals'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui'
import { MessageSquare } from 'lucide-react'

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
            cell: (info) => (
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
            ),
        },
        {
            accessorKey: 'industryRejectionDate',
            header: () => <span>Rejection Date</span>,
            cell: (info) => {
                const date = info?.row?.original?.industryRejectionDate
                return (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {date
                                    ? moment(date).format('Do MMM YYYY')
                                    : 'N/A'}
                            </span>
                        </Typography>
                        {date && (
                            <Typography
                                variant={'small'}
                                color={'text-gray-600'}
                            >
                                <span className="font-semibold whitespace-pre">
                                    {moment(date).format('hh:mm:ss a')}
                                </span>
                            </Typography>
                        )}
                    </>
                )
            },
        },
        {
            accessorKey: 'industryRejectionComment',
            header: () => <span>Industry Rejection Comment</span>,
            cell: (info) => {
                const comment = info?.row?.original?.industryRejectionComment
                const isLarge = comment?.length > 20
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 max-w-37.5">
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] font-semibold leading-tight truncate">
                                {comment || 'N/A'}
                            </span>
                        </div>
                        {isLarge && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="text-[10px] text-[#044866] hover:text-[#0D5468] font-medium underline cursor-pointer text-left w-fit transition-colors">
                                        View All
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none text-red-600 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Rejection Reason
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-relaxed text-wrap whitespace-normal">
                                            {comment}
                                        </p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )
            },
            // cell: (info) => (
            //     <div className="max-w-[200px]">
            //         <Typography variant={'small'} color={'text-gray-600'}>
            //             <span className="font-semibold text-wrap">
            //                 {info?.row?.original?.industryRejectionComment ||
            //                     'N/A'}
            //             </span>
            //         </Typography>
            //     </div>
            // ),
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

            <div className="flex flex-col gap-y-4 mb-32 px-4">
                <PageHeading
                    title={'Workplace Requests Rejected'}
                    subtitle={'List of Workplace Requests Rejected'}
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
                                description={
                                    'There is no industry rejected yet'
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

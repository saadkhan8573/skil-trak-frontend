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
    Typography,
} from '@components'
import { PageHeading } from '@components/headings'
import { ColumnDef } from '@tanstack/react-table'

import { RtoApi } from '@queries'
import { RtoApprovalWorkplaceRequest } from '@types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'
import { StudentCellInfo } from '../student/components'
import {
    ApproveWpApprovalRequest,
    RejectWpApprovalRequest,
    WPApprovalCourseRequirementModal,
} from './modal'

export const RtoWpApproval = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page))
        setItemPerPage(Number(router.query.pageSize))
    }, [router])

    const wpApprovalRequests = RtoApi.Workplace.wpApprovalRequest(
        {
            limit: itemPerPage,
            skip: itemPerPage * page - itemPerPage,
            search: ""
        },
        {
            refetchOnMountOrArgChange: 30,
        }
    )

    const onCancelModal = () => setModal(null)

    const onApprove = (wpAppReq: RtoApprovalWorkplaceRequest) => {
        setModal(
            <ApproveWpApprovalRequest
                wpAppReq={wpAppReq}
                onCancel={onCancelModal}
            />
        )
    }

    const onReject = (wpAppReq: RtoApprovalWorkplaceRequest) => {
        setModal(
            <RejectWpApprovalRequest
                wpAppReq={wpAppReq}
                onCancel={onCancelModal}
            />
        )
    }

    const onViewCourseRequirement = (wpAppReq: RtoApprovalWorkplaceRequest) => {
        setModal(
            <WPApprovalCourseRequirementModal
                wpAppReq={wpAppReq}
                onCancel={onCancelModal}
            />
        )
    }

    const columns: ColumnDef<RtoApprovalWorkplaceRequest>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <StudentCellInfo student={info.row.original?.student} />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <div className="flex items-center gap-x-2">
                    <div className="shadow-inner-image rounded-full relative">
                        <InitialAvatar
                            name={info?.row?.original?.industry?.user?.name}
                            imageUrl={
                                info?.row?.original?.industry?.user?.avatar
                            }
                        />
                    </div>
                    <div>
                        <p className="font-semibold">
                            {info?.row?.original?.industry?.user?.name}
                        </p>
                        <div className="font-medium text-xs text-gray-500">
                            <p className="flex items-center gap-x-1">
                                <span>
                                    <MdEmail />
                                </span>
                                {info?.row?.original?.industry?.user?.email}
                            </p>
                            <p className="flex items-center gap-x-1">
                                <span>
                                    <MdPhoneIphone />
                                </span>
                                {info?.row?.original?.industry?.phoneNumber}
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'requirement',
            header: () => <span>Requirement</span>,
            cell: (info) => (
                <ActionButton
                    onClick={() => {
                        onViewCourseRequirement(info?.row?.original)
                    }}
                    variant="info"
                >
                    View Course
                </ActionButton>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => (
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
            ),
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: ({ row }) => <Badge text={row.original?.rtoApprovalStatus} />,
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info: any) => (
                <div className="flex gap-x-1 items-center">
                    <Button
                        text="Approve"
                        onClick={() => {
                            onApprove(info.row.original)
                        }}
                        variant="success"
                    />

                    <Button
                        text="Reject"
                        onClick={() => {
                            onReject(info.row.original)
                        }}
                        variant="error"
                    />
                </div>
            ),
        },
    ]

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-4 mb-32">
                <PageHeading
                    title={'Workplace Approval Request'}
                    subtitle={'List of Workplace Approval Request'}
                />

                <Card noPadding>
                    {wpApprovalRequests?.isError && <TechnicalError />}
                    {wpApprovalRequests?.isLoading ||
                        wpApprovalRequests?.isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : wpApprovalRequests?.data &&
                        wpApprovalRequests?.data?.data.length &&
                        wpApprovalRequests?.isSuccess ? (
                        <Table
                            columns={columns}
                            data={wpApprovalRequests?.data.data}
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
                                                wpApprovalRequests?.data?.data
                                                    ?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    wpApprovalRequests?.data
                                                        ?.pagination,
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
                                        {wpApprovalRequests?.data?.data
                                            ?.length > 10 && (
                                                <div className="p-6 mb-2 flex justify-between">
                                                    {pageSize(
                                                        itemPerPage,
                                                        setItemPerPage,
                                                        wpApprovalRequests?.data
                                                            ?.data?.length
                                                    )}
                                                    <div className="flex gap-x-2">
                                                        {quickActions}
                                                        {pagination(
                                                            wpApprovalRequests?.data
                                                                ?.pagination,
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
                        !wpApprovalRequests?.isError && (
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

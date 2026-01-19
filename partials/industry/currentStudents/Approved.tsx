import {
    ActionButton,
    Card,
    EmptyData,
    InitialAvatar,
    StudentStatusProgressCell,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { ReactElement, useEffect, useState } from 'react'
import { IndustryDetail, StudentCellInfo } from './components'
import { useAppDispatch } from '@redux/hooks'
import { setIndustryDetail } from '@redux'

// query
import { LoadingAnimation } from '@components/LoadingAnimation'
import { PageHeading } from '@components/headings'
import { ProgressCell } from '@partials/admin/student/components'
import {
    useGetIndustryWorkplaceQuery,
    useWorkplaceActionsMutation,
} from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { UserStatus } from '@types'
import {
    WorkplaceCurrentStatus,
    checkStudentStatus,
    checkWorkplaceStatus,
    getStudentWorkplaceAppliedIndustry,
} from '@utils'
import { useRouter } from 'next/router'
import { FaEye } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { ApproveRequestModal } from '@partials/sub-admin/workplace/modals'
import { DeclineStudentByIndustryModal } from '@partials/common/StudentProfileDetail/components'

export const Approved = () => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [modal, setModal] = useState<ReactElement | null>(null)
    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // query
    const industryWorkplace = useGetIndustryWorkplaceQuery(
        {
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        { refetchOnMountOrArgChange: true }
    )

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (workplace: any) => {
                router.push({
                    pathname: `/portals/industry/students/current-students/${workplace?.id}/detail`,
                    query: { tab: 'overview' },
                })
            },
            Icon: FaEye,
        },
        {
            text: 'New Profile',
            onClick: (workplace: any) => {
                router.push(
                    `/portals/industry/students/current-students/${workplace?.id}/detail`
                )
            },
            Icon: FaEye,
        },
    ]

    const onModalCancelClicked = () => setModal(null)

    const onApproveClicked = (wpId: number, industryData?: any) => {
        if (industryData) {
            dispatch(setIndustryDetail(industryData))
        }
        setModal(
            <ApproveRequestModal
                workplaceId={wpId}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onRejectClicked = (wpId: number) => {
        setModal(
            <DeclineStudentByIndustryModal
                workplaceId={wpId}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'user',
            cell: (info) => (
                <StudentCellInfo
                    id={info.row.original?.id}
                    student={info.row.original?.student}
                    wpIndustry={info.row.original?.industries?.[0]}
                />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>Education Provider</span>,
            cell: (info) => {
                const rto = info.row.original?.student?.rto
                return (
                    <div className="flex items-center gap-x-2">
                        <div className="shadow-inner-image rounded-full">
                            <InitialAvatar
                                name={rto?.user?.name || ''}
                                imageUrl={rto?.user?.avatar || ''}
                            />
                        </div>
                        <div>
                            <p className={`font-medium`}>{rto?.user?.name}</p>
                            {info.row.original?.industries?.[0]
                                ?.awaitingAgreementSigned && (
                                <div className="font-medium text-xs text-gray-500">
                                    <p className="flex items-center gap-x-1">
                                        <span>
                                            <MdEmail />
                                        </span>
                                        {rto?.user?.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => {
                const rto = info.row.original?.student?.rto
                return (
                    <IndustryDetail
                        industry={info.row.original?.industries?.[0]?.industry}
                    />
                )
            },
        },

        {
            accessorKey: 'sectors',
            header: () => <span>Course</span>,
            cell: (info) => (
                <div>
                    <Typography variant={'xs'} color={'text-gray-500'}>
                        {info.row.original?.courses[0]?.code || 'N/A'}
                    </Typography>
                    <Typography variant={'label'} color={'text-gray-700'}>
                        {info.row.original?.courses[0]?.title || 'N/A'}
                    </Typography>
                </div>
            ),
        },
        // {
        //     accessorKey: 're',
        //     header: () => <span>Required Hours</span>,
        //     cell: (info) => (
        //         <div className="w-32">
        //             <div className="border-2 border-[#bf0000] bg-[#bf000010] rounded-full p-2 w-fit">
        //                 <Typography variant="xs" medium>
        //                     20 hours
        //                 </Typography>
        //             </div>
        //         </div>
        //     ),
        // },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => {
                const workplace = row.original
                const studentStatus = checkStudentStatus(
                    row.original?.student?.studentStatus
                )
                const appliedIndustry = getStudentWorkplaceAppliedIndustry(
                    workplace?.industries
                )
                const steps = checkWorkplaceStatus(workplace?.currentStatus)

                const wpStatus = [
                    WorkplaceCurrentStatus.Completed,
                    WorkplaceCurrentStatus.Terminated,
                ]

                return (
                    <div>
                        {row.original?.currentStatus ? (
                            <ProgressCell
                                appliedIndustry={appliedIndustry}
                                studentId={row.original?.student?.id}
                                step={steps > 14 ? 14 : steps < 1 ? 1 : steps}
                            />
                        ) : wpStatus.includes(row.original?.currentStatus) ? (
                            <StudentStatusProgressCell
                                assigned={
                                    workplace?.assignedTo ||
                                    row.original?.student?.subadmin
                                }
                                studentId={row.original?.student?.id}
                                step={
                                    workplace?.currentStatus ===
                                    WorkplaceCurrentStatus.Cancelled
                                        ? 4
                                        : studentStatus
                                }
                                appliedIndustry={appliedIndustry}
                            />
                        ) : null}
                    </div>
                )

                return wpStatus.includes(row.original?.currentStatus) ? (
                    <StudentStatusProgressCell
                        assigned={
                            workplace?.assignedTo ||
                            row.original?.student?.subadmin
                        }
                        studentId={row.original?.student?.id}
                        step={
                            workplace?.currentStatus ===
                            WorkplaceCurrentStatus.Cancelled
                                ? 4
                                : studentStatus
                        }
                        appliedIndustry={appliedIndustry}
                    />
                ) : (
                    <ProgressCell
                        appliedIndustry={appliedIndustry}
                        studentId={row.original?.student?.id}
                        step={steps > 14 ? 14 : steps < 1 ? 1 : steps}
                    />
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const appliedIndustry = getStudentWorkplaceAppliedIndustry(
                    info.row.original?.industries
                )

                const currentStatus = info.row.original?.currentStatus
                return (
                    <div className="flex gap-x-1 items-center">
                        {[
                            WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
                        ]?.includes(currentStatus) ? (
                            <>
                                <ActionButton
                                    variant="success"
                                    onClick={() => {
                                        onApproveClicked(
                                            info.row.original?.id,
                                            appliedIndustry?.industry
                                        )
                                    }}
                                >
                                    Accept
                                </ActionButton>
                                <ActionButton
                                    variant="error"
                                    onClick={() => {
                                        onRejectClicked(info.row.original?.id)
                                    }}
                                >
                                    Reject
                                </ActionButton>
                            </>
                        ) : null}

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
        <>
            {modal}
            <div className="flex flex-col gap-y-4">
                <PageHeading
                    title={'All Students'}
                    subtitle={'List of All Students'}
                />
                <Card noPadding>
                    {industryWorkplace.isError && <TechnicalError />}
                    {industryWorkplace.isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : industryWorkplace.data &&
                      industryWorkplace.data?.data.length ? (
                        <Table
                            columns={columns}
                            data={industryWorkplace.data.data}
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
                                                industryWorkplace.data?.data
                                                    ?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    industryWorkplace.data
                                                        ?.pagination,
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
                        !industryWorkplace.isError && (
                            <EmptyData
                                title={'There is no any Approved Student'}
                                description={'There is no any Approved Student'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}

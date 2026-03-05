import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    StudentStatusProgressCell,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { FaEdit, FaEye } from 'react-icons/fa'

import { RtoCellInfo } from '@partials/admin/rto/components'
import { AdminApi } from '@queries'
import { Industry, Student } from '@types'
import {
    WorkplaceCurrentStatus,
    checkStudentStatus,
    checkWorkplaceStatus,
    getStudentWorkplaceAppliedIndustry,
    getUserCredentials,
    setLink,
} from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'

// hooks
import { EditTimer } from '@components/StudentTimer/EditTimer'
import { useActionModal } from '@hooks'
import {
    ProgressCell,
    StudentCellInfo,
} from '@partials/admin/student/components'
import {
    ArchiveModal,
    BlockModal,
    BlockMultiStudentsModal,
    ChangeStatusModal,
} from '@partials/admin/student/modals'
import moment from 'moment'
import { Waypoint } from 'react-waypoint'
import { UserRoles } from '@constants'
import { StudentCellInfo as SubadminStudentCellInfo } from '@partials/sub-admin/students'

export const IndustryStudents = ({ industry }: { industry: Industry }) => {
    const [isViewed, setIsViewed] = useState<boolean>(false)
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [itemPerPage, setItemPerPage] = useState(10)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    // hooks
    const { passwordModal, onViewPassword } = useActionModal()

    const { isLoading, isFetching, data, isError, refetch } =
        AdminApi.Industries.industryStudents(
            {
                params: {
                    skip: itemPerPage * page - itemPerPage,
                    limit: itemPerPage,
                },
                industryId: industry?.id,
            },
            { refetchOnMountOrArgChange: true, skip: !isViewed }
        )

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onBlockClicked = (student: Student) => {
        setModal(<BlockModal item={student} onCancel={onModalCancelClicked} />)
    }

    const onBlockMultiStudents = (student: Student[]) => {
        setModal(
            <BlockMultiStudentsModal
                onCancel={onModalCancelClicked}
                student={student}
            />
        )
    }

    const onArchiveClicked = (student: Student) => {
        setModal(
            <ArchiveModal item={student} onCancel={onModalCancelClicked} />
        )
    }

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onDateClick = (student: Student) => {
        setModal(
            <EditTimer
                studentId={student?.user?.id}
                date={student?.expiryDate}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const role = getUserCredentials()?.role

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (student: any) => {
                router.push(`/portals/admin/student/${student?.id}/detail`)
                setLink('student', router)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (student: Student) => {
                router.push(
                    `/portals/admin/student/edit-student/${student?.id}`
                )
            },
            Icon: FaEdit,
        },
        {
            text: 'Change Status',
            onClick: (student: Student) => onChangeStatus(student),
            Icon: FaEdit,
        },
        {
            text: 'Change Expiry',
            onClick: (student: Student) => onDateClick(student),
            Icon: FaEdit,
        },
        {
            text: 'View Password',
            onClick: (student: Student) => onViewPassword(student),
            Icon: RiLockPasswordFill,
        },
        {
            text: 'Block',
            onClick: (student: Student) => onBlockClicked(student),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        {
            text: 'Archive',
            onClick: (student: Student) => onArchiveClicked(student),
            Icon: MdBlock,
            color: 'text-red-400 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) =>
                role === UserRoles.ADMIN || role === UserRoles.RTO ? (
                    <StudentCellInfo student={info?.row?.original} />
                ) : role === UserRoles.SUBADMIN ? (
                    <SubadminStudentCellInfo student={info?.row.original} />
                ) : null,
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'rto',
            header: () => <span>RTO</span>,
            cell: (info) => {
                return <RtoCellInfo rto={info?.row?.original?.rto} short />
            },
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => {
                const workplace = row.original.workplace?.reduce(
                    (a: any, b: any) => (a?.createdAt > b?.createdAt ? a : b),
                    {
                        currentStatus: WorkplaceCurrentStatus.NotRequested,
                    }
                )
                const industries = row.original?.industries
                const steps = checkWorkplaceStatus(workplace?.currentStatus)
                const studentStatus = checkStudentStatus(
                    row.original?.studentStatus
                )
                const appliedIndustry = getStudentWorkplaceAppliedIndustry(
                    workplace?.industries
                )

                return workplace ? (
                    <ProgressCell
                        step={steps > 14 ? 14 : steps < 1 ? 1 : steps}
                        assigned={workplace?.assignedTo}
                        appliedIndustry={appliedIndustry}
                    />
                ) : industries?.length > 0 ? (
                    <StudentStatusProgressCell
                        assigned={
                            workplace?.assignedTo || row?.original?.subadmin
                        }
                        studentId={row.original?.id}
                        step={studentStatus}
                        appliedIndustry={appliedIndustry}
                    />
                ) : null

                return industries?.length > 0 ? (
                    <StudentStatusProgressCell
                        assigned={
                            workplace?.assignedTo || row?.original?.subadmin
                        }
                        studentId={row.original?.id}
                        step={studentStatus}
                        appliedIndustry={appliedIndustry}
                    />
                ) : (
                    <ProgressCell
                        step={steps > 14 ? 14 : steps < 1 ? 1 : steps}
                        assigned={workplace?.assignedTo}
                        appliedIndustry={appliedIndustry}
                    />
                )
            },
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

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        router.push(
                            `/portals/admin/student/${student?.id}/detail`
                        )
                    }}
                >
                    View
                </ActionButton>
                <ActionButton
                    Icon={FaEdit}
                    onClick={() => {
                        router.push(
                            `/portals/admin/student/edit-student/${student?.id}`
                        )
                    }}
                >
                    Edit
                </ActionButton>
                <ActionButton
                    Icon={MdBlock}
                    variant="error"
                    onClick={() => {
                        onBlockClicked(student)
                    }}
                >
                    Block
                </ActionButton>
            </div>
        ),
        common: (student: Student[]) => (
            <ActionButton
                onClick={() => {
                    onBlockMultiStudents(student)
                }}
                Icon={MdBlock}
                variant="error"
            >
                Block
            </ActionButton>
        ),
    }

    return (
        <>
            {modal && modal}
            {passwordModal && passwordModal}
            <Waypoint
                onEnter={() => {
                    setIsViewed(true)
                }}
            >
                <div>
                    <Card fullHeight shadowType="profile" noPadding>
                        <div className="px-4 py-3.5 border-b border-secondary-dark">
                            <Typography semibold>
                                <span className="text-[15px]">Students</span>
                            </Typography>
                        </div>

                        {/*  */}
                        <div className="h-[340px] overflow-auto custom-scrollbar">
                            {isError && <TechnicalError />}
                            {isLoading ? (
                                <LoadingAnimation height="h-[60vh]" />
                            ) : data && data?.data?.length ? (
                                <Table
                                    columns={columns}
                                    data={data.data}
                                    quickActions={quickActionsElements}
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
                                                <div className="px-6 pt-2 mb-2 flex justify-between">
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
                                        title={'No Approved Student!'}
                                        description={
                                            'You have not approved any Student request yet'
                                        }
                                        height={'50vh'}
                                    />
                                )
                            )}
                        </div>
                    </Card>
                </div>
            </Waypoint>
        </>
    )
}

import { ColumnDef } from '@tanstack/react-table'
import { Student } from '@types'
import React, { ReactElement, useState } from 'react'
import { StudentCallLogDetail, SubadminStudentIndustries } from '../components'
import {
    CaseOfficerAssignedStudent,
    InitialAvatar,
    StudentExpiryDaysLeft,
    TableAction,
    TableActionOption,
    Typography,
    UserCreatedAt,
} from '@components'
import { SectorCell } from '@partials/admin/student/components'
import { useRouter } from 'next/router'
import {
    AddToNonContactableStudents,
    BlockModal,
    ChangeStudentStatusModal,
    HighPriorityModal,
    UnAssignStudentModal,
} from '../modals'
import { FaEdit, FaEye } from 'react-icons/fa'
import { MdBlock, MdPriorityHigh } from 'react-icons/md'
import { getStudentWorkplaceAppliedIndustry, setLink } from '@utils'
import { EditTimer } from '@components/StudentTimer/EditTimer'
import { InterviewModal } from '@partials/sub-admin/workplace/modals'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { useSubadminProfile } from '@hooks'
import moment from 'moment'

export const useColumns = () => {
    const router = useRouter()

    const subadmin = useSubadminProfile()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onBlockClicked = (student: Student) => {
        setModal(<BlockModal item={student} onCancel={onModalCancelClicked} />)
    }

    const onNonContactableStudents = (student: Student) => {
        setModal(
            <AddToNonContactableStudents
                student={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }
    const onMarkAsHighPriorityClicked = (studetnt: Student) => {
        setModal(
            <HighPriorityModal
                item={studetnt}
                onCancel={onModalCancelClicked}
            // setRefetchStudents={setRefetchStudents}
            />
        )
    }

    const onChangeStatus = (student: Student) => {
        setModal(
            <ChangeStudentStatusModal
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

    const onInterviewClicked = (student: Student) => {
        setModal(
            <InterviewModal
                student={student}
                onCancel={onModalCancelClicked}
                workplace={Number(student?.workplace[0]?.id)}
                workIndustry={Number(
                    getStudentWorkplaceAppliedIndustry(
                        student?.workplace[0]
                            ?.industries as WorkplaceWorkIndustriesType[]
                    )?.id
                )}
            />
        )
    }

    const tableActionOptions = (
        student: Student
    ): TableActionOption<Student>[] => {
        return [
            {
                text: 'View',
                onClick: (student) => {
                    router.push(
                        `/portals/sub-admin/students/${student?.id}/detail`
                    )

                    setLink('subadmin-student', router)
                },
                Icon: FaEye,
            },
            // {
            //     text: 'View Old Profile',
            //     onClick: (student) => {
            //         router.push(
            //             `/portals/sub-admin/students/${student?.id}/old-updated-profile`
            //         )

            //         setLink('subadmin-student', router)
            //     },
            //     Icon: FaEye,
            // },
            {
                text: 'Edit',
                onClick: (student) => {
                    router.push(
                        `/portals/sub-admin/students/${student?.id}/edit-student`
                    )
                },
                Icon: FaEdit,
            },
            {
                text: student?.nonContactable
                    ? 'Add to Contactable'
                    : 'Add to Not Contactable',
                onClick: (student) => onNonContactableStudents(student),
                Icon: MdBlock,
            },

            {
                text: 'Block',
                onClick: (student) => onBlockClicked(student),
                Icon: MdBlock,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
            {
                text: student?.isHighPriority
                    ? 'Remove Mark High Priority'
                    : 'Mark High Priority',
                onClick: (student) => onMarkAsHighPriorityClicked(student),
                Icon: MdPriorityHigh,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
        ]
    }

    const isAssociatedWithRto = subadmin?.isAssociatedWithRto

    const columns: ColumnDef<Student>[] = [
        {
            header: () => 'Name',
            accessorKey: 'user',
            cell: ({ row }: any) => (
                <StudentCallLogDetail student={row.original} call />
            ),
        },
        ...(isAssociatedWithRto
            ? []
            : [
                {
                    header: () => 'RTO',
                    accessorKey: 'rto',
                    cell({ row }: any) {
                        const { rto } = row.original

                        return (
                            <div className="flex gap-x-2 items-center">
                                {rto.user.name && (
                                    <InitialAvatar
                                        name={rto.user.name}
                                        small
                                    />
                                )}
                                {rto?.user?.name}
                            </div>
                        )
                    },
                },
            ]),
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => (
                <SubadminStudentIndustries
                    workplace={info.row.original?.workplace}
                    industries={info.row.original?.industries}
                />
            ),
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: ({ row }: any) => <SectorCell student={row.original} />,
        },
        {
            accessorKey: 'expiry',
            header: () => <span>Days Left</span>,
            cell: (info) => (
                <StudentExpiryDaysLeft
                    expiryDate={info.row.original?.expiryDate}
                />
            ),
        },
        {
            header: () => 'Progress',
            accessorKey: 'progress',
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent student={row.original} />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'lastContactedAt',
            header: () => <span>Last Contacted At</span>,
            cell: (info) => {
                return (
                    info?.row?.original?.lastContactedAt ? <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.lastContactedAt).format(
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
                    </> : "---"
                )
            },
        },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }: any) => {
                const tableActionOption = tableActionOptions(row.original)
                return (
                    <TableAction
                        options={tableActionOption}
                        rowItem={row.original}
                    />
                )
            },
        },
    ]

    const columnsWithCustomActions = (
        tableActionUpdatedOptions: TableActionOption<Student>[]
    ): ColumnDef<Student>[] => [
            ...columns?.slice(0, -1),
            {
                header: () => 'Action',
                accessorKey: 'Action',
                cell: ({ row }) => {
                    const tableActionOption = tableActionOptions(row.original)
                    return (
                        <TableAction
                            options={[
                                ...tableActionOption,
                                ...tableActionUpdatedOptions,
                            ]}
                            rowItem={row.original}
                        />
                    )
                },
            },
        ]

    return {
        modal,
        columns,
        columnsWithCustomActions,
        onChangeStatus,
        onDateClick,
        onInterviewClicked,
    }
}

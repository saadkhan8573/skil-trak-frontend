import {
    CaseOfficerAssignedStudent,
    StudentExpiryDaysLeft,
    TableAction,
    TableActionOption,
    Typography,
    UserCreatedAt,
} from '@components'
import { EditTimer } from '@components/StudentTimer/EditTimer'
import { SubadminStudentIndustries } from '@partials/sub-admin/students'
import { ChangeStudentStatusModal } from '@partials/sub-admin/students/modals'
import { ColumnDef } from '@tanstack/react-table'
import { Student, UserStatus } from '@types'
import { studentsListWorkplace } from '@utils'
import { InitiateAiCallModal } from '@partials/common/modal'
import { Phone } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import {
    AcceptModal,
    AssignCoordinatorModal,
    AssignMultipleCoordinatorModal,
    BlockModal,
    DeleteModal,
    RejectModal,
    UnblockModal,
} from '../modals'
import { FaEdit, FaEye, FaUserPlus } from 'react-icons/fa'
import { IconType } from 'react-icons'
import { SectorCell, StudentCellInfo } from '../components'
import { MdBlock } from 'react-icons/md'

type ActionKey =
    | 'assign'
    | 'block'
    | 'changeStatus'
    | 'changeExpiry'
    | 'unblock'
    | 'delete'
    | 'accept'
    | 'reject'
    | 'aiCall'

type ColumnKey =
    | 'name'
    | 'industry'
    | 'sectors'
    | 'expiry'
    | 'batch'
    | 'progress'
    | 'assigned'
    | 'createdAt'
    | 'action'

interface GetTableConfigOptions {
    columnKeys?: ColumnKey[]
    actionKeys?: ActionKey[]
    removeColumnKeys?: ColumnKey[]
}

type ValidateTableConfigOptions<T extends GetTableConfigOptions> = T extends {
    columnKeys: ColumnKey[]
    removeColumnKeys: ColumnKey[]
}
    ? never
    : T

interface TableConfig {
    columns: ColumnDef<Student>[]
    actions: TableActionOption<Student>[]
}

export const useColumns = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onModalCancelClicked = (): void => {
        setModal(null)
    }

    const onBlockClicked = (student: Student): void => {
        setModal(
            <BlockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onChangeStatus = (student: Student): void => {
        setModal(
            <ChangeStudentStatusModal
                student={student}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onDateClick = (student: Student): void => {
        setModal(
            <EditTimer
                studentId={student?.user?.id}
                date={student?.expiryDate}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onAssignCoordinatorClicked = (student: Student): void => {
        setModal(
            <AssignCoordinatorModal
                studentId={student?.id}
                studentUser={student?.user}
                rtoCoordinatorId={student?.rtoCoordinator?.id}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onAddMultiStudentsCoordinatorClicked = (ids: number[]): void => {
        setModal(
            <AssignMultipleCoordinatorModal
                ids={ids}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onUnblockClicked = (student: Student): void => {
        setModal(
            <UnblockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onDeleteClicked = (student: Student): void => {
        setModal(
            <DeleteModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onAcceptClicked = (item: Student): void => {
        setModal(
            <AcceptModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }

    const onRejectClicked = (item: Student): void => {
        setModal(
            <RejectModal item={item} onCancel={() => onModalCancelClicked()} />
        )
    }

    const onAiCallClicked = (student: Student): void => {
        setModal(
            <InitiateAiCallModal
                student={student}
                onClose={() => onModalCancelClicked()}
            />
        )
    }

    // All available columns definition
    const allColumns: ColumnDef<Student>[] = [
        {
            accessorKey: 'name',
            cell: (info) => (
                <StudentCellInfo
                    {...(router?.pathname?.startsWith(
                        '/portals/rto/students-and-placements/all-students'
                    )
                        ? {
                            link: `/portals/rto/students-and-placements/all-students/${info?.row?.original?.id}/detail`,
                        }
                        : {})}
                    student={info.row.original}
                    call
                />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'industry',
            header: () => <span>Industry</span>,
            cell: (info) => {
                const industry = info.row.original?.industries
                const appliedIndustry = studentsListWorkplace(
                    info.row.original?.workplace
                )
                return industry && industry?.length > 0 ? (
                    <SubadminStudentIndustries
                        workplace={info.row.original?.workplace}
                        industries={info.row.original?.industries}
                    />
                ) : info.row.original?.workplace &&
                    info.row.original?.workplace?.length > 0 &&
                    appliedIndustry ? (
                    <SubadminStudentIndustries
                        workplace={info.row.original?.workplace}
                        industries={info.row.original?.industries}
                    />
                ) : (
                    <Typography center>---</Typography>
                )
            },
        },
        {
            accessorKey: 'sectors',
            header: () => <span>Sectors</span>,
            cell: (info) => <SectorCell student={info.row.original} />,
        },
        {
            accessorKey: 'expiry',
            header: () => <span>Day Left</span>,
            cell: (info) => (
                <StudentExpiryDaysLeft
                    expiryDate={info.row.original?.expiryDate}
                />
            ),
        },
        {
            accessorKey: 'batch',
            header: () => <span>Batch</span>,
            cell: ({ row }) => (
                <Typography whiteSpacePre variant="small" medium>
                    {row?.original?.batch || '---'}
                </Typography>
            ),
        },
        {
            accessorKey: 'progress',
            header: () => <span>Progress</span>,
            cell: ({ row }) => (
                <CaseOfficerAssignedStudent student={row.original} />
            ),
        },
        {
            accessorKey: 'assigned',
            header: () => <span>Assigned Coordinator</span>,
            cell: ({ row }) =>
                row.original?.rtoCoordinator ? (
                    <div>
                        <Typography variant="label">
                            {row.original?.rtoCoordinator?.user?.name}
                        </Typography>
                        <Typography variant="small" color={'text-gray-400'}>
                            {row.original?.rtoCoordinator?.user?.email}
                        </Typography>
                        <Typography variant="small" color={'text-gray-400'}>
                            {row.original?.rtoCoordinator?.phone}
                        </Typography>
                    </div>
                ) : (
                    <span>----</span>
                ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: ({ row }) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
    ]

    const getAllOptionalActions = (
        student: Student
    ): Record<ActionKey, TableActionOption<Student>> => ({
        assign: {
            text: student?.rtoCoordinator
                ? 'Change Coordinator'
                : 'Assign Coordinator',
            onClick: (student) => onAssignCoordinatorClicked(student),
            Icon: FaUserPlus,
        },
        block: {
            text: 'Block',
            onClick: (student) => onBlockClicked(student),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        changeStatus: {
            text: 'Change Status',
            onClick: (student) => onChangeStatus(student),
            Icon: FaEdit,
        },
        changeExpiry: {
            text: 'Change Expiry',
            onClick: (student) => onDateClick(student),
            Icon: FaEdit,
        },
        unblock: {
            text: 'Unblock',
            onClick: (student) => onUnblockClicked(student),
            Icon: MdBlock,
            color: 'text-green-500 hover:bg-green-100 hover:border-green-200',
        },
        delete: {
            text: 'Delete',
            onClick: (student) => onDeleteClicked(student),
            Icon: FaEdit,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        accept: {
            text: 'Accept',
            onClick: (student) => onAcceptClicked(student),
            Icon: FaEdit,
            color: 'text-green-500 hover:bg-green-100 hover:border-green-200',
        },
        reject: {
            text: 'Reject',
            onClick: (student) => onRejectClicked(student),
            Icon: FaEdit,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
        aiCall: {
            text: 'AI Voice Call',
            onClick: (student) => onAiCallClicked(student),
            Icon: Phone as any,
        },
    })

    const getDefaultActions = (): TableActionOption<Student>[] => [
        {
            text: 'View',
            onClick: (student: Student) => {
                if (
                    router?.pathname?.startsWith(
                        '/portals/rto/students-and-placements/all-students'
                    )
                ) {
                    router.push(
                        `/portals/rto/students-and-placements/all-students/${student.id}/detail`
                    )
                } else {
                    router.push(`/portals/rto/students/${student.id}`)
                }
            },
            // onClick: (student) => {
            //     alert(`Viewing student: ${student.id}`)
            // },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (student: Student) =>
                router.push(`/portals/rto/students/${student.id}/edit-student`),
            Icon: FaEdit,
        },
    ]

    const getTableConfig = <T extends GetTableConfigOptions>(
        options?: ValidateTableConfigOptions<T>
    ): TableConfig => {
        const { columnKeys, removeColumnKeys, actionKeys } = options || {}

        // Validate that only one of columnKeys or removeColumnKeys is provided
        if (
            columnKeys &&
            columnKeys.length > 0 &&
            removeColumnKeys &&
            removeColumnKeys.length > 0
        ) {
            throw new Error(
                'Cannot use both columnKeys and removeColumnKeys at the same time. Use only one.'
            )
        }

        // Get filtered columns
        let columns: ColumnDef<Student>[] = allColumns

        if (columnKeys && columnKeys.length > 0) {
            // Include only specified columns
            columns = allColumns.filter((column) => {
                const accessorKey =
                    'accessorKey' in column ? column.accessorKey : null
                return (
                    accessorKey && columnKeys.includes(accessorKey as ColumnKey)
                )
            })
        } else if (removeColumnKeys && removeColumnKeys.length > 0) {
            // Remove specified columns
            columns = allColumns.filter((column) => {
                const accessorKey =
                    'accessorKey' in column ? column.accessorKey : null
                return (
                    accessorKey &&
                    !removeColumnKeys.includes(accessorKey as ColumnKey)
                )
            })
        }

        // Calculate default actions once
        const defaultActions = getDefaultActions()

        // Get filtered actions for a specific student
        const getActionsForStudent = (
            student: Student
        ): TableActionOption<Student>[] => {
            if (actionKeys && actionKeys.length > 0) {
                const allOptionalActions = getAllOptionalActions(student)
                const optionalActions = actionKeys
                    .filter((key) => allOptionalActions[key])
                    .map((key) => allOptionalActions[key])

                return [...defaultActions, ...optionalActions]
            }

            return defaultActions
        }

        if (
            columns.findIndex((col: any) => col?.accessorKey === 'action') ===
            -1
        ) {
            columns.push({
                accessorKey: 'action',
                header: () => <span>Action</span>,
                cell: (info) => {
                    const combinedActions = getActionsForStudent(
                        info.row.original
                    )

                    return (
                        <div className="flex gap-x-1 items-center">
                            <TableAction
                                options={combinedActions}
                                rowItem={info.row.original}
                            />
                        </div>
                    )
                },
            })
        }

        return {
            columns,
            actions: defaultActions,
        }
    }

    /**
     * Backward compatible function - get columns only
     */
    const getColumns = (columnKeys?: string[]): ColumnDef<Student>[] => {
        if (!columnKeys || columnKeys.length === 0) {
            return allColumns
        }
        return allColumns.filter((column) => {
            const accessorKey =
                'accessorKey' in column ? column.accessorKey : null
            return accessorKey && columnKeys.includes(accessorKey)
        })
    }

    const getTableActionOptions = (
        student: Student,
        actionKeys?: ActionKey[]
    ): TableActionOption<Student>[] => {
        const defaultActions = getDefaultActions()

        if (!actionKeys || actionKeys.length === 0) {
            return defaultActions
        }

        const allOptionalActions = getAllOptionalActions(student)
        const optionalActions = actionKeys
            .filter((key) => allOptionalActions[key])
            .map((key) => allOptionalActions[key])

        return [...defaultActions, ...optionalActions]
    }

    // Keep old tableActionOptions for backward compatibility
    const tableActionOptions = (
        student: Student
    ): TableActionOption<Student>[] => getTableActionOptions(student)

    return {
        modal,
        columns: allColumns,
        getTableConfig,
        getColumns,
        getTableActionOptions,
        tableActionOptions,
        onChangeStatus,
        onDateClick,
        onAssignCoordinatorClicked,
        onAddMultiStudentsCoordinatorClicked,
        onBlockClicked,
        onUnblockClicked,
        onDeleteClicked,
        onAcceptClicked,
        onRejectClicked,
    }
}

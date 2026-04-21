import {
    Badge,
    CaseOfficerAssignedStudent,
    StudentExpiryDaysLeft,
    StudentJobId,
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
import moment from 'moment'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui'
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
import { SectorCell, StudentCellInfo } from '../components'
import { MdBlock } from 'react-icons/md'
import { SectorDetailDrawer } from '../components/drawer/SectorDetailDrawer'

type ActionKey =
    | 'assign'
    | 'block'
    | 'changeStatus'
    | 'changeExpiry'
    | 'changeSector'
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
    | 'snoozed'
    | 'action'
    | 'lastContactedAt'
    | 'studentMaskedId'

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

export interface UseColumnsProps {
    baseLinkPath?: string
}

export const useColumns = (hookOptions?: UseColumnsProps) => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const basePathRaw = router?.asPath?.split('?')[0] || ''
    const currentPath = basePathRaw.endsWith('/')
        ? basePathRaw.slice(0, -1)
        : basePathRaw

    // Use the explicit baseLinkPath if provided, otherwise dynamically fallback to the current page path
    const basePath = hookOptions?.baseLinkPath || currentPath

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

    const onChangeSectorClicked = (student: Student): void => {
        setModal(
            <SectorDetailDrawer
                student={student}
                isOpen={true}
                onClose={() => onModalCancelClicked()}
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
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }: any) => (
                <StudentJobId studentJobId={row.original?.studentMaskedId} />
            ),
        },
        {
            accessorKey: 'name',
            cell: (info) => (
                <StudentCellInfo
                    link={`${basePath}/${info?.row?.original?.id}/detail`}
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
            header: () => <span>Expiry</span>,
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
        {
            accessorKey: 'lastContactedAt',
            header: () => <span>Last Contacted At</span>,
            cell: (info) => {
                return info?.row?.original?.lastContactedAt ? (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(
                                    info?.row?.original?.lastContactedAt
                                ).format('Do MMM YYYY')}
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
                ) : (
                    '---'
                )
            },
        },
        {
            accessorKey: 'snoozed',
            header: () => <span>Snoozed</span>,
            cell: ({ row }) => {
                const snoozes = row.original?.snoozeComments || []
                const snooze =
                    Array.isArray(snoozes) && snoozes.length > 0
                        ? snoozes[0]
                        : null
                if (!snooze) return <span className="text-gray-400">---</span>

                return (
                    <Popover>
                        <PopoverTrigger>
                            <Badge
                                variant="info"
                                className="whitespace-pre cursor-pointer"
                            >
                                View Details
                            </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4 shadow-xl rounded-xl border border-slate-100 bg-white">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-[#044866] border-b pb-2 flex items-center gap-2">
                                    <span className="bg-amber-100 p-1 rounded">
                                        ⏰
                                    </span>{' '}
                                    Snoozed Details
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-600">
                                        <span className="font-semibold text-slate-800">
                                            Snoozed Start:
                                        </span>{' '}
                                        {row.original?.snoozedAt
                                            ? moment(
                                                  row.original.snoozedAt
                                              ).format('MMM DD, YYYY hh:mm A')
                                            : moment(snooze.createdAt).format(
                                                  'MMM DD, YYYY hh:mm A'
                                              )}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        <span className="font-semibold text-slate-800">
                                            Snoozed End:
                                        </span>{' '}
                                        {row.original?.snoozedDate
                                            ? moment(
                                                  row.original.snoozedDate
                                              ).format('MMM DD, YYYY')
                                            : '---'}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        <span className="font-semibold text-slate-800">
                                            Comment:
                                        </span>{' '}
                                        {snooze.comment}
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )
            },
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
        changeSector: {
            text: 'Change Sector',
            onClick: (student) => onChangeSectorClicked(student),
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
                router.push(`${basePath}/${student.id}/detail`)
            },
            // onClick: (student) => {
            //     alert(`Viewing student: ${student.id}`)
            // },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (student: Student) => {
                router.push(`${basePath}/${student.id}/edit-student`)
            },
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

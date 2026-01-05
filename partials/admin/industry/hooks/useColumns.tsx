import {
    ActionButton,
    Badge,
    TableAction,
    TableActionOption,
    TruncatedTextWithTooltip,
    Typography,
    UserCreatedAt,
} from '@components'
import { UserRoles } from '@constants'
import { useActionModal, useNotification } from '@hooks'
import { UnSnoozeIndustryModal } from '@partials/common'
import { AdminApi } from '@queries'
import { Industry, UserStatus } from '@types'
import { ellipsisText, getUserCredentials } from '@utils'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { ReactElement, useMemo, useState } from 'react'
import { CgUnblock } from 'react-icons/cg'
import { FaCheck, FaEdit, FaEye, FaTimes, FaTrash } from 'react-icons/fa'
import { MdBlock, MdSnooze } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import {
    BranchCell,
    IndustryCell,
    ProgressIndustryCell,
    SectorCell,
} from '../components'
import { useActionModals } from './useActionModals'

export type ActionKey =
    | 'view'
    | 'viewOldProfile'
    | 'edit'
    | 'viewPassword'
    | 'archive'
    | 'unarchive'
    | 'block'
    | 'unblock'
    | 'delete'
    | 'accept'
    | 'reject'
    | 'unsnooze'

type ColumnKey =
    | 'businessName'
    | 'abn'
    | 'contactPerson'
    | 'favoriteBy'
    | 'placementStatus'
    | 'createdBy'
    | 'branches'
    | 'studentCount'
    | 'suburb'
    | 'address'
    | 'sectors'
    | 'status'
    | 'snoozedBy'
    | 'snoozedAt'
    | 'snoozedDate'
    | 'action'

interface GetTableConfigOptions {
    columnKeys?: ColumnKey[]
    removeColumnKeys?: ColumnKey[]
    actionKeys?: ActionKey[]
    useDynamicActions?: boolean
}

type ValidateTableConfigOptions<T extends GetTableConfigOptions> =
    T['columnKeys'] extends any[]
        ? T['removeColumnKeys'] extends any[]
            ? never
            : T
        : T

interface TableConfig {
    columns: ColumnDef<Industry>[]
}

export const useColumns = () => {
    const router = useRouter()
    const role = getUserCredentials()?.role
    const { passwordModal, onViewPassword } = useActionModal()

    const {
        modal,
        onBlockClicked,
        onUnblockClicked,
        onAcceptClicked,
        onRejectClicked,
        onDeleteClicked,
        onArchiveClicked,
        onUnArchiveClicked,
        onMultiBlockClicked,
        setModal,
        onModalCancelClicked,
    } = useActionModals()

    const allColumns: ColumnDef<Industry>[] = useMemo(
        () => [
            {
                accessorKey: 'user.name',
                id: 'businessName',
                cell: (info) => (
                    <ProgressIndustryCell industry={info?.row?.original} />
                ),
                header: () => <span>Business Name</span>,
            },
            {
                accessorKey: 'abn',
                id: 'abn',
                header: () => <span>ABN Number</span>,
            },
            {
                accessorKey: 'branches',
                id: 'branches',
                header: () => <span>Branches</span>,
                cell: (info) => {
                    return (
                        <div className="flex justify-start">
                            {info?.row?.original?.branches?.length > 0 ? (
                                <BranchCell industry={info.row.original} />
                            ) : info?.row?.original?.headQuarter !== null ? (
                                <div className="flex flex-col gap-y-1 items-center">
                                    <p className="text-xs font-semibold text-blue-400">
                                        Head Quarter
                                    </p>
                                    <p className="text-xs font-semibold text-gray-400 text-center">
                                        {
                                            info?.row?.original?.headQuarter
                                                ?.user?.name
                                        }
                                    </p>
                                </div>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'studentCount',
                id: 'studentCount',
                header: () => <span>Students</span>,
                cell: (info) => info.getValue() || 0,
            },
            {
                accessorKey: 'suburb',
                id: 'suburb',
                header: () => <span>Suburb</span>,
            },
            {
                accessorKey: 'user.status',
                id: 'status',
                header: () => <span>Status</span>,
                cell: (info) => (
                    <Typography uppercase variant={'badge'}>
                        <span className="font-bold">
                            {info.row.original?.user?.status}
                        </span>
                    </Typography>
                ),
            },
            {
                accessorKey: 'contactPerson',
                id: 'contactPerson',
                header: () => <span>Contact Person</span>,
                cell: (info) => {
                    return (
                        <div>
                            <p>
                                {ellipsisText(
                                    info?.row?.original?.contactPerson,
                                    15
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                {info?.row?.original?.contactPersonNumber}
                            </p>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'favouriteBy',
                id: 'favoriteBy',
                header: () => <span>Assigned To</span>,
                cell: (info) => {
                    const userName = info?.row?.original?.favoriteBy?.user?.name

                    return (
                        <div className="flex items-center">
                            {userName ? (
                                <div className="relative px-3 py-1 bg-orange-100 text-orange-600  rounded-tl-lg rounded-br-lg clip-path-bookmark">
                                    {userName}
                                </div>
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'sectors',
                id: 'sectors',
                header: () => <span>Sectors</span>,
                cell: (info) => <SectorCell industry={info?.row?.original} />,
            },
            {
                id: 'placementStatus',
                accessorKey: 'profileCompletionPercentage',
                header: () => <span>Placement Status</span>,
                cell: ({ row }) => (
                    <div>
                        {Number(row?.original?.profileCompletionPercentage) ===
                            100 &&
                        row?.original?.user?.status === UserStatus.Approved &&
                        !row?.original?.isSnoozed ? (
                            <Badge
                                variant={'primaryNew'}
                                text={'Placement Ready'}
                                Icon={FaCheck}
                                className="!whitespace-pre"
                            />
                        ) : (
                            <Badge
                                Icon={FaTimes}
                                variant={'error'}
                                text={'Placement Not Ready'}
                                className="!whitespace-pre"
                            />
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'channel',
                id: 'createdBy',
                header: () => <span>Created By</span>,
                cell: (info) => (
                    <div>
                        {info?.row?.original?.createdBy !== null ? (
                            <div className="bg-emerald-100 text-emerald-600 rounded-md px-2 py-0.5 flex items-center gap-x-1">
                                <p
                                    title={info?.row?.original?.createdBy?.name}
                                    className="text-xs whitespace-nowrap"
                                >
                                    {ellipsisText(
                                        info?.row?.original?.createdBy?.name,
                                        14
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-1 bg-blue-100 text-blue-600 rounded-md px-2 py-0.5">
                                <p className="text-xs">
                                    {info?.row?.original?.channel}
                                </p>
                            </div>
                        )}
                        <UserCreatedAt
                            createdAt={info?.row?.original?.createdAt}
                        />
                    </div>
                ),
            },
            {
                accessorKey: 'addressLine1',
                id: 'address',
                header: () => <span>Address</span>,
                cell: (info) => (
                    <TruncatedTextWithTooltip
                        text={info?.row?.original?.addressLine1}
                    />
                ),
            },
            {
                accessorKey: 'snoozedBy',
                id: 'snoozedBy',
                header: () => <span>Snoozed By</span>,
                cell: ({ row }) => (
                    <Typography variant={'muted'} color={'gray'}>
                        {row?.original?.snoozedBy?.name}
                    </Typography>
                ),
            },
            {
                accessorKey: 'snoozedAt',
                id: 'snoozedAt',
                header: () => <span>Snoozed At</span>,
                cell: ({ row }) => (
                    <UserCreatedAt createdAt={row?.original?.snoozedAt} />
                ),
            },
            {
                accessorKey: 'snoozedDate',
                id: 'snoozedDate',
                header: () => <span>Snoozed Date</span>,
                cell: ({ row }) => (
                    <UserCreatedAt createdAt={row?.original?.snoozedDate} />
                ),
            },
        ],
        []
    )

    const getAllOptionalActions = (
        industry: Industry
    ): Record<ActionKey, TableActionOption<Industry>> => ({
        view: {
            text: 'View',
            onClick: (industry) => {
                router.push(`/portals/admin/industry/${industry.id}`)
            },
            Icon: FaEye,
        },
        viewOldProfile: {
            text: 'View Old Profile',
            onClick: (industry) =>
                router.push(
                    `/portals/admin/industry/${industry?.id}/old-detail`
                ),
            Icon: FaEye,
        },
        edit: {
            text: 'Edit',
            onClick: (industry) => {
                router.push(
                    `/portals/admin/industry/edit-industry/${industry.id}`
                )
            },
            Icon: FaEdit,
        },
        viewPassword: {
            text: 'View Password',
            onClick: (industry) => onViewPassword(industry),
            Icon: RiLockPasswordFill,
            hidden: () => role !== UserRoles.ADMIN,
        },
        archive: {
            text: 'Archive',
            onClick: (industry) => onArchiveClicked(industry),
            Icon: MdBlock,
            color: 'text-primary',
            hidden: (industry) =>
                industry?.user?.status !== UserStatus.Approved,
        },
        unarchive: {
            text: 'Unarchive',
            onClick: (industry) => onUnArchiveClicked(industry),
            Icon: MdBlock,
            color: 'text-primary',
            hidden: (industry) =>
                industry?.user?.status !== UserStatus.Archived,
        },
        block: {
            text: 'Block',
            onClick: (industry) => onBlockClicked(industry),
            Icon: MdBlock,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            hidden: (industry) =>
                industry?.user?.status !== UserStatus.Approved,
        },
        unblock: {
            text: 'Unblock',
            onClick: (industry) => onUnblockClicked(industry),
            Icon: CgUnblock,
            color: 'text-orange-500 hover:bg-orange-100 hover:border-orange-200',
            hidden: (industry) => industry?.user?.status !== UserStatus.Blocked,
        },
        delete: {
            text: 'Delete',
            onClick: (industry) => onDeleteClicked(industry),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            hidden: (industry) => {
                if (role !== UserRoles.ADMIN) return true
                const status = industry?.user?.status
                return ![
                    UserStatus.Blocked,
                    UserStatus.Rejected,
                    UserStatus.Archived,
                ].includes(status as UserStatus)
            },
        },
        accept: {
            text: 'Accept',
            onClick: (industry) => onAcceptClicked(industry),
            Icon: FaEdit,
            color: 'text-green-500 hover:bg-green-100 hover:border-green-200',
            hidden: (industry) => {
                const status = industry?.user?.status
                return ![
                    UserStatus.Pending,
                    UserStatus.Rejected,
                    UserStatus.Archived,
                ].includes(status as UserStatus)
            },
        },
        reject: {
            text: 'Reject',
            onClick: (industry) => onRejectClicked(industry),
            Icon: FaEdit,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            hidden: (industry) => industry?.user?.status !== UserStatus.Pending,
        },
        unsnooze: {
            text: 'Unsnooze',
            onClick: (industry) => {
                setModal(
                    <UnSnoozeIndustryModal
                        onCancel={onModalCancelClicked}
                        industry={industry}
                    />
                )
            },
            Icon: MdSnooze,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            // Typically only for snoozed logic, but added hidden check just in case
        },
    })

    const getTableConfig = <T extends GetTableConfigOptions>(
        options?: ValidateTableConfigOptions<T>
    ): TableConfig => {
        const { columnKeys, removeColumnKeys, actionKeys, useDynamicActions } =
            options || {}

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

        let columns: ColumnDef<Industry>[] = [...allColumns]

        if (columnKeys && columnKeys.length > 0) {
            columns = allColumns.filter((column) => {
                const id = column.id as ColumnKey
                return id && columnKeys.includes(id)
            })
        } else if (removeColumnKeys && removeColumnKeys.length > 0) {
            columns = allColumns.filter((column) => {
                const id = column.id as ColumnKey
                return id && !removeColumnKeys.includes(id)
            })
        }

        const getActionsForIndustry = (
            industry: Industry
        ): TableActionOption<Industry>[] => {
            const allOptionalActions = getAllOptionalActions(industry)
            let actionList: TableActionOption<Industry>[] = []

            if (useDynamicActions) {
                // If dynamic actions requested, we include all relevant base actions
                // and let the 'hidden' property filter them based on industry status
                const dynamicBaseKeys: ActionKey[] = [
                    'view',
                    'viewOldProfile',
                    'edit',
                    'viewPassword',
                    'block',
                    'unblock',
                    'archive',
                    'unarchive',
                    'accept',
                    'reject',
                    'delete',
                ]

                // If user provided specific actionKeys, only use those
                const keysToUse =
                    actionKeys && actionKeys.length > 0
                        ? actionKeys
                        : dynamicBaseKeys

                actionList = keysToUse
                    .map((key) => allOptionalActions[key])
                    .filter(Boolean)
            } else if (actionKeys && actionKeys.length > 0) {
                actionList = actionKeys
                    .map((key) => allOptionalActions[key])
                    .filter(Boolean)
            } else {
                actionList = [allOptionalActions.view, allOptionalActions.edit]
            }

            return actionList
        }

        if (columns.findIndex((col) => col.id === 'action') === -1) {
            columns.push({
                id: 'action',
                header: () => <span>Action</span>,
                cell: (info) => {
                    const combinedActions = getActionsForIndustry(
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
        }
    }

    return {
        modal,
        passwordModal,
        getTableConfig,
        onMultiBlockClicked,
    }
}

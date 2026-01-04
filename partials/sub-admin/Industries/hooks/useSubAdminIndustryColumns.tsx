import { SubadminProgressIndustryCell } from '../components'
import { Badge, TableAction, Typography, UserCreatedAt } from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { Industry, SubAdmin, UserStatus } from '@types'
import { ellipsisText, getUserCredentials, setLink } from '@utils'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import { FaEye, FaTimes } from 'react-icons/fa'
import { MdBlock, MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { RiInboxArchiveFill } from 'react-icons/ri'
import { AddToFavoriteModal, ArchiveModal, BlockModal } from '../modals'
import { FaCheck } from 'react-icons/fa6'

export type IndustryColumnKey =
    | 'name'
    | 'abn'
    | 'students'
    | 'contactPerson'
    | 'favouriteBy'
    | 'profileCompletionPercentage'
    | 'createdAt'
    | 'action'

export const useSubAdminIndustryColumns = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()
    const subadminId = getUserCredentials()?.id
    const id = getUserCredentials()?.id

    const onCancelClicked = () => setModal(null)

    const onAddToFavoriteClicked = (industry: Industry) => {
        setModal(
            <AddToFavoriteModal
                industry={industry}
                onCancel={onCancelClicked}
            />
        )
    }

    const onBlockClicked = (industry: Industry) => {
        setModal(<BlockModal industry={industry} onCancel={onCancelClicked} />)
    }

    const onArchiveClicked = (industry: Industry) => {
        setModal(
            <ArchiveModal industry={industry} onCancel={onCancelClicked} />
        )
    }

    const isFavorite = (subAdmin: SubAdmin[] | undefined) =>
        subAdmin?.find((subadmin: any) => subadmin?.user?.id === id)

    const tableActionOptions = (industry: Industry) => {
        const subAdmin = isFavorite(industry?.subAdmin)

        return [
            {
                text: 'View',
                onClick: (industry: Industry) => {
                    router.push(
                        `/portals/sub-admin/users/industries/${industry.id}`
                    )
                    setLink('subadmin-industries', router)
                },
                Icon: FaEye,
            },
            {
                text: 'View Old Profile',
                onClick: (industry: Industry) => {
                    router.push(
                        `/portals/sub-admin/users/industries/${industry.id}/old-detail`
                    )
                    setLink('subadmin-industries', router)
                },
                Icon: FaEye,
            },
            {
                text: `${industry?.favoriteBy &&
                    industry?.favoriteBy?.user?.id === subadminId
                    ? 'Un Favourite'
                    : 'Add Favourite'
                    }`,
                color: `${industry?.subAdmin && industry?.subAdmin?.length > 0
                    ? 'text-error'
                    : 'text-primary'
                    }`,
                onClick: (industry: Industry) =>
                    onAddToFavoriteClicked(industry),
                Icon: subAdmin ? MdFavorite : MdFavoriteBorder,
            },
            {
                text: `Block`,
                color: 'text-error',
                onClick: (industry: Industry) => onBlockClicked(industry),
                Icon: MdBlock,
            },
            {
                text: 'Archive',
                color: 'text-primary',
                onClick: (industry: Industry) => onArchiveClicked(industry),
                Icon: RiInboxArchiveFill,
            },
        ]
    }

    const getTableConfig = ({
        columnKeys,
    }: {
        columnKeys: IndustryColumnKey[]
    }) => {
        const allColumns: (ColumnDef<Industry> & { id: IndustryColumnKey })[] = [
            {
                id: 'name',
                header: () => 'Business Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <SubadminProgressIndustryCell industry={row.original} />
                ),
            },
            {
                id: 'abn',
                accessorKey: 'abn',
                header: () => <span>ABN Number</span>,
            },
            {
                id: 'students',
                header: () => 'Students',
                accessorKey: 'students',
                cell: ({ row }) => {
                    const { enrolledStudents } = row.original
                    return (
                        <Typography variant={'muted'} color={'gray'} center>
                            {enrolledStudents}
                        </Typography>
                    )
                },
            },
            {
                id: 'contactPerson',
                header: () => 'Contact Person',
                accessorKey: 'contactPerson',
                cell: ({ row }) => {
                    const { contactPersonNumber, contactPerson } = row.original
                    return (
                        <Typography variant={'muted'} color={'gray'}>
                            {contactPersonNumber} {contactPerson}
                        </Typography>
                    )
                },
            },
            {
                id: 'favouriteBy',
                accessorKey: 'favouriteBy',
                header: () => <span>Favorite By</span>,
                cell: ({ row }) => {
                    const userName = row?.original?.favoriteBy?.user?.name
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
                id: 'profileCompletionPercentage',
                accessorKey: 'profileCompletionPercentage',
                header: () => <span>Placement Status</span>,
                cell: ({ row }) => (
                    <Typography variant={'muted'} color={'gray'}>
                        {Number(row?.original?.profileCompletionPercentage) ===
                            100 &&
                            row?.original?.user?.status === UserStatus.Approved ? (
                            <Badge
                                variant={'primaryNew'}
                                text={'Placement Ready'}
                                Icon={FaCheck}
                            />
                        ) : (
                            <Badge
                                outline
                                Icon={FaTimes}
                                variant={'primaryNew'}
                                text={'Placement Not Ready'}
                            />
                        )}
                    </Typography>
                ),
            },
            {
                id: 'createdAt',
                accessorKey: 'createdAt',
                header: () => <span>Registered At</span>,
                cell: ({ row }) => (
                    <div>
                        {row?.original?.createdBy !== null ? (
                            <div className="bg-emerald-100 text-emerald-600 rounded-md px-2 py-0.5 flex items-center gap-x-1">
                                <p className="text-xs whitespace-nowrap">
                                    {ellipsisText(
                                        row.original?.createdBy?.name,
                                        10
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-1 bg-blue-100 text-blue-600 rounded-md px-2 py-0.5">
                                <p className="text-xs">
                                    {row?.original?.channel}
                                </p>
                            </div>
                        )}
                        <UserCreatedAt createdAt={row?.original?.createdAt} />
                    </div>
                ),
            },
            {
                id: 'action',
                header: () => 'Manage',
                accessorKey: 'Action',
                cell: ({ row }) => {
                    const actions = tableActionOptions(row.original)
                    return (
                        <TableAction options={actions} rowItem={row.original} />
                    )
                },
            },
        ]

        const columns = allColumns.filter((col) =>
            columnKeys.includes(col.id)
        )

        return { columns }
    }

    return {
        getTableConfig,
        modal,
    }
}

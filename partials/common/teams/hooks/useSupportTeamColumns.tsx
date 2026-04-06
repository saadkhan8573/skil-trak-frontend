import { useState } from 'react'
import { TableAction, TableActionOption } from '@components'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Tags } from 'lucide-react'
import Image from 'next/image'
import { FaRegEdit, FaTrash } from 'react-icons/fa'
import { TeamMembersModal } from '../modals'
import { TEAM_TAGS } from '../teams-tabs'

interface SupportTeamItem {
    id: number
    name: string
    membersCount: number
    tags: string[]
    createdAt: string
    updatedAt: string
    isActive: boolean
    description?: string
    members: any
    state: any
}

interface UseSupportTeamColumnsProps {
    onDeleteClicked: (item: SupportTeamItem) => void
    onClickEdit: (item: SupportTeamItem) => void
}

export function useSupportTeamColumns({
    onDeleteClicked,
    onClickEdit,
}: UseSupportTeamColumnsProps) {
    const tableActionOptions: TableActionOption<SupportTeamItem>[] = [
        {
            text: 'Edit',
            onClick: (item) => onClickEdit(item),
            Icon: FaRegEdit,
            color: 'text-blue-500 hover:bg-blue-100 hover:border-blue-200',
        },
        {
            text: 'Delete',
            onClick: (item) => onDeleteClicked(item),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    // 👉 Table columns
    const columns: ColumnDef<SupportTeamItem>[] = [
        {
            header: () => <span>Name</span>,
            accessorKey: 'name',
            cell: ({ row }) => {
                const { name } = row.original
                return <span className="font-semibold">{name}</span>
            },
        },
        {
            header: () => <span>Members</span>,
            accessorKey: 'membersCount',
            cell: ({ row }) => {
                const [isModalOpen, setIsModalOpen] = useState(false)
                const members = row.original?.members || []
                const teamName = row.original?.name || ''

                if (!members.length) return <span>0</span>

                return (
                    <>
                        <span
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                        >
                            {members?.length} Members
                        </span>
                        <TeamMembersModal
                            isOpen={isModalOpen}
                            onOpenChange={setIsModalOpen}
                            members={members}
                            teamName={teamName}
                            category={row.original?.tags?.find((tag) =>
                                TEAM_TAGS.includes(tag.toLowerCase())
                            )}
                        />
                    </>
                )
            },
        },
        {
            header: () => <span>Country / State</span>,
            accessorKey: 'state',
            cell: ({ row }) => {
                const state = row?.original?.state
                const country = state?.country

                if (!country || !state) return '---'

                return (
                    <div className="">
                        {/* Country Flag */}
                        <div className="flex items-center gap-2">
                            <Image
                                src={`https://flagcdn.com/w20/${country?.code
                                    ?.slice(0, 2)
                                    ?.toLowerCase()}.png`}
                                alt={country.name}
                                className="size-6 object-contain"
                                width={200}
                                height={200}
                            />

                            {/* <span className="text-sm font-medium text-foreground">
                                {country?.name ?? '---'}
                            </span> */}
                            <span className="text-xs text-muted-foreground">
                                {state?.name ?? '---'}
                            </span>
                        </div>
                        {/* Country + State */}
                    </div>
                )
            },
        },
        {
            header: () => <span>Tags</span>,
            accessorKey: 'tags',
            cell: ({ row }) => {
                const { tags } = row.original
                return (
                    <div className="flex items-center gap-2 flex-wrap">
                        {tags?.length ? (
                            tags.map((tag: string, index: number) => (
                                <div
                                    key={index}
                                    className="px-2 py-1 text-xs rounded-md bg-gray-100 border flex items-center gap-x-2"
                                >
                                    <div className="">
                                        <Tags size={10} />
                                    </div>
                                    <span> {tag}</span>
                                </div>
                            ))
                        ) : (
                            <span>---</span>
                        )}
                    </div>
                )
            },
        },
        {
            header: () => <span>Created</span>,
            accessorKey: 'createdAt',
            cell: ({ row }) => {
                const { createdAt } = row.original
                return createdAt
                    ? format(new Date(createdAt), 'dd MMM yyyy')
                    : '---'
            },
        },
        {
            header: () => <span>Actions</span>,
            accessorKey: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-x-1 items-center">
                    <TableAction
                        options={tableActionOptions}
                        rowItem={row.original}
                    />
                </div>
            ),
        },
    ]

    return { columns, tableActionOptions }
}

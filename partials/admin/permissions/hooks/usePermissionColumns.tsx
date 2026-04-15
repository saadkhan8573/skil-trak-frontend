import { useMemo } from 'react'
import { usePermissionActions } from './PermissionContext'
import { Badge, TableAction, TruncatedTextWithTooltip } from '@components'
import { FaEdit } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa6'

export const usePermissionColumns = () => {
    const { onEdit, onDelete } = usePermissionActions()
    return useMemo(
        () => [
            {
                accessorKey: 'name',
                id: 'name',
                header: () => <span>Name</span>,
            },
            {
                accessorKey: 'code',
                id: 'code',
                header: () => <span>Code</span>,
                cell: (info: any) => (
                    <div className="flex">
                        <Badge variant="primaryNew" text={info.getValue()} />
                    </div>
                ),
            },
            {
                accessorKey: 'roles',
                id: 'roles',
                header: () => <span>Roles</span>,
                cell: (info: any) => {
                    const roles = info.getValue() || []
                    return (
                        <div className="flex flex-wrap gap-1">
                            {roles.map((role: string) => (
                                <Badge
                                    key={role}
                                    outline
                                    variant="primaryNew"
                                    text={role.toUpperCase()}
                                />
                            ))}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'description',
                id: 'description',
                header: () => <span>Description</span>,
                cell: (info: any) => (
                    <TruncatedTextWithTooltip text={info.getValue() || 'N/A'} />
                ),
            },
            {
                id: 'action',
                header: () => <span>Action</span>,
                cell: (info: any) => {
                    const permission = info.row.original
                    const actions = [
                        {
                            text: 'Edit',
                            Icon: FaEdit,
                            onClick: () => onEdit(permission),
                        },
                        {
                            text: 'Delete',
                            Icon: FaTrash,
                            color: 'text-red-500 hover:bg-red-100',
                            onClick: () => onDelete(permission),
                        },
                    ]
                    return (
                        <div className="flex gap-x-1 items-center">
                            <TableAction options={actions} rowItem={permission} />
                        </div>
                    )
                },
            },
        ],
        [onEdit, onDelete]
    )
}

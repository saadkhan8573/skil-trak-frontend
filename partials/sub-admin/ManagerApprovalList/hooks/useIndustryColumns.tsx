import {
    ActionButton,
    Badge,
    Button,
    Typography,
    UserCreatedAt,
} from '@components'
import { IndustryCellInfo } from '@partials/sub-admin/Industries'
import { ColumnDef } from '@tanstack/react-table'
import { RemovePartnerRequest } from '@types'
import { ReactElement, useState } from 'react'
import { RequestedByCellInfo } from '../components'
import { IndustryRequestRemovalStatus } from '../enum'
import {
    ApprovePartnerIndustryApprovalList,
    NoteViewModal,
    RejectPartnerIndustryApprovalList,
} from '../modal'

export const useIndustryColumns = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancel = () => setModal(null)

    const onApproveClicked = (request: RemovePartnerRequest) => {
        setModal(
            <ApprovePartnerIndustryApprovalList
                request={request}
                onCancel={onCancel}
            />
        )
    }

    const onRejectClicked = (request: RemovePartnerRequest) => {
        setModal(
            <RejectPartnerIndustryApprovalList
                request={request}
                onCancel={onCancel}
            />
        )
    }

    const onViewNote = (comment: string) => {
        setModal(<NoteViewModal note={comment} onCancel={onCancel} />)
    }

    const columns: ColumnDef<RemovePartnerRequest>[] = [
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <IndustryCellInfo industry={info.row.original?.industry} />
            ),
            header: () => <span>Industry</span>,
        },
        {
            accessorKey: 'industry.abn',
            header: () => <span>ABN</span>,
        },
        {
            accessorKey: 'requestedBy',
            header: () => <span>Requested By</span>,
            cell: (info) => (
                <RequestedByCellInfo
                    requestedBy={info?.row?.original?.requestedBy}
                />
            ),
        },
        {
            header: () => 'Contact Person',
            accessorKey: 'contactPersonNumber',
            cell: ({ row }) => {
                const { contactPersonNumber, contactPerson } =
                    row.original?.industry
                return (
                    <Typography variant={'muted'} color={'gray'}>
                        {contactPersonNumber} {contactPerson}
                    </Typography>
                )
            },
        },

        {
            accessorKey: 'createdBy',
            header: () => <span>Created At</span>,
            cell: ({ row }) => (
                <UserCreatedAt createdAt={row?.original?.createdAt} />
            ),
        },
        {
            accessorKey: 'comment',
            header: () => <span>Note</span>,
            cell: ({ row }) => (
                <ActionButton
                    variant="info"
                    onClick={() => {
                        onViewNote(row?.original?.comment)
                    }}
                >
                    View
                </ActionButton>
            ),
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            cell: ({ row }) => (
                <Badge
                    text={row?.original?.status}
                    variant={
                        row.original?.status ===
                        IndustryRequestRemovalStatus.REJECTED
                            ? 'error'
                            : 'warning'
                    }
                />
            ),
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => (
                <div className="flex gap-x-1 items-center">
                    <Button
                        text={'Approve'}
                        variant="success"
                        onClick={() => onApproveClicked(info.row.original)}
                        disabled={
                            info.row.original?.status !==
                            IndustryRequestRemovalStatus.PENDING
                        }
                    />
                    <Button
                        text={'Reject'}
                        variant="error"
                        disabled={
                            info.row.original?.status !==
                            IndustryRequestRemovalStatus.PENDING
                        }
                        onClick={() => onRejectClicked(info.row.original)}
                    />
                </div>
            ),
        },
    ]

    return { columns, modal }
}

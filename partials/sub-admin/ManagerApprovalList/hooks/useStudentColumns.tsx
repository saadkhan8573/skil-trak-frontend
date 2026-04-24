import {
    ActionButton,
    Badge,
    Button,
    StudentJobId,
    Typography,
    UserCreatedAt,
} from '@components'
import { StudentCellInfo } from '@partials/sub-admin/students'
import { ColumnDef } from '@tanstack/react-table'
import { StudentActionsRequest } from '@types'
import React, { ReactElement, useState } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import { IndustryRequestRemovalStatus } from '../enum'
import {
    NoteViewModal,
    StudentApprovalActionsModal,
    StudentRejectActionsModal,
} from '../modal'
import { RequestedByCellInfo } from '../components'

export const useStudentColumns = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancel = () => setModal(null)

    const onApproveClicked = (request: StudentActionsRequest) => {
        setModal(
            <StudentApprovalActionsModal
                request={request}
                onCancel={onCancel}
            />
        )
    }

    const onRejectClicked = (request: StudentActionsRequest) => {
        setModal(
            <StudentRejectActionsModal request={request} onCancel={onCancel} />
        )
    }

    const onViewNote = (comment: string) => {
        setModal(<NoteViewModal note={comment} onCancel={onCancel} />)
    }

    const columns: ColumnDef<StudentActionsRequest>[] = [
        {
            header: () => 'Job Id',
            accessorKey: 'studentMaskedId',
            cell: ({ row }) => (
                <StudentJobId
                    studentJobId={row.original?.student?.studentMaskedId}
                />
            ),
        },
        {
            accessorKey: 'user.name',
            cell: (info) => (
                <StudentCellInfo student={info.row.original?.student} />
            ),
            header: () => <span>Student</span>,
        },
        {
            accessorKey: 'requestedBy',
            header: () => <span>Requested By</span>,
            cell: (info) => (
                <RequestedByCellInfo
                    requestedBy={info?.row?.original?.requestedBy}
                />
            ),
            // cell: (info) => (
            //     <div>
            //         <Typography variant="label">
            //             {info?.row?.original?.requestedBy?.name}
            //         </Typography>
            //         <div className="flex items-center gap-x-1">
            //             <span className="text-gray-400">
            //                 <FaEnvelope />
            //             </span>
            //             <Typography variant="small" color="text-gray-500">
            //                 {info?.row?.original?.requestedBy?.email}
            //             </Typography>
            //         </div>
            //     </div>
            // ),
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
                        disabled={
                            info.row.original?.status !==
                            IndustryRequestRemovalStatus.PENDING
                        }
                        onClick={() => onApproveClicked(info.row.original)}
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

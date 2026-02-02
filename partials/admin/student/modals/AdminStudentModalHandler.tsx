import React from 'react'
import { BlockMultiStudentsModal } from './BlockMultiStudentsModal'
import { BlockModal } from './BlockModal'
import { ArchiveModal } from './ArchiveModal'
import { HighPriorityModal } from './HighPriorityModal'
import { ChangeStatusModal } from './ChangeStatusModal'
import { EditTimer } from '@components/StudentTimer/EditTimer'
import { DeleteModal } from './DeleteModal'
import { AcceptModal } from './AcceptModal'
import { RejectModal } from './RejectModal'
import { UnblockModal } from './UnblockModal'
import { InitiateAiCallModal } from '@partials/common/modal'

export enum AdminStudentModalType {
    ARCHIVE = 'archive',
    BLOCK = 'block',
    BULK_BLOCK = 'bulkBlock',
    HIGH_PRIORITY = 'highPriority',
    CHANGE_STATUS = 'changeStatus',
    EDIT_TIMER = 'editTimer',
    DELETE = 'delete',
    ACCEPT = 'accept',
    REJECT = 'reject',
    UNBLOCK = 'unblock',
    AI_CALL = 'aiCall',
}

export const getAdminStudentsModal = (
    type: AdminStudentModalType,
    student: any,
    onCancel: () => void
) => {
    const modals: Record<AdminStudentModalType, React.ReactNode> = {
        [AdminStudentModalType.ARCHIVE]: (
            <ArchiveModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.BLOCK]: (
            <BlockModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.BULK_BLOCK]: (
            <BlockMultiStudentsModal student={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.HIGH_PRIORITY]: (
            <HighPriorityModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.CHANGE_STATUS]: (
            <ChangeStatusModal student={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.EDIT_TIMER]: (
            <EditTimer
                studentId={student?.user?.id}
                date={student?.expiryDate}
                onCancel={onCancel}
            />
        ),
        [AdminStudentModalType.DELETE]: (
            <DeleteModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.ACCEPT]: (
            <AcceptModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.REJECT]: (
            <RejectModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.UNBLOCK]: (
            <UnblockModal item={student} onCancel={onCancel} />
        ),
        [AdminStudentModalType.AI_CALL]: (
            <InitiateAiCallModal student={student} onClose={onCancel} />
        ),
    }
    return modals[type]
}

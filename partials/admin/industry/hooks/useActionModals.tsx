import { Industry } from '@types'
import React, { ReactElement, useEffect, useState } from 'react'

// modals
import {
    AcceptModal,
    ArchiveModal,
    RejectModal,
    UnblockModal,
    DeleteModal,
    BlockModal,
    UnArchiveModal,
    MultiBlockModal,
} from '../modals'

export const useActionModals = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onAcceptClicked = (industry: Industry | undefined | null) => {
        setModal(
            <AcceptModal industry={industry} onCancel={onModalCancelClicked} />
        )
    }
    const onRejectClicked = (industry: Industry | undefined | null) => {
        setModal(
            <RejectModal industry={industry} onCancel={onModalCancelClicked} />
        )
    }

    const onArchiveClicked = (industry: Industry | undefined | null) => {
        setModal(
            <ArchiveModal item={industry} onCancel={onModalCancelClicked} />
        )
    }

    const onUnArchiveClicked = (industry: Industry | undefined | null) => {
        setModal(
            <UnArchiveModal
                industry={industry}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onUnblockClicked = (industry: Industry | undefined | null) => {
        setModal(
            <UnblockModal industry={industry} onCancel={onModalCancelClicked} />
        )
    }
    const onDeleteClicked = (industry: Industry | undefined | null) => {
        setModal(
            <DeleteModal industry={industry} onCancel={onModalCancelClicked} />
        )
    }

    const onBlockClicked = (industry: Industry | undefined | null) => {
        setModal(
            <BlockModal industry={industry} onCancel={onModalCancelClicked} />
        )
    }

    const onMultiBlockClicked = (industries: Industry[]) => {
        setModal(
            <MultiBlockModal
                industries={industries}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    return {
        modal,
        onBlockClicked,
        onAcceptClicked,
        onRejectClicked,
        onDeleteClicked,
        onUnblockClicked,
        onArchiveClicked,
        onUnArchiveClicked,
        onMultiBlockClicked,
        setModal,
        onModalCancelClicked,
    }
}

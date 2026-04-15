import React, { createContext, useContext, useState, ReactNode } from 'react'
import { PermissionModal } from '../modals/PermissionModal'
import { DeletePermissionModal } from '../modals/DeletePermissionModal'

interface PermissionContextType {
    modal: ReactNode | null
    onEdit: (permission: any) => void
    onDelete: (permission: any) => void
    onAdd: () => void
    closeModal: () => void
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modal, setModal] = useState<ReactNode | null>(null)

    const closeModal = () => setModal(null)

    const onAdd = () => {
        setModal(<PermissionModal onCancel={closeModal} />)
    }

    const onEdit = (permission: any) => {
        setModal(
            <PermissionModal
                edit
                permission={permission}
                onCancel={closeModal}
            />
        )
    }

    const onDelete = (permission: any) => {
        setModal(
            <DeletePermissionModal
                permission={permission}
                onCancel={closeModal}
            />
        )
    }

    return (
        <PermissionContext.Provider value={{ modal, onEdit, onDelete, onAdd, closeModal }}>
            {children}
            {modal}
        </PermissionContext.Provider>
    )
}

export const usePermissionActions = () => {
    const context = useContext(PermissionContext)
    if (context === undefined) {
        throw new Error('usePermissionActions must be used within a PermissionProvider')
    }
    return context
}

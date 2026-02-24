import { Button } from '@components'
import React, { ReactElement, useState } from 'react'
import { MdAddBusiness } from 'react-icons/md'
import { RunListingAutomationModal } from '../../modal'

export const RunListingAutomation = ({
    studentAddress,
    sectorId,
    btnText = 'Run Automation',
    icon = true,
}: {
    studentAddress?: string
    sectorId?: number
    btnText?: string
    icon?: boolean
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancel = () => setModal(null)

    const onRunAutomationClicked = () => {
        setModal(
            <RunListingAutomationModal
                onCancel={onCancel}
                studentAddress={studentAddress}
                sectorId={sectorId}
            />
        )
    }
    return (
        <div>
            {modal}
            <Button
                text={btnText}
                variant="primaryNew"
                Icon={icon ? MdAddBusiness : undefined}
                onClick={() => {
                    onRunAutomationClicked()
                }}
            />
        </div>
    )
}

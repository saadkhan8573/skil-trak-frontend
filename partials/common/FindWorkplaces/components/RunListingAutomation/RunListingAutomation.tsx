import { Button } from '@components'
import React, { ReactElement, useState } from 'react'
import { MdAddBusiness } from 'react-icons/md'
import { RunListingAutomationModal } from '../../modal'

export const RunListingAutomation = ({
    studentAddress,
    sectorId,
}: {
    studentAddress?: string
    sectorId?: number
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
                text={'Run Automation'}
                variant="primaryNew"
                Icon={MdAddBusiness}
                onClick={() => {
                    onRunAutomationClicked()
                }}
            />
        </div>
    )
}

import { Modal } from '@components'
import { DeclineStudentFromInd } from '../components'

export const DeclineStudentByIndustryModal = ({
    workplaceId,
    onCancel,
}: {
    onCancel: () => void
    workplaceId: number
}) => {
    return (
        <Modal
            title="Add Reason"
            subtitle="Add Reason to Rejct Student"
            showActions={false}
            onCancelClick={onCancel}
        >
            <DeclineStudentFromInd
                workplaceId={workplaceId}
                onCancel={onCancel}
            />
        </Modal>
    )
}

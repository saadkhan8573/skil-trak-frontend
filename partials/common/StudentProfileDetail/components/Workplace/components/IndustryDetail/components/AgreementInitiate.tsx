import { Button } from '@components'
import { InitiateSigningModal } from '@partials/sub-admin/assessmentEvidence/modal'
import { ReactElement, useState } from 'react'

export const AgreementInitiate = ({
    rto,
    folder,
    courseId,
    onEsignRefetch,
}: {
    rto: any
    folder: any
    courseId: any
    onEsignRefetch: () => void
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancelModal = () => {
        onEsignRefetch()
        setModal(null)
    }

    const onInitiateSigning = () => {
        setModal(
            <InitiateSigningModal
                onCancel={() => {
                    onCancelModal()
                }}
                courseId={courseId}
                folder={folder}
                rtoUser={rto?.user}
            />
        )
    }
    return (
        <>
            {modal}
            <div className=" flex justify-center items-center h-full">
                <div className=" flex flex-col gap-y-2 justify-center items-center">
                    <Button
                        text="Initiate Signing"
                        onClick={() => {
                            onInitiateSigning()
                        }}
                    />
                </div>
            </div>
        </>
    )
}

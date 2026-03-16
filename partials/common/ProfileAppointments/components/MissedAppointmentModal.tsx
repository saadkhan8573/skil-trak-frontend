import { useState, useMemo } from 'react'
import { Button, TextArea, Typography, GlobalModal } from '@components'

type MissedAppointmentModalProps = {
    open: boolean
    loading?: boolean
    onClose: () => void
    onSave: (note: string) => void
}

export const MissedAppointmentModal = ({
    open,
    loading = false,
    onClose,
    onSave,
}: MissedAppointmentModalProps) => {
    const [note, setNote] = useState('')

    const isSaveDisabled = useMemo(() => {
        return !note.trim()
    }, [note])

    if (!open) return null

    return (
        <GlobalModal>
            <div className="flex flex-col gap-y-4 p-6 max-w-lg">
                {/* HEADER */}
                <Typography semibold uppercase>
                    Appointment Missed
                </Typography>

                {/* DESCRIPTION */}
                <Typography variant="small">
                    Please provide details about why the appointment was missed.
                    This information will be shared for record and follow-up.
                </Typography>

                {/* NOTE */}
                <TextArea
                    name="note"
                    placeholder="Add comments / reason"
                    required
                    value={note}
                    onChange={(e: any) => setNote(e.target.value)}
                />

                {/* ACTIONS */}
                <div className="flex justify-end gap-x-3 pt-4">
                    <Button
                        text="Cancel"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    />

                    <Button
                        text="Save"
                        loading={loading}
                        disabled={isSaveDisabled || loading}
                        onClick={() => onSave(note)}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}

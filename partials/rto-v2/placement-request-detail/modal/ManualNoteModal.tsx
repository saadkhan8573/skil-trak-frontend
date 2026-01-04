import { GlobalModal } from '@components/Modal/GlobalModal'
import {
    Button,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { TextArea } from '@components/inputs/TextArea'
import { MessageSquare, Info, Plus } from 'lucide-react'
import { MdCancel } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'

interface ManualNoteModalProps {
    open: boolean
    onClose: () => void
    note: string
    onNoteChange: (note: string) => void
    onConfirm: () => void
}

export function ManualNoteModal({
    open,
    onClose,
    note,
    onNoteChange,
    onConfirm,
}: ManualNoteModalProps) {
    if (!open) return null
    const [manualNote, setManualNote] = useState({
        title: '',
        note: '',
    })
    const router = useRouter()
    const wpId = router.query.id
    const { notification } = useNotification()
    const [addManualNote, addManualNoteResult] =
        RtoV2Api.PlacementRequests.useAddManualNote()
    useEffect(() => {
        if (addManualNoteResult.isSuccess) {
            notification.success({
                title: 'Manual note added',
                description: 'Manual note added successfully',
            })
            onClose()
        }
    }, [addManualNoteResult.isSuccess])
    const onConfirmClick = () => {
        addManualNote({
            body: {
                title: manualNote.title,
                note: manualNote.note,
            },
            id: wpId as string,
        })
    }

    return (
        <>
            <ShowErrorNotifications result={addManualNoteResult} />
            <GlobalModal onCancel={onClose} className="sm:max-w-[500px]">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div>
                            <Typography
                                variant="h3"
                                className="text-primaryNew text-xl flex items-center gap-2"
                            >
                                <MessageSquare className="h-5 w-5" />
                                Add Manual Note
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-gray-600 mt-1"
                            >
                                Add a custom note or observation about this
                                placement
                            </Typography>
                        </div>
                    </div>

                    <div className="pb-4">
                        <div>
                            <TextInput
                                label={'Title'}
                                name="title"
                                placeholder="Enter note title here..."
                                onChange={(e: any) => {
                                    setManualNote({
                                        ...manualNote,
                                        title: e.target.value,
                                    })
                                }}
                            />
                            <TextArea
                                name="note"
                                label={'Description'}
                                placeholder="Enter your note here..."
                                className="mt-2"
                                rows={6}
                                value={note}
                                onChange={(e: any) =>
                                    setManualNote({
                                        ...manualNote,
                                        note: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                onNoteChange('')
                            }}
                            text="Cancel"
                        />
                        <Button
                            variant="primaryNew"
                            onClick={onConfirmClick}
                            Icon={Plus}
                            text="Add Note"
                            loading={addManualNoteResult.isLoading}
                            disabled={addManualNoteResult.isLoading}
                        />
                    </div>
                </div>
            </GlobalModal>
        </>
    )
}

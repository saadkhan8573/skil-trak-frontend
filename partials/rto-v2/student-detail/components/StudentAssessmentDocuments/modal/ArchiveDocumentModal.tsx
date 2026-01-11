import { Button, useShowErrorNotification } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'

interface ArchiveDocumentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file: any
}

export const ArchiveDocumentModal = ({
    open,
    onOpenChange,
    file,
}: ArchiveDocumentModalProps) => {
    const { notification } = useNotification()
    const showErrorNotification = useShowErrorNotification()
    const [archiveFile, archiveFileResult] =
        SubAdminApi.AssessmentEvidence.archiveUploadedFile()

    const isArchived = file?.isArchived

    const handleArchive = async () => {
        if (file?.id) {
            try {
                await archiveFile(file.id).unwrap()
                notification.success({
                    title: `File ${isArchived ? 'Restored' : 'Archived'}`,
                    description: `The assessment file has been successfully ${isArchived ? 'restored' : 'archived'}.`,
                })
                onOpenChange(false)
            } catch (error: any) {
                showErrorNotification({ isError: true, error })
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isArchived ? 'Restore' : 'Archive'} File
                    </DialogTitle>
                    <DialogDescription>
                        {isArchived
                            ? `Are you sure you want to restore "${file?.filename}"? This will make the file accessible to students again.`
                            : `Are you sure you want to archive "${file?.filename}"? Archiving a file makes it inaccessible to students.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
                    <Button
                        variant="action"
                        onClick={() => onOpenChange(false)}
                        disabled={archiveFileResult.isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={isArchived ? 'action' : 'error'}
                        onClick={handleArchive}
                        loading={archiveFileResult.isLoading}
                        disabled={archiveFileResult.isLoading}
                    >
                        {isArchived ? 'Restore' : 'Archive'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

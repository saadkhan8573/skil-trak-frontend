import { Button, ShowErrorNotifications } from '@components'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { FileType } from '@types'
import { ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import { RejectFileModal } from '../modal'

export const RejectFile = ({
    file,
    studentId,
}: {
    file: FileType
    studentId: number
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const [fileStatusChange, fileStatusChangeResult] =
        RtoV2Api.StudentDocuments.fileStatusChange()

    const { notification } = useNotification()

    const handleReject = async (comment: string) => {
        if (!comment.trim()) {
            notification.error({
                title: 'Please enter a reason',
                description: 'Please enter a reason to approve the file',
            })
            return
        }
        const res: any = await fileStatusChange({
            stdId: studentId,
            responseId: file?.id,
            status: 'rejected',
            comment,
        })
        if (res?.data) {
            notification.error({
                title: 'File Rejected',
                description: 'File Rejected Successfully',
            })
            setIsOpen(false)
        }
    }

    return (
        <div>
            <ShowErrorNotifications result={fileStatusChangeResult} />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        mini
                        outline
                        variant="error"
                        Icon={ThumbsDown}
                        onClick={() => setIsOpen(true)}
                    />
                </TooltipTrigger>
                <TooltipContent>Reject File</TooltipContent>
            </Tooltip>
            <RejectFileModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedItem={file}
                handleReject={handleReject}
                result={fileStatusChangeResult}
            />
        </div>
    )
}

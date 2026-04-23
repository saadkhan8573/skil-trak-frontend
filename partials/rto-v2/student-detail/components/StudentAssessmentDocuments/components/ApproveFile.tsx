import React, { useState } from 'react'
import { ApproveFileModal } from '../modal'
import { ThumbsUp } from 'lucide-react'
import { Button, ShowErrorNotifications } from '@components'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { FileType } from '@types'
import { RtoV2Api } from '@queries'
import { useNotification } from '@hooks'

export const ApproveFile = ({
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

    const handleApprove = async (comment: string) => {
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
            status: 'approved',
            comment,
        })
        if (res?.data) {
            notification.success({
                title: 'File Approved',
                description: 'File Approved Successfully',
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
                        Icon={ThumbsUp}
                        variant="success"
                        onClick={() => setIsOpen(true)}
                    />
                </TooltipTrigger>
                <TooltipContent>Approve File</TooltipContent>
            </Tooltip>
            <ApproveFileModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedItem={file}
                handleApprove={handleApprove}
                result={fileStatusChangeResult}
            />
        </div>
    )
}

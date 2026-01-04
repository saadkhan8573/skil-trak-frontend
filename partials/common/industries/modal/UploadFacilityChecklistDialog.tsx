import { Button, ShowErrorNotifications, Typography, Card } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@redux'
import { IndustryCourseApproval } from '@types'
import { UploadCloud, FileText, CheckCircle2, X, Upload } from 'lucide-react'
import { useState } from 'react'

interface UploadFacilityChecklistDialogProps {
    open: boolean
    approval: IndustryCourseApproval
    onOpenChange: (open: boolean) => void
}

export function UploadFacilityChecklistDialog({
    open,
    approval,
    onOpenChange,
}: UploadFacilityChecklistDialogProps) {
    const { notification } = useNotification()
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const [uploadFacilityChecklist, uploadFacilityChecklistResult] =
        RtoV2Api.Industries.uploadCourseFacilityChecklist()

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            setUploadedFile(file)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!uploadedFile) {
            notification.error({
                title: 'Error',
                description: 'Please select a file to upload.',
            })
            return
        }

        const formData = new FormData()
        formData.append('file', uploadedFile)

        const res: any = await uploadFacilityChecklist({
            id: approval.id,
            body: formData,
        })

        if (res?.data) {
            notification.success({
                title: 'Success',
                description: 'Facility checklist uploaded successfully!',
            })
            onOpenChange(false)
            setUploadedFile(null)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={uploadFacilityChecklistResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-xl flex items-center justify-center">
                                <UploadCloud className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg">
                                    Upload Facility Checklist
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    {approval.course.code} -{' '}
                                    {approval.course.title}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <Card className="p-1 border-2 border-dashed border-[#044866]/30 hover:border-[#044866]/60 transition-all rounded-2xl bg-background/60">
                            <div
                                className={`relative rounded-xl p-6 text-center transition-all cursor-pointer ${dragActive
                                    ? 'border-2 border-[#044866] bg-[#044866]/5'
                                    : 'border-2 border-transparent hover:bg-muted/60'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() =>
                                    document
                                        .getElementById('facility-file-upload')
                                        ?.click()
                                }
                            >
                                <input
                                    type="file"
                                    id="facility-file-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e: any) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setUploadedFile(e.target.files[0])
                                        }
                                    }}
                                />

                                {uploadedFile ? (
                                    <div className="space-y-3">
                                        <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center shadow-md">
                                            <CheckCircle2 className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <Typography variant="label" semibold>
                                                {uploadedFile.name}
                                            </Typography>
                                            <Typography
                                                variant="xs"
                                                color="text-muted"
                                            >
                                                {(
                                                    uploadedFile.size / 1024
                                                ).toFixed(2)}{' '}
                                                KB
                                            </Typography>
                                        </div>
                                        <Button
                                            text="Remove file"
                                            outline
                                            Icon={X}
                                            variant="error"
                                            className="h-8 text-[10px]"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation()
                                                setUploadedFile(null)
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-[#044866]/10 to-[#044866]/10 flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-[#044866]" />
                                        </div>
                                        <div>
                                            <Typography variant="label" semibold>
                                                Drag & drop your file here
                                            </Typography>
                                            <Typography
                                                variant="xs"
                                                color="text-muted"
                                            >
                                                or click to browse (.pdf, .doc, .docx)
                                            </Typography>
                                        </div>
                                        <Button
                                            text="Choose file"
                                            outline
                                            Icon={Upload}
                                            className="h-9 text-xs"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation()
                                                document
                                                    .getElementById(
                                                        'facility-file-upload'
                                                    )
                                                    ?.click()
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-10 border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFB]"
                            >
                                Cancel
                            </Button>
                            <Button
                                submit
                                loading={uploadFacilityChecklistResult.isLoading}
                                className="flex-1 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white gap-2 h-10 shadow-lg shadow-[#044866]/20"
                            >
                                <UploadCloud className="w-4 h-4" />
                                Upload File
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

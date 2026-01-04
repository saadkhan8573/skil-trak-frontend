import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
    AlertCircle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Upload,
    X,
} from 'lucide-react'
import { Badge, Button, Card, Typography, Select } from '@components'
import { read, utils } from 'xlsx'
import { useNotification } from '@hooks'
import { BinaryFileUpload } from '@components/inputs/BinaryFileUpload'
import { AdminApi, RtoApi } from '@redux'
import { Course } from '@types'
import { trimText } from '@utils'

interface BulkIndustryImportFormProps {
    onSubmit: (values: any) => void
    result: any
}

type ValidationResult = {
    valid: Array<{ name: string; abn: string; status: string }>
    conflicts: Array<{
        name: string
        abn: string
        conflictType: string
        reason: string
    }>
}

type BulkImportFormValues = {
    courses: number[]
    list: any[]
}

// Yup validation schema
const validationSchema = yup.object({
    courses: yup
        .array()
        .of(yup.number())
        .min(1, 'At least one course must be selected')
        .required('Courses are required'),
})

export const BulkIndustryImportForm = ({
    onSubmit,
    result,
}: BulkIndustryImportFormProps) => {
    const { notification } = useNotification()

    // Form setup
    const methods = useForm<BulkImportFormValues>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    // Get RTO courses
    const rto = RtoApi.Rto.useProfile()

    const rtoCoursesOptions =
        rto.isSuccess && rto?.data?.courses && rto?.data?.courses?.length > 0
            ? rto?.data?.courses?.map((course: Course) => ({
                  label: course?.title,
                  value: course?.id,
                  item: course,
              }))
            : []

    const [dragActive, setDragActive] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

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
            // Create a fake event object to pass to onFileChange
            const fakeEvent = {
                target: { files: [file] },
            }
            onFileChange(fakeEvent)
        }
    }

    const onFileChange = async (e: any) => {
        const fileData: File = e.target.files[0]

        if (!fileData) return

        const reader: any = new FileReader()
        const rABS = !!reader.readAsBinaryString
        if (reader) {
            reader.onload = (loadEvent: any) => {
                if (reader.readyState === 2) {
                    try {
                        const wb = read(loadEvent.target.result, {
                            type: 'binary',
                        })
                        const sheets = wb.SheetNames

                        if (sheets.length) {
                            const rows = utils.sheet_to_json(
                                wb.Sheets[sheets[0]]
                            )
                            // setStudentsCount(rows?.length)
                            if (rows?.length <= 50) {
                                methods.setValue('list', rows)
                            } else {
                                notification.error({
                                    title: 'Industry Length!',
                                    description:
                                        'Industry count must be less than or equal to 50!',
                                    dissmissTimer: 5000,
                                })
                            }
                        }
                    } catch (err) {
                        notification.error({
                            title: 'Invalid File',
                            description: 'File should be .csv or .xlsx',
                        })
                    }
                }
            }

            if (rABS) reader.readAsBinaryString(fileData)
            else reader.readAsArrayBuffer(fileData)
        }
    }

    const downloadTemplate = () => {
        const csvContent =
            'Name,ABN,Sector,Location,Contact Person,Contact Email,Contact Phone,Capacity,Website,Facilities\n' +
            'Example Aged Care,12 345 678 901,Community Services,Melbourne VIC,John Smith,john@example.com.au,(03) 1234 5678,15,https://example.com.au,Aged Care|Disability Support\n'

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'industry-partners-template.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-4 mt-4 animate-fadeIn">
                    <Card className="p-4 border border-primaryNew/15 bg-gradient-to-r from-primaryNew/5 via-background to-primaryNew/10 rounded-xl">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primaryNew to-primaryNew shadow-md">
                                    <Upload className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <Typography variant="subtitle" semibold>
                                        Bulk import partners in one go
                                    </Typography>
                                    <Typography variant="xs" color="text-muted">
                                        Upload a CSV or Excel file and
                                        we&apos;ll validate partners before you
                                        import them into SkilTrak.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border border-primaryNew/20 bg-gradient-to-br from-primaryNew/5 to-transparent rounded-xl">
                        <Typography variant="label" semibold className="mb-3">
                            Select Courses
                        </Typography>
                        <Select
                            name="courses"
                            label="Courses"
                            options={rtoCoursesOptions}
                            required
                            multi
                            onlyValue
                            placeholder="Select courses for bulk import"
                            validationIcons
                            helpText="Select the courses that these industries will be associated with"
                        />
                    </Card>

                    <Card className="p-5 border-2 border-dashed border-primaryNew/30 hover:border-primaryNew/60 transition-all rounded-2xl bg-background/60">
                        <div
                            className={`relative rounded-xl p-6 text-center transition-all cursor-pointer ${
                                dragActive
                                    ? 'border-2 border-primaryNew bg-primaryNew/5'
                                    : 'border-2 border-border hover:border-primaryNew/60 hover:bg-muted/60'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() =>
                                document
                                    .getElementById('bulk-file-upload')
                                    ?.click()
                            }
                        >
                            <input
                                type="file"
                                id="bulk-file-upload"
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={(e: any) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setUploadedFile(e.target.files[0])
                                        onFileChange(e)
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
                                            {(uploadedFile.size / 1024).toFixed(
                                                2
                                            )}{' '}
                                            KB
                                        </Typography>
                                    </div>
                                    <Button
                                        text="Remove file"
                                        outline
                                        Icon={X}
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation()
                                            setUploadedFile(null)
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primaryNew/10 to-primaryNew/10 flex items-center justify-center">
                                        <FileSpreadsheet className="h-6 w-6 text-primaryNew" />
                                    </div>
                                    <div>
                                        <Typography variant="label" semibold>
                                            Drag &amp; drop your file here
                                        </Typography>
                                        <Typography
                                            variant="xs"
                                            color="text-muted"
                                        >
                                            or click to browse from your
                                            computer
                                        </Typography>
                                    </div>
                                    <Button
                                        text="Choose file"
                                        outline
                                        variant="primaryNew"
                                        Icon={Upload}
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation()
                                            document
                                                .getElementById(
                                                    'bulk-file-upload'
                                                )
                                                ?.click()
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <Badge text="CSV" variant="primaryNew" />
                            <Badge text="XLSX" variant="primaryNew" />
                            <Badge text="XLS" variant="primaryNew" />
                        </div>
                    </Card>

                    <Card className="p-4 border border-primaryNew/20 bg-gradient-to-br from-primaryNew/5 to-transparent rounded-xl">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primaryNew/10 to-primaryNew/10">
                                    <Download className="h-4 w-4 text-primaryNew" />
                                </div>
                                <div>
                                    <Typography variant="label" semibold>
                                        Need a template?
                                    </Typography>
                                    <Typography variant="xs" color="text-muted">
                                        Download our CSV template with example
                                        data to get started.
                                    </Typography>
                                </div>
                            </div>
                            <Button
                                text="Download template"
                                outline
                                variant="primaryNew"
                                Icon={Download}
                                onClick={downloadTemplate}
                            />
                        </div>
                    </Card>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                        <Button
                            text={`Import industries`}
                            variant="primaryNew"
                            Icon={Upload}
                            submit
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

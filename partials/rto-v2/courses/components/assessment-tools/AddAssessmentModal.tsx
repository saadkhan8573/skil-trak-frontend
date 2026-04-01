import {
    Button,
    Checkbox,
    ShowErrorNotifications,
    TextInput,
    UploadFile,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui/dialog'
import { FileUpload } from '@hoc'
import { useNotification } from '@hooks'
import { useCreateRtoAssessmentToolsMutation } from '@queries'
import { PlusCircle, FilePlus2, Loader2, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface AddAssessmentModalProps {
    course: any
}

export const AddAssessmentModal = ({ course }: AddAssessmentModalProps) => {
    const [open, setOpen] = useState(false)
    const [fileData, setFileData] = useState<any>(null)
    const { notification } = useNotification()

    const [
        createAssessment,
        { isLoading: isCreating, isSuccess, isError, error },
    ] = useCreateRtoAssessmentToolsMutation()

    const methods = useForm({
        defaultValues: {
            title: '',
            isLogBook: false,
            isIndustryLogBook: false,
            course: course?.id,
        },
    })

    const isLogBook = methods.watch('isLogBook')
    const isIndustryLogBook = methods.watch('isIndustryLogBook')

    useEffect(() => {
        if (isLogBook) {
            methods.setValue('isIndustryLogBook', false)
        }
    }, [isLogBook, methods])

    useEffect(() => {
        if (isIndustryLogBook) {
            methods.setValue('isLogBook', false)
        }
    }, [isIndustryLogBook, methods])

    useEffect(() => {
        if (isSuccess) {
            notification.success({
                title: 'Assessment Added',
                description: 'Assessment tool has been uploaded successfully',
            })
            setOpen(false)
            methods.reset()
            setFileData(null)
        }
    }, [isSuccess])

    const onSubmit = async (values: any) => {
        if (!fileData) {
            notification.error({
                title: 'Missing File',
                description: 'Please upload an assessment file',
            })
            return
        }

        const formData = new FormData()
        formData.append('file', fileData)
        formData.append('title', values.title)
        formData.append('course', values.course)
        if (values.isLogBook) formData.append('isLogBook', 'true')
        if (values.isIndustryLogBook)
            formData.append('isIndustryLogBook', 'true')

        createAssessment(formData)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="z-9999">
                    <Button
                        variant="primary"
                        Icon={PlusCircle}
                        text="Add Assessment"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl **:data-[slot=dialog-close]:text-white">
                <DialogHeader className="gap-0! px-6 py-3.5 bg-linear-to-br from-primaryNew to-primaryNew/80 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FilePlus2 className="h-20 w-20" />
                    </div>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-white/80" />
                        Add Assessment
                    </DialogTitle>
                    <p className="text-white/70 mt-1 text-sm">
                        Upload a new assessment tool for{' '}
                        <span className="font-semibold text-white">
                            {course?.title}
                        </span>
                    </p>
                </DialogHeader>

                <div className="p-8 pt-0 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <ShowErrorNotifications
                                result={{ isError, error }}
                            />

                            <div>
                                <TextInput
                                    label="Assessment Title"
                                    name="title"
                                    placeholder="Enter assessment title..."
                                    required
                                    className="h-12 text-base"
                                />

                                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-accent/5 border border-border/50">
                                    <Checkbox
                                        name="isLogBook"
                                        label="Enable as Student Logbook"
                                        className="text-sm"
                                    />
                                    <Checkbox
                                        name="isIndustryLogBook"
                                        label="Enable as Industry Logbook"
                                        className="text-sm"
                                        showError={false}
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="text-sm font-medium mb-2 block">
                                        Upload File
                                    </label>
                                    <FileUpload
                                        name="file"
                                        component={UploadFile}
                                        onChange={(e: any) => {
                                            setFileData(e)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="secondary"
                                    className="flex-1 h-12 rounded-2xl bg-accent/5 hover:bg-accent/10 border-none transition-all"
                                    text="Cancel"
                                    onClick={() => setOpen(false)}
                                />
                                <Button
                                    submit
                                    variant="primary"
                                    className="flex-1 h-12 rounded-2xl bg-linear-to-r from-primaryNew to-primaryNew/90 shadow-lg shadow-primaryNew/20 active:scale-[0.98] transition-all"
                                    text="Upload Tool"
                                    loading={isCreating}
                                    disabled={isCreating}
                                    Icon={isCreating ? undefined : PlusCircle}
                                />
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    )
}

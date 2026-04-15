import { LoadingAnimation } from '@components/LoadingAnimation'
import { Modal } from '@components/Modal'
import { PdfViewer } from '@components/PdfViewer'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { TextArea, UploadFile } from '@components/inputs'
import { FileUpload } from '@hoc'
import { useNotification } from '@hooks'
import { StudentApi } from '@queries'
import { useEffect, useState } from 'react'
import { AiFillCheckCircle } from 'react-icons/ai'

export const ApplyJobModal = ({
    id,
    onCancel,
}: {
    id: number
    onCancel: () => void
}) => {
    const [resume, setResume] = useState<any>(null)
    const [coverLetter, setCoverLetter] = useState<any>(null)
    const [selectedResume, setSelectedResume] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const [newResumeUploaded, setNewResumeUploaded] = useState<boolean>(false)

    const { notification } = useNotification()

    const getJobResume = StudentApi.Job.useGetStudentUploadedResume()
    const [applyForJob, applyForJobResult] = StudentApi.Job.useApplyJob()

    useEffect(() => {
        if (getJobResume.isSuccess) {
            setResume(getJobResume?.data?.resume)
            setCoverLetter(getJobResume?.data?.cover_latter)
            setSelectedResume(true)
        }
    }, [getJobResume])

    useEffect(() => {
        if (applyForJobResult.isSuccess) {
            notification.success({
                title: 'Applied',
                description: 'Apllied Successfully for job',
            })
            onCancel()
        }
    }, [applyForJobResult])

    useEffect(() => {
        return () => {
            if (resume && typeof resume === 'string' && resume.startsWith('blob:')) {
                URL.revokeObjectURL(resume)
            }
        }
    }, [resume])

    const onApplyJob = () => {
        const formData = new FormData()

        formData.append(
            'resume',
            getJobResume?.data && !newResumeUploaded ? resume : (file as File)
        )
        formData.append('cover_latter', coverLetter)

        applyForJob({ id, body: formData })
    }

    return (
        <div>
            <ShowErrorNotifications result={applyForJobResult} />
            <Modal
                title="Apply For job"
                subtitle="Apply for the job"
                onConfirmClick={() => {
                    onApplyJob()
                }}
                onCancelClick={onCancel}
                confirmText="Apply"
                disabled={
                    !resume || !selectedResume || applyForJobResult.isLoading
                }
                loading={applyForJobResult.isLoading}
            >
                {getJobResume.isLoading ? (
                    <LoadingAnimation />
                ) : (
                    <div className={`relative`}>
                        <div className={`max-h-[70vh] overflow-auto  `}>
                            <TextArea
                                name="coverletter"
                                rows={6}
                                value={coverLetter}
                                label={'Cover Letter (Optional)'}
                                placeholder="Cover Letter "
                                onChange={(e: any) => {
                                    setCoverLetter(e.target.value)
                                }}
                                helpText={
                                    'Your Cover Letter Provides an opertunity to highlight you experiance and achivements'
                                }
                            />
                            {resume ? (
                                <div
                                    className={`border-4 cursor-pointer ${
                                        resume && selectedResume
                                            ? 'border-info'
                                            : ''
                                    } rounded-2xl overflow-hidden relative `}
                                    onClick={() => {
                                        setSelectedResume(!selectedResume)
                                    }}
                                >
                                    <div
                                        className={`absolute top-2 right-2 z-50 ${
                                            resume && selectedResume
                                                ? 'text-info'
                                                : 'text-secondary-dark'
                                        }`}
                                    >
                                        <AiFillCheckCircle size={25} />
                                    </div>
                                    <PdfViewer file={resume} />
                                </div>
                            ) : (
                                <FileUpload
                                    label={'Upload your Resume'}
                                    required
                                    onChange={(doc: File) => {
                                        setFile(doc)
                                        if (resume && typeof resume === 'string' && resume.startsWith('blob:')) {
                                            URL.revokeObjectURL(resume)
                                        }
                                        setResume(URL.createObjectURL(doc))
                                        setSelectedResume(true)
                                    }}
                                    name={'resume'}
                                    component={UploadFile}
                                    // multiple
                                    limit={Number(1111111111)}
                                />
                            )}
                        </div>
                        {resume && (
                            <div className="absolute bottom-2 w-full px-10">
                                <label
                                    htmlFor="replaceResume"
                                    className="w-full py-3 flex items-center justify-center rounded-lg bg-info hover:bg-info-light text-white shadow-lg text-xs font-semibold cursor-pointer"
                                >
                                    Replace Resume
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    name="replaceResume"
                                    id="replaceResume"
                                    onChange={(e: any) => {
                                        const file = e.target.files[0]
                                        setFile(file)
                                        if (resume && typeof resume === 'string' && resume.startsWith('blob:')) {
                                            URL.revokeObjectURL(resume)
                                        }
                                        setResume(URL.createObjectURL(file))
                                        setSelectedResume(true)
                                        setNewResumeUploaded(true)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

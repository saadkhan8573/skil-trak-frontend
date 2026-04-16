import {
    Button,
    Checkbox,
    GlobalModal,
    RadioButton,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { StudentApi } from '@queries'
import Image from 'next/image'
import { ReactElement, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { DocUpload, WorkplaceEmploymentDocument } from '../components'
import { useNotification } from '@hooks'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { useRouter } from 'next/router'

export const EmployerDocuments = ({
    onCancel,
    action,
    result,
    setActive,
    test,
    setAnswer,
    answer,
}: {
    result: any
    action: any
    test: any
    onCancel: () => void
    setActive: (val: number) => void
    setAnswer: any
    answer: any
}) => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [files, setFiles] = useState({})

    const { notification } = useNotification()

    const role = getUserCredentials()?.role

    const [upload, uploadResult] = StudentApi.Workplace.uploadWPContract()

    const onProceed = async () => {
        const payload = uploadResult?.data ?? null

        if (!uploadResult?.data) {
            notification.info({
                title: 'Proceeding without documents',
                description:
                    'You can upload employer documents later from your profile.',
            })
        }

        const res: any = await action(payload)

        if (res?.data) {
            onCancel()
            // router.push(
            //     `/portals/student/workplace/my-workplace/have-workplace/provided-industry-onboarding/${res?.data?.industry?.id}`
            // )

            setActive(4)
        }
    }

    const onUploadFile = async (e: any) => {
        const formData = new FormData()

        Object.entries(e)?.forEach(([key, value]: any) => {
            formData.append(
                key === 'name' ? 'workplaceDocumentType' : key,
                value
            )
        })

        if (
            role === UserRoles.SUBADMIN ||
            role === UserRoles.ADMIN ||
            role === UserRoles.RTO
        ) {
            formData.append('student', router?.query?.id + '')
        }

        const res: any = await upload(formData)

        if (res?.data) {
            notification.success({
                title: 'File Uploaded',
                description: 'File Uploaded Successfully!',
            })
        }
    }

    return (
        <>
            <ShowErrorNotifications result={uploadResult} />
            <GlobalModal>
                <div className="w-full max-w-5xl px-24">
                    <MdCancel
                        onClick={onCancel}
                        className="absolute top-2 right-2 transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                    />

                    <div className="py-6 px">
                        <div className="flex flex-col items-center gap-y-6">
                            <Image
                                src={'/images/workplace/document.png'}
                                alt={''}
                                width={50}
                                height={50}
                            />
                            <Typography variant="title" normal>
                                Please upload one of the following employer
                                documents to add the workplace (optional)
                            </Typography>
                        </div>

                        {/*  */}
                        <div className="flex flex-col items-center gap-y-3 mt-7">
                            <div className="w-full">
                                <DocUpload
                                    name={WorkplaceEmploymentDocument.PAY_SLIP}
                                    value={
                                        files?.[
                                            WorkplaceEmploymentDocument.PAY_SLIP as keyof typeof files
                                        ]
                                    }
                                    title="Pay Slip"
                                    setFile={(e) => {
                                        onUploadFile(e)
                                        setFiles((files) => {
                                            return {
                                                ...files,
                                                paySlip: e,
                                            }
                                        })
                                    }}
                                    disabled={
                                        uploadResult?.isLoading ||
                                        uploadResult?.isSuccess
                                    }
                                    loading={uploadResult?.isLoading as boolean}
                                />
                            </div>
                            <Typography
                                variant="h4"
                                color="text-[#6F6C90]"
                                normal
                            >
                                OR
                            </Typography>
                            <div className="w-full">
                                <DocUpload
                                    name={
                                        WorkplaceEmploymentDocument.EMPLOYMENT_CONTRACT
                                    }
                                    value={
                                        files?.[
                                            WorkplaceEmploymentDocument.EMPLOYMENT_CONTRACT as keyof typeof files
                                        ]
                                    }
                                    title="Employment Contract"
                                    setFile={(e) => {
                                        onUploadFile(e)
                                        setFiles((files) => ({
                                            ...files,
                                            employmentContract: e,
                                        }))
                                    }}
                                    disabled={
                                        uploadResult?.isLoading ||
                                        uploadResult?.isSuccess
                                    }
                                    loading={uploadResult?.isLoading as boolean}
                                />
                            </div>

                            {/* question  */}
                            <div className="flex flex-col gap-y-3">
                                <Typography variant="small" normal>
                                    <span className="font-bold leading-6">
                                        Q: Would you like to join our Talent
                                        Pool Programme?
                                    </span>
                                    <br /> By joining, your profile will be
                                    immediately visible to industries in your
                                    field. They can reach out to you directly
                                    with job opportunities.
                                </Typography>
                                <div className="flex items-center gap-x-4">
                                    <RadioButton
                                        name="answer"
                                        value={'yes'}
                                        group
                                        label={'Yes, Join Now'}
                                        onChange={(e: any) => {
                                            setAnswer(e?.target?.value)
                                        }}
                                    />
                                    <RadioButton
                                        name="answer"
                                        group
                                        value={'no'}
                                        label={'No, Not Yet'}
                                        onChange={(e: any) => {
                                            setAnswer(e?.target?.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/*  */}
                        <div className="w-40 mt-6 mx-auto">
                            <Button
                                text={'Proceed'}
                                fullWidth
                                loading={result?.isLoading}
                                disabled={result?.isLoading}
                                onClick={() => {
                                    onProceed()
                                }}
                            />
                        </div>

                        {/*  */}
                        <div className="max-w-lg w-full mx-auto mt-6">
                            <Typography center>
                                If you do not have these documents, please
                                contact Skiltrak at{' '}
                                <span className="font-bold">
                                    (03) 9363-6378
                                </span>
                                . Our coordinator will be happy to assist you.
                            </Typography>
                        </div>
                    </div>
                </div>
            </GlobalModal>
        </>
    )
}

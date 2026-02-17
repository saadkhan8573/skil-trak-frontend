import { ReactElement } from 'react'

import {
    Button,
    Card,
    LoadingAnimation,
    TextArea,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { SiteLayout } from '@layouts'
import { SubAdminApi } from '@queries'
import { AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { BiUserCheck, BiUserX } from 'react-icons/bi'
import { CgLock, CgMail } from 'react-icons/cg'
import { FaGraduationCap } from 'react-icons/fa'
import * as Yup from 'yup'
import { WorkplaceCurrentStatus } from '@utils'
import moment from 'moment'

export default function DeclinedRequestPage() {
    const router = useRouter()

    const { notification } = useNotification()

    const [updateStatus, updateStatusResult] =
        SubAdminApi.Workplace.updateWorkplaceIndustryStatusFromEmail()
    const checkIsIndustryPerformedAction =
        SubAdminApi.Workplace.checkIsIndustryPerformedAction(
            {
                wpId: Number(router?.query?.wpid),
                wiId: Number(router?.query?.wiId),
            },
            {
                skip: !router?.query?.wpid,
            }
        )

    const validationSchema = Yup.object({
        comment: Yup.string().required('Comment is required!'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = async (values: any) => {
        const res: any = await updateStatus({
            id: Number(router?.query?.wpid),
            status: 'decline',
            ...values,
        })

        if (res?.data) {
            notification.success({
                title: 'Comment Added',
                description: 'Comment Added Successfully',
            })
            router.push('/')
        }
    }

    const comments = methods.watch('comment')

    const isRejected =
        checkIsIndustryPerformedAction?.data?.industries[0]
            ?.industryResponse === 'rejected'

    return (
        <div>
            {checkIsIndustryPerformedAction?.isLoading ? (
                <LoadingAnimation />
            ) : checkIsIndustryPerformedAction?.isSuccess &&
                checkIsIndustryPerformedAction?.data &&
                checkIsIndustryPerformedAction?.data?.currentStatus !==
                WorkplaceCurrentStatus?.AwaitingWorkplaceResponse ? (
                <div
                    className="max-w-5xl mx-auto py-10 flex items-center justify-center p-4"
                    style={{ backgroundColor: '#f8fafc' }}
                >
                    <Card>
                        {/* SkillTrak Header */}
                        <div
                            className="w-full h-16 flex items-center px-6 mb-6 rounded-t-lg"
                            style={{ backgroundColor: '#044866' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-orange-400 flex items-center justify-center">
                                    <FaGraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-white">
                                    <div className="font-semibold">
                                        SkillTrak
                                    </div>
                                    <div className="text-xs opacity-90">
                                        Where Smart Career Happens
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pb-4">
                            <div
                                className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: !isRejected
                                        ? '#10B981'
                                        : '#EF4444',
                                }}
                            >
                                {!isRejected ? (
                                    <BiUserCheck className="w-8 h-8 text-white" />
                                ) : (
                                    <BiUserX className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div
                                className="text-xl"
                                style={{ color: '#044866' }}
                            >
                                Action {!isRejected ? 'Accepted' : 'Declined'}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Action Status */}
                            <div className="text-center space-y-2">
                                <p className="text-gray-600">
                                    You have already{' '}
                                    <strong
                                        style={{
                                            color: !isRejected
                                                ? '#10B981'
                                                : '#EF4444',
                                        }}
                                    >
                                        {isRejected ? 'rejected' : 'accepted'}
                                    </strong>{' '}
                                    this request.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <CgLock className="w-4 h-4" />
                                    <span>
                                        Action taken{' '}
                                        {moment(
                                            checkIsIndustryPerformedAction?.data
                                                ?.industries[0]
                                                ?.industryResponseDate
                                        ).fromNow()}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Support */}
                            <div className="pt-4 border-t border-gray-100 text-center">
                                <Button
                                    Icon={CgMail}
                                    variant="dark"
                                    outline
                                    text="Contact SkillTrak Support"
                                    onClick={() => {
                                        router.push('/contact-us')
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="min-h-screen bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="max-w-2xl mx-auto space-y-5">
                            {/* Header */}
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <Typography variant="label" medium>
                                    Pending Decline
                                </Typography>
                                <div className="w-16 h-0.5 bg-red-500 mx-auto"></div>
                            </div>

                            {/* Main Card */}
                            <Card border borderColor="border-black">
                                <div className="space-y-5">
                                    {/* Status Message */}
                                    <div className="text-center p-6 bg-red-500 text-white rounded-lg">
                                        <AlertTriangle className="w-6 h-6 mx-auto mb-3" />
                                        <Typography
                                            variant="label"
                                            color="text-white"
                                        >
                                            We're ready to decline your request,
                                            but we need your feedback first.
                                            Please provide comments below to
                                            complete the process.
                                        </Typography>
                                    </div>

                                    {/* Required Feedback Section */}
                                    <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="w-5 h-5 text-red-500" />
                                            <h3 className="text-black">
                                                Comments Required to Proceed
                                            </h3>
                                        </div>
                                        <Typography
                                            variant="label"
                                            color="text-gray-700"
                                            normal
                                        >
                                            Before we can complete the decline
                                            process, we need to hear from you.
                                            Your feedback helps us improve and
                                            ensures we understand your
                                            experience.
                                        </Typography>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-black flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5" />
                                            Your Comments *
                                        </h3>

                                        {!updateStatusResult?.isSuccess ? (
                                            <FormProvider {...methods}>
                                                <form
                                                    className="mt-2 w-full"
                                                    onSubmit={methods.handleSubmit(
                                                        onSubmit
                                                    )}
                                                >
                                                    <div>
                                                        <TextArea
                                                            label={'Comments'}
                                                            id="comments"
                                                            name="comment"
                                                            placeholder="This field is required. Please share your thoughts, questions, or any additional information about this decision..."
                                                            required
                                                            rows={4}
                                                        />

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500">
                                                                {comments?.length ||
                                                                    0}
                                                                /1000 characters
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <Button
                                                            submit
                                                            loading={
                                                                updateStatusResult.isLoading
                                                            }
                                                            disabled={
                                                                !comments?.trim() ||
                                                                updateStatusResult.isLoading
                                                            }
                                                            variant="primaryNew"
                                                            text={
                                                                comments?.trim()
                                                                    ? 'Complete Decline Process'
                                                                    : ' Comments Required to Proceed'
                                                            }
                                                            Icon={
                                                                comments?.trim()
                                                                    ? (CheckCircle2 as any)
                                                                    : (AlertTriangle as any)
                                                            }
                                                        />

                                                        <Button
                                                            variant="action"
                                                            outline
                                                            onClick={() => {
                                                                methods.reset()
                                                            }}
                                                        >
                                                            Clear
                                                        </Button>
                                                    </div>
                                                </form>
                                            </FormProvider>
                                        ) : (
                                            <div className="text-center p-6 bg-green-50 rounded border border-green-200">
                                                <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-green-600" />
                                                <h3 className="text-black mb-2">
                                                    Request Decline Complete
                                                </h3>
                                                <p className="text-gray-700">
                                                    Thank you for your feedback.
                                                    Your request has now been
                                                    declined and your comments
                                                    have been received by our
                                                    team.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Support Contact - only show if not submitted */}
                                    {!updateStatusResult?.isSuccess && (
                                        <div className="text-center pt-4 border-t">
                                            <p className="text-gray-600 mb-3">
                                                Need help before we proceed with
                                                the decline?
                                            </p>
                                            <Button
                                                outline
                                                onClick={() =>
                                                    window.open(
                                                        'tel:0393636378'
                                                    )
                                                }
                                            >
                                                📞 Call Support: 0393636378
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

DeclinedRequestPage.getLayout = (page: ReactElement) => {
    return <SiteLayout>{page}</SiteLayout>
}

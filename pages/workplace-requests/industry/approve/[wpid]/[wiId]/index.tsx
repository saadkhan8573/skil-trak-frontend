import moment from 'moment'
import { SiteLayout } from '@layouts'
import { SubAdminApi } from '@queries'
import { ReactElement, useEffect, useState } from 'react'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'
import { WorkplaceCurrentStatus } from '@utils'
import { CgLock, CgMail } from 'react-icons/cg'
import { FaGraduationCap } from 'react-icons/fa'
import { BiUserCheck, BiUserX } from 'react-icons/bi'
import { Button, Card, LoadingAnimation, TechnicalError } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { InterviewAvailability } from '@partials/rto-v2/industry-detail/components/ProfileEssentials/components/InterviewAvailability'
import { useAppDispatch } from '@redux/hooks'
import { setIndustryDetail } from '@redux/slice/industry.slice'

const ApproveRequestPage = () => {
    const router = useRouter()
    const { notification } = useNotification()
    const dispatch = useAppDispatch()
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)

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

    const approveRequest = SubAdminApi.Workplace.approveStudentFromIndustry(
        {
            wpr: Number(router?.query?.wpid),
            wiId: Number(router?.query?.wiId),
            status: 'accept',
        },
        {
            skip:
                !router?.query?.wpid ||
                checkIsIndustryPerformedAction?.data?.industries[0]
                    ?.industryResponse,
        }
    )

    useEffect(() => {
        if (approveRequest?.isError) {
            const errorData = (approveRequest?.error as any)?.data
            const errorMessage = errorData?.message

            if (
                errorMessage?.includes('No interview availability found') ||
                errorData?.type === 'INTERVIEW_AVAILABILITY_MISSING'
            ) {
                // Set industry detail in Redux before opening modal
                const industryData =
                    checkIsIndustryPerformedAction?.data?.industries?.[0]
                        ?.industry
                if (industryData) {
                    dispatch(setIndustryDetail(industryData))
                }
                setShowAvailabilityModal(true)
                return
            }

            notification.error({
                title: 'Action Failed',
                description: errorMessage || 'Something went wrong',
            })
        }
    }, [
        approveRequest?.isError,
        approveRequest?.error,
        checkIsIndustryPerformedAction?.data,
    ])

    const industryResponsed =
        checkIsIndustryPerformedAction?.data?.industries[0]?.industryResponse

    const isRejected =
        checkIsIndustryPerformedAction?.data?.industries[0]
            ?.industryResponse === 'rejected'

    return (
        <div>
            {checkIsIndustryPerformedAction?.isLoading ||
                approveRequest?.isLoading ? (
                <LoadingAnimation />
            ) : approveRequest?.isError ? (
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
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-red-500">
                                <BiUserX className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-xl text-red-600 font-semibold">
                                Action Failed
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center space-y-2 px-6">
                                <p className="text-gray-600">
                                    {(approveRequest?.error as any)?.data
                                        ?.message ||
                                        (approveRequest?.error as any)?.data
                                            ?.messaage ||
                                        'Something went wrong'}
                                </p>
                            </div>

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
            ) : checkIsIndustryPerformedAction?.isSuccess &&
                checkIsIndustryPerformedAction?.data &&
                checkIsIndustryPerformedAction?.data?.currentStatus !==
                WorkplaceCurrentStatus?.AwaitingWorkplaceResponse &&
                industryResponsed ? (
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
                                    backgroundColor: '#10B981',
                                }}
                            >
                                <BiUserCheck className="w-8 h-8 text-white" />
                            </div>
                            <div
                                className="text-xl"
                                style={{ color: '#044866' }}
                            >
                                Action Accepted
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Action Status */}
                            <div className="text-center space-y-2">
                                <p className="text-gray-600">
                                    You have already{' '}
                                    <strong
                                        style={{
                                            color: '#10B981',
                                        }}
                                    >
                                        accepted
                                    </strong>{' '}
                                    this request.
                                </p>
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
            )}
            <Dialog
                open={showAvailabilityModal}
                onOpenChange={setShowAvailabilityModal}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] bg-[#F8FAFC] border-none shadow-2xl p-0 flex flex-col">
                    <DialogHeader className="bg-primaryNew p-6 border-b border-white/10 rounded-t-lg shrink-0">
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                            <FaGraduationCap className="w-6 h-6 opacity-80" />
                            Setup Interview Availability
                        </DialogTitle>
                        <p className="text-white/70 text-sm mt-1">
                            Please set up interview availability to proceed with
                            approval
                        </p>
                    </DialogHeader>

                    <div className="p-6 overflow-y-auto flex-1">
                        <InterviewAvailability
                            isTemporary
                            workplaceId={Number(router?.query?.wpid)}
                            onSuccess={() => {
                                setShowAvailabilityModal(false)
                                approveRequest.refetch()
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApproveRequestPage

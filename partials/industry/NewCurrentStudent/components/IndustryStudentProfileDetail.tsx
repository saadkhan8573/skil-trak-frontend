import {
    Button,
    Card,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { DeclineStudentByIndustryModal } from '@partials/common/StudentProfileDetail/components'
import {
    Avatar,
    RtoDetail,
    UpdatedStudentExpiryTime,
} from '@partials/common/StudentProfileDetail/ContextBarComponents'
import { ApproveRequestModal } from '@partials/sub-admin/workplace/modals'
import { useWorkplaceActionsMutation } from '@queries'
import { UserStatus } from '@types'
import {
    WorkplaceCurrentStatus,
    getStudentWorkplaceAppliedIndustry,
} from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import {
    EmergencyContact,
    StudentDetail,
    StudentFeedBack,
    StudentRelatedInfo,
    StudentReport,
    StudentStatus,
} from '../ContextBarComponents'

export const IndustryStudentProfileDetail = ({ data }: { data: any }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const router = useRouter()

    const profile = data?.data
    const { notification } = useNotification()

    const industry = getStudentWorkplaceAppliedIndustry(profile?.industries)

    const [workplaceActions, workplaceActionsResult] =
        useWorkplaceActionsMutation()

    const onModalCancelClicked = () => setModal(null)

    const onApproveModal = () => {
        setModal(
            <ApproveRequestModal
                workplaceId={Number(router.query.id)}
                onCancel={onModalCancelClicked}
            />
        )
    }
    const onRejectModal = () => {
        setModal(
            <DeclineStudentByIndustryModal
                workplaceId={Number(router.query.id)}
                onCancel={onModalCancelClicked}
            />
        )
    }

    return (
        <Card noPadding>
            {modal}
            <ShowErrorNotifications result={workplaceActionsResult} />
            {data.isError && <NoData text={'Someting Went wrong....'} />}
            {data?.isLoading || data.isFetching ? (
                <LoadingAnimation />
            ) : (
                <div className="flex gap-x-5 w-full justify-between items-center px-4">
                    <div className="flex flex-col gap-y-2 justify-center items-center">
                        <div className="">
                            <Avatar
                                avatar={profile?.student?.user?.avatar}
                                name={profile?.student?.user?.name}
                            />
                        </div>
                        <div className="text-center">
                            <Typography semibold>
                                <span className="text-[15px]">
                                    {profile?.student?.user?.name}
                                </span>
                            </Typography>
                            {profile?.industries?.[0]
                                ?.awaitingAgreementSigned && (
                                <Typography variant="xs" color="text-[#6B7280]">
                                    {profile?.student?.user?.email}
                                </Typography>
                            )}
                        </div>
                        <div className="w-full">
                            <UpdatedStudentExpiryTime
                                studentId={profile?.student?.user?.id}
                                date={profile?.student?.expiryDate}
                                oldExpiry={profile?.student?.oldExpiry}
                            />
                        </div>
                    </div>
                    <div className="h-64 w-px bg-gray-300"></div>
                    <StudentDetail profile={profile} />
                    <div className="h-64 w-px bg-gray-300"></div>

                    <div className="flex flex-col gap-y-4">
                        <StudentRelatedInfo profile={profile} />
                        <EmergencyContact profile={profile} />
                    </div>
                    <div className="h-64 w-px bg-gray-300"></div>

                    <RtoDetail rto={profile?.student?.rto} />
                    <div className="h-64 w-px bg-gray-300"></div>

                    <div>
                        {(industry?.awaitingAgreementSigned ||
                            industry?.AgreementSigned) && (
                            <div className="py-3">
                                <StudentStatus
                                    industry={industry}
                                    student={profile?.student}
                                    currentStatus={profile?.currentStatus}
                                />
                            </div>
                        )}

                        {(industry?.awaitingAgreementSigned ||
                            industry?.AgreementSigned) && (
                            <div className="py-5 flex flex-col items-center gap-y-2 border-t border-secondary-dark">
                                <StudentFeedBack workplace={profile} />
                                <StudentReport workplace={profile} />
                            </div>
                        )}
                        {[
                            WorkplaceCurrentStatus.AppointmentBooked,
                            WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
                        ]?.includes(profile?.currentStatus) ? (
                            <div className="flex items-center gap-x-2">
                                <Button
                                    variant={'secondary'}
                                    onClick={() => {
                                        onApproveModal()
                                    }}
                                >
                                    <span className="text-success">
                                        Approve
                                    </span>
                                </Button>
                                <Button
                                    variant={'secondary'}
                                    onClick={() => {
                                        // setActionStatus(UserStatus.Rejected)
                                        // updateStatus({
                                        //     id: Number(workplace?.id),
                                        //     status: 'decline',
                                        // })
                                        onRejectModal()
                                    }}
                                >
                                    <span className="text-error">Decline</span>
                                </Button>
                                {/* <Button
                                text={'NOT RESPONDED'}
                                variant={'dark'}
                                onClick={() => {
                                    industryResponse({
                                        industryId: appliedIndustry?.id,
                                        status: 'noResponse',
                                    })
                                }}
                                loading={industryResponseResult?.isLoading}
                                disabled={industryResponseResult?.isLoading}
                            /> */}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </Card>
    )
}

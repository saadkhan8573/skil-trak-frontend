import { ReactElement, useEffect, useState } from 'react'

// components
import { ShowErrorNotifications, Typography } from '@components'
import { AfterPlacementActions } from '@partials/sub-admin/workplace/components/Industries/components/Actions/components'

// query
import { Button } from '@components/buttons'
import { useNotification } from '@hooks'
import { SignAgreement } from '@partials/sub-admin/workplace/components/Industries/components/Actions/components'
import {
    ApproveRequestModal,
    PlacementStartedModal,
} from '@partials/sub-admin/workplace/modals'
import { StudentProvidedForwardModal } from '@partials/sub-admin/workplace/modals/StudentProvidedForwardModal'
import {
    useChangeCustomIndustryStatusMutation,
    useIndustryResponseMutation,
    useUpdateWorkplaceStatusMutation,
} from '@queries'
import { Course, Student, UserStatus } from '@types'
import { WorkplaceCurrentStatus, userStatus } from '@utils'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'

export const ByAbnActions = ({
    appliedIndustry,
    workplaceId,
    workplace,
    folders,
    student,
}: {
    appliedIndustry: WorkplaceWorkIndustriesType
    workplaceId: number
    workplace: IWorkplaceIndustries
    folders: any
    student: Student
}) => {
    const [actionStatus, setActionStatus] = useState<any | string>('')
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [changeCustomIndustryStatus, changeCustomIndustryStatusResult] =
        useChangeCustomIndustryStatusMutation()
    const [industryResponse, industryResponseResult] =
        useIndustryResponseMutation()

    const [updateStatus, updateStatusResult] =
        useUpdateWorkplaceStatusMutation()

    // hooks
    const { notification } = useNotification()

    useEffect(() => {
        if (updateStatusResult.isSuccess) {
            notification.success({
                title: `Workplace ${actionStatus}`,
                description: `Workplace ${actionStatus} Successfully`,
            })
        }
        if (changeCustomIndustryStatusResult.isSuccess) {
            notification.success({
                title: `Industry ${actionStatus}`,
                description: `Industry ${actionStatus} Successfully`,
            })
        }
    }, [updateStatusResult, changeCustomIndustryStatusResult])

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onForwardClicked = (industry: any) => {
        setModal(
            <StudentProvidedForwardModal
                industry={industry}
                workplaceId={workplaceId}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onPlacementStartedClicked = (id: number) => {
        setModal(
            <PlacementStartedModal
                id={id}
                agreementSigned={appliedIndustry?.AgreementSigned}
                student={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onApproveModal = () => {
        setModal(
            <ApproveRequestModal
                workplaceId={workplaceId}
                onCancel={onModalCancelClicked}
            />
        )
    }

    return (
        <div className="mt-1.5 mb-2.5">
            {modal && modal}
            <ShowErrorNotifications result={updateStatusResult} />
            <ShowErrorNotifications result={industryResponseResult} />
            <ShowErrorNotifications result={changeCustomIndustryStatusResult} />

            {workplace?.byExistingAbn &&
                workplace?.approvalStatus === UserStatus.Pending && (
                    <Button
                        text={'Forward to industry'}
                        onClick={() => {
                            if (workplace?.assignedTo) {
                                onForwardClicked(appliedIndustry)
                            } else {
                                notification.error({
                                    title: 'Assign workplace',
                                    description:
                                        'You need to assign workplace before forward to industry',
                                })
                            }
                        }}
                    />
                )}

            {workplace?.industryStatus === UserStatus.Pending ? (
                <div className="flex items-center gap-x-2">
                    <Button
                        text={'Approve Industry'}
                        onClick={() => {
                            setActionStatus(userStatus.APPROVED)
                            if (workplace?.assignedTo) {
                                changeCustomIndustryStatus({
                                    industryId:
                                        appliedIndustry?.industry?.user?.id,
                                    workplaceId,
                                    status: userStatus.APPROVED,
                                })
                            } else {
                                notification.error({
                                    title: 'Changing Status Failed',
                                    description:
                                        'You can,t change the status without assigning Workplace',
                                })
                            }
                        }}
                        loading={changeCustomIndustryStatusResult.isLoading}
                        disabled={changeCustomIndustryStatusResult.isLoading}
                    />
                    <Button
                        text={'Reject Industry'}
                        variant={'dark'}
                        onClick={() => {
                            setActionStatus(userStatus.REJECTED)
                            if (workplace?.assignedTo) {
                                changeCustomIndustryStatus({
                                    industryId:
                                        appliedIndustry?.industry?.user?.id,
                                    workplaceId,
                                    status: userStatus.REJECTED,
                                })
                            } else {
                                notification.error({
                                    title: 'Changing Status Failed',
                                    description:
                                        'You can,t change the status without assigning Workplace',
                                })
                            }
                        }}
                        loading={changeCustomIndustryStatusResult.isLoading}
                        disabled={changeCustomIndustryStatusResult.isLoading}
                    />
                </div>
            ) : null}

            {workplace?.industryStatus === UserStatus.Approved &&
                workplace?.approvalStatus === UserStatus.Approved ? (
                <div className="flex items-center gap-x-2">
                    {!appliedIndustry?.AgreementSigned &&
                        appliedIndustry?.awaitingAgreementSigned && (
                            <div>
                                {/* <SignAgreement
                                student={workplace?.student}
                                studentId={workplace?.student?.id}
                                appliedIndustryId={appliedIndustry?.id}
                                course={workplace?.courses[0]}
                            /> */}
                                <SignAgreement
                                    studentId={Number(workplace?.student?.id)}
                                    appliedIndustryId={appliedIndustry?.id}
                                    student={student}
                                    courses={workplace?.courses as Course[]}
                                />
                            </div>
                        )}
                    {!appliedIndustry?.placementStarted &&
                        appliedIndustry?.awaitingAgreementSigned && (
                            <div className="shrink-0">
                                <Button
                                    text={'START PLACEMENT'}
                                    variant={'primary'}
                                    onClick={() => {
                                        onPlacementStartedClicked(
                                            Number(appliedIndustry?.id)
                                        )
                                    }}
                                />
                            </div>
                        )}
                    {appliedIndustry?.placementStarted &&
                        !appliedIndustry?.isCompleted &&
                        !appliedIndustry?.cancelled &&
                        !appliedIndustry?.terminated && (
                            <AfterPlacementActions
                                appliedIndustry={appliedIndustry}
                            />
                        )}
                </div>
            ) : null}
            <div className="mt-2">
                {(appliedIndustry?.isCompleted ||
                    appliedIndustry?.cancelled ||
                    appliedIndustry?.terminated) && (
                        <Typography variant={'small'} color={'text-gray-700'}>
                            Status of student placement
                        </Typography>
                    )}
                {appliedIndustry?.isCompleted && (
                    <Button
                        submit
                        variant={'success'}
                        text={
                            'This Placement was COMPLETED by Sub-Admin/Industry'
                        }
                    />
                )}

                {appliedIndustry?.cancelled && (
                    <Button submit variant={'secondary'}>
                        <span className="text-red-800">
                            This Placement was CANCELLED by Sub-Admin/Industry
                        </span>
                    </Button>
                )}

                {appliedIndustry?.terminated && (
                    <Button
                        submit
                        variant={'error'}
                        text={
                            'This Placement was TERMINATED by Sub-Admin/Industry'
                        }
                    />
                )}

                {workplace?.currentStatus ===
                    WorkplaceCurrentStatus.AwaitingWorkplaceResponse && (
                        <div className="flex items-center gap-x-2">
                            <Button
                                variant={'secondary'}
                                onClick={() => {
                                    onApproveModal()
                                }}
                                loading={
                                    updateStatusResult?.isLoading &&
                                    actionStatus === userStatus.APPROVED
                                }
                                disabled={
                                    updateStatusResult?.isLoading &&
                                    actionStatus === userStatus.APPROVED
                                }
                            >
                                <span className="text-success">Approve</span>
                            </Button>
                        </div>
                    )}
            </div>
        </div>
    )
}

import { useEffect, useState, ReactElement } from 'react'
import moment from 'moment'

// components
import { Typography, ShowErrorNotifications } from '@components'
import { AfterPlacementActions } from './components'

// query
import {
    useAgrementSignMutation,
    useStartPlacementMutation,
    useIndustryResponseMutation,
    useUpdateWorkplaceStatusMutation,
    useForwardWorkplaceToIndustryMutation,
} from '@queries'
import { Button } from '@components/buttons'
import { useNotification } from '@hooks'
import { userStatus } from '@utils'
import {
    ApproveRequestModal,
    ForwardModal,
    PlacementStartedModal,
} from '@partials/sub-admin/workplace/modals'
import { SignAgreement } from './components'
import { useRouter } from 'next/router'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'
import { Course, Folder, Student } from '@types'

export const Actions = ({
    appliedIndustry,
    workplaceId,
    workplace,
    folders,
    student,
}: {
    appliedIndustry: WorkplaceWorkIndustriesType
    workplaceId: number
    workplace: IWorkplaceIndustries
    folders: Folder
    student: Student
}) => {
    const router = useRouter()

    const [actionStatus, setActionStatus] = useState<any | string>('')
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [industryResponse, industryResponseResult] =
        useIndustryResponseMutation()

    const [startPlacement, startPlacementResult] = useStartPlacementMutation()
    const [updateStatus, updateStatusResult] =
        useUpdateWorkplaceStatusMutation()

    // hooks
    const { notification } = useNotification()

    const [agrementSign, agrementSignResult] = useAgrementSignMutation()

    useEffect(() => {
        if (updateStatusResult.isSuccess) {
            notification.success({
                title: `Workplace ${actionStatus}`,
                description: `Workplace ${actionStatus} Successfully`,
            })
        }
        if (startPlacementResult.isSuccess) {
            notification.success({
                title: `Placement Started`,
                description: `WPlacement Started Successfully`,
            })
        }
        if (industryResponseResult?.isSuccess) {
            notification.success({
                title: 'Industry Not Responded',
                description: 'Industry Not Responded Successfully',
            })
        }
    }, [updateStatusResult, startPlacementResult, industryResponseResult])

    const onModalCancelClicked = () => {
        setModal(null)
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

    const onForwardClicked = (industry: any) => {
        setModal(
            <ForwardModal
                industry={industry}
                workplaceId={workplaceId}
                folders={folders}
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
            {modal}
            <ShowErrorNotifications result={updateStatusResult} />
            <ShowErrorNotifications result={startPlacementResult} />
            <ShowErrorNotifications result={industryResponseResult} />

            {appliedIndustry?.industryResponse === 'approved' ? (
                <>
                    {!appliedIndustry.placementStarted && (
                        <div className="flex flex-col gap-y-1 justify-between">
                            <div className="flex justify-end gap-x-1">
                                <Typography variant={'xs'}>
                                    <span className="text-success bg-secondary px-1">
                                        APPROVED
                                    </span>
                                </Typography>
                                <Typography
                                    variant={'xs'}
                                    color={'text-gray-500'}
                                >
                                    <span className="whitespace-pre">
                                        {moment(
                                            appliedIndustry?.industryResponseDate
                                        ).fromNow()}
                                    </span>
                                </Typography>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="shrink-0">
                                    {!student?.user?.appointmentFor?.length && (
                                        <Button
                                            text={'Book Appointment'}
                                            variant={'info'}
                                            onClick={() => {
                                                router.push({
                                                    pathname:
                                                        '/portals/sub-admin/tasks/appointments/create-appointment',
                                                    query: {
                                                        student:
                                                            student?.user?.id,
                                                    },
                                                })
                                            }}
                                        />
                                    )}
                                </div>
                                {!appliedIndustry?.AgreementSigned && (
                                    <div className="flex">
                                        <SignAgreement
                                            studentId={Number(
                                                workplace?.student?.id
                                            )}
                                            appliedIndustryId={
                                                appliedIndustry?.id
                                            }
                                            student={student}
                                            courses={
                                                workplace?.courses as Course[]
                                            }
                                        />
                                    </div>
                                )}
                                {!appliedIndustry.placementStarted && (
                                    <div className="shrink-0">
                                        <Button
                                            text={'START PLACEMENT'}
                                            variant={'primary'}
                                            onClick={() => {
                                                onPlacementStartedClicked(
                                                    Number(appliedIndustry?.id)
                                                )
                                                // startPlacement(appliedIndustry?.id)
                                            }}
                                            loading={
                                                startPlacementResult.isLoading
                                            }
                                            disabled={
                                                startPlacementResult.isLoading
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Placement Started Message */}
                    {appliedIndustry?.placementStarted && (
                        <Typography variant={'xs'} color={'text-success'}>
                            Placement has successfully started at{' '}
                            {moment(
                                appliedIndustry?.placementStartedDate
                            ).format('Do MMM, YYYY')}
                        </Typography>
                    )}

                    {/* {appliedIndustry?.AgreementSigned &&
                        appliedIndustry?.placementStarted &&
                        !appliedIndustry?.isCompleted &&
                        !appliedIndustry?.cancelled &&
                        !appliedIndustry?.terminated && (
                            )} */}
                    {appliedIndustry?.placementStarted &&
                        !appliedIndustry?.isCompleted &&
                        !appliedIndustry?.cancelled &&
                        !appliedIndustry?.terminated && (
                            <AfterPlacementActions
                                appliedIndustry={appliedIndustry}
                            />
                        )}
                    {/* Result */}
                    <div className="mt-2">
                        {(appliedIndustry?.isCompleted ||
                            appliedIndustry?.cancelled ||
                            appliedIndustry?.terminated) && (
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-700'}
                                >
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
                                    This Placement was CANCELLED by
                                    Sub-Admin/Industry
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
                    </div>
                </>
            ) : appliedIndustry?.industryResponse !== 'noResponse' ? (
                <>
                    {appliedIndustry?.awaitingWorkplaceResponse && (
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
                            <Button
                                variant={'secondary'}
                                onClick={() => {
                                    setActionStatus(userStatus.REJECTED)
                                    updateStatus({
                                        id: Number(appliedIndustry?.id),
                                        response: userStatus.REJECTED,
                                    })
                                }}
                                loading={
                                    updateStatusResult?.isLoading &&
                                    actionStatus === userStatus.REJECTED
                                }
                                disabled={
                                    updateStatusResult?.isLoading &&
                                    actionStatus === userStatus.REJECTED
                                }
                            >
                                <span className="text-error">Reject</span>
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
                    )}

                    {!appliedIndustry?.awaitingWorkplaceResponse &&
                        appliedIndustry?.interview && (
                            <div className="mt-1.5 mb-2.5">
                                <Button
                                    text={'FORWARD TO INDUSTRY'}
                                    variant={'dark'}
                                    onClick={() => {
                                        onForwardClicked(appliedIndustry)
                                    }}
                                />
                            </div>
                        )}
                </>
            ) : null}
        </div>
    )
}

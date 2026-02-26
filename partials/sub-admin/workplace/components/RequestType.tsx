import { useEffect, useState } from 'react'

// Icons
import { IoMdArrowDropdown } from 'react-icons/io'

// components
import { LoadingAnimation, OutsideClickHandler, Typography } from '@components'

// query
import { useNotification } from '@hooks'
import { WorkplaceCurrentStatus } from '@utils'

import {
    CompleteWorkplaceModal,
    ForwardModal,
    InterviewModal,
    MeetingModal,
    PlacementStartedModal,
    TerminateWorkplaceModal,
} from '../modals'
import moment from 'moment'

export const RequestType = ({
    workplace,
    folders,
    appliedIndustry,
    isOpen,
}: {
    workplace: any
    folders?: any
    appliedIndustry: any
    isOpen?: boolean
}) => {
    const [modal, setModal] = useState<any>(null)
    const [visibleRequestType, setVisibleRequestType] = useState(false)
    const [selectedRequestType, setSelectedRequestType] = useState<
        number | null
    >(0)

    const industryResponse = workplace?.industries?.find(
        (wp: any) => wp?.industryResponseDate
    )

    const { notification } = useNotification()

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onForwardClicked = (industry: any) => {
        setModal(
            <ForwardModal
                industry={industry}
                workplaceId={workplace?.id}
                folders={folders}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onPlacementStartedClicked = (id: number) => {
        setModal(
            <PlacementStartedModal
                id={id}
                agreementSigned={appliedIndustry?.AgreementSigned}
                student={workplace?.student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onCompleteClicked = () => {
        setModal(
            <CompleteWorkplaceModal
                appliedIndustryId={appliedIndustry?.id}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onTerminateClicked = () => {
        setModal(
            <TerminateWorkplaceModal
                appliedIndustryId={appliedIndustry?.id}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onInterviewClicked = () => {
        setModal(
            <InterviewModal
                workIndustry={appliedIndustry?.id}
                workplace={workplace?.id}
                onCancel={onModalCancelClicked}
                student={workplace?.student}
            />
        )
    }

    const onMeetingClicked = () => {
        setModal(
            <MeetingModal
                workIndustry={appliedIndustry?.id}
                workplace={workplace?.id}
                onCancel={onModalCancelClicked}
                student={workplace?.student}
            />
        )
    }

    const requestTypeActions = [
        {
            primaryText: 'Industry sourcing',
            secondaryText: 'No Case Officer',
            color: 'text-primary-dark',
            onClick: () => { },
            status: WorkplaceCurrentStatus.Applied,
            date: appliedIndustry?.appliedDate,
        },
        {
            primaryText: 'Industry sourcing',
            secondaryText: 'Case Officer',
            color: 'text-primary',
            onClick: () => { },
            status: WorkplaceCurrentStatus.CaseOfficerAssigned,
            date: appliedIndustry?.caseOfficerAssignedDate,
        },
        {
            primaryText: 'Industry sourcing',
            secondaryText: 'with Case Officer',
            color: 'text-primary-light',
            onClick: (isCleared: (bool: boolean) => void) => {
                isCleared(true)
                onInterviewClicked()
            },
            status: WorkplaceCurrentStatus.Interview,
            date: appliedIndustry?.interviewDate,
        },
        {
            primaryText: 'Meeting',
            secondaryText: 'with Workplace Supervisor (Orientation)',
            color: 'text-info-dark',
            onClick: (isCleared: (bool: boolean) => void) => {
                if (
                    workplace?.currentStatus ===
                    WorkplaceCurrentStatus.Interview
                ) {
                    isCleared(true)
                    onMeetingClicked()
                } else {
                    notification.error({
                        title: 'Take an Interview',
                        description: 'Take an Interview From Student',
                    })
                }
            },
            status: WorkplaceCurrentStatus.AppointmentBooked,
            date: appliedIndustry?.appointmentBookedDate,
        },
        {
            primaryText: 'Waiting',
            secondaryText: 'for Workplace Response',
            color: 'text-info-light',
            onClick: (isCleared: (bool: boolean) => void) => {
                if (appliedIndustry) {
                    if (appliedIndustry?.interview) {
                        onForwardClicked(appliedIndustry)
                        isCleared(true)
                    } else {
                        isCleared(false)
                        notification.error({
                            title: 'Take an Interview',
                            description:
                                'You Must have to take an Interview from student before sending request to industry',
                        })
                    }
                } else {
                    notification.error({
                        title: 'Apply on Industry',
                        description:
                            'Apply on Industry before forwarding request',
                    })
                }
            },
            status: WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
            date: appliedIndustry?.awaitingWorkplaceResponseDate,
        },
        {
            primaryText: 'Agreement & Eligibility ',
            secondaryText: 'Checklist Pending',
            color: 'text-info',
            onClick: (isCleared: (bool: boolean) => void) => {
                isCleared(false)
                if (workplace?.currentStatus === 'awaitingWorkplaceResponse') {
                    notification.info({
                        title: 'Approve or reject the Request',
                        description:
                            'Before uploading agreement you must have to Approve the workplace request',
                    })
                    isCleared(false)
                } else {
                    isCleared(false)
                    notification.error({
                        title: 'Forward the request to Industry',
                        description:
                            'You Must have to Forward the request to Industry before uploading agreement',
                    })
                }
            },
            status: WorkplaceCurrentStatus.AwaitingAgreementSigned,
            date: appliedIndustry?.awaitingAgreementSignedDate,
        },
        {
            primaryText: 'Agreement & Eligibility ',
            secondaryText: 'Checklist Signed',
            color: 'text-success',
            onClick: (isCleared: (bool: boolean) => void) => {
                if (workplace?.currentStatus === 'awaitingAgreementSigned') {
                    notification.info({
                        title: 'Agreement Sign',
                        description:
                            'Now You can upload the agreement file on th workplace which is provided by student or you can request to student to upload the agreement file',
                    })
                    isCleared(false)
                } else {
                    isCleared(false)
                    notification.error({
                        title: 'Approve or reject',
                        description:
                            'You must have to Approve the workplace request',
                    })
                }
            },
            status: WorkplaceCurrentStatus.AgreementSigned,
            date: appliedIndustry?.AgreementSignedDate,
        },
        {
            primaryText: 'Placement Started',
            secondaryText: 'Placement Started',
            color: 'text-success-dark',
            onClick: (isCleared: (bool: boolean) => void) => {
                if (workplace?.currentStatus === 'awaitingAgreementSigned') {
                    onPlacementStartedClicked(Number(appliedIndustry?.id))
                    isCleared(true)
                } else {
                    notification.error({
                        title: 'First Approve the workplace',
                        description:
                            'Placement cannot start without approving the workplace',
                    })
                    isCleared(false)
                }
            },
            status: WorkplaceCurrentStatus.PlacementStarted,
            date: appliedIndustry?.placementStartedDate,
        },
        {
            primaryText: 'Completed',
            secondaryText: 'Completed',
            color: 'text-error',
            onClick: () => {
                onCompleteClicked()
            },
            status: WorkplaceCurrentStatus.Completed,
            date: appliedIndustry?.isCompletedDate,
        },
        {
            primaryText: 'Cancelled',
            secondaryText: 'Cancelled',
            color: 'text-error',
            onClick: () => { },
            status: WorkplaceCurrentStatus.Cancelled,
            date: appliedIndustry?.cancelledDate,
        },
        {
            primaryText: 'Rejected',
            secondaryText: 'Rejected',
            color: 'text-error',
            onClick: () => { },
            status: WorkplaceCurrentStatus.Rejected,
            date: industryResponse?.industryResponseDate,
        },
        {
            primaryText: 'Terminated',
            secondaryText: 'Terminated',
            color: 'text-error',
            onClick: () => {
                onTerminateClicked()
            },
            status: WorkplaceCurrentStatus.Terminated,
            date: appliedIndustry?.terminatedDate,
        },
        {
            primaryText: 'No Response',
            secondaryText: 'No Response',
            color: 'text-error',
            onClick: () => { },
            status: WorkplaceCurrentStatus.NoResponse,
            date: industryResponse?.industryResponseDate,
        },
    ]

    const findStatusIndex = requestTypeActions.findIndex(
        (r) => r.status === workplace.currentStatus
    )

    useEffect(() => {
        if (findStatusIndex) {
            setSelectedRequestType(findStatusIndex)
        }
    }, [findStatusIndex])

    const isLoading = false

    return (
        <div className="relative">
            {modal && modal}

            <OutsideClickHandler
                onOutsideClick={() => {
                    setVisibleRequestType(false)
                }}
            >
                <div
                    className={`border border-dashed border-gray-400 rounded-lg w-56 px-4 py-1 flex items-center justify-between gap-x-1 cursor-pointer relative`}
                    onClick={() => {
                        if (workplace?.assignedTo) {
                            if (
                                !appliedIndustry?.terminated ||
                                !appliedIndustry?.isCompleted ||
                                !appliedIndustry?.cancelled
                            ) {
                                setVisibleRequestType(!visibleRequestType)
                            } else {
                                notification.warning({
                                    title: 'Action cant perform',
                                    description: 'Action cant perform',
                                })
                            }
                        } else {
                            notification.warning({
                                title: 'Assign the workplace',
                                description:
                                    'Assign the workplace before changing status',
                            })
                        }
                    }}
                >
                    {isLoading && (
                        <div className="absolute top-0 left-0 w-full h-full bg-[#00000010]">
                            <LoadingAnimation size={40} />
                        </div>
                    )}

                    <div>
                        <Typography
                            variant={'label'}
                            color={
                                requestTypeActions[selectedRequestType as any]
                                    ?.color
                            }
                        >
                            {
                                requestTypeActions[selectedRequestType as any]
                                    ?.primaryText
                            }
                        </Typography>
                        <Typography variant={'xs'} color={'text-gray-300'}>
                            {
                                requestTypeActions[selectedRequestType as any]
                                    ?.secondaryText
                            }
                        </Typography>
                        {requestTypeActions[selectedRequestType as any]
                            ?.date && (
                                <Typography>
                                    <span className="text-[10px] font-semibold">
                                        {' '}
                                        {moment(
                                            requestTypeActions[
                                                selectedRequestType as any
                                            ]?.date
                                        ).format('Do MMM YYYY')}
                                    </span>
                                </Typography>
                            )}
                    </div>
                    <IoMdArrowDropdown
                        className={`${visibleRequestType ? 'rotate-180' : 'rotate-0'
                            } transition-all`}
                    />
                </div>

                {visibleRequestType && (
                    <div
                        className={`shadow absolute z-10 w-full bg-white rounded-md py-2 mt-1 ${isOpen ? 'h-96' : 'h-32 xl:h-36'
                            } overflow-auto custom-scrollbar`}
                    >
                        {requestTypeActions.map((type, i) => (
                            <div
                                key={`request_type_${i}`}
                                className="pb-2 cursor-pointer hover:bg-gray-100 px-2"
                                onClick={() => {
                                    setVisibleRequestType(false)
                                    if (findStatusIndex < i) {
                                        const isCleared = (clear = true) => {
                                            clear && setSelectedRequestType(i)
                                        }

                                        type.onClick(isCleared)
                                    } else {
                                        notification.error({
                                            title: 'You already performed this action',
                                            description:
                                                'You already performed this action',
                                        })
                                    }
                                }}
                            >
                                <Typography
                                    variant={'label'}
                                    color={type.color}
                                >
                                    {type.primaryText}
                                </Typography>
                                <Typography
                                    variant={'xs'}
                                    color={'text-gray-300'}
                                >
                                    {type.secondaryText}
                                </Typography>
                            </div>
                        ))}
                    </div>
                )}
            </OutsideClickHandler>
        </div>
    )
}

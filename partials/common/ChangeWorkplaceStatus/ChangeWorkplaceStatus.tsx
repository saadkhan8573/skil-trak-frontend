import { useEffect, useState } from 'react'

// Icons
import { IoMdArrowDropdown } from 'react-icons/io'

// components
import { LoadingAnimation, OutsideClickHandler, Typography } from '@components'

// query
import { useNotification } from '@hooks'
import {
    ForwardModal,
    InterviewModal,
    PlacementStartedModal,
    CompleteWorkplaceModal,
    TerminateWorkplaceModal,
} from '@partials/sub-admin/workplace/modals'
import { useGetSubAdminStudentWorkplaceQuery } from '@queries'
import { WorkplaceCurrentStatus } from '@utils'


export const ChangeWorkplaceStatus = ({
    studentId,
    folders,
}: {
    studentId: number | undefined
    folders?: any
}) => {
    const [modal, setModal] = useState<any>(null)
    const [visibleRequestType, setVisibleRequestType] = useState(false)
    const [selectedRequestType, setSelectedRequestType] = useState<
        number | null
    >(0)
    const [currentStatus, setCurrentStatus] = useState<string | null>(null)

    const workplace = useGetSubAdminStudentWorkplaceQuery(Number(studentId), {
        skip: !studentId,
    })

    useEffect(() => {
        if (workplace.isSuccess && workplace.data) {
            setCurrentStatus(workplace.data[0]?.currentStatus)
        }
    }, [workplace])

    const appliedIndustry =
        workplace?.data && workplace?.data?.length > 0
            ? workplace?.data[0]?.industries?.find(
                (industry: any) => industry?.applied
            )
            : {}

    const { notification } = useNotification()

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onInterviewClicked = () => {
        setModal(
            <InterviewModal
                workIndustry={appliedIndustry?.id}
                workplace={workplace?.data[0]?.id}
                onCancel={onModalCancelClicked}
                student={workplace?.data[0]?.student}
            />
        )
    }

    const onForwardClicked = (industry: any) => {
        setModal(
            <ForwardModal
                industry={industry}
                workplaceId={workplace?.data[0]?.id}
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
                student={workplace?.data?.student}
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

    const requestTypeActions = [
        {
            primaryText: 'Request Sent',
            secondaryText: 'No Case Officer',
            color: 'text-primary-dark',
            onClick: () => { },
            status: 'applied',
        },
        {
            primaryText: 'Assigned',
            secondaryText: 'Case Officer',
            color: 'text-primary',
            onClick: () => { },
            status: 'caseOfficerAssigned',
        },
        {
            primaryText: 'Interview',
            secondaryText: 'with Case Officer',
            color: 'text-primary-light',
            onClick: (isCleared: any) => {
                isCleared(true)
                onInterviewClicked()
            },
            status: 'interview',
        },
        {
            primaryText: 'Waiting For Student',
            secondaryText: 'Waiting For Student',
            color: 'text-primary-light',
            onClick: (isCleared: any) => {
                isCleared(true)
            },
            status: WorkplaceCurrentStatus.AwaitingStudentResponse,
        },

        {
            primaryText: 'Meeting',
            secondaryText: 'with Workplace Supervisor (Orientation)',
            color: 'text-info-dark',
            onClick: () => { },
            status: 'appointmentBooked',
        },
        // {
        //     primaryText: 'Waiting',
        //     secondaryText: 'for Workplace Response',
        //     color: 'text-info-light',
        //     onClick: (isCleared: any) => {
        //         const WPStatus = [
        //             WorkplaceCurrentStatus.Applied,
        //             WorkplaceCurrentStatus.AppointmentBooked,
        //             WorkplaceCurrentStatus.Interview,
        //             WorkplaceCurrentStatus.CaseOfficerAssigned,
        //         ]
        //         if (WPStatus.includes(workplace?.data[0]?.currentStatus)) {
        //             onForwardClicked(appliedIndustry)
        //             isCleared(true)
        //         } else {
        //             isCleared(false)
        //             notification.error({
        //                 title: 'Take an Interview',
        //                 description:
        //                     'You Must have to take an Interview from student before sending request to industry',
        //             })
        //         }
        //     },
        //     status: 'awaitingWorkplaceResponse',
        // },
        {
            primaryText: 'Agreement & Eligibility ',
            secondaryText: 'Checklist Pending',
            color: 'text-info',
            onClick: (isCleared: any) => {
                notification.info({
                    title: 'Upload the Agreement',
                    description: 'Upload the Agreement from workplace',
                })
                isCleared(false)
            },
            status: 'awaitingAgreementSigned',
        },
        {
            primaryText: 'Agreement & Eligibility ',
            secondaryText: 'Checklist Signed',
            color: 'text-success',
            onClick: (isCleared: any) => {
                notification.info({
                    title: 'Upload the Agreement',
                    description: 'Upload the Agreement from workplace',
                })
                isCleared(false)
            },
            status: 'AgreementSigned',
        },
        {
            primaryText: 'Placement Started',
            secondaryText: 'Placement Started',
            color: 'text-success-dark',
            onClick: (isCleared: any) => {
                if (
                    currentStatus === 'awaitingAgreementSigned' ||
                    currentStatus === 'AgreementSigned' ||
                    currentStatus === 'appointmentBooked' ||
                    currentStatus === 'awaitingWorkplaceResponse'
                ) {
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
            status: 'placementStarted',
        },
        {
            primaryText: 'Completed',
            secondaryText: 'Completed',
            color: 'text-error',
            onClick: () => {
                onCompleteClicked()
            },
            status: 'completed',
        },
        {
            primaryText: 'Cancelled',
            secondaryText: 'Cancelled',
            color: 'text-error',
            onClick: () => { },
            status: 'cancelled',
        },
        {
            primaryText: 'Rejected',
            secondaryText: 'Rejected',
            color: 'text-error',
            onClick: () => { },
            status: 'rejected',
        },
        {
            primaryText: 'Terminated',
            secondaryText: 'Terminated',
            color: 'text-error',
            onClick: () => {
                onTerminateClicked()
            },
            status: 'terminated',
        },
    ]

    // const findStatusIndex = requestTypeActions.findIndex((r) => {
    //     return r.status === workplace?.data && workplace?.data?.length > 0
    //         ? workplace?.data[0]?.currentStatus
    //         : ''
    // })

    const findStatusIndex = requestTypeActions.findIndex((r) => {
        return r.status == currentStatus
    })
    useEffect(() => {
        if (currentStatus) {
            if (appliedIndustry?.industryResponse === 'rejected') {
                setSelectedRequestType(requestTypeActions.length - 1)
            } else {
                setSelectedRequestType(findStatusIndex)
            }
        }
    }, [appliedIndustry, workplace, currentStatus])

    const isLoading = workplace.isLoading

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
                    </div>
                    <IoMdArrowDropdown
                        className={`${visibleRequestType ? 'rotate-180' : 'rotate-0'
                            } transition-all`}
                    />
                </div>

                {visibleRequestType && (
                    <div className="h-96 overflow-auto custom-scrollbar shadow absolute z-10 w-full bg-white rounded-md py-2 mt-1">
                        {requestTypeActions.map((type, i) => (
                            <div
                                key={`request_type_${i}`}
                                className="pb-2 cursor-pointer hover:bg-gray-100 px-2"
                                onClick={() => {
                                    setSelectedRequestType(i)
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

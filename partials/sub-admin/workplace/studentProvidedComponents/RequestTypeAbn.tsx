import { useEffect, useState } from 'react'

// Icons
import { IoMdArrowDropdown } from 'react-icons/io'

// components
import { OutsideClickHandler, Typography } from '@components'

// query
import { useNotification } from '@hooks'
import { UserStatus } from '@types'

import {
    ApproveRequestModal,
    CompleteWorkplaceModal,
    PlacementStartedModal,
    TerminateWorkplaceModal,
} from '../modals'
import { StudentProvidedForwardModal } from '../modals/StudentProvidedForwardModal'
import { WorkplaceCurrentStatus } from '@utils'
import moment from 'moment'

export type isClearedFunctionType = (e: boolean) => void

export const RequestTypeAbn = ({
    appliedIndustry,
    workplace,
    isOpen,
}: {
    appliedIndustry: any
    workplace: any
    isOpen: boolean
}) => {
    const [visibleRequestType, setVisibleRequestType] = useState(false)
    const [selectedRequestType, setSelectedRequestType] = useState<
        number | null
    >(0)
    const [modal, setModal] = useState<any>(null)

    const { notification } = useNotification()

    const onModalCancelClicked = () => {
        setModal(null)
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

    const onForwardClicked = (industry: any) => {
        setModal(
            <StudentProvidedForwardModal
                industry={industry}
                workplaceId={workplace?.id}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onApproveModal = () => {
        setModal(
            <ApproveRequestModal
                workplaceId={workplace?.id}
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
            date: appliedIndustry?.appliedDate,
        },
        {
            primaryText: 'Assigned',
            secondaryText: 'Case Officer',
            color: 'text-primary',
            onClick: () => { },
            status: 'caseOfficerAssigned',
            date: appliedIndustry?.caseOfficerAssignedDate,
        },
        {
            primaryText: 'Waiting',
            secondaryText: 'for Workplace Response',
            color: 'text-info-light',
            onClick: (isCleared: isClearedFunctionType) => {
                if (
                    workplace?.assignedTo &&
                    workplace?.industryStatus === UserStatus.Approved
                ) {
                    onForwardClicked(appliedIndustry)
                    isCleared(true)
                } else {
                    notification.warning({
                        title: 'Industry Not Approved',
                        description: 'Approve the Industry before Forward',
                    })
                }
            },
            status: 'awaitingWorkplaceResponse',
            date: appliedIndustry?.awaitingWorkplaceResponseDate,
        },
        {
            primaryText: 'Agreement & Eligibility ',
            secondaryText: 'Checklist Pending',
            color: 'text-info',
            onClick: (isCleared: isClearedFunctionType) => {
                isCleared(false)
                if (
                    workplace?.currentStatus ===
                    WorkplaceCurrentStatus.AwaitingWorkplaceResponse
                ) {
                    onApproveModal()
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
            status: 'awaitingAgreementSigned',
            date: appliedIndustry?.awaitingAgreementSignedDate,
        },
        {
            primaryText: 'Agreement & Eligibility ',
            secondaryText: 'Checklist Signed',
            color: 'text-success',
            onClick: (isCleared: isClearedFunctionType) => {
                if (workplace?.currentStatus === 'awaitingAgreementSigned') {
                    notification.info({
                        title: 'Upload Agrement',
                        description:
                            'Upload Agrement on clicking sign agreement button',
                    })
                    isCleared(false)
                } else {
                    isCleared(false)
                    notification.info({
                        title: 'Upload Agrement',
                        description:
                            'Upload Agrement on clicking sign agreement button',
                    })
                }
            },
            status: 'AgreementSigned',
            date: appliedIndustry?.AgreementSignedDate,
        },
        {
            primaryText: 'Placement Started',
            secondaryText: 'Placement Started',
            color: 'text-success-dark',
            onClick: (isCleared: isClearedFunctionType) => {
                if (
                    workplace?.currentStatus === 'awaitingWorkplaceResponse' ||
                    workplace?.currentStatus === 'AgreementSigned' ||
                    workplace?.currentStatus === 'awaitingAgreementSigned'
                ) {
                    onPlacementStartedClicked(Number(appliedIndustry?.id))
                    isCleared(true)
                } else {
                    notification.error({
                        title: 'Forward the request to Industry',
                        description:
                            'You Must have to Forward the request to Industry before start placement',
                    })
                    isCleared(false)
                }
            },
            status: 'placementStarted',
            date: appliedIndustry?.placementStartedDate,
        },
        {
            primaryText: 'Completed',
            secondaryText: 'Completed',
            color: 'text-error',
            onClick: () => {
                onCompleteClicked()
            },
            status: 'completed',
            date: appliedIndustry?.isCompletedDate,
        },
        {
            primaryText: 'Cancelled',
            secondaryText: 'Cancelled',
            color: 'text-error',
            onClick: () => { },
            status: 'cancelled',
            date: appliedIndustry?.cancelledDate,
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
            date: appliedIndustry?.terminatedDate,
        },
    ]

    const findStatusIndex = requestTypeActions.findIndex(
        (r) => r.status === workplace.currentStatus
    )

    useEffect(() => {
        if (appliedIndustry?.industryResponse === 'rejected') {
            setSelectedRequestType(requestTypeActions.length - 1)
        } else {
            setSelectedRequestType(findStatusIndex)
        }

        // if (data?.caseOfficerAssigned) {
        //     setSelectedRequestType(1)
        // }
        // if (data?.interview) {
        //     setSelectedRequestType(2)
        // }
        // if (data?.awaitingWorkplaceResponse) {
        //     setSelectedRequestType(3)
        // }
        // if (data?.awaitingAgreementSigned) {
        //     setSelectedRequestType(5)
        // }
        // if (data?.AgreementSigned) {
        //     setSelectedRequestType(6)
        // }
    }, [appliedIndustry])

    const onRequestClicked = () => {
        if (workplace?.assignedTo) {
            if (
                !appliedIndustry?.terminated &&
                !appliedIndustry?.isCompleted &&
                !appliedIndustry?.isCancelled
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
                description: 'Assign the workplace before changing status',
            })
        }
    }

    return (
        <div className="relative">
            {modal && modal}
            <OutsideClickHandler
                onOutsideClick={() => {
                    setVisibleRequestType(false)
                }}
            >
                <div
                    className={`${appliedIndustry?.terminated ||
                        appliedIndustry?.isCompleted ||
                        appliedIndustry?.cancelled
                        ? 'bg-gray-100 cursor-default'
                        : ''
                        }  border border-dashed border-gray-400 rounded-lg w-56 px-4 py-1 flex items-center justify-between gap-x-1 cursor-pointer relative`}
                    onClick={onRequestClicked}
                >
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

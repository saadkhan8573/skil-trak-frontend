import moment from 'moment'

// components
import {
    ActionButton,
    Button,
    ShowErrorNotifications,
    Typography,
} from '@components'

// query
import { useContextBar, useNotification } from '@hooks'
import { ViewAgreement } from '@partials/common'
import {
    useWorkplaceActionsMutation
} from '@queries'
import { UserStatus } from '@types'
import { ReactElement, useEffect, useState } from 'react'
import { Feedback, PlacementStartedModal, ReportModal } from '../../modals'
import { ChangeStatusAction } from './components'

export const Actions = ({ workplace, industry, student }: any) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    //  query
    const [workplaceActions, workplaceActionsResult] =
        useWorkplaceActionsMutation()

    // hooks
    const { setContent, show } = useContextBar()
    const { notification } = useNotification()

    useEffect(() => {
        if (workplaceActionsResult.isSuccess) {
            if (
                workplaceActionsResult.originalArgs?.status ===
                UserStatus.Approved
            ) {
                notification.success({
                    title: 'Workplace Approved',
                    description: 'Workplace Approved Successfully',
                })
            }
            if (
                workplaceActionsResult.originalArgs?.status ===
                UserStatus.Rejected
            ) {
                notification.success({
                    title: 'Workplace Rejected',
                    description: 'Workplace Rejected Successfully',
                })
            }
        }
    }, [workplaceActionsResult])

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onStartPlacementClicked = (id: any) => {
        setModal(
            <PlacementStartedModal
                id={id}
                student={student}
                agreementSigned={industry?.AgreementSigned}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onFeedBackClicked = () => {
        setModal(
            <Feedback
                onCancel={onModalCancelClicked}
                workIndustry={industry?.id}
                student={workplace?.student?.id}
            />
        )
    }

    const onReportClicked = () => {
        setModal(
            <ReportModal
                onCancel={onModalCancelClicked}
                workIndustry={industry?.id}
                student={workplace?.student?.id}
            />
        )
    }

    return (
        <>
            <ShowErrorNotifications result={workplaceActionsResult} />
            <div className="flex flex-col md:flex-row gap-y-2 md:items-center md:gap-x-2">
                {modal && modal}
                {/* {industry?.industryResponseDate && (
                <Typography variant={'xs'} color={'text-success'}>
                    Student was APPROVED on{' '}
                    {moment(industry?.industryResponseDate).format(
                        'Do MMM, YYYY'
                    )}
                </Typography>
            )} */}
                {industry?.AgreementSigned && (
                    <Button
                        variant={'info'}
                        text={'View Agreement'}
                        onClick={() => {
                            setContent(<ViewAgreement workplace={workplace} />)
                            show()
                        }}
                    />
                )}
                {workplace?.isCancelled && (
                    <Typography variant={'small'} color={'text-red-800'}>
                        <span className="bg-secondary px-3 py-0.5 rounded-full">
                            CANCELLED
                        </span>
                    </Typography>
                )}
                {industry?.industryResponse === 'rejected' && (
                    <Typography variant={'small'} color={'text-red-800'}>
                        <span className="bg-secondary px-3 py-0.5 rounded-full">
                            REJECTED
                        </span>
                    </Typography>
                )}
                {industry?.industryResponse === 'noResponse' && (
                    <Typography variant={'small'} color={'text-red-800'}>
                        <span className="bg-secondary px-3 py-0.5 rounded-full">
                            No Response
                        </span>
                    </Typography>
                )}
                {industry?.industryResponse === 'approved' &&
                !workplace?.isCancelled ? (
                    !industry?.terminated &&
                    !industry?.isCompleted &&
                    !workplace?.isCancelled &&
                    !industry?.placementStarted ? (
                        <>
                            {industry?.industryResponseDate && (
                                <Typography
                                    variant={'xs'}
                                    color={'text-success'}
                                >
                                    Student was APPROVED on{' '}
                                    {moment(
                                        industry?.industryResponseDate
                                    ).format('Do MMM, YYYY')}
                                </Typography>
                            )}
                            {!industry.placementStarted && (
                                <Button
                                    variant={'primary'}
                                    text={'Start Placement'}
                                    onClick={() => {
                                        onStartPlacementClicked(industry.id)
                                    }}
                                />
                            )}
                            <Button
                                variant={'dark'}
                                text={'ADD SCHEDULE'}
                                disabled
                            />
                        </>
                    ) : industry?.isCompleted ? (
                        <Typography variant={'small'} color={'text-white'}>
                            <span className="bg-success-dark px-3 py-0.5 rounded-full">
                                COMPLETED
                            </span>
                        </Typography>
                    ) : industry?.terminated ? (
                        <Typography variant={'small'} color={'text-white'}>
                            <span className="bg-success-dark px-3 py-0.5 rounded-full">
                                TERMINATED
                            </span>
                        </Typography>
                    ) : (
                        <>
                            <ChangeStatusAction
                                industry={industry}
                                workplace={workplace}
                            />
                            <Button
                                variant={'action'}
                                onClick={onFeedBackClicked}
                            >
                                <span className="text-gray-800">FEEDBACK</span>
                            </Button>
                            <Button
                                variant={'action'}
                                onClick={onReportClicked}
                            >
                                <span className="text-error">REPORT</span>
                            </Button>
                        </>
                    )
                ) : (
                    !workplace?.isCancelled &&
                    industry?.industryResponse !== 'rejected' &&
                    industry?.industryResponse !== 'noResponse' && (
                        <div className="flex items-center gap-x-2">
                            <div className="whitespace-nowrap">
                                {/* <Button text={'Book Appointment'} variant={'info'} /> */}
                            </div>

                            <ActionButton
                                variant={'success'}
                                onClick={() => {
                                    workplaceActions({
                                        id: industry.id,
                                        status: UserStatus.Approved,
                                    })
                                }}
                                loading={workplaceActionsResult?.isLoading}
                                disabled={workplaceActionsResult?.isLoading}
                            >
                                Approve
                            </ActionButton>
                            <ActionButton
                                variant={'error'}
                                onClick={() => {
                                    workplaceActions({
                                        id: industry.id,
                                        status: UserStatus.Rejected,
                                    })
                                }}
                                loading={workplaceActionsResult?.isLoading}
                                disabled={workplaceActionsResult?.isLoading}
                            >
                                Reject
                            </ActionButton>
                        </div>
                    )
                )}
            </div>
        </>
    )
}

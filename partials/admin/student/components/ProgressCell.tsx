import { Tooltip, Typography } from '@components'
import { useContextBar } from '@hooks'
import { ChangeWorkplaceStatus } from '@partials/common'
import { SubAdmin } from '@types'
import classNames from 'classnames'
import moment from 'moment'
import { FaFileSignature } from 'react-icons/fa'

type WorkplaceRequestStatus =
    | '1-NotRequested'
    | '2-Industry sourcing'
    | '3-Industry sourcing'
    | '4-Industry sourcing'
    | '5-Waiting'
    | '6-Meeting'
    | '7-AgreementPending'
    | '8-AgreementSigned'
    | '9-PlacementStarted'
    | '10-PlacementCancelled'
    | '11-PlacementCompleted'
    | '12-Rejected'
    | '13-Terminated'

type CurrentStatus = {
    status: string
    description: string
    color: string
    image: string
    date?: string
}

const WorkplaceRequestProgress = (appliedIndustry?: any) => {
    return {
        '1-NotRequested': {
            status: 'No WPR Generated',
            description: 'Pending',
            color: 'text-gray-400',
            image: 'not-requested.png',
            date: '',
        },
        '2-Industry sourcing': {
            status: 'Industry sourcing',
            description: 'No Case Officer',
            color: 'text-orange-700',
            image: 'industry-check.png',
            date: appliedIndustry?.appliedDate,
        },
        '3-Industry sourcing': {
            status: 'Industry sourcing',
            description: 'Case Officer',
            color: 'text-orange-600',
            image: 'case-officer.png',
            date: appliedIndustry?.caseOfficerAssignedDate,
        },
        '4-Waiting For Student': {
            status: 'Waiting For Student',
            description: 'for Workplace Response',
            color: 'text-indigo-400',
            image: 'waiting.png',
            date: appliedIndustry?.awaitingWorkplaceResponseDate,
        },
        '5-Waiting For Rto': {
            status: 'Waiting For Rto',
            description: 'for Workplace Response',
            color: 'text-primary',
            image: 'waiting.png',
            date: appliedIndustry?.awaitingWorkplaceResponseDate,
        },
        '6-Waiting For Industry': {
            status: 'Waiting For Industry',
            description: 'for Workplace Response',
            color: 'text-indigo-400',
            image: 'waiting.png',
            date: appliedIndustry?.awaitingWorkplaceResponseDate,
        },
        '7-Industry sourcing': {
            status: 'Industry sourcing',
            description: 'with Case Officer',
            color: 'text-orange-500',
            image: 'interview.png',
            date: appliedIndustry?.interviewDate,
        },

        '8-Meeting': {
            status: 'Appointment',
            description: 'with Workplace Supervisor',
            color: 'text-indigo-600',
            image: 'appointment.png',
            date: appliedIndustry?.appointmentBookedDate,
        },
        '9-AgreementPending': {
            status: 'Agreement & Eligibility Pending',
            description: 'Checklist Pending',
            color: 'text-blue-500',
            image: 'agreement.png',
            date: appliedIndustry?.awaitingAgreementSignedDate,
        },
        '10-AgreementSigned': {
            status: 'Agreement & Eligibility Signed',
            description: 'Checklist Signed',
            color: 'text-green-500',
            image: 'agreement.png',
            date: appliedIndustry?.AgreementSignedDate,
        },
        '11-PlacementStarted': {
            status: 'Placement Started',
            description: '',
            color: 'text-white',
            image: 'placement-started.png',
            date: appliedIndustry?.placementStartedDate,
        },
        '12-PlacementCancelled': {
            status: 'Request Cancelled',
            description: 'request cancelled',
            color: 'text-error',
            image: 'placement-cancelled.png',
            date: appliedIndustry?.cancelledDate,
        },
        '13-PlacementCompleted': {
            status: 'Schedule Completed',
            description: 'placement-completed',
            color: 'text-green-500',
            image: 'placement-cancelled.png',
            date: appliedIndustry?.isCompletedDate,
        },
        '14-NotResponded': {
            status: 'Industry NotResponded',
            description: 'industry not-responded',
            color: 'text-green-500',
            image: 'placement-cancelled.png',
            date: appliedIndustry?.industryResponseDate,
        },
        '15-Rejected': {
            status: 'Rejected',
            description: 'placement-rejected',
            color: 'text-error',
            image: 'placement-cancelled.png',
        },
        '16-Terminated': {
            status: 'Terminated',
            description: 'placement-terminated',
            color: 'text-error',
            image: 'placement-cancelled.png',
            date: appliedIndustry?.terminatedDate,
        },
        '17-Industry-Eligibility': {
            status: 'Industry-Eligibility',
            description: 'placement-terminated',
            color: 'text-error',
            image: 'placement-cancelled.png',
        },
    }
}

export const ProgressCell = ({
    documentInitiates,
    wpCreatedAt,
    step,
    assigned,
    appliedIndustry,
    studentProvidedWorkplace,
}: {
    wpCreatedAt?: Date | undefined
    step:
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
        | number
    assigned?: SubAdmin
    appliedIndustry?: any
    studentProvidedWorkplace?: boolean
    documentInitiates?: boolean
}) => {
    // const currentStatus = WorkplaceRequestProgress[status]
    const currentStatus: CurrentStatus = Object.values(
        WorkplaceRequestProgress(appliedIndustry)
    )[step - 1]

    const contextBar = useContextBar()

    const classes = classNames({
        'px-2 py-1 z-20 relative rounded-md flex items-center gap-x-2 min-w-max': true,
        'bg-white':
            currentStatus.status !==
            WorkplaceRequestProgress()['11-PlacementStarted'].status,
        'bg-green-500':
            currentStatus.status ===
            WorkplaceRequestProgress()['11-PlacementStarted'].status,
    })

    return (
        <>
            <div className={`${classes}`}>
                <img
                    src={`/images/students/workplace-progress/${currentStatus.image}`}
                    alt=""
                    width={24}
                />
                <div>
                    <p
                        className={`${currentStatus.color} text-xs font-semibold whitespace-nowrap`}
                    >
                        {currentStatus.status}
                    </p>
                    <div className="flex justify-between items-center">
                        <div>
                            {assigned ? (
                                <Typography
                                    variant={'xs'}
                                    color={'text-gray-500'}
                                >
                                    <span className="font-semibold">
                                        <span className="text-gray-400">
                                            CO-
                                        </span>{' '}
                                        {assigned?.user?.name}
                                    </span>
                                </Typography>
                            ) : (
                                <p className="text-[11px] text-gray-400 whitespace-nowrap">
                                    {currentStatus.description}
                                </p>
                            )}
                        </div>
                        {documentInitiates ? (
                            <div className="relative group">
                                <FaFileSignature
                                    size={18}
                                    className="text-success-dark"
                                />
                                <Tooltip>Agreement Initiated</Tooltip>
                            </div>
                        ) : null}
                    </div>

                    <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {studentProvidedWorkplace
                            ? 'Student Provided Workplace'
                            : ''}
                    </p>
                    {wpCreatedAt && (
                        <Typography variant="xs">
                            Wp CreatedAt :{' '}
                            {moment(wpCreatedAt).format('Do MMM YYYY')}
                        </Typography>
                    )}
                    {currentStatus?.date && (
                        <Typography>
                            <span className="text-[10px] font-semibold">
                                {' '}
                                {moment(currentStatus?.date).format(
                                    'Do MMM YYYY'
                                )}
                            </span>
                        </Typography>
                    )}
                </div>
            </div>
        </>
    )
}

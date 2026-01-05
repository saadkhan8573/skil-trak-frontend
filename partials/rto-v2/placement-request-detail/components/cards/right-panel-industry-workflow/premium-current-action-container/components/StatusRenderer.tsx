import {
    needsWorkplaceStagesEnum,
    providedWorkplaceStagesEnum,
} from '@partials/rto-v2/placement-request-detail/components/workplaceStages'

import * as Needs from './needs-workplace'
import * as Provided from './provided-workplace'

const STATUS_COMPONENT_MAP: Record<string, React.FC<any>> = {
    [needsWorkplaceStagesEnum.STUDENT_ADDED]: Needs.StudentAdded,
    [needsWorkplaceStagesEnum.REQUEST_GENERATED]: Needs.RequestGenerated,
    [needsWorkplaceStagesEnum.WAITING_FOR_RTO]: Needs.WaitingForRTO,
    [needsWorkplaceStagesEnum.WAITING_FOR_STUDENT]: Needs.WaitingForStudent,
    [needsWorkplaceStagesEnum.WAITING_FOR_INDUSTRY]: Needs.WaitingForIndustry,
    [needsWorkplaceStagesEnum.APPOINTMENT]: Needs.Appointment,
    [needsWorkplaceStagesEnum.AGREEMENT_PENDING]: Needs.AgreementPending,
    [needsWorkplaceStagesEnum.AGREEMENT_SIGNED]: Needs.AgreementSigned,
    [needsWorkplaceStagesEnum.PLACEMENT_STARTED]: Needs.PlacementStarted,
    [needsWorkplaceStagesEnum.SCHEDULE_COMPLETED]: Needs.ScheduleCompleted,
    [needsWorkplaceStagesEnum.COMPLETED]: Needs.Completed,

    [providedWorkplaceStagesEnum.PROVIDED_WORKPLACE_REQUEST]:
        Provided.ProvidedRequest,
    [providedWorkplaceStagesEnum.INDUSTRY_ELIGIBILITY_PENDING]:
        Provided.IndustryEligibilityPending,
    [providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_PENDING]:
        Provided.AgreementPending,
    [providedWorkplaceStagesEnum.AGREEMENT_AND_ELIGIBILITY_SIGNED]:
        Provided.AgreementSigned,
}

export const StatusRenderer = ({ stage, ...props }: { stage?: string }) => {
    if (!stage) return null

    const Component = STATUS_COMPONENT_MAP[stage]
    return Component ? <Component {...props} /> : null
}

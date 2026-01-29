import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'

export enum WorkplaceCurrentStatus {
    NotRequested = 'notRequested',
    Applied = 'applied',
    CaseOfficerAssigned = 'caseOfficerAssigned',
    Interview = 'interview',
    IndustryEligibility = 'industryEligibility',
    AwaitingWorkplaceResponse = 'awaitingWorkplaceResponse',
    AwaitingStudentResponse = 'awaitingStudentResponse',
    AwaitingRtoResponse = 'awaitingRtoResponse',
    AppointmentBooked = 'appointmentBooked',
    AwaitingAgreementSigned = 'awaitingAgreementSigned',
    AgreementSigned = 'AgreementSigned',
    PlacementStarted = 'placementStarted',
    Cancelled = 'cancelled',
    Completed = 'completed',
    NoResponse = 'noResponse',
    Rejected = 'rejected',
    Terminated = 'terminated',
}

export const WorkplaceStatusLabels: Record<WorkplaceCurrentStatus, string> = {
    [WorkplaceCurrentStatus.NotRequested]: 'Not Requested',
    [WorkplaceCurrentStatus.Applied]: 'Applied',
    [WorkplaceCurrentStatus.CaseOfficerAssigned]: 'Case Officer Assigned',
    [WorkplaceCurrentStatus.Interview]: 'Interview Scheduled',
    [WorkplaceCurrentStatus.IndustryEligibility]: 'Industry Eligibility Check',
    [WorkplaceCurrentStatus.AwaitingWorkplaceResponse]: 'Waiting For Industry',
    [WorkplaceCurrentStatus.AwaitingStudentResponse]: 'Waiting For Student',
    [WorkplaceCurrentStatus.AwaitingRtoResponse]: 'Waiting For RTO',
    [WorkplaceCurrentStatus.AppointmentBooked]: 'Appointment',
    [WorkplaceCurrentStatus.AwaitingAgreementSigned]:
        'Agreement & Eligibility (Pending)',
    [WorkplaceCurrentStatus.AgreementSigned]:
        'Agreement & Eligibility (Signed)',
    [WorkplaceCurrentStatus.PlacementStarted]: 'Placement Started',
    [WorkplaceCurrentStatus.Cancelled]: 'Cancelled',
    [WorkplaceCurrentStatus.Completed]: 'Schedule Completed',
    [WorkplaceCurrentStatus.NoResponse]: 'No Response',
    [WorkplaceCurrentStatus.Rejected]: 'Rejected',
    [WorkplaceCurrentStatus.Terminated]: 'Terminated',
}

export const checkWorkplaceStatus = (currentStatus: WorkplaceCurrentStatus) => {
    const requestTypeActions = [
        'notRequested',
        'applied',
        'caseOfficerAssigned',
        'awaitingStudentResponse',
        'awaitingRtoResponse',
        'awaitingWorkplaceResponse',
        'interview',
        'appointmentBooked',
        'awaitingAgreementSigned',
        'AgreementSigned',
        'placementStarted',
        'cancelled',
        'completed',
        'noResponse',
        'rejected',
        'terminated',
        'industryEligibility',
    ]
    const step = requestTypeActions.findIndex(
        (status) => status === currentStatus
    )
    return step + 1
}

export const checkStudentStatus = (studentStatus: string) => {
    const StudentStatus = [
        'active',
        'completed',
        'expired',
        'cancelled',
        'terminated',
        'qualification issued',
    ]

    const step = StudentStatus.findIndex((status) => status === studentStatus)
    return step + 1
}

export const getStudentWorkplaceAppliedIndustry = (
    industries: WorkplaceWorkIndustriesType[]
) => {
    return industries?.find(
        (industry: WorkplaceWorkIndustriesType) => industry?.applied
    )
}

export const latestWorkplace = (workplace: IWorkplaceIndustries[]) => {
    return workplace?.reduce(
        (a: IWorkplaceIndustries, b: IWorkplaceIndustries) =>
            (a?.createdAt ?? 0) > (b?.createdAt ?? 0) ? a : b,
        {
            currentStatus: WorkplaceCurrentStatus.NotRequested,
        }
    )
}

export const activeWorkplace = (workplace: IWorkplaceIndustries[]) =>
    workplace?.filter(
        (wp: any) =>
            wp?.currentStatus !== WorkplaceCurrentStatus.Cancelled &&
            wp?.currentStatus !== WorkplaceCurrentStatus.Terminated &&
            wp?.currentStatus !== WorkplaceCurrentStatus.Rejected &&
            wp?.currentStatus !== WorkplaceCurrentStatus.NoResponse
    )

export const studentsListWorkplace = (workplace: IWorkplaceIndustries[]) => {
    const activeWP = activeWorkplace(workplace)

    const latestWP = latestWorkplace(activeWP)

    const appliedIndustry = getStudentWorkplaceAppliedIndustry(
        latestWP?.industries as WorkplaceWorkIndustriesType[]
    )?.industry

    return appliedIndustry
}

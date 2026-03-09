import { Typography } from '@components'
import { IndustryCellInfo } from '@partials/sub-admin/Industries'
import { Industry } from '@types'
import {
    activeWorkplace,
    getStudentWorkplaceAppliedIndustry,
    WorkplaceCurrentStatus,
} from '@utils'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { latestWpApprovalRequest } from '@partials/rto-v2'

export const SubadminStudentIndustries = ({
    workplace,
    industries,
}: {
    industries: Industry[]
    workplace: IWorkplaceIndustries[]
}) => {
    const olderWorkplace = (workplace: IWorkplaceIndustries[]) => {
        return workplace?.reduce(
            (a: IWorkplaceIndustries, b: IWorkplaceIndustries) =>
                (a?.createdAt ?? 0) < (b?.createdAt ?? 0) ? a : b,
            {
                currentStatus: WorkplaceCurrentStatus.NotRequested,
            }
        )
    }
    const activeWP = activeWorkplace(workplace)
    const latestWP = olderWorkplace(activeWP)
    const studentsListWorkplace = () => {
        const appliedIndustry = getStudentWorkplaceAppliedIndustry(
            latestWP?.industries as WorkplaceWorkIndustriesType[]
        )?.industry

        return appliedIndustry
    }
    const appliedIndustry = studentsListWorkplace()

    // Industry from latestPendingApproval (pre-computed on the backend)
    const wpPendingApprovalIndustry = latestWP?.latestPendingApproval?.industry

    // Industry from the workplaceApprovaleRequest array (via utility)
    const wpApprovalRequestIndustry = latestWpApprovalRequest(
        latestWP?.workplaceApprovaleRequest || []
    )?.industry

    // Industry from student-provided workplace approval
    const wpStudentProvidedIndustry =
        latestWP?.studentProvidedWorkplaceRequestApproval?.industry

    const resolvedIndustry =
        appliedIndustry ||
        wpPendingApprovalIndustry ||
        wpApprovalRequestIndustry ||
        wpStudentProvidedIndustry

    return resolvedIndustry ? (
        <IndustryCellInfo industry={resolvedIndustry} />
    ) : industries && industries?.length > 0 ? (
        <IndustryCellInfo industry={industries?.[0]} />
    ) : (
        <Typography center>-----</Typography>
    )
}

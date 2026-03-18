import { Typography } from '@components'
import { latestWpApprovalRequest } from '@partials/rto-v2'
import { IndustryCell } from '@partials/admin/industry/components'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { Industry } from '@types'
import {
    activeWorkplace,
    getStudentWorkplaceAppliedIndustry,
    WorkplaceCurrentStatus,
} from '@utils'

export const StudentIndustries = ({
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
    const filteredWpApprovalRequests = (
        latestWP?.workplaceApprovaleRequest || []
    )?.filter((req) => {
        return (
            req?.rtoApprovalStatus !== 'rejected' && !req?.isRejectedByIndustry
        )
    })

    const wpApprovalRequestIndustry = latestWpApprovalRequest(
        filteredWpApprovalRequests
    )?.industry

    // Industry from student-provided workplace approval
    const wpStudentProvidedIndustry =
        latestWP?.studentProvidedWorkplaceRequestApproval?.industry

    const resolvedIndustry =
        wpPendingApprovalIndustry ||
        wpApprovalRequestIndustry ||
        wpStudentProvidedIndustry ||
        appliedIndustry

    return resolvedIndustry ? (
        <IndustryCell industry={resolvedIndustry} />
    ) : industries && industries?.length > 0 ? (
        <IndustryCell industry={industries?.[0]} />
    ) : (
        <Typography center>N/A</Typography>
    )
}

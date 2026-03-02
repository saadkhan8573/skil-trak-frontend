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

    const wpApp = latestWP?.latestPendingApproval?.industry

    return workplace && workplace?.length > 0 && appliedIndustry ? (
        <IndustryCellInfo onlyName={false} industry={appliedIndustry} />
    ) : wpApp ? (
        <IndustryCellInfo onlyName={false} industry={wpApp} />
    ) : industries && industries?.length > 0 ? (
        <IndustryCellInfo onlyName={false} industry={industries?.[0]} />
    ) : (
        <Typography center>-----</Typography>
    )
}

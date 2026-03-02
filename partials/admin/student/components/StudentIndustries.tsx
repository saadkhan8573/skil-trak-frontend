import { Typography } from '@components'
import { IndustryCell } from '@partials/admin/industry/components'
import { Industry } from '@types'
import {
    activeWorkplace,
    getStudentWorkplaceAppliedIndustry,
    latestWorkplace,
    WorkplaceCurrentStatus,
} from '@utils'
import React from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'

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

    const wpApp = latestWP?.latestPendingApproval?.industry

    return workplace && workplace?.length > 0 && appliedIndustry ? (
        <IndustryCell industry={appliedIndustry} />
    ) : wpApp ? (
        <IndustryCell industry={wpApp} />
    ) : industries && industries?.length > 0 ? (
        <IndustryCell industry={industries?.[0]} />
    ) : (
        <Typography center>N/A</Typography>
    )
}

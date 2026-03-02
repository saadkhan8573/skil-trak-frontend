import { WorkplaceCurrentStatus } from '@utils'
import React, { useMemo } from 'react'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const useWpData = ({
    selectedWorkplace,
    studentWorkplace,
}: {
    selectedWorkplace: IWorkplaceIndustries | null
    studentWorkplace: IWorkplaceIndustries[]
}) => {
    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return selectedWorkplace?.workplaceApprovaleRequest?.reduce(
            (latest: any, current: any) =>
                new Date(current?.createdAt) > new Date(latest?.createdAt)
                    ? current
                    : latest,
            selectedWorkplace?.workplaceApprovaleRequest?.[0]
        )
    }, [selectedWorkplace?.workplaceApprovaleRequest])

    const latestWorkplaceApprovaleRequestRto = useMemo(() => {
        return selectedWorkplace?.workplaceApprovaleRequest?.reduce(
            (latest: any, current: any) =>
                new Date(current?.createdAt) > new Date(latest?.createdAt)
                    ? current
                    : latest,
            selectedWorkplace?.workplaceApprovaleRequest?.[0]
        )
    }, [selectedWorkplace?.workplaceApprovaleRequest])

    const ignoreCompletedWP = studentWorkplace?.filter(
        (wp: IWorkplaceIndustries) =>
            wp?.currentStatus !== WorkplaceCurrentStatus.Completed
    )

    const firstWorkplaceCurrentStatus = ignoreCompletedWP?.[0]?.currentStatus

    return {
        ignoreCompletedWP,
        firstWorkplaceCurrentStatus,
        latestWorkplaceApprovaleRequest,
        latestWorkplaceApprovaleRequestRto,
    }
}

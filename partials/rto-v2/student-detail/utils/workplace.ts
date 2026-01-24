import { IWorkplaceIndustries } from "@redux/queryTypes"
import { WorkplaceCurrentStatus } from "@utils"

export const sortedWorkplaceRequests = (workplace?: IWorkplaceIndustries[]): IWorkplaceIndustries[] => {
    if (!workplace) return []

    const terminalStatuses = [
        WorkplaceCurrentStatus.Cancelled,
        WorkplaceCurrentStatus.Completed,
        WorkplaceCurrentStatus.NoResponse,
        WorkplaceCurrentStatus.Rejected,
        WorkplaceCurrentStatus.Terminated,
    ]

    return [...workplace].sort((a, b) => {
        const isATerminal = terminalStatuses.includes(a.currentStatus)
        const isBTerminal = terminalStatuses.includes(b.currentStatus)

        if (isATerminal && !isBTerminal) return 1
        if (!isATerminal && isBTerminal) return -1
        return 0
    })
}
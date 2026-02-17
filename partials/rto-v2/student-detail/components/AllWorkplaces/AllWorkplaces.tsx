import {
    Badge,
    EmptyData,
    TechnicalError
} from '@components'
import { RtoV2Api } from '@queries'
import { Building2 } from 'lucide-react'
import { useMemo } from 'react'
import { WorkplaceCard } from './cards'
import { WorkplaceCounts } from './components'

import { WorkplaceTabSkeleton } from '../../skeletonLoader'
import { sortedWorkplaceRequests } from '../../utils'

export function AllWorkplaces({ studentId }: { studentId: number }) {
    const workplaces = RtoV2Api.StudentsWorkplace.getStudentWorkplaceList(
        studentId,
        {
            skip: !studentId,
            refetchOnMountOrArgChange: 30,
        }
    )

    const sortedWorkplaces = useMemo(() =>
        sortedWorkplaceRequests(workplaces?.data),
        [workplaces?.data])

    return (
        <>
            {workplaces?.isError ? <TechnicalError /> : null}
            {workplaces?.isLoading ? (
                <WorkplaceTabSkeleton />
            ) : workplaces?.data &&
                workplaces?.data?.length > 0 &&
                workplaces?.isSuccess ? (
                <div className="space-y-5">
                    {/* Header */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/30">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-slate-900 flex items-center gap-2">
                                        All Workplaces
                                        <Badge
                                            variant="primaryNew"
                                            text={`${workplaces?.data?.length} Total`}
                                            className="text-[10.8px] border border-[#044866]/20"
                                            size="xs"
                                        />
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        Complete overview of all workplace
                                        placements and requests
                                    </p>
                                </div>
                            </div>
                            {/* <Button
                                variant="primaryNew"
                                className="bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/30 px-[11.9px] py-[1.8px] text-[9.9px]"
                                text="+ Request New Placement"
                            /> */}
                        </div>
                    </div>

                    {/* Statistics Overview */}
                    <WorkplaceCounts studentId={studentId} />

                    {/* Workplace Cards */}
                    <div className="space-y-4">
                        {sortedWorkplaces?.map((workplace) => (
                            <WorkplaceCard
                                key={workplace.id}
                                workplace={workplace}
                            />
                        ))}
                    </div>
                </div>
            ) : workplaces?.isSuccess ? (
                <EmptyData />
            ) : null}
        </>
    )
}

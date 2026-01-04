import { Skeleton } from '@components/ui/skeleton'
import { StudentSummarySkeleton } from './StudentSummarySkeleton'
import { ComplianceSkeleton } from './ComplianceSkeleton'
import { PlacementStreamsSkeleton } from './PlacementStreamsSkeleton'
import { IndustryDetailsSkeleton } from './IndustryDetailsSkeleton'
import { StatusNotesSkeleton } from './StatusNotesSkeleton'
import { TasksSkeleton } from './TasksSkeleton'

export function CardsSkeleton() {
    return (
        <div className="px-8 py-8">
            <div className="max-w-[1900px] mx-auto">
                <div className="grid grid-cols-2 gap-10">
                    {/* Left Panel */}
                    <div className="space-y-7">
                        <StudentSummarySkeleton />

                        {/* Collapsible Details Skeleton - Kept here as it's small */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-xl bg-[#044866]/10" />
                                    <Skeleton className="h-5 w-48 bg-slate-200" />
                                </div>
                                <Skeleton className="w-5 h-5 rounded bg-slate-100" />
                            </div>
                        </div>

                        <ComplianceSkeleton />
                        <PlacementStreamsSkeleton />
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-7">
                        <IndustryDetailsSkeleton />
                        <TasksSkeleton />
                        <StatusNotesSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

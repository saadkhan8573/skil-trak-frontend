import { RunListingAutomation } from '@partials/common'
import { cn } from '@utils'
import { ArrowRight } from 'lucide-react'

// --- Row Component ---
interface TableRowProps {
    data: any // Replace with your specific Type
}
const getRowStyle = (status: string) => {
    // Normalize the status to handle both underscores and hyphens if necessary
    const normalizedStatus = status?.replace('_', '-')

    switch (normalizedStatus) {
        case 'not-ready':
            return 'bg-[#FFF5F5] hover:bg-red-100 border-l-4 border-l-[#EF4444]'
        case 'at-risk':
            // Using Amber/Yellowish for that specific "At Risk" warning glow
            return 'bg-[#FFFBEB] hover:bg-amber-100 border-l-4 border-l-[#F7A619]'
        case 'ready':
        default:
            return 'bg-white hover:bg-slate-50 border-l-4 border-l-transparent'
    }
}
export const ReadinessTableRow = ({ data }: { data: any }) => {
    return (
        <div
            className={cn(
                'grid grid-cols-9 items-center px-4 py-4 border-b border-slate-100 transition-all',
                getRowStyle(data?.status) // This handles bg, hover, and the left border
            )}
        >
            {/* Location = suburb */}
            <div className="col-span-2 flex flex-col ">
                <span className="text-sm text-slate-600 font-semibold">
                    {data?.suburb ?? '___'}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                    {data?.postalCode ?? '___'}
                </span>
            </div>

            {/* Course = sectorName */}
            <div className=" text-xs text-slate-700 font-medium">
                {data?.sectorName ?? '___'}
            </div>

            <div className="text-right text-xs text-slate-900 font-bold">
                {data?.expectedStudents ?? '___'}
            </div>
            <div className="text-right text-xs text-slate-700 font-semibold">
                {data?.industryCapacity ?? '___'}
            </div>

            <div className="flex justify-end">
                <span
                    className={`inline-flex items-center gap-0.5 px-2.5 py-1 ${data?.capacityGap >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-lg font-bold text-xs`}
                >
                    {data?.capacityGap ?? '___'}
                </span>
            </div>

            <div className="pl-4">
                <span
                    className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        data?.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                    )}
                >
                    {data?.status?.replace('_', ' ')}
                </span>
            </div>

            {/* Using createdAt or a hardcoded deadline for the demo */}
            <div className="text-right text-sm text-slate-900 font-bold">
                {data?.daysUntil || 60} days
            </div>

            <div className="w-full flex justify-end gap-2">
                {data?.capacityGap < 0 && (
                    <RunListingAutomation
                        studentAddress={`${data?.suburb}, ${data?.postalCode}`}
                        sectorId={data?.sectorId}
                        btnText="Recruit Now"
                        icon={false}
                    />
                )}
            </div>
        </div>
    )
}

import { ArrowUpDown } from 'lucide-react'

export const ReadinessTableHeader = ({
    onSort,
}: {
    onSort: (key: string) => void
}) => (
    <div className="grid grid-cols-9 bg-white shadow-2xl border-b border-slate-200 px-4 py-3">
        <div className="col-span-2 text-xs text-slate-600 font-bold uppercase tracking-wider">
            Location
        </div>
        <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">
            Sector
        </div>
        <div className="text-right text-xs text-slate-600 font-bold uppercase tracking-wider">
            Expected Students
        </div>
        <div
            title="Industry Capacity"
            className="text-right text-xs text-slate-600 font-bold uppercase tracking-wider whitespace-nowrap"
        >
            Ind Capacity
        </div>
        <div className="flex justify-end">
            <button
                onClick={() => onSort('capacityGap')}
                className="inline-flex items-center gap-1 text-xs text-slate-600 font-bold uppercase hover:text-slate-900 transition-colors whitespace-nowrap"
            >
                Capacity Gap
                {/* <ArrowUpDown className="w-3 h-3" /> */}
            </button>
        </div>
        <div className="pl-4 text-xs text-slate-600 font-bold uppercase tracking-wider">
            Status
        </div>
        <div className="flex justify-end">
            <button
                onClick={() => onSort('daysUntil')}
                className="inline-flex items-center gap-1 text-xs text-slate-600 font-bold uppercase hover:text-slate-900 transition-colors"
            >
                Deadline
                {/* <ArrowUpDown className="w-3 h-3" /> */}
            </button>
        </div>
        <div className="pl-4 text-xs text-slate-600 font-bold uppercase tracking-wider">
            Action
        </div>
    </div>
)

import { ReadinessTableHeader } from './ReadinessTableHeader'
import { ReadinessTableRow } from './ReadinessTableRow'

export const IndustryReadinessTable = ({
    data,
    onSort,
}: {
    data: any[]
    onSort: (val: string) => void
}) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
            <ReadinessTableHeader onSort={onSort} />

            <div className="divide-y divide-slate-100 overflow-auto max-h-120">
                {data?.length > 0 ? (
                    data?.map((item) => (
                        <ReadinessTableRow key={item.id} data={item} />
                    ))
                ) : (
                    <div className="p-10 text-center text-slate-500 italic">
                        No records found for this location.
                    </div>
                )}
            </div>
        </div>
    )
}

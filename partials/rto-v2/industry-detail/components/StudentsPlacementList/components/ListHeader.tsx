import { Select } from '@components'

export function ListHeader() {
    const filterOptions = [
        { label: 'All Students (4)', value: 'all' },
        { label: 'In Progress (2)', value: 'in-progress' },
        { label: 'Completed (1)', value: 'completed' },
        { label: 'Pending (1)', value: 'pending' },
    ]

    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-[#1A2332] font-bold mb-1">
                    Placement Students
                </h2>
                <p className="text-xs text-[#64748B]">
                    Track student placement workflow progress...
                </p>
            </div>
            {/* <div className="w-60">
                <Select name="student-filter" options={filterOptions} />
            </div> */}
        </div>
    )
}

import { Button, Select } from '@components'
import { CommonApi } from '@queries'
import { debounce } from 'lodash'
import { Filter, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSupportTicketPermissions } from '../../hooks'
import { FilterSection } from './FilterSection'
import { FilterToggleButton } from './FilterToggleButton'

interface TicketFiltersProps {
    onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>
    activeFilters: FilterState
}

type Member = {
    subadmin?: {
        id?: string
        user?: {
            name?: string
        }
    }
}

type Status = 'assigned' | 'resolved' | 'inProgress'
type Priority = 'low' | 'medium' | 'high' | 'critical'
type DateRange = 'all' | 'today' | 'week' | 'month' | 'overdue'
type FilterMode = 'basic' | 'advanced'
export interface FilterState {
    title: string
    status?: Status
    priority?: Priority
    dateRange?: DateRange
    assignedTo?: string | null
}

const statusOptions: Array<{
    value: Status
    label: string
    color: string
}> = [
    { value: 'assigned', label: 'Opened', color: 'bg-red-500' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
    { value: 'inProgress', label: 'In Progress', color: 'bg-primaryNew' },
]

const priorityOptions: Array<{
    value: Priority
    label: string
    color: string
}> = [
    { value: 'low', label: 'Low', color: 'bg-slate-500' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
    { value: 'high', label: 'High', color: 'bg-[#F7A619]' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
]

const dateRangeOptions: Array<{
    value: DateRange
    label: string
}> = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'overdue', label: 'Over 2 Days' },
]

export function SupportTicketFilter({
    onFilterChange,
    activeFilters,
}: TicketFiltersProps) {
    const [mode, setMode] = useState<FilterMode>('basic')

    const membersList = CommonApi.Teams.useSupportTeamMemberList()
    const memberOptions = useMemo(
        () =>
            membersList?.data?.map((member: Member) => ({
                label: member?.subadmin?.user?.name,
                value: member?.subadmin?.id,
            })) ?? [],
        [membersList?.data]
    )

    const { canSeeAssignedFilter } = useSupportTicketPermissions()
    /** ---------------- Debounced title search ---------------- */
    const onTitleChange = useMemo(
        () =>
            debounce((value: string) => {
                onFilterChange((prev) => ({
                    ...prev,
                    title: value,
                }))
            }, 700),
        [onFilterChange]
    )

    useEffect(() => {
        return () => onTitleChange.cancel()
    }, [onTitleChange])

    /** ---------------- Helpers ---------------- */
    const toggleSingleValue = <K extends 'status' | 'priority'>(
        key: K,
        value: FilterState[K]
    ) => {
        onFilterChange({
            ...activeFilters,
            [key]: value,
        })
    }

    const clearAllFilters = () => {
        onFilterChange({
            title: '',
            status: undefined,
            priority: undefined,
            dateRange: undefined,
            assignedTo: null,
        })
        setMode('basic')
    }

    return (
        <div className="space-y-3">
            {/* Search */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D5468]/40" />
                    <input
                        type="text"
                        defaultValue={activeFilters?.title}
                        onChange={(e) => onTitleChange(e?.target?.value)}
                        placeholder="Search by ticket ID, student name..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F7A619]"
                    />
                </div>

                {mode === 'advanced' ? (
                    <Button
                        onClick={clearAllFilters}
                        className="text-sm text-red-600"
                        variant="error"
                        outline
                    >
                        <X className="w-4 h-4 inline" /> Clear
                    </Button>
                ) : (
                    <Button
                        onClick={() => setMode('advanced')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                        variant="primaryNew"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                )}
            </div>

            {/* Advanced Filters */}
            {mode === 'advanced' && (
                <div className="bg-white p-4 rounded-xl border space-y-4">
                    <FilterSection label="Status">
                        <div className="flex gap-2 flex-wrap">
                            {statusOptions?.map((s) => (
                                <FilterToggleButton
                                    key={s.value}
                                    active={activeFilters?.status === s?.value}
                                    activeClass={s.color}
                                    onClick={() =>
                                        toggleSingleValue('status', s.value)
                                    }
                                >
                                    {s?.label}
                                </FilterToggleButton>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection label="Priority">
                        <div className="flex gap-2 flex-wrap">
                            {priorityOptions?.map((p) => (
                                <FilterToggleButton
                                    key={p?.value}
                                    active={
                                        activeFilters?.priority === p?.value
                                    }
                                    activeClass={p.color}
                                    onClick={() =>
                                        toggleSingleValue('priority', p?.value)
                                    }
                                >
                                    {p?.label}
                                </FilterToggleButton>
                            ))}
                        </div>
                    </FilterSection>

                    {canSeeAssignedFilter && (
                        <FilterSection label="Assigned To">
                            <div className="relative z-50">
                                <Select
                                    name="assignedTo"
                                    options={memberOptions}
                                    loading={membersList.isLoading}
                                    onChange={(e: any) =>
                                        onFilterChange({
                                            ...activeFilters,
                                            assignedTo: e,
                                        })
                                    }
                                    onlyValue
                                />
                            </div>
                        </FilterSection>
                    )}

                    <FilterSection label="Date Range">
                        <div className="flex gap-2 flex-wrap">
                            {dateRangeOptions.map((d) => (
                                <FilterToggleButton
                                    key={d?.value}
                                    active={
                                        activeFilters?.dateRange === d?.value
                                    }
                                    activeClass="bg-[#0D5468]"
                                    onClick={() =>
                                        onFilterChange({
                                            ...activeFilters,
                                            dateRange: d?.value,
                                        })
                                    }
                                >
                                    {d?.label}
                                </FilterToggleButton>
                            ))}
                        </div>
                    </FilterSection>
                </div>
            )}
        </div>
    )
}

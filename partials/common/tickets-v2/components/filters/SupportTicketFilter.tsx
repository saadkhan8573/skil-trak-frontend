import { AuthorizedUserComponent, Button, Select } from '@components'
import { CommonApi, AdminApi } from '@queries'
import { Search, Filter, X, Calendar, UserCheck } from 'lucide-react'
import { useState, useCallback } from 'react'
import { FilterSection } from './FilterSection'
import { FilterToggleButton } from './FilterToggleButton'
import { debounce } from 'lodash'
import { UserRoles } from '@constants'
import { SubAdmin, UserStatus } from '@types'

interface TicketFiltersProps {
    onFilterChange: (filters: FilterState) => void
    activeFilters: FilterState
}

export interface FilterState {
    title: string
    status: any
    priority: any
    dateRange: string
    assignedTo: any
}

const statusOptions = [
    { value: 'assigned', label: 'Assigned', color: 'bg-red-500' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
]

const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-slate-500' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
    { value: 'high', label: 'High', color: 'bg-[#F7A619]' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
]

const dateRangeOptions = [
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
    const [showAdvanced, setShowAdvanced] = useState(false)

    const membersList = CommonApi.Teams.useSupportTeamMemberList()

    const memberOptions =
        membersList?.data?.map((member: any) => ({
            label: member?.subadmin?.user?.name,
            value: member?.subadmin?.id,
        })) ?? []

    /** ---------------- Debounced title search ---------------- */
    const onTitleChange = useCallback(
        debounce((value: string) => {
            onFilterChange({ ...activeFilters, title: value })
        }, 700),
        [onFilterChange]
    )

    /** ---------------- Helpers ---------------- */
    const toggleSingleValue = (key: 'status' | 'priority', value: string) => {
        if (key === 'status') {
            onFilterChange({
                ...activeFilters,
                status: value,
            })
        } else {
            onFilterChange({
                ...activeFilters,
                priority: value,
            })
        }
    }

    const clearAllFilters = () => {
        onFilterChange({
            title: '',
            status: '',
            priority: '',
            dateRange: '',
            assignedTo: null,
        })
        setShowAdvanced(false)
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

                {showAdvanced ? (
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
                        onClick={() => setShowAdvanced(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                        variant="primaryNew"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="bg-white p-4 rounded-xl border space-y-4">
                    <FilterSection label="Status">
                        <div className="flex gap-2 flex-wrap">
                            {statusOptions?.map((s) => (
                                <FilterToggleButton
                                    key={s.value}
                                    active={activeFilters?.status?.includes(
                                        s?.value
                                    )}
                                    activeClass={s.color}
                                    onClick={() =>
                                        toggleSingleValue('status', s?.value)
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
                                    active={activeFilters?.priority?.includes(
                                        p?.value
                                    )}
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

                    <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
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
                    </AuthorizedUserComponent>

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

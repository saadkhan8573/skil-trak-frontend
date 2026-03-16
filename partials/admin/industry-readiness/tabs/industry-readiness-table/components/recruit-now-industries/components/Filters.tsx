import { debounce } from 'lodash'
import { ChevronDown, Filter, Search, X } from 'lucide-react'
import React, { useMemo } from 'react'

export const Filters = ({
    filterInterest,
    setFilterInterest,
    searchTerm,
    setSearchTerm,
}: any) => {
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchTerm(value)
            }, 700),
        [setSearchTerm]
    )

    const activeFiltersCount =
        [filterInterest].filter((f) => f !== 'all').length +
        (searchTerm ? 1 : 0)

    const clearAllFilters = () => {
        setFilterInterest('all')
        setSearchTerm('')
    }

    return (
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#044866]" />
                    <h3 className="text-slate-900 font-bold">Filters</h3>

                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-0.5 bg-[#044866] text-white text-xs rounded-full font-semibold">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>

                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-[#044866] hover:text-[#0D5468] font-semibold flex items-center gap-1"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search Filter */}
                <div>
                    <label className="block text-xs text-slate-600 font-semibold mb-1.5 uppercase tracking-wider">
                        Search
                    </label>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                        <input
                            type="text"
                            defaultValue={searchTerm}
                            onChange={(e) => {
                                debouncedSearch(e.target.value)
                            }}
                            placeholder="Search by name..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium hover:border-[#044866] transition-colors focus:outline-none focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Interest Filter */}
                {/* <div>
                    <label className="block text-xs text-slate-600 font-semibold mb-1.5 uppercase tracking-wider">
                        Interest
                    </label>
                    <div className="relative">
                        <select
                            value={filterInterest}
                            onChange={(e) => setFilterInterest(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium appearance-none cursor-pointer hover:border-[#044866] transition-colors focus:outline-none focus:ring-2 focus:ring-[#044866] focus:border-transparent"
                        >
                            <option value="all">All</option>
                            <option value="interested">Interested</option>
                            <option value="not-interested">
                                Not Interested
                            </option>
                            <option value="not-contacted">Not Contacted</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

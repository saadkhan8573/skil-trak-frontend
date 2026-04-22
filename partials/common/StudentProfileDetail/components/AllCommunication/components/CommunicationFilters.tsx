import { Typography, useWorldwideStudentDataRestriction } from '@components'
import { CommunicationFiltersProps } from '../types'
import { useAppSelector } from '@redux'

export const CommunicationFilters: React.FC<CommunicationFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
}) => {
    const typesOptions = [
        { type: 'all', name: 'All' },
        { type: 'tickets', name: 'Ticket' },
        { type: 'notes', name: 'Notes' },
        { type: 'emails', name: 'Emails' },
        { type: 'calls', name: 'Calls' },
        { type: 'twilio', name: 'Messages' },
        { type: 'workplaceHistory', name: 'Workplace Status' },
        { type: 'statusHistory', name: 'Status History' },
    ]

    return (
        <div className="flex items-center space-x-4 mb-2 px-4 py-1.5 bg-gray-50">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search communications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
            </div>

            {/* <div className="flex items-center space-x-2">
                <Typography variant="small" color="text-gray-600">
                    Pinned to All
                </Typography>
                <select
                    value={fromFilter}
                    onChange={(e) => setFromFilter(e.target.value)}
                    className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="All">All</option>
                    <option value="PinnedNotes">Pinned Notes</option>
                    <option value="internalNotes">Internal Notes</option>
                </select>
            </div> */}

            <div className="flex items-center space-x-2">
                <Typography variant="small" color="text-gray-600">
                    Type:
                </Typography>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                >
                    {typesOptions?.map((types) => (
                        <option key={types?.type} value={types?.type}>
                            {types?.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

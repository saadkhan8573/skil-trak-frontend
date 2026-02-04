// utils/ticketFilters.ts

import { FilterState } from "./SupportTicketFilter"

export const filtersToQuery = (filters: FilterState) => ({
    ...(filters.title && { title: filters.title }),
    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
    ...(filters.dateRange && { dateRange: filters.dateRange }),
    ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
})

export const queryToFilters = (query: any): FilterState => ({
    title: query.title ?? '',
    status: query.status,
    priority: query.priority,
    dateRange: query.dateRange,
    assignedTo: query.assignedTo ?? null,
})

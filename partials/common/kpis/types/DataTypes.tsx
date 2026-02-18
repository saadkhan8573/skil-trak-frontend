import { UserRoles } from '@constants'
import { ColumnDef, HeaderGroup, Row } from '@tanstack/react-table'
import { Paginate } from '@types'

export type Employee = {
    checked: any
    id: number
    avatar: string
    name: string
    email: string
    department: string
    kpiScore: number
    createdAt: any
    metrics: {
        color: any
        blue: number
        yellow: number
        red: number
        green: number
        gray: number
    }
    verified: boolean
}
export interface KPIData {
    day: number
    value: number
}

export interface MetricField {
    id: string
    name: string
    value: number
    color: string
    isActive: boolean
    targetId: string
}

export interface DepartmentData {
    id: number
    icon: any
    title: string
    metrics: MetricField[]
}
export interface DepartmentItemProps {
    department: DepartmentData
    isOpen: boolean
    onToggle: () => void
}

export interface TableProps<T> {
    data: T[]
    columns: ColumnDef<T, any>[]
    title?: string
    titleIcon?: React.ReactNode
    showSearch?: boolean
    searchPlaceholder?: string
    onSearch?: (query: string) => void
    itemsPerPageOptions?: number[]
    defaultItemsPerPage?: number
    children: any
}

export interface EmployeeDetails {
    name: string
    position: string
    department: string
    employmentStatus: 'Active' | 'Inactive'
    efficiency: number
}

export interface TableData {
    studentId: string
    name: string
    email: string
    phone: string
    courses: string

    appointmentDate?: string

    workplaceRequestDate?: string
    requestStatus?: string

    completedDate?: string
    completionStatus?: string

    uploadedDate?: string
    documentType?: string
    verificationStatus?: string

    industry?: string
    contactPerson?: string
    callDate?: string
    callStatus?: string
    followUpDate?: string

    callDuration?: string
    callNotes?: string
    followUpRequired?: string

    accountType?: string
    lastActivity?: string
    accountStatus?: string
    creationDate?: string
}

export interface EmployeeDetails {
    name: string
    position: string
    department: string
    employmentStatus: 'Active' | 'Inactive'
    efficiency: number
}

export interface KpiTableProps {
    table: {
        getHeaderGroups: () => HeaderGroup<TableData>[]
        getRowModel: () => { rows: Row<TableData>[] }
    }
    className?: string
    enableRowSelection?: boolean
}

export interface KpiTableProps {
    table: {
        getHeaderGroups: () => HeaderGroup<TableData>[]
        getRowModel: () => { rows: Row<TableData>[] }
    }
    className?: string
}

export interface DepartmentMetric {
    label: string
    value: number
    maxValue: number
    color: string
}

export interface KpiAppointment {
    objectId: number
    createdAt: Date
    isDuplicated: boolean
    isVerified: boolean
    appointmentid: number
    appointmentcreatedat: Date
    date: Date
    appointmentby: string
    appointmentbyrole: UserRoles
    appointmentfor: string
    appointmentforrole: UserRoles
    typeid: number
    type: string
    courseid: number
    course: string
    coursecode: string
    appointmenttypetitle: string
}

export interface DepartmentActivity {
    label: string
    value: number
}

export interface ChartSegment {
    label: string
    value: number
    color: string
}

export interface DepartmentInfo {
    name: string
    growth: number
    metrics: DepartmentMetric[]
    activities: DepartmentActivity[]
    chartSegments: ChartSegment[]
}

export interface DoughnutChartProps {
    segments: ChartSegment[]
    empty: boolean
}

export interface KPIData {
    day: number
    value: number
}

export interface DateRange {
    startDate: Date
    endDate: Date
}

export interface Week {
    start: Date
    end: Date
    weekNumber: number
}

export interface DataContextType {
    employees: Employee[]
    filteredEmployees: Employee[]
    monthlyData: { [key: string]: KPIData[] }
    months: string[]
    selectedMonth: Date
    setSelectedMonth: (date: Date) => void
    selectedWeeks: DateRange[]
    setSelectedWeeks: (weeks: DateRange[]) => void
    dateRange: DateRange | null
    setDateRange: (range: DateRange | null) => void
    currentMonthWeeks: Week[]
}

export interface MetricsCellProps {
    row: {
        original: {
            metrics: {
                [key: string]: number
            }
        }
    }
}

export interface SerialNumberProps {
    pagination: Paginate
    row: {
        original: {
            id: number
        }
        index: number
    }
}

export interface ItemsPerPageSelectorProps {
    itemsPerPage: number
    itemsPerPageOptions: number[]
    onChange: (value: number) => void
}

export interface TablePaginationProps {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    itemsPerPageOptions: number[]
    onPageChange: (page: number) => void
    onItemsPerPageChange: (itemsPerPage: number) => void
}

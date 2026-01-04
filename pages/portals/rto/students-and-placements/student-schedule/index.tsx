import { Badge, Button, Card, Select, TextInput } from '@components'
import { ScrollArea } from '@components/ui/scroll-area'

import { Separator } from '@components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'
import { RtoLayoutV2 } from '@layouts'
import { OptionType } from '@types'
import {
    Building2,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Filter,
    LayoutGrid,
    List,
    Mail,
    MapPin,
    Printer,
    RefreshCw,
    Search,
    Users,
    X,
} from 'lucide-react'
import React, { ReactElement, useState } from 'react'

// Generate more realistic mock data for 5-70+ students
const generateMockScheduleData = () => {
    const students = [
        'Sarah Johnson',
        'Michael Chen',
        'Emma Wilson',
        'David Brown',
        'Lisa Anderson',
        'James Taylor',
        'Sophie Martin',
        'Ryan Lee',
        'Olivia Garcia',
        'Daniel White',
        'Isabella Martinez',
        'Ethan Thompson',
        'Ava Robinson',
        'Noah Clark',
        'Mia Rodriguez',
        'Lucas Wright',
        'Charlotte Lopez',
        'Mason Hill',
        'Amelia Scott',
        'Logan Green',
        'Harper Adams',
        'Alexander Baker',
        'Evelyn Nelson',
        'Benjamin Carter',
        'Abigail Mitchell',
        'Sebastian Perez',
        'Emily Roberts',
        'William Turner',
        'Elizabeth Phillips',
        'Jacob Campbell',
        'Sofia Parker',
        'Aiden Evans',
        'Ella Edwards',
        'Matthew Collins',
        'Avery Stewart',
        'Samuel Sanchez',
        'Scarlett Morris',
        'Joseph Rogers',
        'Grace Reed',
        'Andrew Cook',
        'Chloe Morgan',
        'Christopher Bell',
        'Madison Murphy',
        'Joshua Bailey',
        'Victoria Rivera',
        'Ryan Cooper',
        'Zoey Richardson',
        'Nathan Cox',
        'Lily Howard',
        'Dylan Ward',
        'Hannah Torres',
        'Tyler Peterson',
        'Natalie Gray',
        'Connor Ramirez',
        'Addison James',
        'Jack Watson',
        'Brooklyn Brooks',
        'Luke Kelly',
        'Aubrey Sanders',
        'Owen Price',
        'Penelope Bennett',
        'Gabriel Wood',
        'Lillian Barnes',
        'Carter Ross',
        'Zoe Henderson',
        'Jayden Coleman',
        'Layla Jenkins',
        'Isaac Perry',
        'Nora Powell',
        'Levi Long',
        'Ellie Patterson',
        'Caleb Hughes',
        'Aria Flores',
        'Wyatt Washington',
        'Riley Butler',
    ]

    const courses = [
        {
            code: 'CHC33021',
            name: 'Certificate III in Individual Support',
            sector: 'Community Services',
            color: '#044866',
        },
        {
            code: 'CHC42021',
            name: 'Certificate IV in Community Services',
            sector: 'Community Services',
            color: '#044866',
        },
        {
            code: 'SIT30821',
            name: 'Certificate III in Commercial Cookery',
            sector: 'Hospitality',
            color: '#F7A619',
        },
        {
            code: 'ICT50220',
            name: 'Diploma of Information Technology',
            sector: 'IT',
            color: '#0D5468',
        },
        {
            code: 'BSB40120',
            name: 'Certificate IV in Business',
            sector: 'Business',
            color: '#044866',
        },
    ]

    const locations = [
        'Community Care Center',
        'Aged Care Facility',
        'Healthcare Center',
        'Community Hub',
        'Grand Hotel Kitchen',
        'Restaurant Plaza',
        'City Café',
        'Weekend Bistro',
        'Tech Solutions Ltd',
        'Digital Innovations Inc',
        'IT Services Corp',
        'Corporate Office Park',
        'Business Hub',
        'Financial Services Center',
    ]

    const coordinators = [
        'Jane Smith',
        'John Davis',
        'Mike Johnson',
        'Sarah Williams',
        'David Chen',
    ]
    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]
    const times = [
        '6:00 AM - 12:00 PM',
        '7:00 AM - 1:00 PM',
        '8:00 AM - 2:00 PM',
        '9:00 AM - 3:00 PM',
        '10:00 AM - 4:00 PM',
        '9:00 AM - 5:00 PM',
        '8:30 AM - 2:30 PM',
        '1:00 PM - 5:00 PM',
    ]

    const scheduleData = []
    let id = 1

    // Generate 60-70 student schedules
    for (let i = 0; i < 65; i++) {
        const course = courses[Math.floor(Math.random() * courses.length)]
        const student = students[i % students.length]
        const day = days[Math.floor(Math.random() * days.length)]

        scheduleData.push({
            id: id++,
            studentName: student,
            course: `${course.code} - ${course.name}`,
            courseCode: course.code,
            sector: course.sector,
            day: day,
            time: times[Math.floor(Math.random() * times.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            coordinator:
                coordinators[Math.floor(Math.random() * coordinators.length)],
            status: Math.random() > 0.3 ? 'confirmed' : 'pending',
            color: course.color,
        })
    }

    return scheduleData
}

const mockScheduleData = generateMockScheduleData()

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

// Generate dates for current week (Jan 15-21, 2025)
const getWeekDates = () => {
    const startDate = new Date(2025, 0, 15) // Jan 15, 2025 (Monday)
    return daysOfWeek.map((day, index) => {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)
        return {
            day,
            date: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
        }
    })
}

const weekDates = getWeekDates()

const sectors = [
    'All Sectors',
    'Community Services',
    'Hospitality',
    'IT',
    'Business',
]
const courses = [
    'All Courses',
    'CHC33021 - Certificate III in Individual Support',
    'CHC42021 - Certificate IV in Community Services',
    'SIT30821 - Certificate III in Commercial Cookery',
    'ICT50220 - Diploma of Information Technology',
    'BSB40120 - Certificate IV in Business',
]

const coordinators = [
    'All Coordinators',
    'Jane Smith',
    'John Davis',
    'Mike Johnson',
    'Sarah Williams',
    'David Chen',
]

export const StudentSchedulePage = () => {
    const [selectedSector, setSelectedSector] = useState('All Sectors')
    const [selectedCourse, setSelectedCourse] = useState('All Courses')
    const [selectedCoordinator, setSelectedCoordinator] =
        useState('All Coordinators')
    const [selectedStatus, setSelectedStatus] = useState('All Status')
    const [currentWeek, setCurrentWeek] = useState('Week of Jan 15-21, 2025')
    const [viewMode, setViewMode] = useState<'week' | 'list'>('week')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDay, setSelectedDay] = useState<string>('Monday')
    const [showFilters, setShowFilters] = useState(true)
    const [density, setDensity] = useState<'comfortable' | 'compact'>(
        'comfortable'
    )

    // Filter schedule data
    const filteredSchedule = mockScheduleData.filter((item) => {
        const sectorMatch =
            selectedSector === 'All Sectors' || item.sector === selectedSector
        const courseMatch =
            selectedCourse === 'All Courses' || item.course === selectedCourse
        const coordinatorMatch =
            selectedCoordinator === 'All Coordinators' ||
            item.coordinator === selectedCoordinator
        const statusMatch =
            selectedStatus === 'All Status' || item.status === selectedStatus
        const searchMatch =
            searchQuery === '' ||
            item.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase())

        return (
            sectorMatch &&
            courseMatch &&
            coordinatorMatch &&
            statusMatch &&
            searchMatch
        )
    })

    // Group by day
    const scheduleByDay = daysOfWeek.map((day) => ({
        day,
        students: filteredSchedule.filter((item) => item.day === day),
        confirmed: filteredSchedule.filter(
            (item) => item.day === day && item.status === 'confirmed'
        ).length,
        pending: filteredSchedule.filter(
            (item) => item.day === day && item.status === 'pending'
        ).length,
    }))

    const totalScheduled = filteredSchedule.length
    const confirmedCount = filteredSchedule.filter(
        (s) => s.status === 'confirmed'
    ).length
    const pendingCount = filteredSchedule.filter(
        (s) => s.status === 'pending'
    ).length

    // Group by coordinator
    const coordinatorStats = coordinators.slice(1).map((coord) => ({
        name: coord,
        count: filteredSchedule.filter((s) => s.coordinator === coord).length,
    }))

    const clearFilters = () => {
        setSelectedSector('All Sectors')
        setSelectedCourse('All Courses')
        setSelectedCoordinator('All Coordinators')
        setSelectedStatus('All Status')
        setSearchQuery('')
        // toast.success("Filters cleared");
    }

    const hasActiveFilters =
        selectedSector !== 'All Sectors' ||
        selectedCourse !== 'All Courses' ||
        selectedCoordinator !== 'All Coordinators' ||
        selectedStatus !== 'All Status' ||
        searchQuery !== ''

    // Quick filter presets
    const applyQuickFilter = (type: string) => {
        clearFilters()
        if (type === 'pending') {
            setSelectedStatus('pending')
            // toast.success("Showing pending placements");
        } else if (type === 'today') {
            const today = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
            })
            setSelectedDay(today)
            setViewMode('list')
            // toast.success(`Showing ${today}'s schedule`);
        } else if (type === 'hospitality') {
            setSelectedSector('Hospitality')
            // toast.success("Showing Hospitality sector");
        }
    }

    // Export functions
    // const handleExport = () => {
    //     toast.success("Schedule exported successfully");
    // };

    // const handlePrint = () => {
    //     toast.success("Opening print preview...");
    // };

    // const handleEmail = () => {
    //     toast.success("Email dialog opened");
    // };

    // Compact student card component
    const StudentCard = ({
        student,
        compact = false,
    }: {
        student: any
        compact?: boolean
    }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`${compact || density === 'compact' ? 'p-2' : 'p-3'
                            } rounded-lg border border-border/50 hover:border-primaryNew/50 transition-all hover:shadow-md cursor-pointer bg-card group`}
                        style={{
                            borderLeftWidth: '3px',
                            borderLeftColor: student.color,
                        }}
                    >
                        <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                                <p
                                    className={`font-semibold ${compact || density === 'compact'
                                            ? 'text-xs'
                                            : 'text-sm'
                                        } line-clamp-1 group-hover:text-primaryNew transition-colors`}
                                >
                                    {student.studentName}
                                </p>
                                {/* <Badge
                                    variant={
                                        student.status === 'confirmed'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                    className={`${
                                        compact || density === 'compact'
                                            ? 'text-[10px] px-1 py-0'
                                            : 'text-xs'
                                    } shrink-0 ${
                                        student.status === 'confirmed'
                                            ? '!bg-green-500/10 !text-green-700 !border-green-200'
                                            : '!bg-orange-500/10 !text-orange-700 !border-orange-200'
                                    }`}
                                >
                                    {student.status}
                                </Badge> */}
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-start gap-1.5">
                                    <Clock
                                        className={`${compact || density === 'compact'
                                                ? 'h-2.5 w-2.5'
                                                : 'h-3 w-3'
                                            } text-muted-foreground mt-0.5 shrink-0`}
                                    />
                                    <p
                                        className={`${compact || density === 'compact'
                                                ? 'text-[10px]'
                                                : 'text-xs'
                                            } text-muted-foreground`}
                                    >
                                        {student.time}
                                    </p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <MapPin
                                        className={`${compact || density === 'compact'
                                                ? 'h-2.5 w-2.5'
                                                : 'h-3 w-3'
                                            } text-muted-foreground mt-0.5 shrink-0`}
                                    />
                                    <p
                                        className={`${compact || density === 'compact'
                                                ? 'text-[10px]'
                                                : 'text-xs'
                                            } text-muted-foreground line-clamp-1`}
                                    >
                                        {student.location}
                                    </p>
                                </div>
                                {!(compact && density === 'compact') && (
                                    <div className="flex items-start gap-1.5">
                                        <Building2 className="h-3 w-3 text-primaryNew mt-0.5 shrink-0" />
                                        <p className="text-xs text-primaryNew font-medium">
                                            {student.sector}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-2">
                        <p className="font-semibold">{student.studentName}</p>
                        <Separator />
                        <div className="space-y-1 text-xs">
                            <p>
                                <span className="font-medium">Course:</span>{' '}
                                {student.courseCode}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Coordinator:
                                </span>{' '}
                                {student.coordinator}
                            </p>
                            <p>
                                <span className="font-medium">Location:</span>{' '}
                                {student.location}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span>{' '}
                                {student.time}
                            </p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br !from-primaryNew to-[#0d5468] flex items-center justify-center shadow-premium">
                        <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Student Schedule</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage weekly placement schedules
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="h-9 w-10 !border !border-gray-200"
                                    variant="action"
                                    Icon={Download}
                                    mini
                                />
                            </TooltipTrigger>
                            <TooltipContent>Export Schedule</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="h-9 w-10 !border !border-gray-200"
                                    variant="action"
                                    Icon={Printer}
                                    mini
                                />
                            </TooltipTrigger>
                            <TooltipContent>Print Schedule</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="h-9 w-10 !border !border-gray-200"
                                    variant="action"
                                    Icon={Mail}
                                    mini
                                />
                            </TooltipTrigger>
                            <TooltipContent>Email Schedule</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Select
                        showError={false}
                        name={'density'}
                        options={[
                            {
                                label: 'Comfortable',
                                value: 'comfortable',
                            },
                            {
                                label: 'Compact',
                                value: 'compact',
                            },
                        ]}
                        value={density}
                        onChange={(e: any) => {
                            setDensity(e)
                        }}
                    />
                </div>
            </div>

            {/* Compact Stats & Controls Row */}
            <Card className="p-3 border-border/50 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Stats */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primaryNew/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-primaryNew" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground">
                                    Total
                                </p>
                                <p className="text-lg font-bold text-primaryNew">
                                    {totalScheduled}
                                </p>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground">
                                    Confirmed
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    {confirmedCount}
                                </p>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground">
                                    Pending
                                </p>
                                <p className="text-lg font-bold text-orange-600">
                                    {pendingCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Week Navigation - Compact */}
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-7 w-8 !border !border-gray-200"
                            variant="action"
                            Icon={ChevronLeft}
                            mini
                        />

                        <div className="text-center px-3">
                            <p className="text-xs font-semibold">
                                {currentWeek}
                            </p>
                        </div>

                        <Button
                            className="h-7 w-8 !border !border-gray-200"
                            variant="action"
                            Icon={ChevronRight}
                            mini
                        />
                    </div>
                </div>
            </Card>

            {/* Compact Filters & Coordinators */}
            <Card className="p-3 border-border/50 shadow-sm">
                <div className="space-y-3">
                    {/* Quick Actions Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                Icon={Clock}
                                text="Pending"
                                onClick={() => applyQuickFilter('pending')}
                                className="py-1"
                                variant="primaryNew"
                                shape="pill"
                                outline
                            />
                            <Badge
                                Icon={Calendar}
                                text="Today"
                                onClick={() => applyQuickFilter('today')}
                                className="py-1"
                                variant="primaryNew"
                                shape="pill"
                                outline
                            />
                            <Button
                                className="rounded-full h-7 w-14 !border !border-primaryNew"
                                variant="primaryNew"
                                outline
                                Icon={RefreshCw}
                                mini
                                onClick={() => window.location.reload()}
                            />
                        </div>

                        {/* Coordinator Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                                Coordinators:
                            </span>
                            {coordinatorStats.map((coord) => (
                                <button
                                    key={coord.name}
                                    onClick={() => {
                                        setSelectedCoordinator(coord.name)
                                        // toast.success(`Filtered by ${coord.name}`);
                                    }}
                                    className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${selectedCoordinator === coord.name
                                            ? 'bg-primaryNew text-primary-foreground'
                                            : 'bg-mutedNew hover:bg-mutedNew/80'
                                        }`}
                                >
                                    {coord.name.split(' ')[0]} ({coord.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Compact Search & Filters */}
            <Card className="p-3 border-border/50 shadow-sm">
                <div className="space-y-2">
                    {/* Search Bar & Toggle */}
                    <div className="flex items-center gap-2">
                        {/* <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search student, course, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-8 text-sm"
                            />
                        </div> */}
                        <TextInput
                            placeholder="Search student, course, or location..."
                            value={searchQuery}
                            onChange={(e: any) =>
                                setSearchQuery(e.target.value)
                            }
                            className="pl-8 h-8 text-sm"
                            name={'search'}
                            showError={false}
                        />
                        {hasActiveFilters && (
                            <Button
                                onClick={clearFilters}
                                className="h-8 text-xs px-2"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                        <Button
                            className="h-10 !border !border-gray-200"
                            variant="action"
                            Icon={Filter}
                            onClick={() => setShowFilters(!showFilters)}
                            text={showFilters ? 'Hide' : 'Filters'}
                        />
                    </div>

                    {/* Compact Filter Dropdowns */}
                    {showFilters && (
                        <div className="grid grid-cols-2 w-full md:grid-cols-4 gap-2 pt-2 border-t">
                            <Select
                                showError={false}
                                name={'sector'}
                                menuPlacement={'top'}
                                options={sectors.map((sector) => ({
                                    label: sector,
                                    value: sector,
                                }))}
                                value={selectedSector}
                                onChange={(e: any) => {
                                    setSelectedSector(e)
                                }}
                                placeholder="Sector"
                                className="text-xs"
                            />
                            <Select
                                name={'course'}
                                showError={false}
                                menuPlacement={'top'}
                                options={courses.map((course) => ({
                                    label:
                                        course.length > 20
                                            ? course.substring(0, 20) + '...'
                                            : course,
                                    value: course,
                                }))}
                                value={selectedCourse}
                                onChange={(e: any) => {
                                    setSelectedCourse(e)
                                }}
                                placeholder="Course"
                                className="text-xs"
                            />
                            <Select
                                showError={false}
                                name={'coordinator'}
                                menuPlacement={'top'}
                                options={coordinators.map((coordinator) => ({
                                    label: coordinator,
                                    value: coordinator,
                                }))}
                                value={selectedCoordinator}
                                onChange={(e: any) => {
                                    setSelectedCoordinator(e)
                                }}
                                placeholder="Coordinator"
                                className="text-xs"
                            />
                            <Select
                                showError={false}
                                name={'status'}
                                menuPlacement={'top'}
                                options={[
                                    {
                                        label: 'All Status',
                                        value: 'All Status',
                                    },
                                    {
                                        label: 'Confirmed',
                                        value: 'confirmed',
                                    },
                                    {
                                        label: 'Pending',
                                        value: 'pending',
                                    },
                                ]}
                                value={selectedStatus}
                                onChange={(e: any) => {
                                    setSelectedStatus(e)
                                }}
                                placeholder="Status"
                                className="text-xs"
                            />
                        </div>
                    )}
                </div>
            </Card>

            {/* View Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Schedule View</h3>
                    <Badge
                        text={`${totalScheduled} Results`}
                        variant="primaryNew"
                        shape="pill"
                        outline
                    />
                </div>
                <div className="flex items-center gap-1 bg-mutedNew rounded-lg p-1">
                    {[
                        {
                            variant: 'primaryNew' as const,
                            icon: LayoutGrid,
                            onClick: () => setViewMode('week'),
                            text: 'Week',
                            key: 'week',
                        },
                        {
                            variant: 'primaryNew' as const,
                            icon: List,
                            onClick: () => setViewMode('list'),
                            text: 'Day',
                            key: 'list',
                        },
                    ].map((button, index) => (
                        <Button
                            key={index}
                            variant={
                                viewMode === button.key
                                    ? 'primaryNew'
                                    : 'secondary'
                            }
                            Icon={button.icon}
                            onClick={button.onClick}
                            text={button.text}
                        />
                    ))}
                </div>
            </div>

            {/* Schedule Content */}
            {viewMode === 'week' ? (
                /* Week View - Scrollable Grid */
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {scheduleByDay.map((daySchedule, index) => {
                        const dateInfo = weekDates[index]
                        return (
                            <Card
                                key={daySchedule.day}
                                noPadding
                                className="border-border/50 shadow-sm overflow-hidden flex flex-col !py-0"
                            >
                                {/* Day Header */}
                                <div className="rounded-t-xl bg-gradient-to-r !from-primaryNew !to-[#0D5468] p-3 text-center sticky top-0 z-10">
                                    <p className="font-bold text-white text-sm">
                                        {daySchedule.day}
                                    </p>
                                    <p className="text-xs text-white/90 font-medium">
                                        {dateInfo.month} {dateInfo.date}
                                    </p>
                                    <p className="text-xs text-white/80 mt-0.5">
                                        {daySchedule.students.length} Total
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <Badge
                                            text={`${daySchedule.confirmed} ✓`}
                                            shape="pill"
                                            className="!p-0.5 !bg-green-500/20 !text-white border !border-white/30 !text-[10px] !px-1.5 !py-0"
                                        ></Badge>
                                        <Badge
                                            text={`${daySchedule.pending} ⏱`}
                                            shape="pill"
                                            className="!p-0.5 !bg-orange-500/20 !text-white border !border-white/30 !text-[10px] !px-1.5 !py-0"
                                        ></Badge>
                                    </div>
                                </div>

                                {/* Students List - Scrollable */}
                                <ScrollArea className="flex-1 h-[600px]">
                                    <div className="p-2 space-y-2">
                                        {daySchedule.students.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                                <div className="h-12 w-12 rounded-full bg-mutedNew flex items-center justify-center mb-2">
                                                    <Calendar className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    No students scheduled
                                                </p>
                                            </div>
                                        ) : (
                                            daySchedule.students.map(
                                                (student) => (
                                                    <StudentCard
                                                        key={student.id}
                                                        student={student}
                                                        compact
                                                    />
                                                )
                                            )
                                        )}
                                    </div>
                                </ScrollArea>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                /* Day View - Tabbed Interface */
                <Tabs
                    className="w-full"
                    value={selectedDay}
                    onValueChange={setSelectedDay}
                >
                    <TabsList className="grid w-full grid-cols-7 mb-4">
                        {daysOfWeek.map((day, index) => {
                            const dayData = scheduleByDay.find(
                                (d) => d.day === day
                            )
                            const dayCount = dayData?.students.length || 0
                            const dateInfo = weekDates[index]
                            return (
                                <TabsTrigger
                                    key={day}
                                    value={day}
                                    className="relative text-xs"
                                >
                                    <div className="flex flex-col items-center gap-0.5">
                                        <span>{day.substring(0, 3)}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {dateInfo.month} {dateInfo.date}
                                        </span>
                                        {dayCount > 0 && (
                                            <Badge
                                                text={dayCount + ''}
                                                variant="primaryNew"
                                            />
                                        )}
                                    </div>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {daysOfWeek.map((day, index) => {
                        const dayData = scheduleByDay.find((d) => d.day === day)
                        const dateInfo = weekDates[index]
                        return (
                            <TabsContent key={day} value={day} className="mt-0">
                                <Card noPadding className="border-border/50">
                                    <div className="p-4 border-b bg-gradient-to-r from-primaryNew/8 to-primaryNew/5">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {day} - {dateInfo.month}{' '}
                                                    {dateInfo.date}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {dayData?.students.length ||
                                                        0}{' '}
                                                    students •{' '}
                                                    {dayData?.confirmed || 0}{' '}
                                                    confirmed •{' '}
                                                    {dayData?.pending || 0}{' '}
                                                    pending
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    Icon={Users}
                                                    text={`${dayData?.students
                                                            .length || 0
                                                        }`}
                                                    variant="primaryNew"
                                                    shape="pill"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <ScrollArea className="h-[500px]">
                                        <div className="p-4">
                                            {!dayData ||
                                                dayData.students.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-60 text-center">
                                                    <div className="h-16 w-16 rounded-full bg-mutedNew flex items-center justify-center mb-3">
                                                        <Calendar className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <p className="font-semibold mb-1">
                                                        No Students Scheduled
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        There are no placements
                                                        for {day}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {dayData.students.map(
                                                        (student) => (
                                                            <StudentCard
                                                                key={student.id}
                                                                student={
                                                                    student
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </Card>
                            </TabsContent>
                        )
                    })}
                </Tabs>
            )}

            {/* Summary Card */}
            {filteredSchedule.length > 0 && (
                <Card className="border border-primaryNew/20 bg-gradient-to-r from-primaryNew/5 to-secondary/5">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primaryNew to-[#0d5468] flex items-center justify-center shrink-0 shadow-premium">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">
                                Weekly Summary
                            </p>
                            <p className="text-xs text-muted-foreground  leading-relaxed">
                                {totalScheduled} students scheduled across{' '}
                                {
                                    scheduleByDay.filter(
                                        (d) => d.students.length > 0
                                    ).length
                                }{' '}
                                days this week. {confirmedCount} confirmed (
                                {(
                                    (confirmedCount / totalScheduled) *
                                    100
                                ).toFixed(0)}
                                %), {pendingCount} pending (
                                {(
                                    (pendingCount / totalScheduled) *
                                    100
                                ).toFixed(0)}
                                %).
                                {hasActiveFilters && ' Active filters applied.'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}

StudentSchedulePage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: Calendar,
                title: 'Student Schedule',
                description: 'Manage weekly placement schedules',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default StudentSchedulePage

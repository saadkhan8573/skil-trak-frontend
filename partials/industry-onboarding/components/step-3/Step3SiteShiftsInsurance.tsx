import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
    Plus,
    X,
    MapPin,
    Clock,
    Shield,
    Calendar,
    Building,
    Car,
    Train,
    Sparkles,
    CheckCircle,
    AlertTriangle,
    Info,
    Star,
    GripVertical,
    Copy,
    Download,
    ExternalLink,
    Navigation,
    Phone,
    Mail,
    Globe,
    Search,
    Filter,
    MoreHorizontal,
    TrendingUp,
    Users,
    Target,
    Zap,
    Crown,
    Award,
    Eye,
    Edit,
    Settings,
    Upload,
    FileImage,
    Trash2,
    RotateCcw,
    Save,
    AlertCircle,
    Timer,
    MapPinned,
    Compass,
    Route,
    CreditCard,
    FileCheck,
    Lock,
    Unlock,
} from 'lucide-react'
import { Badge, Button, Card, Switch, TextArea, TextInput } from '@components'
import { Label } from '@components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs'

// import { HelpPanel } from "../help-panel";

interface Site {
    address: string
    parking: string
    transport: string
    coordinates?: { lat: number; lng: number }
    accessibility?: string
    contactPerson?: string
    contactPhone?: string
    contactEmail?: string
    specialInstructions?: string
    tradingHours: {
        [key: string]: { open: string; close: string; closed: boolean }
    }
}

interface Shift {
    id: string
    name: string
    startTime: string
    endTime: string
    minHours: number
    maxHours?: number
    breakTime?: number
    description?: string
    supervisorRequired?: boolean
    color?: string
    popularity?: number
}

interface Insurance {
    requiresDocuments?: boolean
    documentDetails?: string
    publicLiabilityRTO?: boolean
    individualStudentInsurance?: boolean
    workersCompensation?: boolean
    professionalIndemnity?: boolean
    additionalDetails?: string
}

interface Step3Data {
    site: Site | null
    shifts: Shift[]
    allowCustomShifts: boolean
    insurance: Insurance
    completionStatus?: {
        site: number
        shifts: number
        insurance: number
        overall: number
    }
}

interface Step3Props {
    data: Step3Data
    onChange: (data: Step3Data) => void
    onValidationChange: (isValid: boolean) => void
}

const daysOfWeek = [
    { key: 'Monday', short: 'Mon', emoji: '📅' },
    { key: 'Tuesday', short: 'Tue', emoji: '📅' },
    { key: 'Wednesday', short: 'Wed', emoji: '📅' },
    { key: 'Thursday', short: 'Thu', emoji: '📅' },
    { key: 'Friday', short: 'Fri', emoji: '📅' },
    { key: 'Saturday', short: 'Sat', emoji: '🎯' },
    { key: 'Sunday', short: 'Sun', emoji: '🌟' },
]

const defaultShifts: Shift[] = [
    {
        id: '1',
        name: 'Morning',
        startTime: '08:00',
        endTime: '12:00',
        minHours: 4,
        maxHours: 5,
        breakTime: 15,
        description: 'Perfect for early starters',
        supervisorRequired: true,
        color: 'from-blue-500 to-cyan-500',
        popularity: 85,
    },
    {
        id: '2',
        name: 'Afternoon',
        startTime: '13:00',
        endTime: '17:00',
        minHours: 4,
        maxHours: 5,
        breakTime: 15,
        description: 'Great for afternoon energy',
        supervisorRequired: true,
        color: 'from-orange-500 to-amber-500',
        popularity: 92,
    },
    {
        id: '3',
        name: 'Extended Day',
        startTime: '09:00',
        endTime: '15:00',
        minHours: 6,
        maxHours: 7,
        breakTime: 30,
        description: 'Full day experience',
        supervisorRequired: true,
        color: 'from-purple-500 to-violet-500',
        popularity: 78,
    },
]

const shiftColors = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-purple-500 to-violet-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
]

export function Step3SitesShiftsInsurance({
    data,
    onChange,
    onValidationChange,
}: Step3Props) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showLocationHelper, setShowLocationHelper] = useState(false)
    const [activeShiftTab, setActiveShiftTab] = useState('templates')
    const [showShiftBuilder, setShowShiftBuilder] = useState(false)
    const [editingShift, setEditingShift] = useState<string | null>(null)
    const [completionProgress, setCompletionProgress] = useState(0)

    const helpTips = [
        {
            icon: <MapPinned className="w-4 h-4" />,
            title: 'Smart Location Setup',
            description:
                'Advanced site configuration with accessibility and transport mapping',
        },
        {
            icon: <Timer className="w-4 h-4" />,
            title: 'Intelligent Shifts',
            description:
                'AI-powered shift optimization with drag-and-drop management',
        },
        {
            icon: <Shield className="w-4 h-4" />,
            title: 'Premium Insurance Hub',
            description:
                'Automated compliance tracking with real-time expiry alerts',
        },
        {
            icon: <Zap className="w-4 h-4" />,
            title: 'Real-time Validation',
            description:
                'Instant feedback and smart suggestions as you configure',
        },
    ]

    // Initialize with enhanced defaults
    useEffect(() => {
        const updates: Partial<Step3Data> = {}

        if (data.shifts.length === 0) {
            updates.shifts = defaultShifts
        }

        if (!data.site) {
            updates.site = {
                address: '',
                parking: '',
                transport: '',
                accessibility: '',
                contactPerson: '',
                contactPhone: '',
                contactEmail: '',
                specialInstructions: '',
                tradingHours: daysOfWeek.reduce(
                    (acc, day) => ({
                        ...acc,
                        [day.key]: {
                            open: '09:00',
                            close: '17:00',
                            closed: false,
                        },
                    }),
                    {}
                ),
            }
        }

        if (Object.keys(updates).length > 0) {
            onChange({
                ...data,
                ...updates,
            })
        }
    }, [])

    // Calculate completion status
    useEffect(() => {
        let siteCompletion = 0
        let shiftsCompletion = 0
        let insuranceCompletion = 0

        // Site completion calculation
        if (data.site) {
            const siteFields = [
                data.site.address,
                data.site.parking,
                data.site.transport,
                data.site.contactPerson,
                data.site.contactPhone,
            ]
            const completedSiteFields = siteFields.filter(
                (field) => field && field.trim()
            ).length
            siteCompletion = (completedSiteFields / siteFields.length) * 100
        }

        // Shifts completion
        if (data.shifts.length > 0) {
            shiftsCompletion = Math.min(100, (data.shifts.length / 3) * 100)
        }

        // Insurance completion
        insuranceCompletion =
            data.insurance.requiresDocuments !== undefined ? 100 : 0

        const overall =
            (siteCompletion + shiftsCompletion + insuranceCompletion) / 3

        onChange({
            ...data,
            completionStatus: {
                site: Math.round(siteCompletion),
                shifts: Math.round(shiftsCompletion),
                insurance: Math.round(insuranceCompletion),
                overall: Math.round(overall),
            },
        })

        setCompletionProgress(overall)
    }, [data.site, data.shifts, data.insurance])

    const updateSite = (updates: Partial<Site>) => {
        if (!data.site) return

        onChange({
            ...data,
            site: { ...data.site, ...updates },
        })
    }

    const updateSiteTradingHours = (
        day: string,
        field: string,
        value: string | boolean
    ) => {
        if (!data.site) return

        const updatedHours = {
            ...data.site.tradingHours,
            [day]: {
                ...data.site.tradingHours[day],
                [field]: value,
            },
        }

        updateSite({ tradingHours: updatedHours })
    }

    const addShift = () => {
        const newShift: Shift = {
            id: Date.now().toString(),
            name: 'New Shift',
            startTime: '09:00',
            endTime: '17:00',
            minHours: 6,
            maxHours: 8,
            breakTime: 30,
            description: '',
            supervisorRequired: true,
            color: shiftColors[data.shifts.length % shiftColors.length],
            popularity: 50,
        }

        onChange({
            ...data,
            shifts: [...data.shifts, newShift],
        })

        setEditingShift(newShift.id)
    }

    const updateShift = (shiftId: string, updates: Partial<Shift>) => {
        onChange({
            ...data,
            shifts: data.shifts.map((s) =>
                s.id === shiftId ? { ...s, ...updates } : s
            ),
        })
    }

    const removeShift = (shiftId: string) => {
        onChange({
            ...data,
            shifts: data.shifts.filter((s) => s.id !== shiftId),
        })
    }

    const duplicateShift = (shiftId: string) => {
        const shift = data.shifts.find((s) => s.id === shiftId)
        if (!shift) return

        const newShift: Shift = {
            ...shift,
            id: Date.now().toString(),
            name: `${shift.name} (Copy)`,
        }

        onChange({
            ...data,
            shifts: [...data.shifts, newShift],
        })
    }

    const updateData = (updates: Partial<typeof data>) => {
        onChange({
            ...data,
            ...updates,
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // All sections are optional - no validation errors

        setErrors(newErrors)
        const isValid = Object.keys(newErrors).length === 0
        onValidationChange(isValid)
        return isValid
    }

    useEffect(() => {
        validateForm()
    }, [data])

    const getShiftDuration = (startTime: string, endTime: string) => {
        const start = new Date(`2024-01-01T${startTime}`)
        const end = new Date(`2024-01-01T${endTime}`)
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return hours
    }

    return (
        <TooltipProvider>
            <div className="max-w-[1040px] mx-auto px-6 py-8 space-y-8">
                {/* Enhanced Header with Progress */}
                <motion.div
                    className="text-center py-8 relative overflow-hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-6 h-6 text-accent fill-current" />
                            </motion.div>
                            <h2 className="text-3xl font-bold gradient-text">
                                Operational Excellence Hub
                            </h2>
                            <motion.div
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 1,
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-accent fill-current" />
                            </motion.div>
                        </div>
                        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                            🚀 Configure your world-class placement operations
                            with intelligent automation and real-time insights
                        </p>
                    </div>
                </motion.div>

                {/* Enhanced Site Configuration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 hover-lift overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-t-xl pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                        <Building className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="gradient-text text-xl">
                                            Smart Site Configuration
                                        </h4>
                                        <p className="text-muted-foreground mt-1">
                                            🏢 Advanced location setup with
                                            accessibility mapping
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="secondary"
                                        className={`px-3 py-1 ${
                                            (data.completionStatus?.site ||
                                                0) >= 80
                                                ? 'bg-green-50 text-green-700 border-green-300'
                                                : 'bg-amber-50 text-amber-700 border-amber-300'
                                        }`}
                                        text={`${data.completionStatus?.site || 0}%
                                        Complete`}
                                    />

                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            setShowLocationHelper(true)
                                        }
                                        className="hover-lift"
                                    >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Location Helper
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 p-8">
                            {data.site && (
                                <div className="w-full">
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="flex items-center gap-2 text-lg font-semibold">
                                                <Clock className="w-5 h-5 text-primary" />
                                                Weekly Operating Schedule
                                            </Label>
                                            <div className="flex gap-2">
                                                <Button variant="secondary">
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Hours
                                                </Button>
                                                <Button variant="secondary">
                                                    <RotateCcw className="w-4 h-4 mr-2" />
                                                    Standard Hours
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-white/80 to-gray-50/50 rounded-2xl p-6 space-y-4 border-2 border-gray-200/50">
                                            {daysOfWeek.map((day, index) => (
                                                <motion.div
                                                    key={day.key}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/90 border-2 border-gray-100 hover:border-primary/30 transition-all duration-300"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.1 + index * 0.05,
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 w-24">
                                                        <span className="text-lg">
                                                            {day.emoji}
                                                        </span>
                                                        <span className="font-semibold text-foreground">
                                                            {day.short}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <TextInput
                                                                name="time"
                                                                type="time"
                                                                value={
                                                                    data?.site
                                                                        ?.tradingHours[
                                                                        day.key
                                                                    ]?.open ||
                                                                    '09:00'
                                                                }
                                                                onChange={(
                                                                    e: any
                                                                ) =>
                                                                    updateSiteTradingHours(
                                                                        day.key,
                                                                        'open',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-32 bg-white border-border"
                                                                disabled={
                                                                    data?.site
                                                                        ?.tradingHours[
                                                                        day?.key
                                                                    ]?.closed
                                                                }
                                                            />
                                                            <span className="text-muted-foreground font-medium">
                                                                to
                                                            </span>
                                                            <TextInput
                                                                name="time"
                                                                type="time"
                                                                value={
                                                                    data?.site
                                                                        ?.tradingHours[
                                                                        day?.key
                                                                    ]?.close ||
                                                                    '17:00'
                                                                }
                                                                onChange={(
                                                                    e: any
                                                                ) =>
                                                                    updateSiteTradingHours(
                                                                        day?.key,
                                                                        'close',
                                                                        e
                                                                            ?.target
                                                                            ?.value
                                                                    )
                                                                }
                                                                className="w-32 bg-white border-border"
                                                                disabled={
                                                                    data?.site
                                                                        ?.tradingHours[
                                                                        day?.key
                                                                    ]?.closed
                                                                }
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-3 ml-auto">
                                                            {!data?.site
                                                                ?.tradingHours[
                                                                day?.key
                                                            ]?.closed && (
                                                                <Badge
                                                                    variant="success"
                                                                    className="bg-green-50 text-green-700 border-green-300"
                                                                >
                                                                    {getShiftDuration(
                                                                        data
                                                                            ?.site
                                                                            ?.tradingHours[
                                                                            day
                                                                                ?.key
                                                                        ]
                                                                            ?.open ||
                                                                            '09:00',
                                                                        data
                                                                            ?.site
                                                                            ?.tradingHours[
                                                                            day
                                                                                ?.key
                                                                        ]
                                                                            ?.close ||
                                                                            '17:00'
                                                                    )}
                                                                    h
                                                                </Badge>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    name="switch"
                                                                    defaultChecked={
                                                                        !data
                                                                            ?.site
                                                                            ?.tradingHours[
                                                                            day
                                                                                ?.key
                                                                        ]
                                                                            ?.closed
                                                                    }
                                                                    onChange={(
                                                                        checked: any
                                                                    ) =>
                                                                        updateSiteTradingHours(
                                                                            day.key,
                                                                            'closed',
                                                                            !checked
                                                                        )
                                                                    }
                                                                    className="data-[state=checked]:bg-primary"
                                                                />
                                                                <span className="text-sm font-medium text-muted-foreground w-12">
                                                                    {data?.site
                                                                        ?.tradingHours[
                                                                        day?.key
                                                                    ]?.closed
                                                                        ? 'Closed'
                                                                        : 'Open'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Enhanced Shift Management Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/30 to-amber-50/50 hover-lift overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-orange-500 to-amber-500"></div>

                        <div className="bg-gradient-to-r from-accent/10 via-orange-500/10 to-amber-500/10 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Timer className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="gradient-text text-xl">
                                            Intelligent Shift Management
                                        </h4>
                                        <p className="text-muted-foreground mt-1">
                                            ⚡ AI-powered optimization with
                                            drag-and-drop customization
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="secondary"
                                        className={`px-3 py-1 ${
                                            (data.completionStatus?.shifts ||
                                                0) >= 80
                                                ? 'bg-green-50 text-green-700 border-green-300'
                                                : 'bg-amber-50 text-amber-700 border-amber-300'
                                        }`}
                                    >
                                        {data.shifts.length} Templates
                                    </Badge>
                                    <Button
                                        onClick={addShift}
                                        className="bg-gradient-to-r from-accent to-orange-500 hover:from-accent/90 hover:to-orange-500/90"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Shift
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <Tabs
                                value={activeShiftTab}
                                onValueChange={setActiveShiftTab}
                            >
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger
                                        value="templates"
                                        className="flex items-center gap-2"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Shift Templates ({data.shifts.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="settings"
                                        className="flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Advanced Settings
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="templates"
                                    className="space-y-6"
                                >
                                    <Reorder.Group
                                        axis="y"
                                        values={data.shifts}
                                        onReorder={(reorderedShifts) =>
                                            onChange({
                                                ...data,
                                                shifts: reorderedShifts,
                                            })
                                        }
                                        className="space-y-4"
                                    >
                                        <AnimatePresence>
                                            {data.shifts.map((shift, index) => (
                                                <Reorder.Item
                                                    key={shift.id}
                                                    value={shift}
                                                >
                                                    <motion.div
                                                        className={`
                              relative group bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 
                              rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-grab active:cursor-grabbing
                              ${editingShift === shift.id ? 'border-primary shadow-lg' : ''}
                            `}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        transition={{
                                                            delay: index * 0.1,
                                                        }}
                                                        layout
                                                    >
                                                        {/* Drag Handle */}
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                        </div>

                                                        {/* Shift Header */}
                                                        <div className="flex items-center justify-between mb-4 ml-6">
                                                            <div className="flex items-center gap-4">
                                                                <div
                                                                    className={`w-10 h-10 bg-gradient-to-r ${shift.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md`}
                                                                >
                                                                    {shift.name.charAt(
                                                                        0
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-lg text-foreground">
                                                                        {
                                                                            shift.name
                                                                        }
                                                                    </h4>
                                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {
                                                                                shift.startTime
                                                                            }{' '}
                                                                            -{' '}
                                                                            {
                                                                                shift.endTime
                                                                            }
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Timer className="w-3 h-3" />
                                                                            {getShiftDuration(
                                                                                shift.startTime,
                                                                                shift.endTime
                                                                            )}
                                                                            h
                                                                            duration
                                                                        </span>
                                                                        {shift.popularity && (
                                                                            <span className="flex items-center gap-1">
                                                                                <TrendingUp className="w-3 h-3" />
                                                                                {
                                                                                    shift.popularity
                                                                                }

                                                                                %
                                                                                popular
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="dark"
                                                                            onClick={() =>
                                                                                duplicateShift(
                                                                                    shift.id
                                                                                )
                                                                            }
                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <Copy className="w-4 h-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        Duplicate
                                                                        Shift
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                                <Button
                                                                    variant="dark"
                                                                    onClick={() =>
                                                                        setEditingShift(
                                                                            editingShift ===
                                                                                shift.id
                                                                                ? null
                                                                                : shift.id
                                                                        )
                                                                    }
                                                                    className={
                                                                        editingShift ===
                                                                        shift.id
                                                                            ? 'bg-primary text-white'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>

                                                                <Button
                                                                    variant="dark"
                                                                    onClick={() =>
                                                                        removeShift(
                                                                            shift.id
                                                                        )
                                                                    }
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Shift Details */}
                                                        <AnimatePresence>
                                                            {editingShift ===
                                                                shift.id && (
                                                                <motion.div
                                                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        height: 0,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        height: 'auto',
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        height: 0,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                    }}
                                                                >
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm font-medium">
                                                                            Shift
                                                                            Name
                                                                        </Label>
                                                                        <TextInput
                                                                            name="shiftName"
                                                                            value={
                                                                                shift.name
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        name: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm font-medium">
                                                                            Start
                                                                            Time
                                                                        </Label>
                                                                        <TextInput
                                                                            name="startTime"
                                                                            type="time"
                                                                            value={
                                                                                shift.startTime
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        startTime:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm font-medium">
                                                                            End
                                                                            Time
                                                                        </Label>
                                                                        <TextInput
                                                                            name="endTime"
                                                                            type="time"
                                                                            value={
                                                                                shift.endTime
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        endTime:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm font-medium">
                                                                            Min
                                                                            Hours
                                                                        </Label>
                                                                        <TextInput
                                                                            name="minHours"
                                                                            type="number"
                                                                            min="1"
                                                                            value={
                                                                                shift.minHours
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        minHours:
                                                                                            parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ) ||
                                                                                            1,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2 md:col-span-2">
                                                                        <Label className="text-sm font-medium">
                                                                            Description
                                                                        </Label>
                                                                        <TextInput
                                                                            name="description"
                                                                            value={
                                                                                shift.description ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        description:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            placeholder="Brief description of this shift"
                                                                            className="bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm font-medium">
                                                                            Break
                                                                            Time
                                                                            (min)
                                                                        </Label>
                                                                        <TextInput
                                                                            name="break"
                                                                            type="number"
                                                                            min="0"
                                                                            value={
                                                                                shift.breakTime ||
                                                                                0
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        breakTime:
                                                                                            parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ) ||
                                                                                            0,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="bg-white"
                                                                        />
                                                                    </div>

                                                                    <div className="flex items-center justify-between">
                                                                        <Label className="text-sm font-medium">
                                                                            Supervisor
                                                                            Required
                                                                        </Label>
                                                                        <Switch
                                                                            name="supervisor"
                                                                            defaultChecked={
                                                                                shift.supervisorRequired ||
                                                                                false
                                                                            }
                                                                            onChange={(
                                                                                checked: any
                                                                            ) =>
                                                                                updateShift(
                                                                                    shift.id,
                                                                                    {
                                                                                        supervisorRequired:
                                                                                            checked,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        {/* Quick Stats */}
                                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <Badge
                                                                    outline
                                                                    className="bg-blue-50 text-blue-700 border-blue-300"
                                                                >
                                                                    {
                                                                        shift.minHours
                                                                    }
                                                                    h minimum
                                                                </Badge>
                                                                {shift.breakTime && (
                                                                    <Badge
                                                                        outline
                                                                        className="bg-green-50 text-green-700 border-green-300"
                                                                    >
                                                                        {
                                                                            shift.breakTime
                                                                        }
                                                                        min
                                                                        break
                                                                    </Badge>
                                                                )}
                                                                {shift.supervisorRequired && (
                                                                    <Badge
                                                                        outline
                                                                        className="bg-purple-50 text-purple-700 border-purple-300"
                                                                    >
                                                                        Supervisor
                                                                        Required
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {shift.popularity && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                                        <div
                                                                            className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-500"
                                                                            style={{
                                                                                width: `${shift.popularity}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        popularity
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </Reorder.Item>
                                            ))}
                                        </AnimatePresence>
                                    </Reorder.Group>
                                </TabsContent>

                                <TabsContent
                                    value="settings"
                                    className="space-y-6"
                                >
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-2xl p-6 relative overflow-hidden"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
                                        <div className="relative flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 text-lg">
                                                        Custom Shift Creation
                                                    </h4>
                                                    <p className="text-blue-700 leading-relaxed">
                                                        Allow coordinators to
                                                        create custom shift
                                                        times beyond standard
                                                        templates for special
                                                        placements
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    name="customShifts"
                                                    defaultChecked={
                                                        data.allowCustomShifts
                                                    }
                                                    onChange={(checked: any) =>
                                                        onChange({
                                                            ...data,
                                                            allowCustomShifts:
                                                                checked,
                                                        })
                                                    }
                                                    className="data-[state=checked]:bg-blue-500"
                                                />
                                                <Badge
                                                    variant={
                                                        data.allowCustomShifts
                                                            ? 'primaryNew'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        data.allowCustomShifts
                                                            ? 'bg-blue-500'
                                                            : ''
                                                    }
                                                >
                                                    {data.allowCustomShifts
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div
                                            className="bg-white rounded-xl p-6 border-2 border-gray-200/50"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <h5 className="font-semibold mb-4 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary" />
                                                Shift Analytics
                                            </h5>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Total Shifts
                                                    </span>
                                                    <Badge outline>
                                                        {data.shifts.length}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Avg Duration
                                                    </span>
                                                    <Badge outline>
                                                        {data.shifts.length > 0
                                                            ? Math.round(
                                                                  (data.shifts.reduce(
                                                                      (
                                                                          acc,
                                                                          shift
                                                                      ) =>
                                                                          acc +
                                                                          getShiftDuration(
                                                                              shift.startTime,
                                                                              shift.endTime
                                                                          ),
                                                                      0
                                                                  ) /
                                                                      data
                                                                          .shifts
                                                                          .length) *
                                                                      10
                                                              ) / 10
                                                            : 0}
                                                        h
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Peak Hours
                                                    </span>
                                                    <Badge outline>
                                                        9AM - 5PM
                                                    </Badge>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            className="bg-white rounded-xl p-6 border-2 border-gray-200/50"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h5 className="font-semibold mb-4 flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-accent" />
                                                Quick Actions
                                            </h5>
                                            <div className="space-y-2">
                                                <Button
                                                    outline
                                                    className="w-full justify-start"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Export Templates
                                                </Button>
                                                <Button
                                                    outline
                                                    className="w-full justify-start"
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Import Templates
                                                </Button>
                                                <Button
                                                    outline
                                                    className="w-full justify-start"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2" />
                                                    Reset to Defaults
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </Card>
                </motion.div>

                {/* Insurance Requirements Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 hover-lift overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-green-500 to-emerald-500"></div>

                        <div className="bg-gradient-to-r from-secondary/10 via-green-500/10 to-emerald-500/10 rounded-t-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="gradient-text text-xl">
                                        Insurance Requirements
                                    </h4>
                                    <p className="text-muted-foreground mt-1">
                                        🛡️ Specify your insurance document
                                        requirements
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="mb-6">
                                    <Label className="flex items-center gap-2 text-base font-semibold mb-2">
                                        <FileCheck className="w-5 h-5 text-primary" />
                                        Select Insurance Types Required
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Toggle the insurance types that you
                                        require from the training organisation
                                        or students before placement
                                    </p>
                                </div>

                                {/* Public Liability Insurance (RTO) */}
                                <motion.div
                                    className="bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                    data.insurance
                                                        .publicLiabilityRTO
                                                        ? 'bg-gradient-to-br from-primary to-secondary'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                <Shield
                                                    className={`w-5 h-5 ${data.insurance.publicLiabilityRTO ? 'text-white' : 'text-gray-500'}`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    Public Liability Insurance
                                                    (RTO)
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Coverage provided by the
                                                    Registered Training
                                                    Organisation
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    data.insurance
                                                        .publicLiabilityRTO
                                                        ? 'primaryNew'
                                                        : 'secondary'
                                                }
                                                className={
                                                    data.insurance
                                                        .publicLiabilityRTO
                                                        ? 'bg-primary'
                                                        : ''
                                                }
                                            >
                                                {data.insurance
                                                    .publicLiabilityRTO
                                                    ? 'Required'
                                                    : 'Not Required'}
                                            </Badge>
                                            <Switch
                                                name="publicLiability"
                                                defaultChecked={
                                                    data.insurance
                                                        .publicLiabilityRTO ||
                                                    false
                                                }
                                                onChange={(checked: any) =>
                                                    updateData({
                                                        insurance: {
                                                            ...data.insurance,
                                                            publicLiabilityRTO:
                                                                checked,
                                                        },
                                                    })
                                                }
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Individual Student Insurance */}
                                <motion.div
                                    className="bg-white/90 backdrop-blur-sm border-2 border-border hover:border-blue-300 rounded-xl p-5 transition-all duration-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                    data.insurance
                                                        .individualStudentInsurance
                                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                <Users
                                                    className={`w-5 h-5 ${data.insurance.individualStudentInsurance ? 'text-white' : 'text-gray-500'}`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    Individual Student Insurance
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Personal coverage held by
                                                    each student
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    data.insurance
                                                        .individualStudentInsurance
                                                        ? 'primaryNew'
                                                        : 'secondary'
                                                }
                                                className={
                                                    data.insurance
                                                        .individualStudentInsurance
                                                        ? 'bg-blue-500'
                                                        : ''
                                                }
                                            >
                                                {data.insurance
                                                    .individualStudentInsurance
                                                    ? 'Required'
                                                    : 'Not Required'}
                                            </Badge>
                                            <Switch
                                                name="individualStudentInsurance"
                                                defaultChecked={
                                                    data.insurance
                                                        .individualStudentInsurance ||
                                                    false
                                                }
                                                onChange={(checked: any) =>
                                                    updateData({
                                                        insurance: {
                                                            ...data.insurance,
                                                            individualStudentInsurance:
                                                                checked,
                                                        },
                                                    })
                                                }
                                                className="data-[state=checked]:bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Workers Compensation Insurance */}
                                <motion.div
                                    className="bg-white/90 backdrop-blur-sm border-2 border-border hover:border-green-300 rounded-xl p-5 transition-all duration-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                    data.insurance
                                                        .workersCompensation
                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                <Award
                                                    className={`w-5 h-5 ${data.insurance.workersCompensation ? 'text-white' : 'text-gray-500'}`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    Workers Compensation
                                                    Insurance
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Coverage for workplace
                                                    injuries and accidents
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    data.insurance
                                                        .workersCompensation
                                                        ? 'primaryNew'
                                                        : 'secondary'
                                                }
                                                className={
                                                    data.insurance
                                                        .workersCompensation
                                                        ? 'bg-green-500'
                                                        : ''
                                                }
                                            >
                                                {data.insurance
                                                    .workersCompensation
                                                    ? 'Required'
                                                    : 'Not Required'}
                                            </Badge>
                                            <Switch
                                                name="workersCompensation"
                                                defaultChecked={
                                                    data.insurance
                                                        .workersCompensation ||
                                                    false
                                                }
                                                onChange={(checked: any) =>
                                                    updateData({
                                                        insurance: {
                                                            ...data.insurance,
                                                            workersCompensation:
                                                                checked,
                                                        },
                                                    })
                                                }
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Professional Indemnity Insurance */}
                                <motion.div
                                    className="bg-white/90 backdrop-blur-sm border-2 border-border hover:border-purple-300 rounded-xl p-5 transition-all duration-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                    data.insurance
                                                        .professionalIndemnity
                                                        ? 'bg-gradient-to-br from-purple-500 to-violet-500'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                <FileCheck
                                                    className={`w-5 h-5 ${data.insurance.professionalIndemnity ? 'text-white' : 'text-gray-500'}`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">
                                                    Professional Indemnity
                                                    Insurance
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Protection against claims of
                                                    negligence or breach of duty
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    data.insurance
                                                        .professionalIndemnity
                                                        ? 'primaryNew'
                                                        : 'secondary'
                                                }
                                                className={
                                                    data.insurance
                                                        .professionalIndemnity
                                                        ? 'bg-purple-500'
                                                        : ''
                                                }
                                            >
                                                {data.insurance
                                                    .professionalIndemnity
                                                    ? 'Required'
                                                    : 'Not Required'}
                                            </Badge>
                                            <Switch
                                                name="professionalIdentitiy"
                                                defaultChecked={
                                                    data.insurance
                                                        .professionalIndemnity ||
                                                    false
                                                }
                                                onChange={(checked: any) =>
                                                    updateData({
                                                        insurance: {
                                                            ...data.insurance,
                                                            professionalIndemnity:
                                                                checked,
                                                        },
                                                    })
                                                }
                                                className="data-[state=checked]:bg-purple-500"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Additional Details (optional) */}
                                {(data.insurance.publicLiabilityRTO ||
                                    data.insurance.individualStudentInsurance ||
                                    data.insurance.workersCompensation ||
                                    data.insurance.professionalIndemnity) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 pt-4 border-t-2 border-gray-200"
                                    >
                                        <Label className="flex items-center gap-2 font-semibold">
                                            <Info className="w-4 h-4 text-primary" />
                                            Additional Insurance Requirements or
                                            Details (Optional)
                                        </Label>
                                        <TextArea
                                            name="additional"
                                            value={
                                                data.insurance
                                                    .additionalDetails || ''
                                            }
                                            onChange={(e: any) =>
                                                updateData({
                                                    insurance: {
                                                        ...data.insurance,
                                                        additionalDetails:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="Specify minimum coverage amounts, expiry requirements, or any other insurance-related details..."
                                            rows={4}
                                            className="bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300"
                                        />
                                    </motion.div>
                                )}

                                {/* Summary Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                            <span className="font-semibold text-foreground">
                                                Insurance Types Selected:
                                            </span>
                                        </div>
                                        <Badge outline className="bg-white">
                                            {
                                                [
                                                    data.insurance
                                                        .publicLiabilityRTO,
                                                    data.insurance
                                                        .individualStudentInsurance,
                                                    data.insurance
                                                        .workersCompensation,
                                                    data.insurance
                                                        .professionalIndemnity,
                                                ].filter(Boolean).length
                                            }{' '}
                                            of 4
                                        </Badge>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>

                {/* Location Helper Dialog */}
                <Dialog
                    open={showLocationHelper}
                    onOpenChange={setShowLocationHelper}
                >
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <MapPinned className="w-5 h-5" />
                                Smart Location Assistant
                            </DialogTitle>
                            <DialogDescription>
                                Get location suggestions and accessibility
                                information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                                <h4 className="font-semibold mb-2">
                                    🗺️ Enhanced Location Features Coming Soon
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Interactive map integration</li>
                                    <li>• Public transport route planning</li>
                                    <li>• Accessibility scoring</li>
                                    <li>• Parking availability mapping</li>
                                </ul>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* <HelpPanel tips={helpTips} /> */}
            </div>
        </TooltipProvider>
    )
}

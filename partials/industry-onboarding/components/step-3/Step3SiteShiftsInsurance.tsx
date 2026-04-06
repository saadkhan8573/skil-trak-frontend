import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, Copy, Shield } from 'lucide-react'
import { Badge, Button, Card, Switch, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { IndustryApi } from '@queries'

interface TradingDay {
    open: string
    close: string
    breakStart: string
    breakEnd: string
    isEnabled: boolean
}

interface Step3Data {
    tradingHours: Record<string, TradingDay>
    insurance: {
        selectedInsuranceIds: number[]
        additionalDetails?: string
    }
}

interface Step3Props {
    id: string | number | string[] | undefined
    data: any
    onChange: any
    onValidationChange: (isValid: boolean) => void
}

const DAYS_OF_WEEK = [
    { key: 'Monday', short: 'Mon' },
    { key: 'Tuesday', short: 'Tue' },
    { key: 'Wednesday', short: 'Wed' },
    { key: 'Thursday', short: 'Thu' },
    { key: 'Friday', short: 'Fri' },
    { key: 'Saturday', short: 'Sat' },
    { key: 'Sunday', short: 'Sun' },
]

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const DEFAULT_TRADING_HOURS: Record<string, TradingDay> = {
    Monday: {
        open: '08:00',
        close: '17:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
    Tuesday: {
        open: '08:00',
        close: '17:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
    Wednesday: {
        open: '08:00',
        close: '17:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
    Thursday: {
        open: '08:00',
        close: '17:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
    Friday: {
        open: '08:00',
        close: '16:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
    Saturday: {
        open: '09:00',
        close: '13:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
    Sunday: {
        open: '09:00',
        close: '13:00',
        breakStart: '',
        breakEnd: '',
        isEnabled: false,
    },
}

export function Step3SitesShiftsInsurance({
    id,
    data,
    onChange,
    onValidationChange,
}: Step3Props) {
    // Guard against stale localStorage shape (old data had data.site.tradingHours)
    const tradingHours: Record<string, TradingDay> =
        data?.tradingHours || DEFAULT_TRADING_HOURS
    const insurance = data?.insurance || { selectedInsuranceIds: [] }

    const {
        data: insuranceDocs,
        isLoading: insuranceLoading,
        isError: insuranceError,
    } = IndustryApi.Insurance.useIndustryInsuraceById(id, { skip: !id })

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    const updateTradingHour = (
        day: string,
        field: keyof TradingDay,
        value: any
    ) => {
        onChange({
            ...data,
            tradingHours: {
                ...tradingHours,
                [day]: { ...tradingHours[day], [field]: value },
            },
        })
    }

    const hasAnyDayOpen = DAYS_OF_WEEK.some(
        (d) => tradingHours[d.key]?.isEnabled
    )

    const copyToWeekdays = () => {
        const firstOpen = DAYS_OF_WEEK.find(
            (d) => tradingHours[d.key]?.isEnabled
        )
        if (!firstOpen) return
        const source = tradingHours[firstOpen.key]
        const updated = { ...tradingHours }
        WEEKDAYS.forEach((day) => {
            updated[day] = { ...source, isEnabled: true }
        })
        onChange({ ...data, tradingHours: updated })
    }

    const toggleInsuranceDoc = (id: number, checked: boolean) => {
        const current = insurance.selectedInsuranceIds || []
        onChange({
            ...data,
            insurance: {
                ...insurance,
                selectedInsuranceIds: checked
                    ? [...current, id]
                    : current.filter((x:any) => x !== id),
            },
        })
    }

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    return (
        <div className="max-w-260 mx-auto px-6 py-8 space-y-8">
            <motion.div
                className="text-center py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold gradient-text mb-2">
                    Sites & Shifts
                </h2>
                <p className="text-muted-foreground text-lg">
                    Configure your operating schedule and insurance requirements
                </p>
            </motion.div>

            {/* Trading Hours */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card noPadding className="border-0 shadow-xl">
                    <div
                        className="rounded-t-xl p-4"
                        style={{
                            background: `linear-gradient(135deg, rgba(4, 72, 102, 0.08) 0%, rgba(13, 84, 104, 0.05) 100%)`,
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-10 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, #044866 0%, #0D5468 100%)`,
                                    }}
                                >
                                    <Clock className="size-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="gradient-text text-lg">
                                        Weekly Operating Schedule
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Enable days and set your operating hours
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                disabled={!hasAnyDayOpen}
                                onClick={copyToWeekdays}
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Mon–Fri
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {DAYS_OF_WEEK.map((day, index) => {
                            const hours = tradingHours[day.key]
                            const isOpen = !!hours?.isEnabled

                            return (
                                <motion.div
                                    key={day.key}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-primary/30 transition-all"
                                >
                                    {/* Switch + day label */}
                                    <Switch
                                        name={`day_${day.key}`}
                                        defaultChecked={isOpen}
                                        onChange={(e: any) =>
                                            updateTradingHour(
                                                day.key,
                                                'isEnabled',
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span
                                        className={`font-semibold text-sm w-8 shrink-0 ${isOpen ? 'text-foreground' : 'text-muted-foreground'}`}
                                    >
                                        {day.short}
                                    </span>

                                    {isOpen ? (
                                        <>
                                            {/* Open → Close */}
                                            <TextInput
                                                name={`open_${day.key}`}
                                                type="time"
                                                value={hours?.open || '09:00'}
                                                onChange={(e: any) =>
                                                    updateTradingHour(
                                                        day.key,
                                                        'open',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-28 bg-white border-border"
                                                showError={false}
                                            />
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                to
                                            </span>
                                            <TextInput
                                                name={`close_${day.key}`}
                                                type="time"
                                                value={hours?.close || '17:00'}
                                                onChange={(e: any) =>
                                                    updateTradingHour(
                                                        day.key,
                                                        'close',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-28 bg-white border-border"
                                                showError={false}
                                            />

                                            {/* Break */}
                                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                                Break
                                            </span>
                                            <TextInput
                                                name={`breakStart_${day.key}`}
                                                type="time"
                                                value={hours?.breakStart || ''}
                                                onChange={(e: any) =>
                                                    updateTradingHour(
                                                        day.key,
                                                        'breakStart',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-28 bg-white border-border"
                                                showError={false}
                                            />
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                to
                                            </span>
                                            <TextInput
                                                name={`breakEnd_${day.key}`}
                                                type="time"
                                                value={hours?.breakEnd || ''}
                                                onChange={(e: any) =>
                                                    updateTradingHour(
                                                        day.key,
                                                        'breakEnd',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-28 bg-white border-border"
                                                showError={false}
                                            />
                                        </>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            Closed
                                        </span>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </Card>
            </motion.div>

            {/* Insurance Documents */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Card noPadding className="border-0 shadow-xl">
                    <div
                        className="rounded-t-xl p-4"
                        style={{
                            background: `linear-gradient(135deg, rgba(4, 72, 102, 0.08) 0%, rgba(13, 84, 104, 0.05) 100%)`,
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-10 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, #044866 0%, #0D5468 100%)`,
                                    }}
                                >
                                    <Shield className="size-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="gradient-text text-lg">
                                        Insurance Requirements
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Select insurance documents required from
                                        students
                                    </p>
                                </div>
                            </div>
                            {(insurance.selectedInsuranceIds || []).length >
                                0 && (
                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1"
                                >
                                    {insurance.selectedInsuranceIds.length} of{' '}
                                    {insuranceDocs?.length ?? 0} selected
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {insuranceLoading && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Loading insurance types...
                            </div>
                        )}

                        {insuranceError && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 text-sm text-red-700">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                Failed to load insurance types. Please refresh
                                and try again.
                            </div>
                        )}

                        {!insuranceLoading &&
                            !insuranceError &&
                            insuranceDocs?.map((doc: any, i: number) => {
                                const isSelected = (
                                    insurance.selectedInsuranceIds || []
                                ).includes(doc.id)
                                return (

                                    
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white border-2 transition-all"
                                        style={{
                                            borderColor: isSelected
                                                ? '#044866'
                                                : '#E5E7EB',
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`size-9 rounded-lg flex items-center justify-center transition-all ${
                                                    isSelected
                                                        ? 'bg-primary'
                                                        : 'bg-gray-100'
                                                }`}
                                            >
                                                <Shield
                                                    className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`}
                                                />
                                            </div>
                                            <span className="font-medium text-sm">
                                                {doc.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    isSelected
                                                        ? 'primaryNew'
                                                        : 'secondary'
                                                }
                                                className={
                                                    isSelected
                                                        ? 'bg-primary text-white'
                                                        : ''
                                                }
                                            >
                                                {isSelected
                                                    ? 'Required'
                                                    : 'Not Required'}
                                            </Badge>
                                            <Switch
                                                name={`insurance_${doc.id}`}
                                                defaultChecked={isSelected}
                                                onChange={(e: any) =>
                                                    toggleInsuranceDoc(
                                                        doc.id,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </div>
                                    </motion.div>
                                )
                            })}

                        {!insuranceLoading &&
                            !insuranceError &&
                            insuranceDocs?.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No insurance documents configured.
                                </div>
                            )}
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}

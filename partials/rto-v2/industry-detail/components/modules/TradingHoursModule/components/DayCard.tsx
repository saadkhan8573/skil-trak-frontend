import { ModeSelector } from './ModeSelector'
import { FixedHoursInput } from './FixedHoursInput'
import { FreeShiftsManager, Shift } from './FreeShiftsManager'
import { Card, Switch } from '@components'
import { Controller, useFormContext } from 'react-hook-form'
import { useRemoveShiftMutation } from '@queries'
import { useNotification } from '@hooks/useNotification'

export type DayHours = {
    open: boolean
    mode: 'fixed' | 'free-shifts'
    start: string
    end: string
    break?: string
    breakStart?: string
    breakEnd?: string
    shifts: Shift[]
}

interface DayCardProps {
    day: string
    dayKey: string
}

export function DayCard({ day, dayKey }: DayCardProps) {
    const { control, watch } = useFormContext()
    const isOpen = watch(`hours.${dayKey}.open`)
    const mode = watch(`hours.${dayKey}.mode`)

    const [removeShift] = useRemoveShiftMutation()
    const { notification } = useNotification()

    const handleDeleteShift = async (id: number) => {
        try {
            await removeShift(id).unwrap()
            notification.success({
                title: 'Success',
                description: 'Shift deleted successfully',
            })
            return true
        } catch (error) {
            notification.error({
                title: 'Error',
                description: 'Failed to delete shift. Please try again.',
            })
            return false
        }
    }

    return (
        <Card className="p-3 hover:border-[#044866]/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 flex-wrap">
                {/* Day & Toggle */}
                <div className="w-32 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[#1A2332]">
                        {day}
                    </span>
                    <Controller
                        name={`hours.${dayKey}.open`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Switch
                                name={dayKey}
                                isChecked={value}
                                onChange={onChange}
                                customStyleClass="profileSwitch"
                            />
                        )}
                    />
                </div>

                {isOpen ? (
                    <>
                        <Controller
                            name={`hours.${dayKey}.mode`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ModeSelector
                                    mode={value}
                                    onModeChange={onChange}
                                />
                            )}
                        />

                        {mode === 'fixed' ? (
                            <FixedHoursInput basePath={`hours.${dayKey}`} />
                        ) : (
                            <FreeShiftsManager
                                name={`hours.${dayKey}.shifts`}
                                onDeleteShift={handleDeleteShift}
                            />
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8] rounded-lg">
                        <span className="text-sm font-medium text-[#94A3B8]">
                            Closed
                        </span>
                    </div>
                )}
            </div>
        </Card>
    )
}

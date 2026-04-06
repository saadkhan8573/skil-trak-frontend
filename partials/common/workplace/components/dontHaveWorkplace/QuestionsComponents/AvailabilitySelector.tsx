'use client'

import { DaySelector } from './DaySelector'
import { useFormContext } from 'react-hook-form'
import { TimeSlotSelector } from './TimeSlotSelector'
import { useCallback, useEffect, useState } from 'react'
import { InputErrorMessage } from '@components/inputs/components'

export const AvailabilitySelector = ({ name }: { name: string }) => {
    const formContext = useFormContext()
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [hasInitialized, setHasInitialized] = useState(false)

    const initialValue = formContext.watch(name)

    useEffect(() => {
        if (!hasInitialized && initialValue && typeof initialValue === 'object') {
            if (initialValue.days?.length > 0) {
                setSelectedDays(initialValue.days)
                setHasInitialized(true)
            }
            if (initialValue.timeSlot) {
                setSelectedTime(initialValue.timeSlot)
                setHasInitialized(true)
            }
        }
    }, [initialValue, hasInitialized])

    const error =
        formContext &&
        formContext.getFieldState(String(name)).error !== undefined

    const handleDayChange = useCallback((day: string) => {
        const prevFtn = (prev: any) => prev.filter((d: any) => d !== day)

        setSelectedDays((prev) =>
            day === 'Anyday'
                ? prev.includes(day)
                    ? prevFtn(prev)
                    : [day]
                : prev.includes(day)
                ? prevFtn(prev)
                : [...prev, day]
        )
    }, [])

    const handleTimeChange = useCallback((slot: string) => {
        setSelectedTime(slot)
    }, [])

    useEffect(() => {
        if (selectedDays.length > 0 || selectedTime) {
            formContext.setValue('preferredContactTime', {
                days: selectedDays,
                timeSlot: selectedTime,
            })
        }
    }, [selectedDays, selectedTime])

    return (
        <div
            className={`w-full max-w-xl mx-auto p-6 border border-dashed rounded-[10px] ${
                error ? 'border-2 border-error' : 'border border-[#A5A3A9]'
            }`}
        >
            <div className="mb-6">
                <label className="block font-medium mb-4 text-sm">
                    Select Days
                </label>
                <DaySelector
                    selectedDays={selectedDays}
                    onChange={handleDayChange}
                />

                <InputErrorMessage name="days" subname={name} />
            </div>
            <div>
                <label className="block font-medium mb-4 text-sm">
                    Select Time Slot
                </label>
                <TimeSlotSelector
                    selectedSlot={selectedTime}
                    onChange={handleTimeChange}
                />
                <InputErrorMessage name="timeSlot" subname={name} />
            </div>
        </div>
    )
}

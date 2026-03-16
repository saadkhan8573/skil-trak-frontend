import { Calendar, CheckCircle2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { TextInput } from '@components'
import { WeeklyAvailabilitySection } from './WeeklyAvailabilitySection'
import moment from 'moment'
import { CourseAndIndustryCard } from '../../CourseAndIndustryCard'

interface SuccessfulStatusContentProps {
    appointment: any
    industry: any
}

export function SuccessfulStatusContent({
    appointment,
    industry,
}: SuccessfulStatusContentProps) {
    const { watch } = useFormContext()
    const weekSchedule = watch('weekSchedule')
    const minAllowedDate = moment().add(7, 'days').format('YYYY-MM-DD')
    return (
        <div className="p-4 bg-[#0D5468]/5 overflow-auto border-t-2 border-[#0D5468] animate-in slide-in-from-top-4 duration-500">
            {/* Confirmation Message */}
            <div className="flex items-start gap-2 mb-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-[#0D5468]/30">
                <CheckCircle2 className="w-4 h-4 text-[#0D5468] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-800 leading-relaxed">
                    I confirm I have contacted both industry and student, and
                    both have agreed to proceed with the workplace placement.
                </p>
            </div>

            {/* Schedule Management */}
            <div className="bg-white rounded-lg p-4 shadow-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-[#0D5468] rounded">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                        Manage Schedule
                    </h3>
                </div>

                {/* Course and Industry Info */}
                <CourseAndIndustryCard
                    industry={industry}
                    course={appointment?.course}
                />

                {/* Hours and Date Inputs */}
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <TextInput
                        label="Total Hours Required"
                        name="hours"
                        type="number"
                        defaultValue={Math.floor(
                            appointment?.course?.extraHours?.length > 0
                                ? appointment?.course?.extraHours?.[0]?.hours
                                : appointment?.course?.hours
                        ).toString()}
                    />
                    <TextInput
                        label="Placement Start Date"
                        name="startDate"
                        type="date"
                        min={minAllowedDate}
                    />
                </div>

                {/* Weekly Availability */}
                <WeeklyAvailabilitySection weekSchedule={weekSchedule} />
            </div>
        </div>
    )
}

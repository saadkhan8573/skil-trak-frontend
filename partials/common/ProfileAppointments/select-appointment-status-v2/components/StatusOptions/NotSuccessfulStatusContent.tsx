import { Select } from '@components'
import { useFormContext } from 'react-hook-form'
import { MissedAppointmentContent } from './ReasonContent/MissedAppointmentContent'
import { RejectedByIndustryContent } from './ReasonContent/RejectedByIndustryContent'
import { OtherReasonContent } from './ReasonContent/OtherReasonContent'

interface NotSuccessfulStatusContentProps {
    unsuccessfulReason: string | undefined
}

export function NotSuccessfulStatusContent({
    unsuccessfulReason,
}: NotSuccessfulStatusContentProps) {
    return (
        <div className="p-4 bg-[#F7A619]/5 border-t-2 border-[#F7A619] animate-in slide-in-from-top-4 duration-500 overflow-auto min-h-56">
            {/* Reason Selection */}
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Please select a reason for the unsuccessful appointment
            </label>
            <Select
                name="unsuccessfulReason"
                value={unsuccessfulReason}
                onlyValue
                options={[
                    {
                        label: 'Appointment Missed',
                        value: 'missed',
                    },
                    {
                        label: 'Rejected by Industry',
                        value: 'rejected',
                    },
                    {
                        label: 'Other',
                        value: 'other',
                    },
                ]}
            />

            {/* Reason-specific Content */}
            {/* {unsuccessfulReason === 'missed' && <MissedAppointmentContent />} */}
            {unsuccessfulReason === 'rejected' && <RejectedByIndustryContent />}
            {unsuccessfulReason === 'other' && <OtherReasonContent />}
        </div>
    )
}

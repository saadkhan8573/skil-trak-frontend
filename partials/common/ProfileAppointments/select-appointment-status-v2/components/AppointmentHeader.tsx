import { X } from 'lucide-react'

interface AppointmentHeaderProps {
    onClose: () => void
}

export const AppointmentHeader = ({ onClose }: AppointmentHeaderProps) => {
    return (
        <div className="bg-[#0D5468] text-white px-4 py-3 rounded-t-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"></div>
            <div className="relative flex items-center justify-between">
                <h2 className="text-white font-bold tracking-tight">
                    Appointment Status Review
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

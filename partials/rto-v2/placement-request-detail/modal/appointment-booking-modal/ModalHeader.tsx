import { User2, X } from 'lucide-react'

interface ModalHeaderProps {
    supervisorName?: string
    onClose?: () => void
}

export const ModalHeader = ({
    supervisorName = 'Dr. Sarah Johnson',
    onClose,
}: ModalHeaderProps) => (
    <div
        className="relative px-4 sm:px-6 pt-4 sm:pt-5 pb-4 overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, #044866 0%, #0D5468 100%)',
        }}
    >
        {/* Background decorations */}
        <div
            className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full opacity-10 blur-3xl"
            style={{
                backgroundColor: '#F7A619',
                transform: 'translate(30%, -30%)',
            }}
        />
        <div
            className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full opacity-10 blur-2xl"
            style={{
                backgroundColor: '#F7A619',
                transform: 'translate(-30%, 30%)',
            }}
        />

        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-start gap-2.5 sm:gap-3 flex-1">
                <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0"
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <User2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl text-white mb-1">
                        Book Appointment
                    </h2>
                </div>
            </div>
            {onClose && (
                <div onClick={onClose} className=" cursor-pointer">
                    <X className="text-white" />
                </div>
            )}
        </div>
    </div>
)

import { CheckCircle2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { SuccessfulStatusContent } from './SuccessfulStatusContent'

interface StatusSuccessfulOptionProps {
    isSelected: boolean
    appointment: any
    industry: any
}

export function StatusSuccessfulOption({
    isSelected,
    appointment,
    industry,
}: StatusSuccessfulOptionProps) {
    const { setValue } = useFormContext()

    const handleSelect = () => {
        setValue('status', 'successful', {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    return (
        <div
            className={`rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                isSelected
                    ? 'border-[#0D5468] shadow-lg shadow-[#0D5468]/20'
                    : 'border-slate-200 hover:border-slate-300'
            }`}
        >
            <button
                onClick={handleSelect}
                className={`w-full flex items-center gap-2 p-3 transition-all duration-300 ${
                    isSelected
                        ? 'bg-[#0D5468] text-white'
                        : 'bg-white text-gray-700 hover:bg-slate-50'
                }`}
            >
                <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                            ? 'border-white bg-white scale-110'
                            : 'border-slate-400 bg-white'
                    }`}
                >
                    {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#0D5468]" />
                    )}
                </div>
                <div className="flex-1 flex items-center gap-2">
                    <span className="font-bold text-sm">SUCCESSFUL</span>
                    {isSelected && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            Selected
                        </span>
                    )}
                </div>
            </button>

            {isSelected && (
                <SuccessfulStatusContent
                    appointment={appointment}
                    industry={industry}
                />
            )}
        </div>
    )
}

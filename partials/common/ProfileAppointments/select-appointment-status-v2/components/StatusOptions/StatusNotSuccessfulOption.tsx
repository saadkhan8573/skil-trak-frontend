import { AlertCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Select } from '@components'
import { NotSuccessfulStatusContent } from './NotSuccessfulStatusContent'

interface StatusNotSuccessfulOptionProps {
    isSelected: boolean
    unsuccessfulReason: string | undefined
}

export function StatusNotSuccessfulOption({
    isSelected,
    unsuccessfulReason,
}: StatusNotSuccessfulOptionProps) {
    const { setValue } = useFormContext()

    const handleSelect = () => {
        setValue('status', 'not-successful', {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    return (
        <div
            className={`rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                isSelected
                    ? 'border-[#F7A619] shadow-lg shadow-[#F7A619]/20'
                    : 'border-slate-200 hover:border-slate-300'
            }`}
        >
            <button
                onClick={handleSelect}
                className={`w-full flex items-center gap-2 p-3 transition-all duration-300 ${
                    isSelected
                        ? 'bg-[#F7A619] text-white'
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
                        <AlertCircle className="w-4 h-4 text-[#F7A619]" />
                    )}
                </div>
                <div className="flex-1 flex items-center gap-2">
                    <span className="font-bold text-sm">NOT SUCCESSFUL</span>
                    {isSelected && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            Selected
                        </span>
                    )}
                </div>
            </button>

            {isSelected && (
                <NotSuccessfulStatusContent
                    unsuccessfulReason={unsuccessfulReason}
                />
            )}
        </div>
    )
}

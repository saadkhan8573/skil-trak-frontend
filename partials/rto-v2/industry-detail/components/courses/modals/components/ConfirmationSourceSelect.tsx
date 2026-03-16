import { ConfirmationSource } from '@types'
import { CheckCircle2, Mail, Phone } from 'lucide-react'

interface ConfirmationSourceSelectProps {
    selectedSource: ConfirmationSource
    onSelect: (source: ConfirmationSource) => void
}

export function ConfirmationSourceSelect({
    selectedSource,
    onSelect,
}: ConfirmationSourceSelectProps) {
    return (
        <div className="grid grid-cols-2 gap-4 py-6">
            {/* Email Option */}
            <div
                onClick={() => onSelect(ConfirmationSource.EMAIL)}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 group ${
                    selectedSource === ConfirmationSource.EMAIL
                        ? 'border-[#044866] bg-[#044866]/5 shadow-md'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
            >
                {selectedSource === ConfirmationSource.EMAIL && (
                    <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-[#044866]" />
                    </div>
                )}
                <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                        selectedSource === ConfirmationSource.EMAIL
                            ? 'bg-[#044866] text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                >
                    <Mail className="w-5 h-5" />
                </div>
                <h4
                    className={`text-sm font-bold ${
                        selectedSource === ConfirmationSource.EMAIL
                            ? 'text-[#044866]'
                            : 'text-slate-700'
                    }`}
                >
                    Email
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                    Confirmed via official email record
                </p>
            </div>

            {/* Phone Option */}
            <div
                onClick={() => onSelect(ConfirmationSource.PHONE)}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 group ${
                    selectedSource === ConfirmationSource.PHONE
                        ? 'border-[#044866] bg-[#044866]/5 shadow-md'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
            >
                {selectedSource === ConfirmationSource.PHONE && (
                    <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-[#044866]" />
                    </div>
                )}
                <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                        selectedSource === ConfirmationSource.PHONE
                            ? 'bg-[#044866] text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                >
                    <Phone className="w-5 h-5" />
                </div>
                <h4
                    className={`text-sm font-bold ${
                        selectedSource === ConfirmationSource.PHONE
                            ? 'text-[#044866]'
                            : 'text-slate-700'
                    }`}
                >
                    Phone Call
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                    Confirmed during a phone discussion
                </p>
            </div>
        </div>
    )
}

import { Ticket } from 'lucide-react'
import { TextArea } from '@components'

export function OtherReasonContent() {
    return (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="p-3 bg-white rounded-lg border-2 border-[#F7A619]/50">
                <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 bg-[#F7A619]/10 rounded">
                        <Ticket className="w-4 h-4 text-[#F7A619]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 mb-0.5">
                            Other Reason
                        </h4>
                        <p className="text-xs text-gray-600">
                            The SkilTrak team will review this and get back to
                            you.
                        </p>
                    </div>
                </div>
                <TextArea
                    name="otherReason"
                    placeholder="Please describe the reason..."
                />
            </div>
        </div>
    )
}

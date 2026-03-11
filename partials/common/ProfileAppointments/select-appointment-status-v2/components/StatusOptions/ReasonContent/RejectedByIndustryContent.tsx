import { AlertCircle, RefreshCw } from 'lucide-react'
import { TextArea } from '@components'

export function RejectedByIndustryContent() {
    return (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="p-3 bg-white rounded-lg border-2 border-[#F7A619]/50">
                <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 bg-[#F7A619]/10 rounded">
                        <AlertCircle className="w-4 h-4 text-[#F7A619]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 mb-0.5">
                            Rejection Details
                        </h4>
                        <p className="text-xs text-gray-600">
                            This will be saved to{' '}
                            <span className="font-semibold">
                                Student - All Communication
                            </span>{' '}
                            and the automation will be re-run.
                        </p>
                    </div>
                </div>
                <TextArea
                    name="rejectionReason"
                    placeholder="Enter the industry's rejection reason..."
                />
            </div>

            {/* Automation Info */}
            <div className="flex items-center gap-1 p-2 bg-[#0D5468]/5 border border-[#0D5468]/30 rounded-lg">
                <RefreshCw className="w-3 h-3 text-[#0D5468] shrink-0" />
                <p className="text-xs text-gray-800">
                    <span className="font-semibold">
                        Automation will automatically re-run
                    </span>{' '}
                    after saving the rejection reason.
                </p>
            </div>
        </div>
    )
}

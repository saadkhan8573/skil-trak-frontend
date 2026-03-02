import { NoData } from '@components'
import { FileText } from 'lucide-react'
import React from 'react'

export const AbourtWorkplace = ({ bio }: { bio: string }) => {
    return (
        <div className="p-4 bg-linear-to-br from-blue-50/30 via-white to-purple-50/20 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-[#044866]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-[#6B46C1]/5 to-transparent rounded-full blur-3xl"></div>

            <div className="relative">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-xl shadow-[#044866]/30">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">
                            About the Workplace
                        </h4>
                        <p className="text-xs text-slate-600">
                            Learn more about this verified partner
                        </p>
                    </div>
                </div>

                {/* Description Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    {bio ? (
                        <div
                            className="text-xs text-slate-700 leading-relaxed space-y-1.5"
                            dangerouslySetInnerHTML={{
                                __html: bio || '',
                            }}
                        />
                    ) : (
                        <NoData text="No Bio Available" simple />
                    )}
                </div>
            </div>
        </div>
    )
}

import { Sparkles } from 'lucide-react'
import React from 'react'

export const Header = () => {
    return (
        <div className="">
            {/* Header */}
            <div className="mb-4 animate-slide-up">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#F7A619] to-[#F7A619]/80 rounded-lg flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-[#044866] text-xl mb-0">
                                SkilTrak Auto-Escalation Tickets
                            </h1>
                            {/* <p className="text-[#0D5468]/70 text-xs">
                                Automated 4-hour escalation engine
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

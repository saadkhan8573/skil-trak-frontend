import { Card } from '@components'
import { EqualApproximately, Users } from 'lucide-react'
import React from 'react'

export const TotalExpectedStudentsCard = ({ expectedStudents }: any) => {
    return (
        <div className="bg-[#044866] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-5 mb-5">
                <div className="size-13 bg-white/20 rounded-xl flex items-center justify-center shadow-xl">
                    <Users className="size-6 text-white" />
                </div>
                <div>
                    <div className="text-sm text-white/80 mb-0.5 font-medium">
                        Total Expected Students
                    </div>
                    <div className="text-2xl text-white font-bold flex items-center gap-x-1">
                        <EqualApproximately />
                        <span>{expectedStudents}</span>
                    </div>
                </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-5 pt-5 border-t border-white/20">
                <div>
                    <div className="text-xs text-white/70 mb-1.5 font-medium uppercase tracking-wider">
                        Within 30 Days
                    </div>
                    <div className="text-xl text-white font-bold">
                        40
                    </div>
                </div>
                <div>
                    <div className="text-xs text-white/70 mb-1.5 font-medium uppercase tracking-wider">
                        Within 60 Days
                    </div>
                    <div className="text-xl text-white font-bold">
                        120
                    </div>
                </div>
            </div> */}
        </div>
    )
}

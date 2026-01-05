import { Target } from 'lucide-react'

export const CurrentActionHeader = () => (
    <div className="bg-gradient-to-r from-[#0D5468] via-[#044866] to-[#0D5468] px-6 py-5">
        <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
                <Target className="h-5 w-5" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Current Stage Actions</h3>
                <p className="text-white/80 text-sm">
                    Take action to progress placement
                </p>
            </div>
        </div>
    </div>
)

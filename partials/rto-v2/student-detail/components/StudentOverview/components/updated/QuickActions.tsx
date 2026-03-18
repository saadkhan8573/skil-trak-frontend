import {
    AlertCircle,
    FileText,
    Zap,
    ArrowRight,
    Sparkles,
    Building2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { Button, Badge } from '@components'

interface QuickActionsProps {
    index?: number
    showWorkplaceTypes: boolean
    setShowWorkplaceTypes: (show: boolean) => void
    showPlacementRequirements: boolean
    setShowPlacementRequirements: (show: boolean) => void
    showHighlightedTasks: boolean
    setShowHighlightedTasks: (show: boolean) => void
}

export function QuickActions({
    index = 0,
    showWorkplaceTypes,
    setShowWorkplaceTypes,
    showPlacementRequirements,
    setShowPlacementRequirements,
    showHighlightedTasks,
    setShowHighlightedTasks,
}: QuickActionsProps) {
    return (
        <div
            className={`bg-linear-to-br from-[#044866] via-[#0D5468] to-[#044866] bg-size-[200%_100%] animate-gradient backdrop-blur-sm rounded-xl border-2 border-[#0D5468] shadow-lg shadow-[#044866]/20 overflow-hidden hover:shadow-xl transition-all relative`}
        >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            {/* Compact Single Line Layout */}
            <div className="relative px-5 py-3 flex items-center justify-between gap-4">
                {/* Left: Title */}
                <div className="flex items-center gap-2.5">
                    <div className="relative group/counter">
                        <div
                            className={`w-9 h-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover/counter:scale-105 transition-transform duration-300 border border-white/30`}
                        >
                            <div className="w-7 h-7 bg-linear-to-br from-amber-400 to-[#F7A619] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                {index + 1}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3
                            className={`text-white font-bold text-sm flex items-center gap-1.5 tracking-tight`}
                        >
                            Workplace Overview
                            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                        </h3>
                        <p
                            className={`text-white/80 text-[10px] font-medium uppercase tracking-wider`}
                        >
                            Active Placement Profile
                        </p>
                    </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Workplace Types Toggle Button */}
                    <Button
                        onClick={() =>
                            setShowWorkplaceTypes(!showWorkplaceTypes)
                        }
                        variant="action"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                        <div className="relative flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>
                                {showWorkplaceTypes ? 'Hide' : 'Show'} Workplace
                                Types
                            </span>

                            {showWorkplaceTypes ? (
                                <ChevronUp className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] transition-transform" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5 group-hover/btn:translate-y-[2px] transition-transform" />
                            )}
                        </div>
                    </Button>

                    {/* Highlighted Tasks Button */}
                    <Button
                        onClick={() =>
                            setShowHighlightedTasks(!showHighlightedTasks)
                        }
                        className="bg-linear-to-r from-[#F7A619] to-amber-500 hover:from-amber-500 hover:to-[#F7A619] text-white shadow-lg hover:shadow-xl group/btn h-9 px-4 text-sm relative overflow-hidden transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                        <div className="relative flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Highlighted Tasks</span>

                            {showHighlightedTasks ? (
                                <ChevronUp className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] transition-transform" />
                            ) : (
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            )}
                        </div>
                    </Button>

                    {/* Placement Requirements Button */}
                    <Button
                        onClick={() =>
                            setShowPlacementRequirements(
                                !showPlacementRequirements
                            )
                        }
                        variant="action"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
                        <div className="relative flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Placement Requirements</span>
                            {showPlacementRequirements ? (
                                <ChevronUp className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] transition-transform" />
                            ) : (
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            )}
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

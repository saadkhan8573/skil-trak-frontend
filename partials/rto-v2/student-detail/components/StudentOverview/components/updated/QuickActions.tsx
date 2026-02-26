import { AlertCircle, FileText, Zap, ArrowRight, Sparkles, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { Button, Badge } from "@components";

interface QuickActionsProps {
  showWorkplaceTypes: boolean;
  setShowWorkplaceTypes: (show: boolean) => void;
  showPlacementRequirements: boolean;
  setShowPlacementRequirements: (show: boolean) => void;
  showHighlightedTasks: boolean;
  setShowHighlightedTasks: (show: boolean) => void;
}

export function QuickActions({
  showWorkplaceTypes,
  setShowWorkplaceTypes,
  showPlacementRequirements,
  setShowPlacementRequirements,
  showHighlightedTasks,
  setShowHighlightedTasks
}: QuickActionsProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl transition-all">
      {/* Compact Single Line Layout */}
      <div className="px-5 py-3 flex items-center justify-between gap-4">
        {/* Left: Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold text-sm flex items-center gap-1.5">
              Placement Information
              <Sparkles className="w-3 h-3 text-[#F7A619] animate-pulse" />
            </h3>
            <p className="text-slate-600 text-xs">As per the course</p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Workplace Types Toggle Button */}
          <Button
            onClick={() => setShowWorkplaceTypes(!showWorkplaceTypes)}
            className="bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg hover:shadow-xl group/btn h-9 px-4 text-sm relative overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
            <div className="relative flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{showWorkplaceTypes ? 'Hide' : 'Show'} Workplace Types</span>
              <Badge className="bg-white/20 text-white border-0 text-xs px-1.5 py-0 ml-1">
                9
              </Badge>
              {showWorkplaceTypes ? (
                <ChevronUp className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] transition-transform" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 group-hover/btn:translate-y-[2px] transition-transform" />
              )}
            </div>
          </Button>

          {/* Highlighted Tasks Button */}
          <Button
            onClick={() => setShowHighlightedTasks(!showHighlightedTasks)}
            className="bg-linear-to-r from-[#F7A619] to-amber-500 hover:from-amber-500 hover:to-[#F7A619] text-white shadow-lg hover:shadow-xl group/btn h-9 px-4 text-sm relative overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
            <div className="relative flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Highlighted Tasks</span>
              <Badge className="bg-white/20 text-white border-0 text-xs px-1.5 py-0 ml-1">
                3 New
              </Badge>
              {showHighlightedTasks ? (
                <ChevronUp className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] transition-transform" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              )}
            </div>
          </Button>

          {/* Placement Requirements Button */}
          <Button
            onClick={() => setShowPlacementRequirements(!showPlacementRequirements)}
            className="bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg hover:shadow-xl group/btn h-9 px-4 text-sm relative overflow-hidden transition-all duration-300"
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
  );
}
import { BarChart3, Calendar, CalendarCheck, CheckCircle2, Circle, Clock, Edit3, TrendingUp, Zap } from "lucide-react";
import { Button } from "@components";
import { getCourseById } from "./data";

interface CourseProgressProps {
  selectedCourseId: string;
}

export function CourseProgress({ selectedCourseId }: CourseProgressProps) {
  const course = getCourseById(selectedCourseId);

  if (!course) return null;

  const streams = course.streamProgress;
  const overallProgress = course.overallProgress;

  // Calculate average progress
  const averageProgress = Math.round(
    streams.reduce((acc, stream) => acc + stream.progress, 0) / streams.length
  );

  // Mock hours data - in real app this would come from the course data
  const totalHours = 300;
  const completedHours = Math.round((totalHours * overallProgress) / 100);
  const remainingHours = totalHours - completedHours;

  // Mock placement dates based on course
  const placementDates = {
    CHC33021: { start: "Nov 4, 2024", end: "Mar 15, 2025" },
    CHC52021: { start: "Jan 15, 2025", end: "Jun 30, 2025" },
    CHC43015: { start: "Feb 1, 2025", end: "Jul 20, 2025" }
  };

  const dates = placementDates[selectedCourseId as keyof typeof placementDates] || { start: "TBD", end: "TBD" };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 shadow-md p-1.5 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-md bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-sm">
            <BarChart3 className="w-2.5 h-2.5 text-slate-700" />
          </div>
          <div>
            <h3 className="text-slate-900 text-[11px] font-semibold leading-tight">Placement Schedule Progress</h3>
            <p className="text-[9px] text-slate-600 leading-tight">Track your placement timeline and completion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range */}
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-50/80 backdrop-blur-sm rounded-lg border border-slate-200/60">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-slate-200/80 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="w-2 h-2 text-slate-600" />
              </div>
              <div>
                <p className="text-slate-500 text-[8px] leading-tight">Start Date</p>
                <p className="text-slate-900 text-[10px] font-semibold leading-tight">{dates.start}</p>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-300/50"></div>
            <div className="flex items-center gap-1">
              <div>
                <p className="text-slate-500 text-[8px] text-right leading-tight">Expected End</p>
                <p className="text-slate-900 text-[10px] font-semibold text-right leading-tight">{dates.end}</p>
              </div>
              <div className="w-4 h-4 rounded bg-slate-200/80 backdrop-blur-sm flex items-center justify-center">
                <CalendarCheck className="w-2 h-2 text-slate-600" />
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            outline
            variant="primaryNew"
            className="h-8 px-2 text-[10px] bg-white hover:bg-[#044866] hover:text-white border-[#044866]/30 hover:border-[#044866] transition-all shadow-sm"
          >
            <Edit3 className="w-2.5 h-2.5 mr-1" />
            Edit Schedule
          </Button>
        </div>
      </div>

      {/* Main Progress Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 rounded-lg p-1.5 shadow-sm">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/50 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-[#F7A619]/10 rounded-full blur-lg"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-slate-600 text-[9px] leading-tight">Overall Completion</p>
              <p className="text-slate-700 text-[10px] flex items-center gap-1 leading-tight">
                <span className="text-sm">💪</span>
                <span>Great progress!</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 leading-none">{overallProgress}%</div>
              <div className="flex items-center gap-0.5 text-[9px] text-emerald-600 leading-tight">
                <TrendingUp className="w-2 h-2" />
                <span>On track</span>
              </div>
            </div>
          </div>

          <div className="relative h-1.5 bg-slate-200/80 backdrop-blur-sm rounded-full overflow-hidden shadow-inner mb-1">
            <div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-[#F7A619] to-[#F7A619]/80 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/30 to-transparent"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md flex items-center justify-center">
                <Zap className="w-1 h-1 text-[#F7A619]" />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-slate-100/80 backdrop-blur-sm rounded-md p-1 border border-slate-200/60">
              <div className="flex items-center gap-0.5 mb-0.5">
                <div className="w-3 h-3 rounded bg-slate-200/80 flex items-center justify-center">
                  <Clock className="w-1.5 h-1.5 text-slate-600" />
                </div>
                <span className="text-slate-600 text-[8px] leading-none">Total</span>
              </div>
              <p className="text-slate-900 font-bold leading-none mb-0.5">{totalHours}</p>
              <p className="text-slate-500 text-[8px] leading-none">hours</p>
            </div>

            <div className="bg-emerald-50/80 backdrop-blur-sm rounded-md p-1 border border-emerald-200/60">
              <div className="flex items-center gap-0.5 mb-0.5">
                <div className="w-3 h-3 rounded bg-emerald-100/80 flex items-center justify-center">
                  <CheckCircle2 className="w-1.5 h-1.5 text-emerald-600" />
                </div>
                <span className="text-emerald-700 text-[8px] leading-none">Done</span>
              </div>
              <p className="text-emerald-900 font-bold leading-none mb-0.5">{completedHours}</p>
              <p className="text-emerald-600 text-[8px] leading-none">hours</p>
            </div>

            <div className="bg-orange-50/80 backdrop-blur-sm rounded-md p-1 border border-orange-200/60">
              <div className="flex items-center gap-0.5 mb-0.5">
                <div className="w-3 h-3 rounded bg-orange-100/80 flex items-center justify-center">
                  <Circle className="w-1.5 h-1.5 text-[#F7A619]" />
                </div>
                <span className="text-[#F7A619] text-[8px] leading-none">Left</span>
              </div>
              <p className="text-slate-900 font-bold leading-none mb-0.5">{remainingHours}</p>
              <p className="text-orange-700 text-[8px] leading-none">hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
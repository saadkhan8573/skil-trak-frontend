import { CheckCircle, Clock, FileText, Shield } from "lucide-react";
import { getCourseById } from "./data";

interface PlacementRequirementsProps {
  selectedCourseId: string;
}

export function PlacementRequirements({ selectedCourseId }: PlacementRequirementsProps) {
  const course = getCourseById(selectedCourseId);

  if (!course) return null;

  const requirements = [
    "The workplace must allow direct interaction with clients, enabling students to demonstrate skills across both ageing and disability contexts.",
    "Supervision must be provided by a qualified worker holding a minimum Certificate III or higher in a related community services discipline (e.g., aged care, disability support, or nursing).",
    "The setting must have appropriate workplace policies on safety, dignity, privacy, manual handling, infection control, and ethical practice."
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl transition-all">
      {/* Header */}
      <div className="bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] px-5 py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Placement Requirements</h3>
            <p className="text-white/70 text-xs">Essential criteria for this placement</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Course Info Card */}
        <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-50 via-white to-blue-50 border border-blue-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <div className="relative">
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">{course.code} - {course.name}</h4>
            <p className="text-xs text-slate-600">Australian Qualification Framework Level</p>
          </div>
        </div>

        {/* Minimum Hours Card */}
        <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-50 via-white to-emerald-50 border border-emerald-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900 mb-0.5">Minimum Placement Hours</p>
              <p className="text-2xl font-bold text-emerald-600">120 hours</p>
            </div>
          </div>
        </div>

        {/* Workplace Requirements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/30">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <h5 className="text-xs font-bold text-slate-900">Workplace Requirements:</h5>
          </div>

          <div className="space-y-2.5">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="group/req relative overflow-hidden rounded-lg bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-[#044866]/30 transition-all duration-300 cursor-pointer"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover/req:translate-x-[200%] transition-transform duration-1000"></div>

                <div className="relative flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shrink-0 shadow-lg group-hover/req:scale-110 group-hover/req:rotate-6 transition-all duration-300">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed group-hover/req:text-slate-900 transition-colors flex-1">
                    {req}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

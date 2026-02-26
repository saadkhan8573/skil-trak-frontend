import { BookOpen, ArrowRight, Target } from "lucide-react";
import { Button, Badge } from "@components";
import { Progress } from "@components/ui/progress";
import { useState } from "react";
import { getAllCourses, getCourseById } from "./data";

interface CourseOverviewProps {
  selectedCourseId: string;
  onCourseSelect: (courseId: string) => void;
}

export function CourseOverview({ selectedCourseId, onCourseSelect }: CourseOverviewProps) {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const courses = getAllCourses();
  const selectedCourse = getCourseById(selectedCourseId);

  if (!selectedCourse) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-3 hover:shadow-2xl transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-2xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/30">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-slate-900 text-[15px] flex items-center gap-1.5">
              My Courses
              <Badge className="bg-[#044866]/10 text-[#044866] text-[10px] border border-[#044866]/20 px-1.5 py-0.5">{courses.length} Active</Badge>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Track your learning progress</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="border-slate-300 hover:border-[#044866] hover:text-[#044866] hover:bg-[#044866]/5 shadow-md hover:shadow-lg transition-all px-2.5 py-1.5 text-xs"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? 'Show Less' : `View All Courses (${courses.length - 1} more)`}
          <ArrowRight className="w-2.5 h-2.5 ml-1.5" />
        </Button>
      </div>

      {!showAllCourses ? (
        <div
          className="relative overflow-hidden bg-linear-to-br from-[#044866]/5 via-[#0D5468]/5 to-[#F7A619]/5 rounded-2xl p-3 border border-[#044866]/20 shadow-inner cursor-pointer hover:shadow-lg transition-all"
          onClick={() => onCourseSelect(selectedCourse.id)}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#044866]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2.5">
              <h3 className="text-slate-900 text-[15px]">{selectedCourse.name}</h3>
              <Badge className="bg-[#044866]/10 text-[#044866] border border-[#044866]/20 shadow-sm text-[10px] px-1.5 py-0.5">
                ✓ {selectedCourse.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <span className="bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/40">{selectedCourse.code}</span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3 text-[#044866]" />
                {selectedCourse.streams.length} streams
              </span>
              <span className="text-slate-500">{selectedCourse.streams[0]}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative overflow-hidden rounded-2xl p-3 border cursor-pointer transition-all ${selectedCourseId === course.id
                ? 'bg-linear-to-br from-[#044866]/10 via-[#0D5468]/10 to-[#F7A619]/10 border-[#044866]/30 shadow-lg'
                : 'bg-linear-to-br from-[#044866]/5 via-[#0D5468]/5 to-[#F7A619]/5 border-[#044866]/15 shadow-inner hover:shadow-md'
                }`}
              onClick={() => {
                onCourseSelect(course.id);
                setShowAllCourses(false);
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#044866]/10 to-transparent rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-slate-900 text-sm">{course.name}</h4>
                    <Badge className="bg-[#044866]/10 text-[#044866] border border-[#044866]/20 shadow-sm text-[10px] px-1.5 py-0.5">
                      ✓ {course.status}
                    </Badge>
                  </div>
                  {selectedCourseId === course.id && (
                    <Badge className="bg-[#F7A619] text-white border-0 shadow-sm text-[10px] px-1.5 py-0.5">
                      Selected
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-1.5">
                  <span className="bg-white/60 backdrop-blur-sm px-1.5 py-0.5 rounded-lg border border-white/40">{course.code}</span>
                  <span className="flex items-center gap-1">
                    <Target className="w-2.5 h-2.5 text-[#044866]" />
                    {course.streams.length} streams
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Progress value={course.overallProgress} className="h-1 bg-white/60 shadow-inner flex-1" />
                  <span className="text-[10px] font-medium" style={{ color: '#044866' }}>{course.overallProgress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { BookOpen, Building2 } from 'lucide-react'
import React from 'react'

export const CourseAndIndustryCard = ({ industry, course }: any) => {
    return (
        <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-[#0D5468]/5 rounded-lg border border-[#0D5468]/20">
                <div className="flex items-center gap-1 mb-1.5">
                    <BookOpen className="w-3 h-3 text-[#0D5468]" />
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {course?.title ?? '___'}
                    </label>
                </div>
                <p className="text-xs font-bold text-[#0D5468] mb-0.5">
                    {course?.code ?? '___'}
                </p>
                <p className="text-xs text-gray-700 leading-snug">
                    {course?.description ?? '___'}{' '}
                    {course?.isSuperseded && '(Superseded)'}
                </p>
            </div>
            <div className="p-3 bg-[#0D5468]/5 rounded-lg border border-[#0D5468]/20">
                <div className="flex items-center gap-1 mb-1.5">
                    <Building2 className="w-3 h-3 text-[#0D5468]" />
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Workplace
                    </label>
                </div>
                <p className="text-xs text-gray-600 mb-0.5">
                    {industry?.email ?? '___'}
                </p>
                <p className="text-xs font-bold text-[#0D5468]">
                    {industry?.name ?? '___'}
                </p>
            </div>
        </div>
    )
}

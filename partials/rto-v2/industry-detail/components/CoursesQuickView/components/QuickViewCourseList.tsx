import React from 'react';
import { cn } from '@utils';
import { IndustryCourseApproval } from '@types';

interface Props {
    approvalCourses: IndustryCourseApproval[];
}

export const QuickViewCourseList: React.FC<Props> = ({ approvalCourses }) => {
    return (
        <div className="mb-2 space-y-1">
            <div className="flex items-center gap-1 px-1 mb-1">
                <div className="h-2 w-0.5 bg-[#64748B] rounded-full" />
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Courses List
                </span>
            </div>
            {approvalCourses.map((approval) => (
                <div
                    key={approval.id}
                    className="flex items-center justify-between gap-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors group/item"
                >
                    <span className="text-[11.5px] font-medium text-[#475569] truncate flex-1 group-hover/item:text-[#1A2332]">
                        {approval.course.title}
                    </span>
                    <div
                        className={cn(
                            'px-1 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 shadow-sm',
                            approval.status === 'approved'
                                ? 'bg-[#D1FAE5] text-[#065F46] border border-[#10B981]/20'
                                : 'bg-[#FEF3C7] text-[#92400E] border border-[#F7A619]/20'
                        )}
                    >
                        {approval.status}
                    </div>
                </div>
            ))}
        </div>
    );
};

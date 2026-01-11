import { Student } from '@types'
import { Award, Clock } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { useAppSelector } from '@redux/hooks'

export const StudentQuickInfo = () => {
    const { selectedCourse, studentDetail } = useAppSelector(
        (state) => state.student
    )
    const studentInfoCards = [
        {
            id: 'primary-course',
            title: 'Primary Course',
            mainText: selectedCourse?.code,
            subText: selectedCourse?.title,
            icon: Award,
            iconType: 'lucide' as const,
            gradient: 'from-[#044866] to-[#0D5468]',
        },
        // {
        //     id: 'active-workplace',
        //     title: 'Active Workplace',
        //     mainText: 'Hale Foundation',
        //     subText: 'Marangaroo, WA',
        //     icon: '🏢',
        //     iconType: 'emoji' as const,
        //     gradient: 'from-[#0D5468] to-[#044866]',
        // },
        {
            id: 'coordinator',
            title: 'Coordinator',
            mainText: studentDetail?.subadmin
                ? studentDetail?.subadmin?.user?.name
                : '---',
            // subText: 'Assigned Nov 4, 2025',
            icon: '👤',
            iconType: 'emoji' as const,
            gradient: 'from-[#044866] to-[#0D5468]',
        },
        {
            id: 'student-since',
            title: 'Student Since',
            mainText: studentDetail?.createdAt
                ? moment(studentDetail?.createdAt).format('MMMM YYYY')
                : '',
            subText: studentDetail?.createdAt
                ? moment(studentDetail?.createdAt).fromNow()
                : '',
            icon: Clock,
            iconType: 'lucide' as const,
            gradient: 'from-[#044866] to-[#0D5468]',
        },
    ]
    return (
        <div className="grid grid-cols-3 gap-2.5">
            {studentInfoCards.map((card) => (
                <div
                    key={card.id}
                    className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-3.5 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 bg-white/5 rounded-full -ml-5 -mb-5"></div>

                    <div className="relative">
                        <div className="absolute top-0 right-0 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all">
                            {card.iconType === 'lucide' ? (
                                <card.icon className="w-4 h-4 text-white" />
                            ) : (
                                <span className="text-base">{card.icon}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">
                            {card.title}
                        </p>
                        <p className="text-white mb-0.5 text-[13px]">
                            {card.mainText}
                        </p>
                        <p className="text-xs text-white/80">{card.subText}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

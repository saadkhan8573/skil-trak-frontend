import { ActionButton, AuthorizedUserComponent } from '@components'
import { Student } from '@types'
import { Award, Clock, User } from 'lucide-react'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { useAppSelector } from '@redux/hooks'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { latestWpApprovalRequest } from '../../utils'
import { useStatusInfo } from '../StudentOverview/hooks/useStatusInfo'
import { ReassignStudentCoordinatorModal } from './modals/ReassignStudentCoordinatorModal'
import { UserRoles } from '@constants'

export const StudentQuickInfo = () => {
    const [showAssignModal, setShowAssignModal] = useState(false)
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state.student
    )

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            selectedWorkplace?.workplaceApprovaleRequest || []
        )
    }, [selectedWorkplace?.workplaceApprovaleRequest])

    const workIndustry = selectedWorkplace?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )

    const { currentStep } = useStatusInfo({
        workplace: selectedWorkplace as any,
        workIndustry: workIndustry as any,
    })

    const industry =
        workIndustry?.industry ||
        latestWorkplaceApprovaleRequest?.industry ||
        selectedWorkplace?.studentProvidedWorkplaceRequestApproval?.industry

    const courseHours =
        selectedCourse?.extraHours && selectedCourse?.extraHours?.length > 0
            ? selectedCourse?.extraHours?.[0]?.hours
            : selectedCourse?.hours

    const studentInfoCards = [
        {
            id: 'primary-course',
            title: 'Primary Course',
            mainText: selectedCourse?.code,
            subText: (
                <div className="flex flex-col gap-1 mt-1">
                    <span
                        className="line-clamp-1"
                        title={selectedCourse?.title}
                    >
                        {selectedCourse?.title}
                    </span>
                    {courseHours && (
                        <div className="flex items-center gap-1.5 pt-1 border-t border-white/10">
                            <Clock className="w-3 h-3 text-white/70" />
                            <span className="font-medium text-white/90">
                                {courseHours} Hours Required
                            </span>
                        </div>
                    )}
                </div>
            ),
            icon: Award,
            iconType: 'lucide' as const,
            gradient: 'from-[#044866] to-[#0D5468]',
        },
        {
            id: 'active-workplace',
            title: 'Current Workplace',
            mainText: industry?.user?.name || '---',
            subText: `Address: ${industry?.addressLine1 || ''}`,
            icon: '🏢',
            iconType: 'emoji' as const,
            gradient: 'from-[#0D5468] to-[#044866]',
        },
        {
            id: 'current-status',
            title: 'Current Status',
            isSpecial: true,
            subText: (
                <div className="mt-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F7A619] animate-pulse shrink-0"></div>
                        <p className="text-sm text-white font-medium whitespace-nowrap">
                            {currentStep?.label || '---'}
                        </p>
                    </div>
                    <p className="text-[10px] text-white/60 whitespace-nowrap">
                        Assigned to:
                    </p>
                    <div className="flex items-center justify-between gap-1 mt-1.5">
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-white/80" />
                            <p className="text-[10px] text-white/60 whitespace-nowrap">
                                <span className="font-semibold text-white/80">
                                    {studentDetail?.subadmin?.user?.name ||
                                        '---'}
                                </span>
                            </p>
                        </div>
                        <AuthorizedUserComponent
                            isHod
                            isManager
                            customUserIds={[20365, 24631]} // Testers
                            roles={[UserRoles.ADMIN]}
                        >
                            <ActionButton
                                onClick={() => setShowAssignModal(true)}
                                variant="light"
                                small
                                noPadding
                                className="px-2! py-0.5! text-[9px]! rounded!"
                                text="Change"
                            />
                        </AuthorizedUserComponent>
                    </div>
                </div>
            ),
            icon: User,
            iconType: 'lucide' as const,
            gradient: 'from-[#044866] to-[#0D5468]',
        },
        {
            id: 'student-since',
            title: 'Student Since',
            mainText: studentDetail?.createdAt
                ? moment(studentDetail?.createdAt).format(
                      'DD MMMM YYYY [at] h:mm A'
                  )
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
        <div className="grid grid-cols-4 gap-1.5">
            {studentInfoCards.map((card) => (
                <div
                    key={card.id}
                    className={`group relative overflow-hidden rounded-xl bg-linear-to-br ${card.gradient} p-3.5 shadow-xl hover:shadow-2xl transition-all`}
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
                        {!card.isSpecial && (
                            <p className="text-white mb-0.5 text-[13px]">
                                {card.mainText}
                            </p>
                        )}
                        <div
                            className={`${
                                card.isSpecial ? '' : 'text-xs text-white/80'
                            }`}
                        >
                            {card.subText}
                        </div>
                    </div>
                </div>
            ))}

            {showAssignModal && (
                <ReassignStudentCoordinatorModal
                    open={showAssignModal}
                    onOpenChange={setShowAssignModal}
                    student={studentDetail}
                />
            )}
        </div>
    )
}

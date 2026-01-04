import {
    CheckCircle,
    ChevronDown,
    Sparkles,
    Target,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    ChecklistTask,
    PlacementReadinessModal,
} from '../modal/PlacementReadinessModal'
import { setNavigationTarget } from '@redux'
import { useAppDispatch } from '@redux/hooks'
import { useIndustryProgress } from '../hooks'
import { ChecklistSkeleton } from '../skeletonLoader'

export function PlacementChecklist() {
    const [showProgress, setShowProgress] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useAppDispatch()

    const {
        progressPercentage,
        completedItems,
        totalItems,
        checklistItems,
        isPlacementReady,
        isLoading,
    } = useIndustryProgress()

    const relevantItems = checklistItems

    useEffect(() => {
        if (!isLoading) {
            // If they are not ready, show the modal. 
            // If they ARE ready, ensure it is closed (especially useful if they completed it while it was open)
            setIsModalOpen(!isPlacementReady)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isPlacementReady])

    const checklistTasks: ChecklistTask[] = relevantItems.map((item) => ({
        id: item.title,
        title: item.title,
        description: item.description,
        completed: item.status === 'done',
        optional: false,
        icon: item.icon,
        color: item.color,
        targetTab: (item as any).targetTab,
        targetSection: (item as any).targetSection,
    }))

    if (isLoading) return <ChecklistSkeleton />

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
            <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold">
                            Placement Readiness Checklist
                        </h2>
                        <p className="text-white/80 text-xs">
                            Complete these steps to become placement ready
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white/80 text-[10px] mb-0.5">Progress</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden min-w-[80px]">
                            <div
                                className="h-full bg-gradient-to-r from-white to-[#10B981] rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-white font-bold text-xs">
                            {progressPercentage}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Progress Section - Compact */}
                <div className="p-4 bg-gradient-to-br from-[#044866]/5 via-transparent to-[#F7A619]/5">
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="text-[#1A2332] text-sm font-semibold">
                                    Your Progress
                                </h3>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-lg font-bold text-[#044866]">
                                        {completedItems}
                                    </span>
                                    <span className="text-[#64748B] text-xs">
                                        / {totalItems}
                                    </span>
                                </div>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="relative h-2.5 bg-gradient-to-r from-[#E8F4F8] to-[#F8FAFB] rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#044866] rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2 bg-[length:200%_100%] animate-gradient"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    {progressPercentage > 25 && (
                                        <span className="text-white text-[9px] font-bold drop-shadow-lg">
                                            {progressPercentage}%
                                        </span>
                                    )}
                                </div>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                            </div>
                        </div>

                        {/* Toggle Button */}
                        <button
                            onClick={() => setShowProgress(!showProgress)}
                            className="ml-4 px-2.5 py-1.5 text-[10px] font-medium text-[#044866] hover:bg-white/50 rounded-lg transition-all flex items-center gap-1"
                        >
                            {showProgress ? 'Hide Details' : 'View Details'}
                            <ChevronDown
                                className={`w-3 h-3 transition-transform ${showProgress ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Collapsible Details */}
                    {showProgress && (
                        <div className="mt-3 pt-3 border-t border-[#E2E8F0] animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-[#64748B] text-xs mb-2">
                                Keep going! You're doing great.
                            </p>

                            {/* Milestone Markers */}
                            <div className="flex justify-between px-0.5">
                                <span className="text-[10px] text-[#64748B]">
                                    0%
                                </span>
                                <span className="text-[10px] text-[#64748B]">
                                    25%
                                </span>
                                <span className="text-[10px] text-[#64748B]">
                                    50%
                                </span>
                                <span className="text-[10px] text-[#64748B]">
                                    75%
                                </span>
                                <span className="text-[10px] text-[#64748B]">
                                    100%
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Collapsible Checklist Grid and CTA */}
                {showProgress && (
                    <>
                        {/* Checklist Grid */}
                        <div className="p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {relevantItems.map((item, index) => {
                                    const Icon = item.icon
                                    const isDone = item.status === 'done'

                                    return (
                                        <div
                                            onClick={() =>
                                                dispatch(
                                                    setNavigationTarget({
                                                        tab: (item as any)
                                                            .targetTab,
                                                        section: (item as any)
                                                            .targetSection,
                                                    })
                                                )
                                            }
                                            key={index}
                                            className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${isDone
                                                ? 'bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 hover:border-[#10B981]/50 hover:shadow-lg'
                                                : 'bg-white border border-[#E2E8F0] hover:border-[#044866]/30 hover:shadow-xl hover:scale-105'
                                                }`}
                                            style={{
                                                animationDelay: `${index * 50
                                                    }ms`,
                                            }}
                                        >
                                            {/* Gradient Glow */}
                                            {!isDone && (
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#044866] to-[#F7A619] rounded-xl opacity-0 group-hover:opacity-10 blur transition-all duration-300" />
                                            )}

                                            <div className="relative p-3">
                                                <div className="flex items-start gap-2 mb-2">
                                                    {/* Icon */}
                                                    <div
                                                        className={`relative w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${isDone
                                                            ? 'bg-gradient-to-br from-[#10B981] to-[#059669] group-hover:scale-110 group-hover:rotate-6'
                                                            : 'bg-gradient-to-br from-[#E8F4F8] to-[#F8FAFB] group-hover:scale-110'
                                                            }`}
                                                    >
                                                        {isDone ? (
                                                            <CheckCircle
                                                                className="w-4 h-4 text-white"
                                                                strokeWidth={
                                                                    2.5
                                                                }
                                                            />
                                                        ) : (
                                                            <Icon className="w-4 h-4 text-[#044866]" />
                                                        )}
                                                        {isDone && (
                                                            <div className="absolute inset-0 rounded-lg bg-[#10B981] animate-ping opacity-20" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4
                                                        className={`text-xs font-semibold mb-1 ${isDone
                                                            ? 'text-[#10B981]'
                                                            : 'text-[#1A2332]'
                                                            }`}
                                                    >
                                                        {item.title}
                                                    </h4>
                                                    <p
                                                        className={`text-[10px] mb-2 ${isDone
                                                            ? 'text-[#059669]'
                                                            : 'text-[#64748B]'
                                                            }`}
                                                    >
                                                        {item.description}
                                                    </p>

                                                    {isDone ? (
                                                        <div className="flex items-center gap-1.5 text-[#10B981] text-[10px] font-medium">
                                                            <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                                                            Completed
                                                        </div>
                                                    ) : (
                                                        <button className="text-[10px] text-[#044866] hover:text-[#0D5468] font-medium flex items-center gap-1.5 group-hover:gap-2 transition-all">
                                                            <span>
                                                                Complete Task
                                                            </span>
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            {progressPercentage < 100 ? (
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#F7A619] to-[#EA580C] p-4 text-white">
                                    {/* Animated Background */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" />
                                        <div
                                            className="absolute bottom-0 left-0 w-36 h-36 bg-white rounded-full blur-3xl animate-pulse"
                                            style={{ animationDelay: '1s' }}
                                        />
                                    </div>

                                    <div className="relative flex items-start gap-3">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center flex-shrink-0 shadow-xl">
                                            <Target className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-white text-sm font-bold flex items-center gap-1.5">
                                                Almost There!
                                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                                                    {totalItems -
                                                        completedItems}{' '}
                                                    left
                                                </span>
                                            </h4>
                                            <p className="text-white/95 text-xs">
                                                Complete the remaining tasks to
                                                unlock full placement
                                                capabilities. Our guided wizard
                                                makes it quick and easy!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] p-4 text-white">
                                    {/* Confetti Effect */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" />
                                    </div>

                                    <div className="relative flex items-start gap-3">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center flex-shrink-0 shadow-xl">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white text-sm font-bold mb-1.5">
                                                🎉 Congratulations!
                                            </h4>
                                            <p className="text-white/95 text-xs">
                                                Your profile is 100% complete!
                                                You're now ready to accept
                                                student placements and grow your
                                                partnership with us.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {isModalOpen && (
                <PlacementReadinessModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    tasks={checklistTasks}
                />
            )}
        </div>
    )
}

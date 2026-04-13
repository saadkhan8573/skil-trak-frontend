import {
    AlertCircle,
    ArrowUpCircle,
    BookOpen,
    CheckCircle,
    X,
} from 'lucide-react'
import { Badge, Button, GlobalModal } from '@components'
import { Label } from '@components/ui/label'
import { SupervisorQualification } from '@partials/common'
import { ReactElement, useEffect, useState } from 'react'
import { NoAvailableCourseModal } from '../modal/NoAvailableCourseModal'

interface AvailableCoursesProps {
    qualificationLevel: string
    coursesByLevel: any
    coursesLoading: boolean
    coursesError: boolean
    sectorConfig: { color: string }
    sectorId: string
    selectedTaskIds: Record<string, Record<number, number[]>>
    onToggleTask: (courseId: number, taskId: number) => void
    courseLevel?: any
}

export function AvailableCourses({
    qualificationLevel,
    coursesByLevel,
    coursesLoading,
    coursesError,
    sectorConfig,
    sectorId,
    selectedTaskIds,
    onToggleTask,
    courseLevel,
}: AvailableCoursesProps) {
    if (!qualificationLevel) return null

    const [modal, setModal] = useState<ReactElement | null>(null)

    const courses = coursesByLevel?.data ?? []

    const currentLevelIndex = SupervisorQualification.findIndex(
        (q) => q.value === Number(qualificationLevel)
    )
    const currentLabel =
        SupervisorQualification[currentLevelIndex]?.label ?? qualificationLevel
    const nextLevel = SupervisorQualification[currentLevelIndex + 1]
    const onClose = () => {
        setModal(null)
    }
    useEffect(() => {
        const hasNoCourses =
            !coursesLoading &&
            !coursesError &&
            coursesByLevel &&
            courses.length === 0

        const shouldShowModal = !!courseLevel && hasNoCourses

        if (shouldShowModal) {
            setModal(
                <NoAvailableCourseModal
                    onClose={onClose}
                    nextLevel={nextLevel}
                    currentLabel={currentLabel}
                />
            )
        } else {
            // 🔥 IMPORTANT: clear modal when condition no longer valid
            setModal(null)
        }
    }, [courseLevel, coursesLoading, coursesError, coursesByLevel, courses])
    return (
        <>
            {modal && modal}
            {coursesLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading available courses...
                </div>
            )}

            {!coursesLoading && coursesError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-semibold text-red-800 text-sm">
                            Failed to Load Courses
                        </div>
                        <p className="text-xs text-red-700 mt-0.5">
                            Could not retrieve courses for this qualification
                            level. Please try again.
                        </p>
                    </div>
                </div>
            )}

            {!coursesLoading &&
                !coursesError &&
                coursesByLevel &&
                courses.length === 0 && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                                <ArrowUpCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-amber-900 text-sm">
                                    No courses available at{' '}
                                    <span className="text-amber-700">
                                        {currentLabel}
                                    </span>{' '}
                                    level
                                </div>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    The supervisor's current qualification level
                                    does not match any courses in this sector.
                                    {nextLevel ? (
                                        <>
                                            {' '}
                                            Consider upgrading to{' '}
                                            <span className="font-semibold">
                                                {nextLevel.label}
                                            </span>{' '}
                                            or higher to unlock available course
                                            options.
                                        </>
                                    ) : (
                                        <>
                                            {' '}
                                            This is the highest qualification
                                            level — please check that this
                                            sector has courses configured.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {!coursesLoading && !coursesError && courses.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Available Courses for This Supervisor
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                        {courses.map((course: any) => {
                            const courseTasks =
                                selectedTaskIds[sectorId]?.[course.id] || []
                            return (
                                <div
                                    key={course.id}
                                    className="p-5 rounded-xl border-2 bg-white/80 space-y-3"
                                    style={{
                                        borderColor: `${sectorConfig.color}20`,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">
                                            {course.title}
                                        </h4>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            Level {course.level}
                                        </Badge>
                                    </div>

                                    {course.highlightedTasks?.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                                            <div className="text-xs font-semibold text-primary mb-2">
                                                Highlighted Tasks
                                            </div>
                                            {course.highlightedTasks.map(
                                                (task: any) => {
                                                    const isChecked =
                                                        courseTasks.includes(
                                                            task.id
                                                        )
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center gap-2 cursor-pointer group"
                                                            onClick={() =>
                                                                onToggleTask(
                                                                    course.id,
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            <div
                                                                className="w-4 h-4 rounded flex items-center justify-center transition-all shrink-0"
                                                                style={{
                                                                    backgroundColor:
                                                                        isChecked
                                                                            ? '#10B981'
                                                                            : '#E5E7EB',
                                                                    border: '2px solid',
                                                                    borderColor:
                                                                        isChecked
                                                                            ? '#10B981'
                                                                            : '#D1D5DB',
                                                                }}
                                                            >
                                                                {isChecked && (
                                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                                {task.statement}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Badge
                                            variant="success"
                                            className="text-xs bg-emerald-50 border-emerald-300 text-emerald-700"
                                            text="Compatible"
                                            Icon={CheckCircle}
                                        />

                                        <span className="text-xs text-muted-foreground">
                                            {course.highlightedTasks?.length}{' '}
                                            highlighted tasks
                                        </span>
                                        {course.hours && (
                                            <span className="text-xs text-muted-foreground">
                                                {course.hours} hrs
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

import { AlertCircle, BookOpen, CheckCircle } from 'lucide-react'
import { Badge } from '@components'
import { Label } from '@components/ui/label'

interface AvailableCoursesProps {
    qualificationLevel: string
    coursesByLevel: any
    coursesLoading: boolean
    coursesError: boolean
    sectorConfig: { color: string }
    sectorId: string
    selectedTaskIds: Record<string, Record<number, number[]>>
    onToggleTask: (courseId: number, taskId: number) => void
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
}: AvailableCoursesProps) {
    if (!qualificationLevel) return null

    const courses = coursesByLevel?.data ?? []

    return (
        <>
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
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-amber-800 text-sm">
                                No Courses Available
                            </div>
                            <p className="text-xs text-amber-700 mt-0.5">
                                No courses found for the selected qualification
                                level in this sector. Try a different level.
                            </p>
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

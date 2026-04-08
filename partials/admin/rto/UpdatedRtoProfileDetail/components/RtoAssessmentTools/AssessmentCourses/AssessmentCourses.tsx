import { Course } from '@types'
import { AssessmentCourseCard } from './AssessmentCourseCard'
import { NoData, Typography } from '@components'

export const AssessmentCourses = ({
    courses,
    selectedCourseId,
    onSelectedCourse,
}: {
    courses: Course[]
    selectedCourseId: number | null
    onSelectedCourse: (course: Course) => void
}) => {
    return (
        <div className="px-3.5 py-[18px] h-full">
            <Typography variant="label" medium>
                Select Folder
            </Typography>
            <div className="mt-3.5 h-[calc(405px-125px)] overflow-auto custom-scrollbar">
                {courses && courses?.length > 0 ? (
                    <div className="flex flex-col gap-y-3.5">
                        {courses?.map((course: any) => (
                            <AssessmentCourseCard
                                course={course}
                                key={course?.id}
                                onClick={() => onSelectedCourse(course)}
                                active={selectedCourseId === course?.id}
                            />
                        ))}
                    </div>
                ) : (
                    <NoData text="No Courses were found!" />
                )}
            </div>
        </div>
    )
}

import { Badge, LoadingAnimation, NoData } from '@components'
import { setSelectedCourse } from '@redux'
import { Course } from '@types'
import { cn } from '@utils'
import { BookOpen } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { CourseCard } from '../card'
import { useCourseSelection } from '../hooks'

export const CourseOverview = () => {
    const dispatch = useAppDispatch()

    const { studentCourses } = useCourseSelection()

    const selectedCourse = useAppSelector(
        (state) => state.student.selectedCourse
    )

    const onSelectCourse = (course: Course) => {
        dispatch(setSelectedCourse(course))
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-4.5 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-lg shadow-[#044866]/30">
                        <BookOpen className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-slate-900 flex items-center gap-2">
                            My Courses
                            <Badge
                                variant="primaryNew"
                                text={`${
                                    studentCourses?.data?.length || 0
                                } Courses`}
                                size="xs"
                                className="border border-[#044866]/20"
                            />
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Track your learning progress
                        </p>
                    </div>
                </div>
                {/* <Button
                    outline
                    variant="secondary"
                    onClick={() => setModalOpen(true)}
                    className="border-slate-300 hover:border-[#044866] hover:text-[#044866] hover:bg-[#044866]/5 shadow-md hover:shadow-lg transition-all px-3.5 py-2 text-sm"
                >
                    View All Courses ({(studentCourses?.data?.length || 1) - 1}{' '}
                    more) <ArrowRight className="w-3 h-3 ml-2" />
                </Button> */}
            </div>

            {/* <ViewAllCourseModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                courses={studentCourses?.data || []}
                isLoading={studentCourses?.isLoading}
            /> */}

            {studentCourses?.isError ? (
                <NoData isError text="There is some technical error!" />
            ) : null}

            {studentCourses?.isLoading ? (
                <div className="flex justify-center py-10">
                    <LoadingAnimation />
                </div>
            ) : studentCourses?.isSuccess &&
              studentCourses?.data &&
              studentCourses?.data?.length > 0 ? (
                <div
                    className={cn('grid grid-cols-1 md:grid-cols-2 gap-2', {
                        'h-40 overflow-auto custom-scrollbar':
                            studentCourses?.data?.length > 2,
                        'md:grid-cols-1!': studentCourses?.data?.length === 1,
                    })}
                >
                    {studentCourses?.data?.map((course: Course) => (
                        <CourseCard
                            key={course?.id}
                            selectedCourse={
                                course as Course & { coursePrograms: number }
                            }
                            onClick={() => onSelectCourse(course)}
                            isActive={selectedCourse?.id === course?.id}
                        />
                    ))}
                </div>
            ) : (
                studentCourses?.isSuccess && <NoData text="No Courses Found!" />
            )}
        </div>
    )
}

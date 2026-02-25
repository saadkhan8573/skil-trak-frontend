import { Course } from '@types'
import { Typography } from '@components'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'

interface SectorCourseGroupProps {
    courses: Course[]
}

const getSectors = (courses: Course[]) => {
    if (!courses) return {}
    const sectors: Record<string, Course[]> = {}
    courses.forEach((c) => {
        const sectorName = c.sector?.name || 'Unknown Sector'
        if (sectors[sectorName]) {
            sectors[sectorName].push(c)
        } else {
            sectors[sectorName] = [c]
        }
    })
    return sectors
}

const CourseRenderList = ({ sectorsWithCourses }: { sectorsWithCourses: Record<string, Course[]> }) => (
    <div className="flex flex-col gap-y-2 w-full">
        {Object.keys(sectorsWithCourses).map((sectorName) => (
            <div key={sectorName} className="flex flex-col gap-y-1">
                <Typography
                    variant="small"
                    color="text-gray-500"
                    className="text-[10px] font-semibold uppercase tracking-wider"
                >
                    {sectorName}
                </Typography>
                <div className="flex flex-col gap-y-1">
                    {sectorsWithCourses[sectorName].map((course) => (
                        <div key={course.id} className="flex flex-col">
                            <Typography variant="small" className="text-[11px] font-medium leading-tight">
                                {course.title}
                            </Typography>
                            <Typography variant="small" color="text-gray-400" className="text-[10px] leading-tight">
                                {course.code}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
)

export const SectorCourseGroup = ({ courses }: SectorCourseGroupProps) => {
    if (!courses || courses.length === 0) {
        return <Typography variant="small" color="text-gray-400">---</Typography>
    }

    const isOverLimit = courses.length > 3
    const displayedCourses = isOverLimit ? courses.slice(0, 3) : courses
    const remainingCourses = isOverLimit ? courses.slice(3) : []
    const sectorsWithCourses = getSectors(displayedCourses)
    const remainingSectorsWithCourses = getSectors(remainingCourses)

    return (
        <div className="flex flex-col gap-y-2 py-1 w-full">
            <CourseRenderList sectorsWithCourses={sectorsWithCourses} />

            {isOverLimit && (
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="text-[11px] font-semibold text-blue-600 hover:underline text-left mt-1">
                            + {courses.length - 3} more courses
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 max-h-80 overflow-y-auto" align="start">
                        <Typography variant="label" className="mb-3 block border-b pb-1">
                            Remaining Courses
                        </Typography>
                        <CourseRenderList sectorsWithCourses={remainingSectorsWithCourses} />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}

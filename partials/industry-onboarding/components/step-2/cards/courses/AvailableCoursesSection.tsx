import { BookOpen } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { Label } from '@components/ui/label'
import { EligibilityChecks, Sector } from '../../types/sectorsAndCourses'

interface AvailableCoursesProps {
    sector: Sector
    getFilteredCoursesForSector: (
        sectorName: string,
        supervisorLevel: string
    ) => any[]
    getCoursePrerequisites: (
        sectorId: string,
        courseId: string
    ) => EligibilityChecks
    onPrerequisiteChange: any

    sectorColor: string
}

export const AvailableCoursesSection: React.FC<AvailableCoursesProps> = ({
    sector,
    getFilteredCoursesForSector,
    getCoursePrerequisites,
    onPrerequisiteChange,
    sectorColor,
}) => {
    const courses = getFilteredCoursesForSector(
        sector.name,
        sector.supervisorLevel
    )

    if (!sector.supervisorLevel || courses.length === 0) return null

    return (
        <div className="space-y-4">
            <Label className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Available Courses for This Supervisor
            </Label>
            <div className="grid grid-cols-1 gap-3">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        sector={sector}
                        sectorColor={sectorColor}
                        getCoursePrerequisites={getCoursePrerequisites}
                        onPrerequisiteChange={onPrerequisiteChange}
                    />
                ))}
            </div>
        </div>
    )
}

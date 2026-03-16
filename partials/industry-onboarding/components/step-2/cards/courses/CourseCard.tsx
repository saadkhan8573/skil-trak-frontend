import { Badge } from '@components'
import { EligibilityChecks, Sector } from '../../types/sectorsAndCourses'
import { CoursePrerequisiteItem } from './CoursePrerequisiteItem'
import { CheckCircle } from 'lucide-react'

interface CourseCardProps {
    course: any
    sector: Sector
    sectorColor: string
    getCoursePrerequisites: (
        sectorId: string,
        courseId: string
    ) => EligibilityChecks
    onPrerequisiteChange: (
        sectorId: string,
        courseId: string,
        field: keyof EligibilityChecks,
        value: boolean
    ) => void
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    sector,
    sectorColor,
    getCoursePrerequisites,
    onPrerequisiteChange,
}) => {
    const prereqs = getCoursePrerequisites(sector.id, course.id)

    return (
        <div
            className="p-5 rounded-xl border-2 bg-white/80 space-y-3"
            style={{ borderColor: `${sectorColor}20` }}
        >
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{course.name}</h4>
                <Badge variant="secondary" text={course.level} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <div className="text-xs font-semibold text-primary mb-2">
                    Course Prerequisites (Specific to this course)
                </div>

                <CoursePrerequisiteItem
                    label="1. Direct Support Environment"
                    checked={prereqs.directSupport}
                    onChange={(value) =>
                        onPrerequisiteChange(
                            sector.id,
                            course.id,
                            'directSupport',
                            value
                        )
                    }
                />

                <CoursePrerequisiteItem
                    label="2. Supervision"
                    checked={prereqs.supervision}
                    onChange={(value) =>
                        onPrerequisiteChange(
                            sector.id,
                            course.id,
                            'supervision',
                            value
                        )
                    }
                />

                <CoursePrerequisiteItem
                    label="3. Equipment & Resources"
                    checked={prereqs.equipmentResources}
                    onChange={(value) =>
                        onPrerequisiteChange(
                            sector.id,
                            course.id,
                            'equipmentResources',
                            value
                        )
                    }
                />
            </div>

            <p className="text-xs text-muted-foreground mb-2">
                {course.requirements}
            </p>
            <div className="flex items-center gap-2">
                <Badge
                    variant="secondary"
                    className="text-xs"
                    Icon={CheckCircle}
                    text={'Compatible'}
                />

                <span className="text-xs text-muted-foreground">
                    {course.tasks.length} learning tasks
                </span>
            </div>
        </div>
    )
}

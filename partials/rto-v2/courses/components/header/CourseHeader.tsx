import { Card } from '@components'
import { Button } from '@components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@components/ui/collapsible'
import { Separator } from '@components/ui/separator'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ViewAssessmentsModal } from '../assessment-tools'
import { PlacementRequirementsConfiguration } from '../collapsible-content/placement-requirements-config'
import { CourseApproval } from './CourseApproval'
import { CourseHeaderStats } from './CourseHeaderStats'
import { CourseHeaderTitle } from './CourseHeaderTitle'

export const CourseHeader = ({ coursesData }: any) => {
    const [expandedCourses, setExpandedCourses] = useState<string[]>([
        coursesData?.[0]?.id,
    ])

    const toggleCourse = (courseId: string) => {
        setExpandedCourses((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        )
    }
    return (
        <div className="space-y-3">
            {coursesData?.map((course: any) => {
                const isExpanded = expandedCourses?.includes(course?.id)
                return (
                    <Card
                        key={course.id}
                        className="border border-border/50 transition-all shadow-sm hover:shadow-md bg-card overflow-hidden"
                    >
                        <Collapsible
                            open={isExpanded}
                            onOpenChange={() => toggleCourse(course?.id)}
                        >
                            <CollapsibleTrigger asChild>
                                <div className="cursor-pointer transition-all pb-4">
                                    {/* Course Title Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <CourseHeaderTitle
                                                course={course}
                                            />
                                            <div className="flex items-center gap-2 shrink-0 mt-1">
                                                <div
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <ViewAssessmentsModal
                                                        course={course}
                                                    />
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-full"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronRight className="h-5 w-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <CourseHeaderStats course={course} />
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <PlacementRequirementsConfiguration
                                    course={course}
                                />

                                <Separator className="my-6 mt-8" />
                                <CourseApproval course={course} />
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )
            })}
            {/* <LogbookSummaryDisplay course={course} /> */}
        </div>
    )
}

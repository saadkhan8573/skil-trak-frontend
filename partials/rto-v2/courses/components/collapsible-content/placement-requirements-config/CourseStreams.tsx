import { Badge, Card, TextInput } from '@components'
import { Course, CourseProgramType, UserStatus } from '@types'
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    Clock,
    Layers,
} from 'lucide-react'
import React, { useState } from 'react'

export const CourseStreams = ({ course }: { course: Course | any }) => {
    const [editingStream, setEditingStream] = useState<number | null>(null)

    const coursePrograms = course?.coursePrograms || []

    const handleUpdateStreamHours = (
        courseId: number,
        streamId: number,
        hours: number
    ) => {
        // Implement API call here when available
    }

    const totalStreamHours = coursePrograms.reduce(
        (sum: number, s: any) => sum + (parseInt(s.hours) || 0),
        0
    )

    const logbook = course?.rtoCourseFiles?.find(
        (file: any) => file.title === 'logBook'
    )
    const isCourseApproved = logbook?.status === UserStatus.Approved

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primaryNew flex items-center justify-center shadow-md">
                    <Layers className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-base">Course Streams</h3>
                <Badge variant="info" outline className="ml-auto text-xs">
                    {coursePrograms.length} stream
                    {coursePrograms.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            {/* Existing Streams */}
            <div className="mb-4 grid grid-cols-2 gap-3">
                {coursePrograms.map((stream: any) => (
                    <Card
                        key={stream.id}
                        className="border-2 border-primaryNew/20 bg-linear-to-br from-primaryNew/5 to-background hover:border-primaryNew/30 transition-all"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-secondary/10 to-primaryNew/10 flex items-center justify-center border border-primaryNew/20">
                                    <BookOpen className="h-5 w-5 text-primaryNew" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">
                                        {stream.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <div className="text-xs text-muted-foreground">
                                            {editingStream === stream.id ? (
                                                <TextInput
                                                    type="number"
                                                    name={`stream-${stream.id}-hours`}
                                                    value={stream.hours}
                                                    onChange={(e: any) =>
                                                        handleUpdateStreamHours(
                                                            stream.course?.id,
                                                            stream.id,
                                                            parseInt(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                    onFocus={(e: any) =>
                                                        e.stopPropagation()
                                                    }
                                                />
                                            ) : (
                                                <span className="font-semibold">
                                                    {stream.hours} hours
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {!coursePrograms?.length && (
                    <div className="text-center py-8 px-4 rounded-xl bg-muted/30 border-2 border-dashed border-border col-span-2">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-linear-to-br from-primaryNew/10 to-secondary/10 flex items-center justify-center mb-3">
                            <Layers className="h-6 w-6 text-primaryNew" />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                            No streams added yet
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Add streams to organize placement hours by
                            specialization or area
                        </p>
                    </div>
                )}
            </div>

            {coursePrograms.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-primaryNew/10 border border-success/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">
                                Total Stream Hours:
                            </span>
                        </div>
                        <span className="text-lg font-bold text-success">
                            {totalStreamHours} hours
                        </span>
                    </div>
                    {isCourseApproved &&
                        course.confirmedHours &&
                        totalStreamHours !== course.confirmedHours && (
                            <div className="mt-2 flex items-start gap-2 text-xs text-warning">
                                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                <span>
                                    Stream hours ({totalStreamHours}) don't
                                    match required hours (
                                    {course.confirmedHours})
                                </span>
                            </div>
                        )}
                </div>
            )}
        </div>
    )
}

'use client'

import { ShowErrorNotifications, TextInput } from '@components'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { useNotification } from '@hooks'
import { RtoApi } from '@queries'
import { UserStatus } from '@types'
import { AlertCircle, CheckCircle2, Clock, Edit, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PuffLoader } from 'react-spinners'

type RequiredPlacementHoursProps = {
    course: any
}

export const RequiredPlacementHours = ({
    course,
}: RequiredPlacementHoursProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [tempHours, setTempHours] = useState<number | null>(null)

    const { notification } = useNotification()
    const [updateHours, updateHoursResult] =
        RtoApi.Courses.useUpdateCourseHours()

    // Sync tempHours when course.hours changes
    useEffect(() => {
        const hours =
            course.extraHours.length > 0
                ? course?.extraHours[0]?.hours
                : course?.hours
        setTempHours(hours ?? null)
    }, [course])

    // Show notifications on success or error
    useEffect(() => {
        if (updateHoursResult.isSuccess) {
            notification.success({
                title: 'Course Hours Updated',
                description: 'Course hours updated successfully',
            })
            setIsEditing(false)
        }
    }, [updateHoursResult.isSuccess])

    // Handle save button
    const handleSave = () => {
        if (tempHours === null || tempHours < 0) return

        updateHours({
            body: {
                courses: [
                    {
                        course: course?.id,
                        hours: tempHours,
                    },
                ],
            },
        })
    }

    const logbook = course?.rtoCourseFiles?.find((file: any) => file.title === 'logBook')
    const isCourseApproved = logbook?.status === UserStatus.Approved

    return (
        <>
            <ShowErrorNotifications result={updateHoursResult} />

            <div className="space-y-8">
                {/* Required Hours */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-primaryNew/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primaryNew" />
                        </div>
                        <h3 className="font-semibold text-base">
                            Required Placement Hours
                        </h3>

                        {isCourseApproved ? (
                            <Badge className="!bg-success/10 !text-success !border-success/20 ml-auto flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Confirmed
                            </Badge>
                        ) : (
                            <Badge className="bg-warning/10 text-warning border-yellow-300/20 ml-auto flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Needs Confirmation
                            </Badge>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-[#f1f5f9]/30 to-[#f1f5f9]/50 rounded-xl p-5 border border-border/50">
                        {isEditing ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <TextInput
                                        name="tempHours"
                                        type="number"
                                        value={tempHours || 0}
                                        min={0}
                                        onChange={(e: any) =>
                                            setTempHours(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className="w-32 h-11"
                                        placeholder="Hours"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        hours minimum
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-success hover:bg-success/90 h-9 flex items-center gap-1"
                                        onClick={handleSave}
                                        disabled={updateHoursResult.isLoading}
                                    >
                                        {updateHoursResult.isLoading ? (
                                            <PuffLoader size={24} />
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                Save
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                        disabled={updateHoursResult.isLoading}
                                        className="h-9"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-semibold text-primaryNew">
                                        {course?.extraHours?.length > 0
                                            ? course?.extraHours[0]?.hours
                                            : course?.hours ?? 0}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        hours minimum
                                    </span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="h-9 gap-2 flex items-center"
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

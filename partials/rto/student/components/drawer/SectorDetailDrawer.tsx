import { ActionButton, ContextBarLoading, NoData, Typography } from '@components'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@components/ui/drawer'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Course, Student } from '@types'
import { useEffect, useState } from 'react'
import { AssignedCourse } from '../../components'
import { AssignSectorForm } from '../../form'
import { Button } from '@components/ui/button'

const getSectors = (courses: any) => {
    if (!courses) return {}
    const sectors = {}
    courses.forEach((c: any) => {
        if ((sectors as any)[c.sector.name]) {
            ; (sectors as any)[c.sector.name].push(c)
        } else {
            ; (sectors as any)[c.sector.name] = []
                ; (sectors as any)[c.sector.name].push(c)
        }
    })
    return sectors
}

export const SectorDetailDrawer = ({
    student,
    isOpen,
    onClose,
}: {
    student: Student
    isOpen?: boolean
    onClose?: () => void
}) => {
    const { notification } = useNotification()
    const [open, setOpen] = useState(isOpen || false)

    useEffect(() => {
        if (isOpen !== undefined) {
            setOpen(isOpen)
        }
    }, [isOpen])

    const handleOpenChange = (v: boolean) => {
        setOpen(v)
        if (!v && onClose) {
            onClose()
        }
    }

    // Only fetch when open to save resources
    const courses = AdminApi.Students.useSectors(student.id, {
        skip: !open
    })
    const sectorsWithCourses = getSectors(courses.data)

    const [assignCourses, assignCoursesResult] =
        AdminApi.Students.useAssignCourses()
    const onSubmit = async (values: any) => {
        const { courses } = values
        await assignCourses({
            user: student.id,
            courses: courses.map((c: any) => c.value),
        })
    }

    const [unassignCourse, unassignCourseResult] =
        AdminApi.Students.useUnassignCourses()
    const onCourseRemove = async (course: Course) => {
        await unassignCourse({
            id: Number(student.id),
            courseId: Number(course.id),
        })
    }

    useEffect(() => {
        if (assignCoursesResult.isSuccess) {
            handleOpenChange(false) // Close drawer on success
            notification.success({
                title: 'Courses Assigned',
                description: 'Courses have been assigned to Student',
            })
        }

        if (assignCoursesResult.isError) {
            notification.error({
                title: 'Courses Assignment Failed',
                description: 'An error occurred while assigning course(s)',
            })
        }
    }, [assignCoursesResult])

    useEffect(() => {
        if (unassignCourseResult.isSuccess) {
            notification.info({
                title: 'Courses Unassigned',
                description: 'Courses have been unassigned to RTO',
            })
        }

        if (unassignCourseResult.isError) {
            notification.error({
                title: 'Failed To Unassign',
                description: 'An error occurred while unassign course(s)',
            })
        }
    }, [unassignCourseResult])

    return (
        <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
            {isOpen === undefined && (
                <DrawerTrigger asChild>
                    <ActionButton variant="link" simple>
                        View
                    </ActionButton>
                </DrawerTrigger>
            )}
            <DrawerContent className="w-screen h-full mt-0 rounded-none">
                <div className="mx-auto w-full h-full flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle>Sectors &amp; Courses</DrawerTitle>
                        <div className="flex flex-col">
                            <Typography variant={'muted'} color={'text-gray-400'}>
                                Sectors &amp; Courses Of:
                            </Typography>
                            <Typography variant={'label'}>{student?.user?.name}</Typography>
                        </div>
                    </DrawerHeader>

                    <div className="p-4 overflow-y-auto flex-1">
                        <div className="flex flex-col gap-y-6">
                            <AssignSectorForm
                                onSubmit={onSubmit}
                                result={assignCoursesResult}
                            />

                            <div className={'flex flex-col gap-y-2'}>
                                <Typography variant={'muted'} color={'text-gray-400'}>
                                    Selected Sectors &amp; Courses
                                </Typography>

                                {courses.isLoading ? (
                                    <ContextBarLoading />
                                ) : courses.data?.length ? (
                                    Object.keys(sectorsWithCourses).map((sector) => {
                                        return (
                                            <div key={sector}>
                                                <span
                                                    className="text-xs font-medium text-slate-400 border-t pt-2 block mb-1"
                                                >
                                                    {sector}
                                                </span>

                                                {(sectorsWithCourses as any)[sector].map(
                                                    (c: Course) => (
                                                        <AssignedCourse
                                                            key={c.id}
                                                            course={c}
                                                            onRemove={onCourseRemove}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )
                                    })
                                ) : (
                                    <NoData text={'No Courses Assigned'} />
                                )}
                            </div>
                        </div>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

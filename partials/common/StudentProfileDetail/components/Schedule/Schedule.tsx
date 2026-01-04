import {
    AuthorizedUserComponent,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    NoData,
    Select,
    ShowErrorNotifications,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { StudentApi, SubAdminApi } from '@queries'
import { Course, Industry, User } from '@types'
import { CourseSelectOption, formatOptionLabel } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { ViewAvailability } from '../Workplace'
import { useWorkplaceQueries } from '../Workplace/hooks/useWorkplaceQueries.hook'
import { AddSchedule, ScheduleTimetable } from './components'

export const Schedule = ({
    user,
    studentId,
    student,
}: {
    studentId: number
    user: User
    student?: any
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [isEntered, setIsEntered] = useState<boolean>(false)
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
    const [selectedIndustry, setSelectedIndustry] = useState<number | null>(
        null
    )
    const [addSchedule, setAddSchedule] = useState<boolean>(false)
    const { selectedWorkplace } = useWorkplaceQueries({ student })
    const router = useRouter()
    const courses = SubAdminApi.Student.useCourses(studentId, {
        skip: !studentId || !isEntered,
        refetchOnMountOrArgChange: 300,
    })

    const studentWorkplace = SubAdminApi.Student.getWorkplaceForSchedule(
        studentId,
        {
            skip: !studentId || !isEntered,
        }
    )

    const schedules = StudentApi.Schedule.useGetStudentSchedule(
        {
            userId: user?.id,
            courseId: Number(selectedCourse),
            workplace: Number(selectedIndustry),
        },
        {
            skip: !selectedCourse || !selectedIndustry || !isEntered,
            refetchOnMountOrArgChange: 300,
        }
    )

    const industriesOptions = useMemo(
        () =>
            studentWorkplace?.data
                ?.map((w: any) =>
                    w?.industries?.map((ind: any) => ind?.industry)
                )
                ?.flat()
                ?.map((ind: Industry) => ({
                    label: ind?.user?.name,
                    value: ind?.id,
                    item: ind,
                })),
        [studentWorkplace]
    )

    useEffect(() => {
        if (courses.data && courses.data?.length > 0) {
            setSelectedCourse(courses.data?.[0]?.id)
        }
        if (industriesOptions && industriesOptions?.length > 0) {
            setSelectedIndustry(industriesOptions?.[0]?.value)
        }
    }, [courses, industriesOptions])

    const courseOptions = courses.data?.map((course: Course) => ({
        value: course?.id,
        label: course?.title,
        item: course,
    }))

    return (
        <>
            {modal}
            <Waypoint
                onEnter={() => {
                    setIsEntered(true)
                }}
                onLeave={() => {
                    setIsEntered(false)
                }}
            >
                <div className="relative">
                    <ShowErrorNotifications result={schedules} />

                    {addSchedule ? (
                        <AddSchedule
                            user={user}
                            studentId={studentId}
                            selectedCourse={Number(selectedCourse)}
                            onAddStudentCourse={() => {
                                setAddSchedule(false)
                            }}
                            workplace={
                                industriesOptions?.find(
                                    (w: any) =>
                                        w?.value === Number(selectedIndustry)
                                )?.item
                            }
                        />
                    ) : (
                        <>
                            <Card noPadding>
                                <div className="px-4 py-3.5 border-b border-secondary-dark">
                                    <Typography variant="label">
                                        Schedule
                                    </Typography>
                                </div>
                                <div className="flex flex-col-reverse xl:flex-row justify-between px-4 py-2.5">
                                    <div className="flex flex-col md:flex-row gap-x-2">
                                        <div className="w-72">
                                            <Select
                                                label={'Courses'}
                                                name={'courses'}
                                                // value={courseOptions?.find(
                                                //     (c: any) =>
                                                //         c?.value ===
                                                //         selectedCourse
                                                // )}
                                                value={selectedCourse}
                                                options={courseOptions}
                                                loading={courses.isLoading}
                                                onlyValue
                                                disabled={courses.isLoading}
                                                validationIcons
                                                components={{
                                                    Option: CourseSelectOption,
                                                }}
                                                formatOptionLabel={
                                                    formatOptionLabel
                                                }
                                                onChange={(e: any) => {
                                                    setSelectedCourse(e)
                                                }}
                                                showError={false}
                                            />
                                        </div>
                                        <div className="w-72">
                                            <Select
                                                label={'Workplaces'}
                                                name={'workplace'}
                                                defaultValue={industriesOptions}
                                                // value={industriesOptions?.find(
                                                //     (c: any) =>
                                                //         c?.value ===
                                                //         selectedIndustry
                                                // )}
                                                value={selectedIndustry}
                                                options={industriesOptions}
                                                loading={
                                                    studentWorkplace.isLoading
                                                }
                                                onlyValue
                                                disabled={
                                                    studentWorkplace.isLoading
                                                }
                                                validationIcons
                                                onChange={(e: any) => {
                                                    setSelectedIndustry(e)
                                                }}
                                                showError={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-x-2 mt-4 ml-4">
                                        <AuthorizedUserComponent
                                            excludeRoles={[UserRoles.OBSERVER]}
                                        >
                                            <div className="mt-1 ml-auto">
                                                <Button
                                                    text={
                                                        schedules?.data
                                                            ?.schedule
                                                            ? 'Edit Schedule'
                                                            : 'Add Schedule'
                                                    }
                                                    variant={'info'}
                                                    onClick={() => {
                                                        setAddSchedule(true)
                                                    }}
                                                />
                                            </div>
                                        </AuthorizedUserComponent>
                                        <div className="">
                                            <ViewAvailability
                                                wpId={Number(
                                                    selectedWorkplace?.id
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    {schedules.isError && <TechnicalError />}
                                    {schedules?.isLoading ||
                                    schedules?.isFetching ? (
                                        <LoadingAnimation />
                                    ) : schedules?.data?.schedule ? (
                                        <>
                                            <div className="bg-[#e6f3ff] w-fit px-5 py-2 rounded-md mx-auto flex justify-center items-center gap-x-4">
                                                <div>
                                                    <Typography variant="small">
                                                        Start Date
                                                    </Typography>
                                                    <Typography variant="label">
                                                        {moment(
                                                            schedules?.data
                                                                ?.schedule
                                                                ?.startDate
                                                        ).format(
                                                            'MMMM DD, YYYY'
                                                        )}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="small">
                                                        End Date
                                                    </Typography>
                                                    <Typography variant="label">
                                                        {moment(
                                                            schedules?.data
                                                                ?.schedule
                                                                ?.endDate
                                                        ).format(
                                                            'MMMM DD, YYYY'
                                                        )}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="small">
                                                        Total Hours
                                                    </Typography>
                                                    <Typography variant="label">
                                                        {
                                                            schedules?.data
                                                                ?.schedule
                                                                ?.hours
                                                        }{' '}
                                                        : Hours
                                                    </Typography>
                                                </div>
                                            </div>

                                            <ScheduleTimetable
                                                scheduleCourse={
                                                    schedules?.data?.schedule
                                                        ?.course
                                                }
                                                scheduleId={
                                                    schedules?.data?.schedule
                                                        ?.id
                                                }
                                                startDate={
                                                    new Date(
                                                        schedules?.data?.schedule?.startDate
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <NoData text="No schedule found" />
                                    )}
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </Waypoint>
        </>
    )
}

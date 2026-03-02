import { Rto } from '@types'
import { Button, Card } from '@components'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { ProfileCounts } from './ProfileCounts'
import { useEffect, useMemo, useState } from 'react'
import { AdminApi, RtoApi, SubAdminApi } from '@queries'
import { RtoProfileProgress } from './RtoProfileProgress'
import Modal from '@modals/Modal'
import { ViewProgressByCourseChart } from '@partials/common'

export const RtoProfileStatistics = ({
    rto,
    subadmin,
    rtoUserId,
}: {
    rto: Rto
    subadmin: any
    rtoUserId: number
}) => {
    const rtoCourses = rto?.courses
    const rtoCourseOptions: any = useMemo(
        () =>
            rtoCourses?.map((course: any) => ({
                label: `${course?.code} - ${course?.title}`,
                value: course?.id,
            })),
        [rtoCourses]
    )
    const [selectedCourse, setSelectedCourse] = useState<any>()
    useEffect(() => {
        setSelectedCourse(rtoCourseOptions?.[0])
    }, [rtoCourseOptions])
    const { data, isLoading, isError, isSuccess } =
        RtoApi.Rto.useRtoProgressByCourse({
            courseId: selectedCourse?.value ?? selectedCourse,
            userId: rtoUserId,
        })
    const role = getUserCredentials()?.role

    const statisticsCount = AdminApi.Rtos.useStatisticsCount(
        Number(rtoUserId),
        { skip: !rtoUserId }
    )
    const subadminStatisticsCount = SubAdminApi.Rto.subadminRtoStatistics(
        Number(rtoUserId),
        { skip: !rtoUserId || role !== UserRoles.SUBADMIN }
    )

    const initialData = [
        { name: 'Total Students', value: data?.totalStudent ?? 0 },
        { name: 'Flagged Students', value: data?.flaggedStudent ?? 0 },
        { name: 'Snoozed Students', value: data?.snoozed ?? 0 },
        { name: 'Not Contactable', value: data?.notContactable ?? 0 },
        {
            name: 'Workplace Requests',
            value: data?.workplaceRequestCreated ?? 0,
        },
        // { name: 'Searching for Workplace', value: 30 },
        {
            name: 'Placed (Options Available)',
            value: data?.placedStudents ?? 0,
        },
        {
            name: 'Average Time (Weeks)',
            value:
                data?.averageTime === 0 || data?.averageTime === null
                    ? 3
                    : data?.averageTime,
        },
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-[18px]">
            <div className="flex flex-col">
                <div className="grow">
                    <div className="h-full">
                        <ProfileCounts
                            statisticsCount={
                                role === UserRoles.SUBADMIN &&
                                !subadmin?.data?.isAdmin
                                    ? subadminStatisticsCount
                                    : statisticsCount
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex justify-end">
                    <Modal>
                        <Modal.Open opens="viewProgressByCourse">
                            <span className="text-sm text-link mb-1 underline cursor-pointer">
                                View Progress by Course
                            </span>
                        </Modal.Open>
                        <Modal.Window name="viewProgressByCourse">
                            <ViewProgressByCourseChart
                                selectedCourse={selectedCourse}
                                initialData={initialData}
                                courses={rtoCourseOptions}
                                setSelectedCourse={setSelectedCourse}
                                isLoading={isLoading}
                                isError={isError}
                                isSuccess={isSuccess}
                            />
                        </Modal.Window>
                    </Modal>
                </div>
                <div className="grow">
                    <Card shadowType="profile" fullHeight>
                        <div className="relative whitespace-nowrap inline-block">
                            <Button variant="info" text={'E-Sign Documents'} />
                            <span className="absolute -top-2 -right-3 text-xs font-bold text-white bg-error px-1.5 py-0.5 rounded-full animate-blink shadow-md">
                                {statisticsCount?.data?.pendingDocuments ?? 0}
                            </span>
                        </div>
                        <RtoProfileProgress
                            statisticsCount={
                                role === UserRoles.SUBADMIN &&
                                !subadmin?.data?.isAdmin
                                    ? subadminStatisticsCount
                                    : statisticsCount
                            }
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}

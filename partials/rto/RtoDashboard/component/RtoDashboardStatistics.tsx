import { Button, Card } from '@components'
import Modal from '@modals/Modal'
import { RtoProfileProgress } from '@partials/admin'
import { ViewProgressByCourseChart } from '@partials/common'
import { RtoApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { ProfileCounts } from './ProfileCounts'
import { Rto } from '@types'

export const RtoDashboardStatistics = ({ rto }: { rto?: Rto }) => {
    const router = useRouter()

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
    const count = RtoApi.Rto.useDashboard()
    const selectedCourseId = selectedCourse?.value ?? selectedCourse
    const { data, isLoading, isError, isSuccess } =
        RtoApi.Rto.useRtoProgressByCourse(
            {
                courseId: selectedCourseId,
            },
            {
                skip: !selectedCourseId,
                // refetchOnMountOrArgChange: true,
            }
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

    const links = [
        {
            text: 'Assessment Tools',
            link: '/portals/rto/tasks/assessment-tools',
        },
        {
            text: 'Appointments',
            link: '/portals/rto/tasks/appointments',
        },
        // {
        //     text: 'E-Sign',
        //     link: '/portals/rto/tasks/e-sign',
        // },
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-[18px]">
            <div className="flex flex-col">
                <div className="grow">
                    <div className="h-full">
                        <ProfileCounts statisticsCount={count} />
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
                        <div className="mb-2 flex items-center gap-x-2">
                            {links?.map((link) => (
                                <Button
                                    key={link?.text}
                                    fullWidth
                                    variant="info"
                                    text={link?.text}
                                    onClick={() => router?.push(link?.link)}
                                />
                            ))}
                            <div className="relative whitespace-nowrap">
                                <Button
                                    fullWidth
                                    variant="info"
                                    text={'E-Sign Documents'}
                                    onClick={() =>
                                        router?.push(
                                            '/portals/rto/tasks/e-sign'
                                        )
                                    }
                                />
                                <span className="absolute -top-2 -right-3 text-xs font-bold text-white bg-error px-1.5 py-0.5 rounded-full animate-blink shadow-md">
                                    {count?.data?.pendingDocuments ?? 0}
                                </span>
                            </div>
                        </div>
                        <RtoProfileProgress statisticsCount={count} />
                    </Card>
                </div>
            </div>
        </div>
    )
}

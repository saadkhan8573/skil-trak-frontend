import {
    LoadingAnimation,
    MasonryGrid,
    NoData,
    SectorCourseStudentCount,
    StudentAISearch,
    Typography,
} from '@components'
import { FigureCard } from '@components/sections/subAdmin'
import { useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import { ProgressLineChart } from '@partials/common'
import { AdminApi, CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { AuthUtils } from '@utils'
import moment from 'moment'
import { ReactElement, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

const AdminDashboard: NextPageWithLayout = () => {
    const navBar = useNavbar()

    const isTablet = useMediaQuery({ maxWidth: 1080 })
    const isMobile = useMediaQuery({ maxWidth: 767 })

    const [name, setName] = useState('')
    const credentials = AuthUtils.getUserCredentials()
    const getRtos = CommonApi.Filter.useRtos()
    const stats = AdminApi.Admin.useCount()
    const sectorsStudentsCount = AdminApi.Admin.useSectorsStudentsCount()

    useEffect(() => {
        navBar.setTitle('Admin Dashboard')
        return () => {
            navBar.setTitle('')
        }
    }, [])

    useEffect(() => {
        if (name === '') {
            if (credentials) {
                setName(credentials?.name || 'Admin')
            } else {
                setName('Admin')
            }
        }
    }, [])

    return (
        <div className="flex flex-col gap-y-6 pb-8 px-6 pt-6">
            {/* Admin Welcome Message */}
            <div className="relative pt-6">
                <div className="absolute right-8 -top-8">
                    <img
                        src="/images/icons/girl-with-laptop.png"
                        alt=""
                        className="w-48"
                    />
                </div>
                <div className="bg-blue-100 px-8 py-6 rounded-2xl">
                    <p className="text-xl text-blue-500 mb-6">
                        <>
                            <span>Welcome Back</span>{' '}
                            <span className="font-bold">{name}!</span>
                        </>
                    </p>
                    <div className="text-blue-900">
                        <p>
                            You are all set to go. It&apos;s{' '}
                            <span className="text-gray-500">
                                {moment().format('Do MMMM')}
                            </span>{' '}
                            today
                        </p>
                        <p>
                            Start by looking into{' '}
                            <strong>Workplace Requests</strong> or{' '}
                            <strong>Appointments</strong> may be!
                        </p>
                    </div>
                </div>
            </div>

            {/* Figure Cards */}
            <div className="flex flex-col gap-y-4">
                <div className="flex gap-x-4">
                    <FigureCard
                        imageUrl="/images/icons/rto.png"
                        count={stats.data?.users.rto || 0}
                        title={'RTOs'}
                        loading={stats.isLoading}
                        link="admin/rto?tab=approved&page=1&pageSize=50"
                    />
                    <FigureCard
                        imageUrl="/images/icons/students.png"
                        count={stats.data?.users.student || 0}
                        title={'Students'}
                        loading={stats.isLoading}
                        link="admin/student?tab=active&page=1&pageSize=50"
                    />
                    <FigureCard
                        imageUrl="/images/icons/industry.png"
                        count={stats.data?.users.industry || 0}
                        title={'Industries'}
                        loading={stats.isLoading}
                        link="admin/industry?tab=approved&page=1&pageSize=50"
                    />
                    <FigureCard
                        imageUrl="/images/icons/job.png"
                        count={stats.data?.jobs || 0}
                        title={'Jobs'}
                        loading={stats.isLoading}
                        link="admin/jobs"
                    />
                </div>
                <div className="flex gap-x-4">
                    <FigureCard
                        imageUrl="/images/icons/sub-admin.png"
                        count={stats.data?.users.subadmin || 0}
                        title={'Coordinators'}
                        loading={stats.isLoading}
                        link="admin/sub-admin?tab=active"
                    />
                    <FigureCard
                        imageUrl="/images/icons/workplace.png"
                        count={stats.data?.workplaceRequests || 0}
                        title={'Workplace Requests'}
                        loading={stats.isLoading}
                        link="admin/workplaces?tab=all-student-provided-workplace"
                    />
                    {/* <FigureCard
                        imageUrl="/images/icons/industry.png"
                        count={0}
                        title={'Joining Requests'}
                        loading={stats.isLoading}
                    /> */}
                </div>
            </div>
            <StudentAISearch />
            <div className="flex flex-col">
                {/* Bar chart */}
                {/* <ViewProgressByCourseAdmin /> */}
                <ProgressLineChart />
            </div>

            <div>
                <Typography>
                    <span className="font-semibold">Sectors & Courses</span>
                </Typography>

                {sectorsStudentsCount.isError && (
                    <NoData text={'There is some technical issue'} isError />
                )}
                {sectorsStudentsCount.isLoading ? (
                    <LoadingAnimation size={80} height={'h-48'} />
                ) : sectorsStudentsCount?.data &&
                    sectorsStudentsCount?.data?.length > 0 ? (
                    <MasonryGrid
                        columnWidth={
                            isMobile ? '100%' : isTablet ? '50%' : '33%'
                        }
                        gutterWidth={11}
                        gutterHeight={11}
                    >
                        {sectorsStudentsCount?.data?.map(
                            (sector: any, i: number) => (
                                <SectorCourseStudentCount
                                    imageUrl="/images/icons/rto.png"
                                    loading={false}
                                    index={i}
                                    key={i}
                                    sector={sector}
                                />
                            )
                        )}
                    </MasonryGrid>
                ) : (
                    sectorsStudentsCount.isSuccess && (
                        <NoData text={'No Sectors Student Count'} />
                    )
                )}
            </div>
        </div>
    )
}

AdminDashboard.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default AdminDashboard

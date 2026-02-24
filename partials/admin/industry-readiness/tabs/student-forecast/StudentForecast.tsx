import React from 'react'
import { BookOpen, MapPin, Building2, TrendingUp } from 'lucide-react'
import { ForecastCard } from './components/ForecastCard'
import { TotalExpectedStudentsCard } from './components/TotalExpectedStudentsCard'
import { LoadingAnimation, NoData, Typography, Card } from '@components'
import { DetailedForecastTable } from './components/DetailedForecastTable'
import { AdminApi } from '@redux'
export const StudentForecast = () => {
    const { data, isLoading, isError } =
        AdminApi.IndustryReadiness.useStudentForecast()
    const totalStudents = data?.totalExpectedStudents?.expectedStudents ?? 0

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Typography variant="title">
                        Incoming Students Forecast
                    </Typography>
                    <Typography color="text-gray-400" variant="muted">
                        Predictive view of expected student arrivals
                    </Typography>
                </div>
                <div className="bg-primary text-white p-3 rounded-xl">
                    <TrendingUp />
                </div>
            </div>
            <Card className='space-y-4'>
                {isError && <NoData isError text="Something went wrong" />}
                {isLoading ? (
                    <LoadingAnimation />
                ) : data && Object.keys(data).length > 0 ? (
                    <>
                        <TotalExpectedStudentsCard
                            expectedStudents={
                                data?.totalExpectedStudents?.expectedStudents ??
                                0
                            }
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <ForecastCard
                                title="By Course"
                                icon={BookOpen}
                                data={data?.studentsBycourse}
                                totalStudents={totalStudents}
                                colorClass="#044866"
                                renderLabel={(item) => item?.courseTitle}
                            />
                            <ForecastCard
                                title="By Location"
                                icon={MapPin}
                                data={data?.studentsBySuburb}
                                totalStudents={totalStudents}
                                colorClass="#0D5468"
                                renderLabel={(item) => item?.suburb}
                            />

                            {/* Training Org Card */}
                            <ForecastCard
                                title="By Training Org"
                                icon={Building2}
                                data={data?.studentsByRTO}
                                totalStudents={totalStudents}
                                colorClass="#F7A619"
                                renderLabel={(item) => item?.rtoName}
                            />
                        </div>

                        {/* Table */}
                        <DetailedForecastTable data={data?.detailStats} />
                    </>
                ) : (
                    !isError && <NoData text="No Data" />
                )}
            </Card>
        </div>
    )
}

import { LoadingAnimation, NoData, Select, Typography } from '@components'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

export const ViewProgressByCourseChart = ({
    courses,
    initialData,
    setSelectedCourse,
    selectedCourse,
    isLoading,
    isError,
}: any) => {

    return (
        <div className="w-full">
            <div className="flex justify-center my-6">
                <Typography variant={'h4'}>
                    Updated Course Overview Chart with Timeline
                </Typography>
            </div>

            <div className="flex items-center gap-4 justify-between mb-5">
                <div className="min-w-56">
                    <Select
                        name="courses"
                        options={courses}
                        placeholder="Filter by Course..."
                        label={'Filter by course'}
                        onChange={(e: any) => setSelectedCourse(e)}
                        defaultValue={selectedCourse}
                        onlyValue
                    />
                </div>
            </div>

            <div className="w-full h-120">
                {isError && <NoData text={'Something went wrong!'} />}
                {isLoading ? (
                    <LoadingAnimation size={60} />
                ) : initialData?.length > 0 ? (
                    <ResponsiveContainer width="102%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart
                            data={initialData}
                            margin={{
                                top: 20,
                                right: 60,
                                left: 20,
                                bottom: 70,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis
                                yAxisId="left"
                                label={{
                                    value: 'Values',
                                    angle: -90,
                                    position: 'insideLeft',
                                }}
                            />

                            {/* <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0.5, avgTimelineWeeks + 0.5]}
                                // ticks={[0, 1, 2, 3].filter(
                                //     (tick) => tick <= avgTimelineWeeks + 0.5
                                // )}
                                label={{
                                    value: 'Timeline (Weeks)',
                                    angle: 270,
                                    position: 'insideRight',
                                    style: {
                                        textAnchor: 'middle',
                                        fill: 'red',
                                    },
                                }}
                            /> */}
                            <Tooltip />
                            {/* <Legend /> */}

                            {/* Bars for the main metrics */}
                            <Bar
                                yAxisId="left"
                                dataKey="value"
                                fill="#87CEEB"
                                name="Metrics"
                                label={{
                                    position: 'top',
                                    fill: '#000000',
                                    fontSize: 12,
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    !isError && <NoData text="No data found" />
                )}
            </div>
        </div>
    )
}

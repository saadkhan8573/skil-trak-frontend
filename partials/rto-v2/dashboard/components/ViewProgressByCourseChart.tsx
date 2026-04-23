import { LoadingAnimation, NoData } from '@components'
import { RtoApi } from '@queries'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

export const ViewProgressByCourseChart = ({
    selectedCourse,
    showBullets = true,
}: {
    selectedCourse: number | null
    showBullets?: boolean
}) => {
    const { data, isLoading, isError, isSuccess } =
        RtoApi.Rto.useRtoProgressByCourse(
            {
                courseId: selectedCourse,
            },
            {
                skip: !selectedCourse,
            }
        )

    const COLORS: { [key: string]: string } = {
        'Total Students': '#0ea5e9',
        'Flagged Students': '#f97316',
        'Snoozed Students': '#8b5cf6',
        'No Contactable': '#ef4444',
        'Workplace Requests': '#14b8a6',
        'Placed (Options Available)': '#10b981',
        'Average Time (Weeks)': '#6366f1',
    }

    const initialData = [
        { name: 'Total Students', value: data?.totalStudent ?? 0 },
        { name: 'Flagged Students', value: data?.flaggedStudent ?? 0 },
        { name: 'Snoozed Students', value: data?.snoozed ?? 0 },
        { name: 'Not Contactable', value: data?.notContactable ?? 0 },
        {
            name: 'Workplace Requests',
            value: data?.workplaceRequestCreated ?? 0,
        },
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
        <div className="w-full max-w-4xl mx-auto space-y-2.5">
            <div className="w-full h-80 bg-white rounded-lg p-4 shadow-sm">
                {isError && <NoData isError text={'Something went wrong!'} />}
                {isLoading ? (
                    <LoadingAnimation size={40} />
                ) : isSuccess && data ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 10 }}
                                label={{
                                    value: 'Values',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { fontSize: 10 },
                                }}
                            />
                            <Tooltip />

                            <Bar
                                yAxisId="left"
                                dataKey="value"
                                name="Metrics"
                                barSize={30}
                                radius={[8, 8, 0, 0]}
                                label={{
                                    position: 'top',
                                    fill: '#000000',
                                    fontSize: 10,
                                }}
                            >
                                {initialData.map((entry: any, index: any) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.name] || '#87CEEB'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    isSuccess && <NoData text="No data found" />
                )}
            </div>
            {/*  */}
            {showBullets && (
                <div className="grid grid-cols-2 gap-1 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    {Object.entries(COLORS)?.map(([name, color]: any) => (
                        <div key={name}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full bg-primaryNew"
                                    style={{
                                        backgroundColor: color,
                                    }}
                                />
                                <p className="text-sm font-medium text-gray-700">
                                    {name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

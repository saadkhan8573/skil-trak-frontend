import { Rto, Sector } from '@types'
import { removeEmptyValues } from '@utils'
import { useMemo, useState } from 'react'
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { CustomTooltip } from './CustomTooltip'
import { CurveType } from 'recharts/types/shape/Curve'
import { Button, Card, Select, SidebarCalendar, Typography } from '@components'
import { AdminApi, AuthApi, CommonApi } from '@queries'
import moment from 'moment'

export const ProgressLineChart = () => {
    const [rtoId, setRtoId] = useState(undefined)
    const [sectorId, setSectorId] = useState(undefined)
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showDateFilter, setShowDateFilter] = useState<boolean>(false)

    // query
    const getRtos = CommonApi.Filter.useRtos()
    const sectorResponse = AuthApi.useSectors({})

    const chartCount = AdminApi.Admin.useDashboardChartCounts(
        {
            search: `${JSON.stringify(
                removeEmptyValues({
                    sectorId: sectorId,
                    rtoId: rtoId,
                    year: year,
                    date: selectedDate
                        ? moment(selectedDate).format('YYYY-MM-DD')
                        : null,
                })
            )
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const monthOrder = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const initialData = chartCount?.data
        ? Object.entries(chartCount?.data)?.map(([month, value]: any) => ({
            name: month,
            ...value,
        }))
        : []

    initialData?.sort(
        (a: any, b: any) =>
            monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name)
    )

    // options
    const sectorOptions = useMemo(
        () =>
            sectorResponse.data?.map((sector: Sector) => ({
                label: sector?.name,
                value: sector?.id,
            })),
        [sectorResponse]
    )
    const rtoOptions = getRtos?.data?.map((rto: Rto) => ({
        value: rto?.id,
        label: rto?.user?.name,
    }))

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear()
        const startYear = 2018
        const years = []
        for (let i = startYear; i <= currentYear; i++) {
            years.push({ value: i, label: i.toString() })
        }
        return years
    }, [])

    // Chart lines configuration array
    const chartLinesConfig = [
        {
            dataKey: 'Added',
            stroke: '#FFC107',
            strokeWidth: 4,
            activeDot: { r: 8 },
            type: 'monotone',
        },
        {
            dataKey: 'ALL WPR',
            stroke: '#6A5ACD',
            strokeWidth: 4,
            type: 'monotone',
        },
        {
            dataKey: 'Current Month WPR',
            stroke: '#008080',
            strokeWidth: 4,
            type: 'monotone',
            strokeDasharray: '5 5',
        },
        {
            dataKey: 'Manual WPO',
            stroke: '#6A5ACD',
            strokeWidth: 4,
            type: 'monotone',
        },
        {
            dataKey: 'Placed',
            stroke: '#008080',
            strokeWidth: 4,
            type: 'monotone',
        },
        {
            dataKey: 'Expired',
            stroke: '#FF6F61',
            strokeWidth: 4,
            type: 'monotone',
        },
        {
            dataKey: 'Automated WPO',
            stroke: '#7ccf00',
            strokeWidth: 4,
            type: 'monotone',
        },
        {
            dataKey: 'Cancelled WPR',
            stroke: '#FF7979',
            strokeWidth: 4,
            type: 'monotone',
        },
    ]

    // Check if chart data is loading or refetching
    const isChartLoading = chartCount.isLoading || chartCount.isFetching

    return (
        <Card noPadding>
            <div className="px-8 py-4 flex justify-between items-center">
                <div className="text-nowrap">
                    <Typography variant="h3">Statistics</Typography>
                </div>
                <div className="flex items-center justify-end w-full gap-x-2 xl:gap-x-4">
                    <div className="w-44 lg:w-48 xl:w-64 relative z-20">
                        <Select
                            name={'rtoId'}
                            options={rtoOptions}
                            placeholder={'Select By Rto...'}
                            onChange={(e: any) => {
                                setRtoId(e?.value)
                            }}
                            showError={false}
                            loading={getRtos.isLoading}
                            disabled={getRtos.isLoading}
                        />
                    </div>
                    <div className="w-44 lg:w-48 xl:w-64 relative z-20">
                        <Select
                            name={'sectorId'}
                            options={sectorOptions}
                            placeholder={'Select Sector...'}
                            onChange={(e: any) => {
                                setSectorId(e?.value)
                            }}
                            showError={false}
                            loading={sectorResponse.isLoading}
                            disabled={sectorResponse.isLoading}
                        />
                    </div>
                    <div className="mt-4 w-44 lg:w-48 xl:w-64 relative z-20">
                        <Select
                            name={'year'}
                            options={yearOptions}
                            placeholder={'Select Year...'}
                            onChange={(e: any) => {
                                setYear(e?.value)
                            }}
                            value={yearOptions.find((y) => y.value === year)}
                        />
                    </div>
                    <div className="relative space-x-2 z-20">
                        <Button
                            text="Date Filter"
                            variant="action"
                            onClick={() => {
                                setShowDateFilter(!showDateFilter)
                            }}
                        />
                        {selectedDate && (
                            <Button
                                text="Clear Filter"
                                variant="dark"
                                onClick={() => {
                                    setSelectedDate(null)
                                }}
                            />
                        )}
                        <div
                            className={`absolute top-full w-72 z-50 right-0 bg-white ${showDateFilter ? 'block' : 'hidden'
                                }`}
                        >
                            <SidebarCalendar
                                setSelectedDate={(e) => {
                                    setShowDateFilter(!showDateFilter)
                                    setSelectedDate(e)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Container with Loading State */}
            <div className="relative">
                {isChartLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                        <div className="flex flex-col items-center">
                            {/* Spinner */}
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                            <Typography color="text-gray-600">
                                Loading chart data...
                            </Typography>
                        </div>
                    </div>
                )}

                <ResponsiveContainer
                    width="100%"
                    height={300}
                    minWidth={0}
                    minHeight={0}
                    className={'relative z-10'}
                >
                    <LineChart
                        data={initialData}
                        margin={{
                            top: 15,
                            right: 0,
                            left: 0,
                            bottom: 15,
                        }}
                        className="pb-5"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Legend />
                        <Tooltip
                            wrapperStyle={{ zIndex: 1000 }}
                            content={<CustomTooltip />}
                            allowEscapeViewBox={{ x: true, y: true }}
                        />
                        {chartLinesConfig.map((lineConfig) => (
                            <Line
                                key={lineConfig.dataKey}
                                type={lineConfig?.type as CurveType}
                                dataKey={lineConfig.dataKey}
                                stroke={lineConfig.stroke}
                                strokeWidth={lineConfig.strokeWidth}
                                strokeDasharray={lineConfig?.strokeDasharray}
                                activeDot={lineConfig.activeDot}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

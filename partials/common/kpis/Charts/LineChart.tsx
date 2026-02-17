'use client'
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { FaArrowTrendUp } from 'react-icons/fa6'
import { useDataContext } from '../Employees/DataProvider'
import { LoadingAnimation, NoData } from '@components'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    Filler
)

export const LineChart = ({ employeeProgress }: { employeeProgress: any }) => {
    const chartRef = useRef<ChartJS<'line'>>(null)
    const { filteredEmployees } = useDataContext()

    const calculateAverageMetrics = () => {
        if (filteredEmployees.length === 0) return Array(9).fill(0)

        const metricSums = filteredEmployees.reduce(
            (acc: any, employee: any) => {
                const total =
                    ((employee.metrics.blue / 20) * 100 +
                        (employee.metrics.yellow / 20) * 100 +
                        (employee.metrics.red / 10) * 100 +
                        (employee.metrics.green / 20) * 100 +
                        (employee.metrics.gray / 20) * 100) /
                    5
                const dailyValues = Array(9)
                    .fill(total)
                    .map((value, index) => {
                        const variance = Math.sin(index) * 10
                        return Math.min(Math.max(value + variance, 0), 100)
                    })

                if (acc.length === 0) {
                    return dailyValues
                }
                return acc.map((val: any, idx: any) => val + dailyValues[idx])
            },
            [] as number[]
        )

        return metricSums.map((sum: any) => sum / filteredEmployees.length)
    }

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const updateGradient = () => {
            const ctx = chart.ctx
            const chartArea = chart.chartArea
            if (!ctx || !chartArea) return

            const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
            )
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.4)')
            gradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.2)')
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')

            chart.data.datasets[0].backgroundColor = gradient
            chart.update()
        }

        setTimeout(updateGradient, 100)
    }, [filteredEmployees])

    const data = {
        labels:
            employeeProgress?.data && employeeProgress?.data?.length > 0
                ? [...employeeProgress?.data?.map((item: any) => item?.month)]
                : [],
        datasets: [
            {
                label: 'KPI Performance',
                data:
                    employeeProgress?.data && employeeProgress?.data?.length > 0
                        ? [
                            ...employeeProgress?.data?.map((item: any) =>
                                Math.round(item?.overall)
                            ),
                        ]
                        : [],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                pointBackgroundColor: '#2563eb',
                tension: 0.8,
                pointRadius: 0,
                borderWidth: 0.5,
                fill: true,
            },
        ],
    }

    const totalDuration = 1000
    const delayBetweenPoints = totalDuration / data.datasets[0].data.length
    const previousY = (ctx: any) =>
        ctx.index === 0
            ? ctx.chart.scales.y.getPixelForValue(100)
            : ctx.chart
                .getDatasetMeta(ctx.datasetIndex)
                .data[ctx.index - 1].getProps(['y'], true).y

    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx: any) {
                if (ctx.type !== 'data' || ctx.xStarted) return 0
                ctx.xStarted = true
                return ctx.index * delayBetweenPoints
            },
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx: any) {
                if (ctx.type !== 'data' || ctx.yStarted) return 0
                ctx.yStarted = true
                return ctx.index * delayBetweenPoints
            },
        },
    }

    const options: ChartOptions<'line'> = {
        animation: animation as any,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'white',
                titleColor: 'black',
                bodyColor: 'black',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 8,
                displayColors: false,
                callbacks: {
                    label: (context) => `${(context.parsed?.y ?? 0).toFixed(1)}%`,
                },
            },
            datalabels: {
                display: false,
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            x: {
                type: 'category',
                grid: { display: false },
                ticks: { font: { size: 12 } },
                border: { display: false },
            },
            y: {
                beginAtZero: true,
                stacked: false,
                max: 100,
                border: { display: false },
                ticks: {
                    callback: (value) => `${value}%`,
                    stepSize: 20,
                    font: { size: 12, family: 'Inter' },
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)',
                    tickBorderDashOffset: 3,
                },
            },
        },
    }

    return (
        // <div className="px-3 mx-auto pt-4 pb-2 bg-white rounded-2xl shadow-md">
        <>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <div className="p-2 border border-[#1436B033] rounded-lg">
                        <FaArrowTrendUp className="text-[#1436B0]" />
                    </div>
                    <h2 className="ml-3 text-base font-medium">
                        Overall Employee
                    </h2>
                </div>
            </div>

            {employeeProgress?.isError && (
                <NoData text="There is Some Technical Error!" />
            )}
            {employeeProgress?.isLoading ? (
                <LoadingAnimation />
            ) : employeeProgress?.data && employeeProgress?.isSuccess ? (
                <div className="flex flex-col pt-1">
                    <div className="h-72 mb-2">
                        <Line ref={chartRef} data={data} options={options} />
                    </div>
                </div>
            ) : employeeProgress?.isSuccess ? (
                <NoData text="No Counts Found!" />
            ) : null}
        </>
    )
}

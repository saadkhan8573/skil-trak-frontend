import { LoadingAnimation, NoData, Typography } from '@components'
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
    TooltipItem,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut } from 'react-chartjs-2'
import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import { GiSpeedometer } from 'react-icons/gi'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

export const RadialChart = ({
    employeeProgressCounts,
}: {
    employeeProgressCounts: any
}) => {
    const metricLabels = {
        agreementByWorkplace: 'Agreement By Workplace',
        agreementByStudent: 'Agreement By Student',
        completed: 'Completed',
        workplace: 'Workplace Request',
        appointment: 'Appointment',
    }

    const datasets = [
        {
            label: metricLabels.agreementByWorkplace,
            backgroundColor: ['#207D04', '#efefef'],
        },
        {
            label: metricLabels.agreementByStudent,
            backgroundColor: ['#35E100', '#efefef'],
        },
        {
            label: metricLabels.completed,
            backgroundColor: ['#FF0303', '#efefef'],
        },
        {
            label: metricLabels.workplace,
            backgroundColor: ['#F5A70C', '#efefef'],
        },
        {
            label: metricLabels.appointment,
            backgroundColor: ['#0365F5', '#efefef'],
        },
    ]

    const kpiKeys = [
        'agreementByStudentWorkplace',
        'agreementByStudent',
        'completed',
        'workplaceRequest',
        'appointments',
    ]

    const options = {
        cutout: '50%',
        rotation: 180,
        circumference: 338,
        beginAtZero: true,
        elements: {
            arc: {
                borderRadius: 999,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: 'white',
                titleColor: '#000',
                bodyColor: '#000',
                borderWidth: 1,
                borderColor: '#ddd',
                padding: 0,
                callbacks: {
                    label: function (tooltipItem: TooltipItem<'doughnut'>) {
                        const dataIndex = tooltipItem.dataIndex

                        if (dataIndex === 0) {
                            const value = tooltipItem.raw as number
                            const label = tooltipItem.dataset.label || ''
                            return `${label}: ${value.toFixed(1)}%`
                        }
                        return ''
                    },

                    title: function () {
                        return ''
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },

        events: [
            'mousemove' as const,
            'mouseout' as const,
            'click' as const,
            'touchstart' as const,
            'touchmove' as const,
        ],
        onHover: (event: any, chartElement: string | any[]) => {
            const chart = chartElement?.[0]?.chart
            if (chart) {
                chart.canvas.style.cursor =
                    chartElement.length && chartElement[0].index === 0
                        ? 'pointer'
                        : 'default'
            }
        },
    }

    const firstValues = employeeProgressCounts?.data
        ? Object.entries(employeeProgressCounts?.data)
            ?.filter(([key]) => key !== 'overAll' && key !== 'previousMonth')
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => kpiKeys?.indexOf(a.key) - kpiKeys?.indexOf(b.key))
        : []

    // firstValues.reverse()

    const datas = {
        labels: datasets.map((dataset) => dataset.label),
        datasets: firstValues?.map((value, i) => ({
            ...datasets?.[i],
            data: [value?.value, 100 - Number(value?.value)],
        })),
        weight: 30,
    }

    return (
        // <div className="h-full px-3 mx-auto pt-4 pb-2 bg-white rounded-2xl shadow-md">
        <>
            <div className="flex items-center mb-4">
                <div className="p-2 border border-[#1436B033] rounded-lg">
                    <GiSpeedometer className="text-[#1436B0]" />
                </div>
                <h2 className="ml-3 text-base font-medium">Overall Employee</h2>
            </div>

            {employeeProgressCounts?.isError && (
                <NoData text="There is Some Technical Error!" />
            )}
            {employeeProgressCounts?.isLoading ? (
                <LoadingAnimation />
            ) : employeeProgressCounts?.data &&
                employeeProgressCounts?.isSuccess ? (
                <div className="flex flex-col items-center">
                    <div className="relative h-64">
                        <Doughnut data={datas} options={options} />
                        <div className="absolute inset-1 flex items-center justify-center flex-col">
                            <Typography variant="h1">
                                {Math.round(
                                    Number(
                                        employeeProgressCounts?.data?.overAll
                                    )
                                )}
                                %
                            </Typography>
                            <p className="flex flex-row items-center gap-1 text-gray-500">
                                <BsArrowUpRightCircleFill />
                                Average
                            </p>
                            <div className="-inset-[6px] pl-7 text-[9px] absolute flex flex-col items-center justify-end">
                                {[...firstValues?.reverse()]?.map(
                                    (value, index) => (
                                        <div key={index} className="">
                                            <div className="flex flex-col rounded-lg text-[#1CA844]">
                                                {Number(value?.value)?.toFixed(
                                                    1
                                                )}
                                                %
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-green-500 mt-4">
                        +
                        {Number(
                            employeeProgressCounts?.data?.previousMonth
                        )?.toFixed(2)}
                        % in past 1 month
                    </p>
                </div>
            ) : employeeProgressCounts?.isSuccess ? (
                <NoData text="No Counts Found!" />
            ) : null}
        </>
    )
}

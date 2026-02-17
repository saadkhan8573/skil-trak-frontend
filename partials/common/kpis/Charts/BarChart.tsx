'use client'
import { LoadingAnimation, NoData } from '@components'
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { RiUserLine } from 'react-icons/ri'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const BarChart = ({
    title = 'Employees',
    employeeCounts,
    totalEmployees = 322,
    newEmployees = 8,
    timePeriod = 'in past 1 month',
    chartData = [65, 45, 75, 90, 85],
}: any) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 0,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'white',
                titleColor: '#000',
                bodyColor: '#000',
                borderWidth: 1,
                borderColor: '#ddd',
                padding: 0,
                displayColors: false,
                callbacks: {
                    title: (tooltipItem: any) => tooltipItem?.label,
                    label: (tooltipItem: any) => {
                        return `${tooltipItem?.raw} employees added`
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: '#1436B033',
                    drawBorder: false,
                    lineWidth: 1,
                    borderDash: [4, 4],
                    offset: true,
                    tickLength: 0,
                    z: -1,
                },
                border: {
                    dash: [4, 4],
                    display: false,
                    color: '#1436B033',
                },
                ticks: {
                    display: false,
                },
                beginAtZero: true,
                max: employeeCounts?.data?.finalCounts
                    ? Math.max(
                        ...(Object?.values(
                            employeeCounts?.data?.finalCounts
                        ) as number[])
                    )
                    : 0,
            },
        },
    }

    const data = {
        labels: employeeCounts?.data
            ? Object?.keys(employeeCounts?.data?.finalCounts)
            : [],
        datasets: [
            {
                data: employeeCounts?.data
                    ? Object?.values(employeeCounts?.data?.finalCounts)
                    : [],
                backgroundColor: '#AEC6D0',
                hoverBackgroundColor: '#214BDD',
                borderRadius: {
                    topLeft: 8,
                    topRight: 8,
                    bottomLeft: 0,
                    bottomRight: 0,
                },
                borderSkipped: false,
                barThickness: 34,
                clip: false as false,
            },
        ],
    }

    return (
        // <div className="px-3 mx-auto pt-4 pb-4 bg-white rounded-2xl shadow-md h-full">
        <>
            <div className="flex items-center mb-4">
                <div className="p-2 border border-[#1436B033] rounded-lg">
                    <RiUserLine className="text-[#1436B0]" />
                </div>
                <h2 className="ml-3 text-base font-medium">{title}</h2>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-3xl font-medium">
                    {employeeCounts?.data?.totalSubadmins}
                </div>
                {/* <div className="text-base text-green-500 font-medium">
                    +{newEmployees}{' '}
                    <span className="text-[#9A9A9A] text-nowrap text-base font-normal">
                        {timePeriod}
                    </span>
                </div> */}
            </div>

            <p className="text-[#9A9A9A] font-normal">
                Total employee
            </p>

            {employeeCounts?.isError && (
                <NoData text="There is Some Technical Error!" />
            )}
            {employeeCounts?.isLoading ? (
                <LoadingAnimation />
            ) : employeeCounts?.data && employeeCounts?.isSuccess ? (
                <div className="h-60 mt-6 ">
                    <Bar options={options} data={data} />
                </div>
            ) : employeeCounts?.isSuccess ? (
                <NoData text="No Counts Found!" />
            ) : null}
        </>
    )
}

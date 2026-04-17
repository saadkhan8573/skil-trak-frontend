import { Typography } from '@components'
import React, { useState } from 'react'
import { NonContactableStudentReport } from './NonContactableStudentReport'
import { CompletedWorkplaceReport } from './CompletedWorkplaceReport'
import { PlacementStartedReport } from './PlacementStartedReport'
import { StudentResultsReport } from './StudentResultsReport'
import { WorkplaceRequestReport } from './WorkplaceRequestReport'
import { AppointmentsReport } from './AppointmentsReport'
import { Waypoint } from 'react-waypoint'

export const ReportTabs = ({
    user,
    endDate,
    startDate,
}: {
    user?: number
    endDate: Date
    startDate: Date
}) => {
    const [isViewd, setIsViewd] = useState<boolean>(false)
    const reportsData = [
        {
            title: 'Non Contactable Students',
            component: (
                <NonContactableStudentReport
                    user={user}
                    isViewd={isViewd}
                    endDate={endDate}
                    startDate={startDate}
                />
            ),
        },
        {
            title: 'Completed Workplace',
            component: (
                <CompletedWorkplaceReport
                    user={user}
                    isViewd={isViewd}
                    endDate={endDate}
                    startDate={startDate}
                />
            ),
        },
        {
            title: 'Placement Started',
            component: (
                <PlacementStartedReport
                    user={user}
                    isViewd={isViewd}
                    endDate={endDate}
                    startDate={startDate}
                />
            ),
        },
        {
            title: 'Student Results',
            component: (
                <StudentResultsReport
                    user={user}
                    isViewd={isViewd}
                    endDate={endDate}
                    startDate={startDate}
                />
            ),
        },
        {
            title: 'Workplace Request',
            component: (
                <WorkplaceRequestReport
                    user={user}
                    isViewd={isViewd}
                    endDate={endDate}
                    startDate={startDate}
                />
            ),
        },
        {
            title: 'Appointments',
            component: (
                <AppointmentsReport
                    user={user}
                    isViewd={isViewd}
                    endDate={endDate}
                    startDate={startDate}
                />
            ),
        },
    ]
    const [selectedReport, setSelectedReport] = useState(
        reportsData?.[0]?.title
    )

    return (
        <Waypoint
            onEnter={() => {
                setIsViewd(true)
            }}
            onLeave={() => {
                setIsViewd(false)
            }}
        >
            <div>
                <div className="flex items-center justify-between px-4 pb-3.5 bg-[#F5F7FB]">
                    {reportsData?.map((report) => (
                        <div
                            key={report?.title}
                            onClick={() => {
                                setSelectedReport(report?.title)
                            }}
                            className="cursor-pointer"
                        >
                            <Typography
                                color={
                                    selectedReport === report?.title
                                        ? 'text-[#017EFA]'
                                        : 'text-[#797979]'
                                }
                                medium={
                                    selectedReport === report?.title
                                        ? true
                                        : false
                                }
                                variant="small"
                            >
                                {report?.title}
                            </Typography>
                        </div>
                    ))}
                </div>

                {/*  */}
                <div className="mt-4">
                    {
                        reportsData?.find(
                            (report) => report?.title === selectedReport
                        )?.component
                    }
                </div>
            </div>
        </Waypoint>
    )
}

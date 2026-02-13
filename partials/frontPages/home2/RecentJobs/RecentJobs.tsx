import { Typography } from '@components'
import { MediaQueries } from '@constants'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'
import { JobsSlider } from './components'
import { CommonApi } from '@queries'
import { useState } from 'react'
import { Waypoint } from 'react-waypoint'

const RecentJobs = () => {
    const isMobile = useMediaQuery(MediaQueries.Mobile)
    const [jobsView, setJobsView] = useState<boolean>(false)

    const jobs = CommonApi.Industries.getAllAdvertisedJobs(
        {},
        {
            skip: !jobsView,
        }
    )

    const onEnterWaypoint = () => setJobsView(true)
    const onLeaveWaypoint = () => setJobsView(false)

    return (
        <Waypoint
            onEnter={() => {
                onEnterWaypoint()
            }}
            onLeave={() => {
                onLeaveWaypoint()
            }}
        >
            {jobs?.data && jobs?.data?.length > 0 ? (
                <div className="relative py-10">
                    <div className="max-w-7xl mx-auto flex flex-col gap-y-">
                        <div className="flex flex-col md:flex-row gap-y-1 justify-center md:justify-between items-center">
                            <Typography
                                variant={isMobile ? 'title' : 'h2'}
                                {...(isMobile
                                    ? {
                                          center: true,
                                      }
                                    : {})}
                                bold
                            >
                                Recent Jobs From Our Partners
                            </Typography>
                            <div className="flex justify-end">
                                <Link href={'/jobs'} className="underline text-primary text-[15px] font-bold">
                                    
                                        View All Job
                                    
                                </Link>
                            </div>
                        </div>

                        {/* Jobs */}
                        <div className="pt-6">
                            <JobsSlider jobs={jobs} />
                        </div>
                    </div>
                </div>
            ) : null}
        </Waypoint>
    );
}

export default RecentJobs

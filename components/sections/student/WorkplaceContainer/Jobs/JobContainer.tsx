import { JobCard } from './components/JobCard'

// components
import { LoadingAnimation, EmptyData, TechnicalError } from '@components'

// query
import { useGetStudentJobsQuery, useSaveJobMutation } from '@queries'
import { StudentJobType } from '@redux/queryTypes'

type Props = {}

export const JobContainer = (props: Props) => {
    const { data, isSuccess, isLoading, isError } = useGetStudentJobsQuery()
    const filteredJobs = data?.data?.filter(
        (job: any) => job?.status !== 'expired'
    )
    return (
        <div>
            {isError && <TechnicalError />}
            {isLoading ? (
                <LoadingAnimation />
            ) : filteredJobs && filteredJobs.length > 0 && isSuccess ? (
                filteredJobs?.map((job: StudentJobType, index: number) => (
                    <JobCard key={index} job={job} savedJobs={job?.savedJobs} />
                ))
            ) : (
                !isError &&
                isSuccess && (
                    <EmptyData
                        title={'No Jobs were found'}
                        description={'No Active jobs were found'}
                    />
                )
            )}
        </div>
    )
}

import { AdminApi, RtoV2Api } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { StudentCard } from './StudentCard'
import { EmptyData, PageSize, Pagination, TechnicalError } from '@components'
import { StudentsTabSkeleton } from '../../../skeletonLoader'
import { useState } from 'react'

export function WaitingForStudents() {
    const [itemPerPage, setItemPerPage] = useState(20)
    const [page, setPage] = useState(1)

    const industry = useAppSelector((state) => state.industry)
    const workplaces = AdminApi.Industries.useIndustryWaitingStudents(
        {
            industryId: industry?.industryDetail?.id ?? 0,
            params: {
                search: '',
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
        },
        {
            skip: !industry?.activeSector || !industry?.industryDetail?.id,
        }
    )

    return (
        <div className="space-y-2">
            {workplaces?.isError ? <TechnicalError /> : null}
            {workplaces?.isLoading || workplaces?.isFetching ? (
                <StudentsTabSkeleton />
            ) : workplaces?.isSuccess &&
              workplaces?.data?.data &&
              workplaces?.data?.data?.length > 0 ? (
                <>
                    {workplaces?.data?.data?.map((workplace: any) => (
                        <StudentCard
                            key={workplace.id}
                            student={{
                                ...workplace!,
                                workplace: [workplace?.workplaceRequest],
                            }}
                        />
                    ))}
                </>
            ) : workplaces?.isSuccess ? (
                <EmptyData
                    title="No Waiting for student"
                    description="No waiting for students found"
                    height="50vh"
                />
            ) : null}
        </div>
    )
}

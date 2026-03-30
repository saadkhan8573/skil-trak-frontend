import { RtoV2Api } from '@redux'
import { useAppSelector } from '@redux/hooks'
import { StudentCard } from './StudentCard'
import { EmptyData, PageSize, Pagination, TechnicalError } from '@components'
import { StudentsTabSkeleton } from '../../../skeletonLoader'
import { useState } from 'react'

export function WaitingForRtoStudents() {
    const [itemPerPage, setItemPerPage] = useState(20)
    const [page, setPage] = useState(1)

    const industry = useAppSelector((state) => state.industry)
    const workplaces = RtoV2Api.Industries.getIndustryWaitingForRtoStudents(
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
              workplaces?.data &&
              workplaces?.data?.length > 0 ? (
                <>
                    {workplaces?.data?.map((workplace) => (
                        <StudentCard
                            key={workplace.id}
                            student={{
                                ...workplace?.student!,
                                workplace: [workplace?.workplaceRequest],
                            }}
                        />
                    ))}
                </>
            ) : workplaces?.isSuccess ? (
                <EmptyData
                    title="No Students Waiting for RTO"
                    description="No students waiting for RTO approval found"
                    height="50vh"
                />
            ) : null}
        </div>
    )
}

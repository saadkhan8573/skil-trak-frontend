import { RtoV2Api } from '@redux'
import { useAppSelector } from '@redux/hooks'
import { EmptyData, PageSize, Pagination, TechnicalError } from '@components'
import { StudentsTabSkeleton } from '../../../skeletonLoader'
import { useState } from 'react'
import { CancelledStudentCard } from './CancelledStudentCard'

export function CancelledStudentsList() {
    const [itemPerPage, setItemPerPage] = useState(20)
    const [page, setPage] = useState(1)

    const industry = useAppSelector((state) => state.industry)
    const workplaceCancelledStudents = RtoV2Api.Industries.getIndustryCancelledStudents(
        {
            industryId: industry?.industryDetail?.id ?? 0,
            params: {
                search: '',
                skip: itemPerPage * page - itemPerPage,
                limit: itemPerPage,
            },
        },
        {
            skip: !industry?.industryDetail?.id,
        }
    )

    return (
        <div className="space-y-2">
            {workplaceCancelledStudents?.isError ? <TechnicalError /> : null}
            {workplaceCancelledStudents?.isLoading || workplaceCancelledStudents?.isFetching ? (
                <StudentsTabSkeleton />
            ) : workplaceCancelledStudents?.isSuccess &&
                workplaceCancelledStudents?.data?.data &&
                workplaceCancelledStudents?.data?.data?.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={workplaceCancelledStudents?.data?.data?.length}
                        />
                        <Pagination
                            setPage={setPage}
                            pagination={workplaceCancelledStudents.data?.pagination}
                            updateUrl={false}
                        />
                    </div>
                    {workplaceCancelledStudents?.data?.data?.map((workplace) => (
                        <CancelledStudentCard key={workplace.id} workplace={workplace} />
                    ))}
                </>
            ) : workplaceCancelledStudents?.isSuccess ? (
                <EmptyData
                    title="No Cancelled Students"
                    description="No cancelled students for industry found"
                    height="50vh"
                />
            ) : null}
        </div>
    )
}

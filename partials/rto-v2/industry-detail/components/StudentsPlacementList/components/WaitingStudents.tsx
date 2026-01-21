import { RtoV2Api } from '@redux'
import { useAppSelector } from '@redux/hooks'
import { StudentCard } from './StudentCard'
import { EmptyData, PageSize, Pagination, TechnicalError } from '@components'
import { StudentsTabSkeleton } from '../../../skeletonLoader'
import { useState } from 'react'

export function WaitingStudents() {
    const [itemPerPage, setItemPerPage] = useState(20)
    const [page, setPage] = useState(1)

    const industry = useAppSelector((state) => state.industry)
    const students = RtoV2Api.Industries.getIndustryWaitingStudents(
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
            {students?.isError ? <TechnicalError /> : null}
            {students?.isLoading || students?.isFetching ? (
                <StudentsTabSkeleton />
            ) : students?.isSuccess &&
                students?.data?.data &&
                students?.data?.data?.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={students?.data?.data?.length}
                        />
                        <Pagination
                            setPage={setPage}
                            pagination={students.data?.pagination}
                            updateUrl={false}
                        />
                    </div>
                    {students?.data?.data?.map((student: any) => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </>
            ) : students?.isSuccess ? (
                <EmptyData
                    title="No Waiting Students"
                    description="No students waiting for industry found"
                    height="50vh"
                />
            ) : null}
        </div>
    )
}

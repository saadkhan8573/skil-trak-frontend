import { EmptyData, PageSize, Pagination, TechnicalError } from '@components'
import { RtoV2Api } from '@redux'
import { useAppSelector } from '@redux/hooks'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { StudentsTabSkeleton } from '../../../skeletonLoader'
import { TerminatedStudentCard } from './TerminatedStudentCard'

export function TerminatedStudentsList() {
    const [itemPerPage, setItemPerPage] = useState(20)
    const [page, setPage] = useState(1)
    const router = useRouter()

    useEffect(() => {
        if (router.query.pageSize) {
            setItemPerPage(Number(router.query.pageSize))
        }
        if (router.query.page) {
            setPage(Number(router.query.page))
        }
    }, [router.query.pageSize, router.query.page])

    const industry = useAppSelector((state) => state.industry)
    const workplaceTerminatedStudents =
        RtoV2Api.Industries.getIndustryTerminatedStudents(
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
            {workplaceTerminatedStudents?.isError ? <TechnicalError /> : null}
            {workplaceTerminatedStudents?.isLoading ||
            workplaceTerminatedStudents?.isFetching ? (
                <StudentsTabSkeleton />
            ) : workplaceTerminatedStudents?.isSuccess &&
              workplaceTerminatedStudents?.data?.data &&
              workplaceTerminatedStudents?.data?.data?.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={
                                workplaceTerminatedStudents?.data?.data?.length
                            }
                        />
                        <Pagination
                            setPage={setPage}
                            pagination={
                                workplaceTerminatedStudents.data?.pagination
                            }
                            updateUrl={false}
                        />
                    </div>
                    {workplaceTerminatedStudents?.data?.data?.map((student) => (
                        <TerminatedStudentCard
                            key={student?.id}
                            student={student}
                        />
                    ))}
                </>
            ) : workplaceTerminatedStudents?.isSuccess ? (
                <EmptyData
                    title="No Terminated Students"
                    description="No terminated students for industry found"
                    height="50vh"
                />
            ) : null}
        </div>
    )
}

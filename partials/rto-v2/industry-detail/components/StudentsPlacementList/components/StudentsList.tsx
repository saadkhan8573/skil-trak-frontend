import { RtoV2Api } from '@redux'
import { useAppSelector } from '@redux/hooks'
import { StudentCard } from './StudentCard'
import { EmptyData, TechnicalError } from '@components'
import { StudentsTabSkeleton } from '../../../skeletonLoader'

export function StudentsList() {
    const industry = useAppSelector((state) => state.industry)
    const students = RtoV2Api.Industries.industryStudentsList(
        {
            sectorId: industry?.activeSector ?? 0,
            industryId: industry?.industryDetail?.id ?? 0,
            params: {
                search: '',
                skip: 0,
                limit: 10,
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
                students?.data?.data?.map((student: any) => (
                    <StudentCard key={student.id} student={student} />
                ))
            ) : students?.isSuccess ? (
                <EmptyData
                    title="No Students"
                    description="No students found"
                    height="50vh"
                />
            ) : null}
        </div>
    )
}

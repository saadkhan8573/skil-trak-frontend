import {
    SubAdminApi,
    useGetSubAdminStudentWorkplaceDetailQuery,
    useGetWorkplaceFoldersQuery,
} from '@queries'
import { Student } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { sortedWP } from '../functions'

export const useWorkplaceQueries = ({ student }: { student: Student }) => {
    const [selectedWorkplace, setSelectedWorkplace] =
        useState<IWorkplaceIndustries | null>(null)
    const [showPreviousWorkplace, setShowPreviousWorkplace] = useState(false)

    const router = useRouter()

    const studentWorkplace = useGetSubAdminStudentWorkplaceDetailQuery(
        Number(router?.query?.id),
        {
            skip: !router?.query?.id,
            refetchOnMountOrArgChange: true,
        }
    )
    const workplaceIndustryDetail = SubAdminApi.Student.workplaceIndustryDetail(
        Number(selectedWorkplace?.id),
        {
            skip: !selectedWorkplace,
            refetchOnMountOrArgChange: true,
        }
    )

    const workplaceStudentDetail = SubAdminApi.Student.workplaceStudentDetail(
        Number(selectedWorkplace?.id),
        {
            skip: !selectedWorkplace,
            refetchOnMountOrArgChange: true,
        }
    )

    const rejectedWorkplaces =
        SubAdminApi.Student.useSubAdminStudentCancelledWorkplaces(
            {
                params: { courseId: selectedWorkplace?.courses?.[0]?.id },
                id: student?.id,
            },
            {
                skip: !student?.id || !student?.user?.id || !selectedWorkplace,
            }
        )

    const courses = SubAdminApi.Student.useCourses(Number(router?.query?.id), {
        skip: !router?.query?.id,
        refetchOnMountOrArgChange: true,
    })

    const getCancelledWP = SubAdminApi.Student.getCancelledWP(student?.id, {
        skip: !studentWorkplace?.isSuccess || !showPreviousWorkplace,
    })

    const course = selectedWorkplace?.courses?.find((c: any) => c)

    const appliedIndustry: WorkplaceWorkIndustriesType =
        workplaceIndustryDetail?.data?.find((i: any) => i.applied)

    const workplaceFolders = useGetWorkplaceFoldersQuery(
        {
            workplaceId: Number(selectedWorkplace?.id),
            appliedIndustryId: appliedIndustry?.industry?.id,
            courseId: course?.id,
        },
        { skip: !studentWorkplace || !appliedIndustry || !course }
    )
    const getWorkplaceAppointment = SubAdminApi.Student.getWorkplaceAppointment(
        Number(selectedWorkplace?.id),
        {
            skip: !selectedWorkplace,
            refetchOnMountOrArgChange: true,
        }
    )

    const esignDocumentsFolders = SubAdminApi.Student.esignDocumentsFolders(
        Number(selectedWorkplace?.id),
        {
            skip: !selectedWorkplace,
            refetchOnMountOrArgChange: true,
        }
    )

    const [refresh, refreshResult] = SubAdminApi.Student.rerunAutomation()

    const [skipWorkplace, skipWorkplaceResult] =
        SubAdminApi.Student.skipWpAndApplyAnother()

    const [skipWp, skipWpResult] = SubAdminApi.Student.skipWorkplace()

    const sortedWorkplace = sortedWP(studentWorkplace)

    useEffect(() => {
        if (sortedWorkplace && sortedWorkplace?.length > 0) {
            setSelectedWorkplace(
                selectedWorkplace
                    ? studentWorkplace?.data?.find(
                          (w: any) => w?.id === selectedWorkplace?.id
                      )
                    : sortedWorkplace?.[0]
            )
        }
        return () => {
            setSelectedWorkplace(null)
        }
    }, [studentWorkplace?.data])

    return {
        sortedWorkplace,
        skipWorkplace,
        skipWorkplaceResult,
        skipWp,
        skipWpResult,
        refresh,
        refreshResult,
        selectedWorkplace,
        setSelectedWorkplace,
        showPreviousWorkplace,
        setShowPreviousWorkplace,
        studentWorkplace,
        workplaceIndustryDetail,
        workplaceStudentDetail,
        rejectedWorkplaces,
        courses,
        getCancelledWP,
        workplaceFolders,
        getWorkplaceAppointment,
        esignDocumentsFolders,
        appliedIndustry,
        course,
    }
}

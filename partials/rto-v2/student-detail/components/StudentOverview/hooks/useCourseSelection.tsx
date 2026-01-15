import { useState, useEffect, useMemo } from 'react'
import { AssessmentCourseType, Course, Sector, Student } from '@types'
import { useStudentAssessmentCoursesQuery, SubAdminApi } from '@queries'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { setSelectedCourse } from '@redux'

export const useCourseSelection = () => {
    const [selectedSector, setSelectedSector] = useState<number | null>(null)
    const { selectedCourse, studentDetail } = useAppSelector(
        (state) => state.student
    )

    const dispatch = useAppDispatch()

    const studentCourses = SubAdminApi.AssessmentEvidence.studentAllCourses(
        Number(studentDetail?.id),
        {
            skip: !studentDetail?.id,
            refetchOnMountOrArgChange: 300,
        }
    )

    const studentWorkplace = SubAdminApi.Student.getWorkplaceForSchedule(
        Number(studentDetail?.id),
        {
            skip: !studentDetail,
        }
    )

    const getSectors = (data: AssessmentCourseType[]) => {
        const sectorsById: { [key: number]: Sector } = {}

        data?.forEach((item: Course) => {
            const sectorId = item.sector.id
            if (!sectorsById.hasOwnProperty(sectorId)) {
                sectorsById[sectorId] = item.sector
            }
        })

        return Object.values(sectorsById)
    }

    const sectors = useMemo(
        () => studentCourses?.data && getSectors(studentCourses?.data),
        [studentCourses?.data]
    )

    const courses = useMemo(
        () =>
            studentCourses?.data?.filter(
                (c: Course) => c?.sector?.id === selectedSector
            ),
        [studentCourses?.data, selectedSector]
    )

    const appliedIndustry = useMemo(
        () =>
            studentWorkplace?.data
                ?.filter(
                    (wp: any) => wp?.courses?.[0]?.id === selectedCourse?.id
                )
                ?.map((ind: any) => ind?.industries)
                ?.flat()
                ?.map((ind: any) => ind?.industry?.id)
                ?.join(','),
        [studentWorkplace, selectedCourse]
    )

    // Auto-select first sector when sectors load
    useEffect(() => {
        if (sectors && sectors?.length > 0 && !selectedSector) {
            setSelectedSector(sectors[0]?.id)
        }
    }, [sectors, selectedSector])

    // Auto-select first course when courses load
    useEffect(() => {
        if (courses && courses?.length > 0) {
            const course = courses?.find(
                (c: Course) => c?.id === selectedCourse?.id
            )

            dispatch(
                setSelectedCourse(
                    selectedSector && course
                        ? course
                        : !selectedCourse
                        ? courses?.[0]
                        : selectedCourse
                )
            )
        }
    }, [courses, selectedSector])

    return {
        selectedSector,
        setSelectedSector,
        sectors,
        courses,
        appliedIndustry,
        studentCourses,
        studentWorkplace,
    }
}

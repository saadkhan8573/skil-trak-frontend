import { useState, useEffect, useMemo } from 'react'
import { Course, Sector, Student } from '@types'
import { useStudentAssessmentCoursesQuery, SubAdminApi } from '@queries'

export const useCourseSelection = (student: Student, isEntered: boolean) => {
    const [selectedSector, setSelectedSector] = useState<number | null>(null)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    const studentCourses = useStudentAssessmentCoursesQuery(
        Number(student?.id),
        {
            skip: !student?.id || !isEntered,
            refetchOnMountOrArgChange: 300,
        }
    )

    const studentWorkplace = SubAdminApi.Student.getWorkplaceForSchedule(
        student?.id,
        {
            skip: !student,
        }
    )

    const getSectors = (data: Course[]) => {
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
            setSelectedCourse(selectedSector && course ? course : courses[0])
        }
    }, [courses, selectedSector])

    return {
        selectedSector,
        setSelectedSector,
        selectedCourse,
        setSelectedCourse,
        sectors,
        courses,
        appliedIndustry,
        studentCourses,
        studentWorkplace,
    }
}

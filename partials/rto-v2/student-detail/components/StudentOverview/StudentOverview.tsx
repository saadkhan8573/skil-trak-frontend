import { RtoV2Api } from '@queries'
import {
    ApplyWorkplaceOverview,
    CourseOverview,
    CurrentStatus,
    PlacementRequest,
    WorkplaceBio,
} from './components'
import { useAppSelector } from '@redux/hooks'
import { useState } from 'react'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const StudentOverview = () => {
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state?.student
    )
    const [addNewWorkplace, setAddNewWorkplace] = useState(false)
    const handleAddNewWorkplace = () => {
        setAddNewWorkplace(true)
    }

    const studentWorkplaces =
        RtoV2Api.StudentsWorkplace.getStudentWorkplacesByCourse(
            {
                id: studentDetail?.id ?? 0,
                courseId: selectedCourse?.id ?? 0,
            },
            {
                skip: !selectedCourse?.id || !studentDetail?.id,
            }
        )

    const firstWorkplace = selectedWorkplace || studentWorkplaces?.data?.[0]

    return (
        <div className="space-y-4">
            <CourseOverview />
            <PlacementRequest studentWorkplaces={studentWorkplaces} />
            {firstWorkplace && !addNewWorkplace ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <WorkplaceBio
                        workplace={firstWorkplace}
                        handleAddNewWorkplace={handleAddNewWorkplace}
                    />
                    <CurrentStatus workplace={firstWorkplace} />
                </div>
            ) : (
                <ApplyWorkplaceOverview
                    firstWorkplace={firstWorkplace as IWorkplaceIndustries}
                    handleAddNewWorkplace={() => setAddNewWorkplace(false)}
                />
            )}
        </div>
    )
}

import { RtoV2Api } from '@queries'
import { setSelectedWorkplace } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { useEffect, useMemo, useState } from 'react'
import { sortedWorkplaceRequests } from '../../utils'
import {
    ApplyWorkplaceOverview,
    CourseOverview,
    CurrentStatus,
    PlacementRequest,
    WorkplaceBio,
} from './components'

export const StudentOverview = () => {
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state?.student
    )
    const dispatch = useAppDispatch()

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

    const sortedWorkplaces = useMemo(() =>
        sortedWorkplaceRequests(studentWorkplaces?.data),
        [studentWorkplaces?.data])

    useEffect(() => {
        if (sortedWorkplaces && sortedWorkplaces?.length > 0) {
            dispatch(setSelectedWorkplace(sortedWorkplaces?.[0]))
        }
    }, [sortedWorkplaces])

    return (
        <div className="space-y-4">
            <CourseOverview />
            <PlacementRequest sortedWorkplaces={sortedWorkplaces} studentWorkplaces={studentWorkplaces} />
            {selectedWorkplace && !addNewWorkplace ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <WorkplaceBio
                        workplace={selectedWorkplace}
                        handleAddNewWorkplace={handleAddNewWorkplace}
                    />
                    <CurrentStatus workplace={selectedWorkplace} />
                </div>
            ) : (
                <ApplyWorkplaceOverview
                    firstWorkplace={selectedWorkplace as IWorkplaceIndustries}
                    handleAddNewWorkplace={() => setAddNewWorkplace(false)}
                />
            )}
        </div>
    )
}

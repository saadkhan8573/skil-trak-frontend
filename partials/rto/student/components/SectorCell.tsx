import { Student } from '@types'
import { SectorDetailDrawer } from './drawer/SectorDetailDrawer'
import { SectorCourseGroup } from './SectorCourseGroup'

export const SectorCell = ({ student }: { student: Student }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col items-start gap-y-2">
                <SectorDetailDrawer student={student} />
                <SectorCourseGroup courses={student?.courses} />
            </div>
        </div>
    )
}

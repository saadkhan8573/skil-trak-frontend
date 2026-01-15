import { Course, Student } from '@types'
import { CourseDot } from './CourseDot'
import { SectorDetailDrawer } from './drawer/SectorDetailDrawer'

export const SectorCell = ({ student }: { student: Student }) => {
    return (
        <div className="w-fit">
            <div className="flex flex-col items-center">
                <SectorDetailDrawer student={student} />
                <div className="flex gap-x-1">
                    {student?.courses?.map((c: Course) => (
                        <CourseDot key={c?.id} course={c} />
                    ))}
                </div>
            </div>
        </div>
    )
}

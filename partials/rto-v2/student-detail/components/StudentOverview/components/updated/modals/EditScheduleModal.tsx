import { GlobalModal, NoData } from '@components'
import { AddScheduleContainer } from '@partials/common'
import { useAppSelector } from '@redux/hooks'

interface EditScheduleModalProps {
    onCancel: () => void
}

export function EditScheduleModal({ onCancel }: EditScheduleModalProps) {
    const { selectedCourse, studentDetail, selectedWorkplace } = useAppSelector(
        (state) => state?.student
    )

    // Resolve the industry object the same way Schedule.tsx does
    const industry =
        selectedWorkplace?.industries?.find((i: any) => i?.applied)?.industry ??
        null

    return (
        <GlobalModal
            onCancel={onCancel}
            className="max-w-6xl! w-full overflow-hidden"
        >
            <div className="max-h-[80vh] overflow-y-auto px-1 custom-scrollbar">
                {selectedCourse && industry ? (
                    <AddScheduleContainer
                        user={studentDetail?.user}
                        course={selectedCourse}
                        workplace={industry}
                        onAddStudentCourse={onCancel}
                    />
                ) : (
                    <NoData text="Schedule data not available" />
                )}
            </div>
        </GlobalModal>
    )
}

import { workplaceQuestionsKeys } from '@partials/common'
import { SubAdminApi, useAppSelector } from '@redux'
import { Clock } from 'lucide-react'

export const PreferredContactTime = () => {
    const studentId = useAppSelector(
        (state) => state.student?.studentDetail?.id
    )

    const { data } = SubAdminApi.Student.useStudentPreferredCallTime(
        studentId!,
        {
            skip: !studentId,
        }
    )

    const getQuestionData = (type: workplaceQuestionsKeys) =>
        data?.find((d) => d?.type === type)

    const medicalCondition = getQuestionData(
        workplaceQuestionsKeys?.medicalCondition
    )
    const preferredContactTime = getQuestionData(
        workplaceQuestionsKeys?.preferredContactTime
    )

    return (
        <div className="flex items-center gap-3">
            {/* Medical Conditions Card */}
            {medicalCondition && (
                <div className="flex items-center gap-2.5 bg-linear-to-br from-rose-50 to-rose-100/50 border border-rose-200/70 px-3.5 py-2.5 rounded-xl shadow-sm flex-1">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-rose-100 to-rose-200/50 flex items-center justify-center shrink-0">
                        <span className="text-lg">🩺</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-wide mb-0.5">
                            Medical Conditions
                        </p>
                        <p className="text-sm text-rose-700 font-medium">
                            {medicalCondition?.answer}
                        </p>
                    </div>
                </div>
            )}

            {/* Contact Time Card */}
            {preferredContactTime && (
                <div className="flex items-center gap-2.5 bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 border border-[#044866]/30 px-3.5 py-2.5 rounded-xl shadow-sm flex-1">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#044866]/10 to-[#0D5468]/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-[#044866]" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-semibold text-[#044866] uppercase tracking-wide mb-0.5">
                            Contact Time
                        </p>
                        <p className="text-sm text-[#044866] font-medium">
                            {preferredContactTime?.answer}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

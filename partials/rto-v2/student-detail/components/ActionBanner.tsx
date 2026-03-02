import { Badge } from '@components'
import { RtoV2Api } from '@queries'
import { Student } from '@types'
import { AlertCircle, Sparkles } from 'lucide-react'

export const ActionBanner = ({ student }: { student: Student }) => {
    const infoMessages = RtoV2Api.Students.getStudentInfoMessages(
        { userId: student?.user?.id },
        {
            skip: !student,
        }
    )

    if (infoMessages?.isSuccess && infoMessages?.data) {
        return (
            <div className="mt-3.5 relative overflow-hidden bg-linear-to-r from-[#F7A619]/10 via-[#F7A619]/5 to-transparent border-l-4 border-[#F7A619] rounded-2xl p-3.5 shadow-lg hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 w-36 h-36 bg-linear-to-br from-[#F7A619]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#F7A619] to-[#F7A619]/80 flex items-center justify-center shadow-xl shadow-[#F7A619]/30">
                                <AlertCircle className="w-4.5 h-4.5 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-slate-900 text-[15px]">
                                    {infoMessages?.data?.title}
                                </p>
                                {infoMessages?.data?.urgencyLevel && (
                                    <Badge
                                        text={infoMessages?.data?.urgencyLevel}
                                        variant="primaryNew"
                                    />
                                )}
                            </div>
                            <p className="text-sm text-slate-600">
                                {infoMessages?.data?.message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return <></>
}

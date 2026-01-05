import { Button } from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { Student } from '@types'
import { Mail, Phone } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { ComposeEmailModal } from '../Communications/modal'
import { ProfileLinks } from '../ProfileLinks'

export const HeaderQuickActions = ({ student }: { student: Student }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { notification } = useNotification()

    const [callLog, callLogResult] = SubAdminApi.Student.useStudentCallLog()

    const onCancelClicked = () => setModal(null)

    const onComposeMailClicked = () => {
        setModal(
            <ComposeEmailModal
                user={student?.user}
                onCancel={onCancelClicked}
            />
        )
    }

    const onMakeCallClicked = () => {
        if (!student?.id || !student?.phone) {
            notification.error({
                title: 'Action Failed',
                description: 'Student phone number is not available.',
            })
            return
        }
        navigator.clipboard.writeText(student?.phone)
        notification.success({
            title: 'Copied',
            description: `Phone number copied`,
        })
        callLog({
            student: student?.id,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Called Student',
                    description: `Called Student with Id: ${student?.studentId}`,
                })
            }
        })
    }
    return (
        <div className="flex items-center gap-2.5">
            {modal}
            <Button
                onClick={onMakeCallClicked}
                loading={callLogResult.isLoading}
                disabled={callLogResult.isLoading}
                className="bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-xl shadow-[#044866]/25 hover:shadow-2xl hover:scale-105 transition-all px-5 py-2"
            >
                <Phone className="w-3.5 h-3.5 mr-2" />
                Call
            </Button>
            <Button
                outline
                variant="secondary"
                onClick={onComposeMailClicked}
                className="bg-white border-2 border-slate-200 hover:border-[#044866] hover:text-[#044866] shadow-lg hover:shadow-xl hover:scale-105 transition-all px-5 py-2"
            >
                <Mail className="w-3.5 h-3.5 mr-2" />
                Email
            </Button>

            <ProfileLinks profile={student} />
        </div>
    )
}

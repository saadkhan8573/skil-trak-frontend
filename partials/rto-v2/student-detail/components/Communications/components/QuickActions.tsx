import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { StudentMessageModal } from '@partials/rto-v2/student-detail/modals/StudentMessageModal'
import { SubAdminApi } from '@queries'
import { Student } from '@types'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { ComposeEmailModal } from '../modal'

export const QuickActions = ({ student }: { student: Student }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { notification } = useNotification()

    const [callLog, callLogResult] = SubAdminApi.Student.useStudentCallLog()

    const onCancelClicked = () => setModal(null)
    const onComposeMailClicked = () => {
        setModal(
            <ComposeEmailModal
                onCancel={onCancelClicked}
                user={student?.user}
            />
        )
    }

    const onMessageSendClicked = () => {
        setModal(
            <StudentMessageModal onCancel={onCancelClicked} student={student} />
        )
    }

    const onMakeCallClicked = () => {
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
        <>
            {modal}
            <ShowErrorNotifications result={callLogResult} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="primaryNew"
                        text="Send Email"
                        Icon={Mail}
                        className="h-auto py-4"
                        onClick={onComposeMailClicked}
                    />
                    <Button
                        variant="primaryNew"
                        text="Send SMS"
                        Icon={MessageSquare}
                        className="h-auto py-4"
                        onClick={onMessageSendClicked}
                    />
                    <Button
                        variant="info"
                        text="Make Call"
                        Icon={Phone}
                        className="h-auto py-4"
                        loading={callLogResult.isLoading}
                        disabled={callLogResult.isLoading}
                        onClick={onMakeCallClicked}
                    />
                </div>
            </div>
        </>
    )
}

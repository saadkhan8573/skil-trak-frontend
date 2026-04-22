import {
    Button,
    ShowErrorNotifications,
    WorldwideStudentDataRestriction,
} from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { Student } from '@types'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { ComposeEmailModal } from '../modal'
import { useAppSelector } from '@redux'
import { StudentMessageModal } from '@partials/rto-v2/student-detail/modals/StudentMessageModal'

export const QuickActions = ({ student }: { student: Student }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { notification } = useNotification()

    const [callLog, callLogResult] = SubAdminApi.Student.useStudentCallLog()

    const rtoUserId = useAppSelector((state) => state.rto.rtoDetail?.user?.id)

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
                    <WorldwideStudentDataRestriction
                        anotherUserId={Number(rtoUserId)}
                        fallbackOptions={{
                            height: '60px',
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="primaryNew"
                            text="Send Email"
                            Icon={Mail}
                            className="h-auto py-4"
                            onClick={onComposeMailClicked}
                        />{' '}
                    </WorldwideStudentDataRestriction>
                    <WorldwideStudentDataRestriction
                        anotherUserId={Number(rtoUserId)}
                        fallbackOptions={{
                            height: '60px',
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="primaryNew"
                            text="Send SMS"
                            Icon={MessageSquare}
                            className="h-auto py-4"
                            onClick={onMessageSendClicked}
                        />{' '}
                    </WorldwideStudentDataRestriction>
                    <WorldwideStudentDataRestriction
                        anotherUserId={Number(rtoUserId)}
                        fallbackOptions={{
                            height: '60px',
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="info"
                            text="Make Call"
                            Icon={Phone}
                            className="h-auto py-4"
                            loading={callLogResult.isLoading}
                            disabled={callLogResult.isLoading}
                            onClick={onMakeCallClicked}
                        />
                    </WorldwideStudentDataRestriction>
                </div>
            </div>
        </>
    )
}

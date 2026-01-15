import { Button } from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { Student } from '@types'
import { AuthorizedUserComponent } from '@components'
import { UserRoles } from '@constants'
import { DollarSign, Mail, Phone } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { ComposeEmailDialog } from '../Communications/modal/ComposeEmailDialog'
import { ProfileLinks } from '../ProfileLinks'
import { StudentCallLogModal, ViewPaymentDetailsModal } from './modals'

export const HeaderQuickActions = ({ student }: { student: Student }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [showEmailDialog, setShowEmailDialog] = useState(false)

    const { notification } = useNotification()


    const onCancelClicked = () => setModal(null)

    const onComposeMailClicked = () => {
        setShowEmailDialog(true)
    }

    const onMakeCallClicked = () => {
        setModal(
            <StudentCallLogModal
                open={true}
                onOpenChange={(val) => !val && setModal(null)}
                studentId={student?.id}
                studentDisplayId={student?.studentId}
                phoneNumber={student?.phone}
                studentName={student?.user?.name}
            />
        )
    }

    const onViewPaymentDetailsClicked = () => {
        setModal(
            <ViewPaymentDetailsModal
                open={true}
                onOpenChange={(val) => !val && setModal(null)}
                studentId={student?.id}
            />
        )
    }

    return (
        <div className="flex flex-wrap items-center justify-center xl:justify-end gap-2.5">
            {modal}
            <ComposeEmailDialog
                open={showEmailDialog}
                onOpenChange={setShowEmailDialog}
                user={student?.user}
                userId={student?.user?.id}
            />
            {student?.hasPaid && (
                <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                    <Button
                        onClick={onViewPaymentDetailsClicked}
                        variant='info'
                    >
                        <DollarSign className="w-3.5 h-3.5 mr-2" />
                        Payment Details
                    </Button>
                </AuthorizedUserComponent>
            )}
            <Button
                onClick={onMakeCallClicked}
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

import {
    AuthorizedUserComponent,
    Button,
    WorldwideStudentDataRestriction
} from '@components'
import { UserRoles } from '@constants'
import { useAppSelector } from '@redux'
import { Student } from '@types'
import {
    DollarSign,
    Mail,
    Phone,
    StickyNote,
    UserMinus,
    UserPlus,
} from 'lucide-react'
import { ReactElement, useState } from 'react'
import { AssignStudentModal } from '../../modals/AssignStudentModal'
import { ComposeEmailDialog } from '../Communications/modal/ComposeEmailDialog'
import { ProfileLinks } from '../ProfileLinks'
import {
    CreateStudentNoteModal,
    StudentCallLogModal,
    ViewPaymentDetailsModal,
} from './modals'

export const HeaderQuickActions = ({ student }: { student: Student }) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [showEmailDialog, setShowEmailDialog] = useState(false)
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [showAssignModal, setShowAssignModal] = useState(false)

    const rtoDetail = useAppSelector((state) => state.rto.rtoDetail)

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
        <div className="flex items-center justify-center xl:justify-end gap-2.5">
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
                        variant="info"
                    >
                        <DollarSign className="w-3.5 h-3.5 mr-2" />
                        Payment Details
                    </Button>
                </AuthorizedUserComponent>
            )}
            <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                <Button
                    onClick={() => setShowAssignModal(true)}
                    variant={student?.subadmin ? 'error' : 'action'}
                >
                    {student?.subadmin ? (
                        <UserMinus className="w-3.5 h-3.5 mr-2" />
                    ) : (
                        <UserPlus className="w-3.5 h-3.5 mr-2" />
                    )}
                    {student?.subadmin ? 'Unassign Student' : 'Assign Student'}
                </Button>
            </AuthorizedUserComponent>
            <Button onClick={() => setShowNoteModal(true)}>
                <StickyNote className="w-3.5 h-3.5 mr-2" />
                Note
            </Button>

            <WorldwideStudentDataRestriction
                anotherUserId={Number(rtoDetail?.user?.id)}
                fallbackOptions={{
                    height: '25px',
                    width: '100px',
                }}
            >
                <Button
                    onClick={onMakeCallClicked}
                    className="bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-xl shadow-[#044866]/25 hover:shadow-2xl hover:scale-105 transition-all px-5 py-2"
                >
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    Call
                </Button>
            </WorldwideStudentDataRestriction>

            <WorldwideStudentDataRestriction
                anotherUserId={Number(rtoDetail?.user?.id)}
                fallbackOptions={{
                    height: '25px',
                    width: '100px',
                }}
            >
                {' '}
                <Button
                    outline
                    variant="secondary"
                    onClick={onComposeMailClicked}
                    className="bg-white border-2 border-slate-200 hover:border-[#044866] hover:text-[#044866] shadow-lg hover:shadow-xl hover:scale-105 transition-all px-5 py-2"
                >
                    <Mail className="w-3.5 h-3.5 mr-2" />
                    Email
                </Button>
            </WorldwideStudentDataRestriction>

            <ProfileLinks profile={student} />
            <CreateStudentNoteModal
                open={showNoteModal}
                onOpenChange={setShowNoteModal}
                studentId={student?.id}
                receiverId={student?.user?.id}
            />
            {showAssignModal && (
                <AssignStudentModal
                    student={student}
                    onCancel={() => setShowAssignModal(false)}
                />
            )}
        </div>
    )
}

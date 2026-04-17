import { Button, TableAction } from '@components'
import { UserRoles } from '@constants'
import { useActionModal, useNotification, useSubadminProfile } from '@hooks'
import { ViewProfileVisitorsModal } from '@partials/common/modal'
import {
    MailPasswordModal,
    SnoozeStudentModal,
    UnSnoozeStudentModal,
} from '@partials/common/StudentProfileDetail/modals'
import { IndustryRequestsActions } from '@partials/sub-admin/ManagerApprovalList/enum'
import { PermissionType, Student } from '@types'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CiUnlock } from 'react-icons/ci'
import { IoMdEyeOff } from 'react-icons/io'
import { MdInfo, MdSnooze, MdAccessTime } from 'react-icons/md'
import { RiEditFill, RiFootprintFill } from 'react-icons/ri'
import { TbMessage2Up } from 'react-icons/tb'
import { StudentMessageModal } from '../modals/StudentMessageModal'
import {
    StudentInfoMessageModal,
    StudentStatusModal,
    AddExpectedDelayModal,
    RemoveExpectedDelayModal,
} from '../modals'

export const ProfileLinks = ({ profile }: { profile: Student }) => {
    const router = useRouter()
    const { passwordModal, onViewPassword, onUpdatePassword } = useActionModal()
    const [modal, setModal] = useState<ReactNode | null>(null)

    const role = getUserCredentials()?.role

    const { notification } = useNotification()

    const subadmin = useSubadminProfile()

    const studentUpdateRequest = profile?.studentUpdateRequests?.find(
        (r) => r?.action === IndustryRequestsActions.Snoozed
    )

    const onCancelClicked = () => setModal(null)

    const onStudentInfoMessageClicked = () => {
        setModal(
            <StudentInfoMessageModal
                onCancel={onCancelClicked}
                student={profile}
            />
        )
    }

    const onMailPasswordToStudent = (student: Student) => {
        setModal(
            <MailPasswordModal
                user={student?.user}
                onCancel={onCancelClicked}
            />
        )
    }

    const onSnooze = () => {
        if (studentUpdateRequest) {
            notification.warning({
                title: 'Snooze Request Already Sent',
                description: 'Snooze Request Already Sent to manager!',
            })
        } else {
            setModal(
                <SnoozeStudentModal
                    onCancel={onCancelClicked}
                    student={profile}
                />
            )
        }
    }

    const UnSnoozeModal = () => {
        setModal(
            <UnSnoozeStudentModal
                onCancel={onCancelClicked}
                student={profile}
            />
        )
    }
    const onUpdateStatus = () => {
        setModal(
            <StudentStatusModal onCancel={onCancelClicked} student={profile} />
        )
    }

    const onMessageSendClicked = () => {
        setModal(
            <StudentMessageModal onCancel={onCancelClicked} student={profile} />
        )
    }

    const onViewProfileVisitorsClicked = () => {
        setModal(
            <ViewProfileVisitorsModal
                onCancel={onCancelClicked}
                userId={profile?.user.id}
            />
        )
    }

    const onAddExpectedDelay = () => {
        setModal(
            <AddExpectedDelayModal
                student={profile}
                isOpen={true}
                onClose={onCancelClicked}
            />
        )
    }

    const onRemoveExpectedDelay = () => {
        setModal(
            <RemoveExpectedDelayModal
                student={profile}
                isOpen={true}
                onClose={onCancelClicked}
            />
        )
    }

    const profileLinks = [
        {
            text: 'Edit Password',
            Icon: IoMdEyeOff,
            onClick: () => onUpdatePassword({ user: profile?.user }),
            permissions: [PermissionType.EDIT_PASSWORD],
        },
        {
            text: 'View Password',
            Icon: IoMdEyeOff,
            onClick: () => onViewPassword(profile),
            permissions: [PermissionType.VIEW_PASSWORD],
        },
        {
            text: 'Send Password',
            Icon: CiUnlock,
            onClick: () => onMailPasswordToStudent(profile),
            permissions: [PermissionType.SEND_PASSWORD],
        },
        {
            text: 'Edit Profile',
            Icon: RiEditFill,
            onClick: () => {
                const editPath =
                    role === UserRoles.ADMIN || subadmin?.isAdmin
                        ? `/portals/admin/student/edit-student/${profile?.id}`
                        : role === UserRoles.SUBADMIN
                          ? `/portals/sub-admin/students/${profile?.id}/edit-student`
                          : role === UserRoles.RTO
                            ? `/portals/rto/students-and-placements/all-students/${profile?.id}/edit-student`
                            : '#'
                router.push(editPath)
            },
            permissions: [PermissionType.ALLOW_UPDATE_PROFILE],
        },
        {
            text: 'Send Message',
            Icon: TbMessage2Up,
            onClick: () => onMessageSendClicked(),
        },
        {
            text: 'Send Info Message',
            Icon: MdInfo,
            onClick: () => onStudentInfoMessageClicked(),
        },
        {
            text: profile?.isSnoozed ? 'Un-Snooze' : 'Snooze',
            Icon: MdSnooze,
            onClick: () => (profile?.isSnoozed ? UnSnoozeModal() : onSnooze()),
            permissions: [PermissionType.SNOOZE_STUDENT],
        },
        {
            text: 'Update Status',
            Icon: MdInfo,
            onClick: () => onUpdateStatus(),
        },
        {
            text: profile?.expectedDelay ? 'Delay Info' : 'Expected Delay',
            Icon: MdAccessTime,
            onClick: () =>
                profile?.expectedDelay
                    ? onRemoveExpectedDelay()
                    : onAddExpectedDelay(),
        },
        {
            text: 'View Visitors',
            Icon: RiFootprintFill,
            onClick: () => onViewProfileVisitorsClicked(),
            permissions: [PermissionType.VIEW_VISITORS],
        },
    ]

    return (
        <div className="flex flex-col items-end gap-y-2.5">
            {modal}
            {passwordModal}
            <div className="flex gap-x-1 items-center">
                <TableAction options={profileLinks} rowItem={profile}>
                    <Button
                        outline
                        Icon={BsThreeDotsVertical}
                        variant="secondary"
                        mini
                        className="bg- border-2 border-slate-200 hover:border-[#044866] shadow-lg hover:shadow-xl hover:scale-105 transition-all w-9 h-9"
                    />
                </TableAction>
            </div>
        </div>
    )
}

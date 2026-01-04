import { Badge } from '@components'
import { UserRoles } from '@constants'
import { useActionModal } from '@hooks'
import {
    AcceptingStudentModal,
    AddIndustryQuestionsModal,
    AddRplModal,
    IndustryGalleryListModal,
    ViewIndustryAnswersModal,
} from '@partials/common/IndustryProfileDetail/modal'
import { MailPasswordModal } from '@partials/common/StudentProfileDetail/modals'
import { ViewProfileVisitorsModal } from '@partials/common/modal'
import { useAppSelector } from '@redux/hooks'
import { User } from '@types'
import { getUserCredentials, cn } from '@utils'
import { MoreVertical, X } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { MoreMenuDropdown } from '../dropdowns'
import { IndustryInfoMessageModal, ServicesOfferedModal, WorkplaceTypeModal } from '@partials/rto-v2/industry-detail/modal'
import { BranchLocationsDialog, IndustryStatusChangeModal } from '../modals'
import { UserStatus } from '@types'

export function MoreMenuButton() {
    const [showMenu, setShowMenu] = useState(false)
    const { industryDetail: industry } = useAppSelector(
        (state) => state.industry
    )
    const { passwordModal, onViewPassword, onUpdatePassword } = useActionModal()
    const [modal, setModal] = useState<ReactNode | null>(null)
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
    const [showBranchLocationsDialog, setShowBranchLocationsDialog] = useState(false)
    const role = getUserCredentials()?.role

    const onCancelModal = () => {
        setModal(null)
        setShowMenu(false)
    }

    const onMailPasswordToStudent = (user: User) => {
        setModal(<MailPasswordModal user={user} onCancel={onCancelModal} />)
        setShowMenu(false)
    }

    const onViewProfileVisitorsClicked = () => {
        setModal(
            <ViewProfileVisitorsModal
                onCancel={onCancelModal}
                userId={industry!.user.id}
            />
        )
        setShowMenu(false)
    }

    const onViewIndustryAnswersClicked = () => {
        setModal(
            <ViewIndustryAnswersModal
                industryId={industry!.id}
                onCancel={onCancelModal}
            />
        )
        setShowMenu(false)
    }

    const onAddIndustryAnswersClicked = () => {
        setModal(
            <AddIndustryQuestionsModal
                industry={industry!}
                onCancel={onCancelModal}
            />
        )
        setShowMenu(false)
    }

    const onAddRpl = () => {
        setModal(<AddRplModal industry={industry!} onCancel={onCancelModal} />)
        setShowMenu(false)
    }

    const onIndustryGallery = () => {
        setModal(
            <IndustryGalleryListModal
                industry={industry!}
                onCancel={onCancelModal}
            />
        )
        setShowMenu(false)
    }

    const onSendInfoMessage = () => {
        setModal(
            <IndustryInfoMessageModal
                industry={industry!}
                onCancel={onCancelModal}
            />
        )
        setShowMenu(false)
    }

    const onServiceOffered = () => {
        setModal(
            <ServicesOfferedModal
                open={true}
                onOpenChange={(val) => !val && onCancelModal()}
                industryId={industry!.id}
                serviceOffered={industry!.serviceOffered}
            />
        )
        setShowMenu(false)
    }

    const onWorkplaceType = () => {
        setModal(
            <WorkplaceTypeModal
                open={true}
                onOpenChange={(val) => !val && onCancelModal()}
                industryUserId={industry!.user.id}
            />
        )
        setShowMenu(false)
    }

    const actions = {
        onEditPassword: () => {
            onUpdatePassword({ user: industry!.user })
            setShowMenu(false)
        },
        onSendPassword: () => onMailPasswordToStudent(industry!.user),
        onViewPassword: () => {
            onViewPassword(industry!)
            setShowMenu(false)
        },
        onPlacementStatus: () => {
            setModal(
                <AcceptingStudentModal
                    industry={industry!}
                    onCancel={onCancelModal}
                />
            )
            setShowMenu(false)
        },
        onViewVisitors: onViewProfileVisitorsClicked,
        onViewIndustryAnswers: onViewIndustryAnswersClicked,
        onAddIndustryAnswers: onAddIndustryAnswersClicked,
        onAddRpl: onAddRpl,
        onIndustryGallery: onIndustryGallery,
        onSendInfoMessage: onSendInfoMessage,
        onServiceOffered: onServiceOffered,
        onWorkplaceType: onWorkplaceType,
        onStatusChange: () => {
            setShowStatusChangeModal(true)
            setShowMenu(false)
        },
        onBranchLocations: () => {
            setShowBranchLocationsDialog(true)
            setShowMenu(false)
        },
    }

    return (
        <div className="relative">
            {modal}
            {passwordModal}
            <Badge
                onClick={() => setShowMenu(!showMenu)}
                Icon={showMenu ? X : MoreVertical}
                className={cn(
                    '!bg-white !text-[#044866] border border-[#044866]/20 cursor-pointer hover:bg-slate-50 transition-all active:scale-95',
                    showMenu && 'border-primary/40 shadow-sm'
                )}
                title="More Options"
            />

            {showMenu && industry && (
                <MoreMenuDropdown
                    onClose={() => setShowMenu(false)}
                    actions={actions}
                    role={role}
                    industry={industry}
                />
            )}

            <IndustryStatusChangeModal
                industryId={industry?.id!}
                isBlocked={industry?.user?.status === UserStatus.Blocked}
                open={showStatusChangeModal}
                onOpenChange={setShowStatusChangeModal}
            />

            <BranchLocationsDialog
                open={showBranchLocationsDialog}
                onOpenChange={setShowBranchLocationsDialog}
            />
        </div>
    )
}

import {
    AuthorizedUserComponent,
    Badge,
    Button,
    Typography,
    useAuthorizedUserComponent,
    WorldwideStudentDataRestriction,
} from '@components'
import { UserRoles } from '@constants'
import { CreateStudentNoteModal } from '@partials/rto-v2/student-detail/components/StudentHeader/modals'
import { ComposeMailModal } from '@partials/common/StudentProfileDetail/modals'
import { ReactElement, useState } from 'react'
import { WorkplaceHistory } from '../../Workplace'
import { useWorkplaceQueries } from '../../Workplace/hooks/useWorkplaceQueries.hook'
import { ShowAllCommunicationModal } from '../modal'
import { useAppSelector } from '@redux'

interface CommunicationHeaderProps {
    user?: any
}

export const CommunicationHeader = ({ user }: CommunicationHeaderProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const { selectedWorkplace } = useWorkplaceQueries({ student: user })

    const rtoDetail = useAppSelector((state) => state.rto.rtoDetail)

    const onCancelClicked = () => setModal(null)

    const onComposeMail = () => {
        setModal(
            <ComposeMailModal
                user={user?.user}
                userId={user?.user?.id}
                onCancel={onCancelClicked}
            />
        )
    }

    const onShowFullCommunication = () => {
        setModal(
            <ShowAllCommunicationModal user={user} onCancel={onCancelClicked} />
        )
    }

    const onAddNote = () => {
        setModal(
            <CreateStudentNoteModal
                open={true}
                onOpenChange={(val) => !val && setModal(null)}
                studentId={user?.id}
                receiverId={Number(user?.user?.id)}
            />
        )
    }

    return (
        <>
            {modal}
            <div className="flex items-center justify-between px-4 py-1.5 bg-white border-b">
                <Typography variant="body" semibold color="text-gray-900">
                    Recent Communications
                </Typography>

                <div className="flex items-center gap-x-2">
                    <Badge
                        text="View Full Screen"
                        variant="info"
                        onClick={onShowFullCommunication}
                    />
                    {user?.user?.role === UserRoles.STUDENT && (
                        <>
                            <AuthorizedUserComponent
                                roles={[UserRoles.SUBADMIN, UserRoles.ADMIN]}
                            >
                                <WorkplaceHistory
                                    wpId={Number(selectedWorkplace?.id)}
                                />
                            </AuthorizedUserComponent>
                            <AuthorizedUserComponent
                                roles={[
                                    UserRoles.SUBADMIN,
                                    UserRoles.ADMIN,
                                    UserRoles.RTO,
                                ]}
                            >
                                <Button
                                    onClick={() => {
                                        onAddNote()
                                    }}
                                >
                                    + Add Note
                                </Button>
                            </AuthorizedUserComponent>
                        </>
                    )}
                    <WorldwideStudentDataRestriction
                        anotherUserId={rtoDetail?.user?.id!}
                        fallbackOptions={{
                            height: '32px',
                            width: '120px',
                        }}
                    >
                        <Button
                            variant="info"
                            onClick={() => {
                                onComposeMail()
                            }}
                        >
                            + Compose Mail
                        </Button>
                    </WorldwideStudentDataRestriction>
                </div>
            </div>
        </>
    )
}

import {
    AuthorizedUserComponent,
    Badge,
    Button,
    Portal,
    Typography,
    useAuthorizedUserComponent,
} from '@components'
import { UserRoles } from '@constants'
import { CreateStudentNote } from '@partials/common/Notes/forms'
import { ComposeMailModal } from '@partials/common/StudentProfileDetail/modals'
import clsx from 'clsx'
import { ReactElement, useState } from 'react'
import { WorkplaceHistory } from '../../Workplace'
import { useWorkplaceQueries } from '../../Workplace/hooks/useWorkplaceQueries.hook'
import { ShowAllCommunicationModal } from '../modal'

interface CommunicationHeaderProps {
    user?: any
}

export const CommunicationHeader = ({ user }: CommunicationHeaderProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const { selectedWorkplace } = useWorkplaceQueries({ student: user })
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

    const isSubadminOrAdmin = useAuthorizedUserComponent({
        roles: [UserRoles.SUBADMIN, UserRoles.ADMIN],
    })

    const onAddNote = () => {
        setModal(
            <Portal>
                <div
                    className={clsx(
                        'bg-[#00000050] flex items-center justify-center gap-x-2 fixed  right-0 z-40',
                        {
                            'w-[calc(320px)]! h-full! top-[4.4rem]':
                                isSubadminOrAdmin,
                            'w-full h-screen top-0 overflow-auto':
                                !isSubadminOrAdmin,
                        }
                    )}
                >
                    <CreateStudentNote
                        studentId={user?.id}
                        onCancel={onCancelClicked}
                        receiverId={Number(user?.user?.id)}
                    />
                </div>
            </Portal>
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
                    <Button
                        variant="info"
                        onClick={() => {
                            onComposeMail()
                        }}
                    >
                        + Compose Mail
                    </Button>
                </div>
            </div>
        </>
    )
}

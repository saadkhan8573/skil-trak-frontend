import { UserRoles } from '@constants'
import { NotesView } from './components'
import { Waypoint } from 'react-waypoint'
import { ReactNode, useState } from 'react'
import { CreateStudentNote } from './forms'
import { AuthorizedUserComponent, Button, Card, Typography } from '@components'

export const StudentProfileNotes = ({
    userId,
    isPinned,
    studentId,
}: {
    userId: number
    studentId: number
    isPinned?: boolean
}) => {
    const [modal, setModal] = useState<ReactNode>(null)
    const [isViewd, setIsViewd] = useState<boolean>(false)

    const onCancel = () => {
        setModal(null)
    }
    const onAddNote = () => {
        setModal(
            <div
                className={`bg-[#00000050]  w-[calc(100%-80%)]
                 h-full flex items-center justify-center gap-x-2 fixed top-[4.4rem] right-0 z-40`}
            >
                <CreateStudentNote
                    studentId={studentId}
                    receiverId={Number(userId)}
                    onCancel={onCancel}
                />
            </div>
        )
    }

    return (
        <>
            {modal && modal}
            <Waypoint
                onEnter={() => {
                    setIsViewd(true)
                }}
            >
                <div className="h-full">
                    <Card noPadding fullHeight>
                        <div className="px-4 py-3.5 flex justify-between items-center border-b border-secondary-dark">
                            <Typography variant="label" semibold>
                                Notes
                            </Typography>
                            <AuthorizedUserComponent
                                excludeRoles={[UserRoles.OBSERVER]}
                            >
                                <Button onClick={onAddNote}>Add Note</Button>
                            </AuthorizedUserComponent>
                        </div>

                        <NotesView
                            userId={userId}
                            isViewd={isViewd}
                            isPinned={isPinned}
                        />
                    </Card>
                </div>
            </Waypoint>
        </>
    )
}

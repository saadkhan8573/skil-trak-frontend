import {
    AuthorizedUserComponent,
    Button,
    Card,
    CreateNote,
    Typography,
} from '@components'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@components/ui/drawer'
import { Button as UIButton } from '@components/ui/button'
import { UserRoles } from '@constants'
import { useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { NotesView } from './components'

export const Notes = ({
    userId,
    isPinned,
}: {
    userId: number
    isPinned?: boolean
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [isViewd, setIsViewd] = useState<boolean>(false)

    return (
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
                            <Drawer
                                open={isDrawerOpen}
                                onOpenChange={setIsDrawerOpen}
                                direction="right"
                            >
                                <DrawerTrigger asChild>
                                    <Button>Add Note</Button>
                                </DrawerTrigger>
                                <DrawerContent className="sm:max-w-[500px] w-screen h-full mt-0 rounded-none z-100">
                                    <div className="mx-auto w-full h-full flex flex-col">
                                        <DrawerHeader>
                                            <DrawerTitle>Add Note</DrawerTitle>
                                        </DrawerHeader>

                                        <div className="p-4 overflow-y-auto flex-1">
                                            <CreateNote
                                                receiverId={Number(userId)}
                                                onCancel={() =>
                                                    setIsDrawerOpen(false)
                                                }
                                            />
                                        </div>

                                        <DrawerFooter>
                                            <DrawerClose asChild>
                                                <UIButton variant="outline">
                                                    Close
                                                </UIButton>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>
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
    )
}

import { useState } from 'react'

// Icons
import { IoMdNotifications } from 'react-icons/io'
import { MdMessage } from 'react-icons/md'

// components
import { Typography } from '@components'

// components
import { useNavbar } from '@hooks'
import { useRouter } from 'next/router'
import OutsideClickHandler from 'react-outside-click-handler'
import { BadgeButton, MessageDropDown, NavbarBreadCrumbs } from './components'
import { NotificationDropDown } from './components/notifications'

// query
import { CommonApi } from '@queries'

export const AdminNavbar = () => {
    const data = CommonApi.Notifications.useNotifications({
        skip: undefined,
        limit: undefined,
    })
    const [isReadNotification, resultIsReadNotification] =
        CommonApi.Notifications.useIsReadNotification()
    let router = useRouter()
    const navbar = useNavbar()

    const [messagesExpanded, setMessagesExpanded] = useState(false)
    const [notificationsExpanded, setNotificationsExpanded] = useState(false)

    const paths = router.asPath.split('/')
    const links = paths.slice(1, -1)

    const titlePath = [...paths]?.reverse()

    const isId =
        typeof Number(titlePath?.[0]) === 'number' &&
        !isNaN(Number(titlePath?.[0]))

    const title = `${titlePath?.[isId ? 1 : 0]?.split('-')?.join(' ')?.split('?')?.[0]
        } ${isId ? 'Detail' : ''}`

    const unreadNotifications = data?.data?.data?.filter(
        (notification: any) => notification?.isRead === false
    )
    const count = unreadNotifications?.length

    const { data: mailCount } = CommonApi.Messages.useMailCount()
    const allMails = CommonApi.Messages.useRecentMails()
    const [seenMessage, resultSeenMessage] = CommonApi.Messages.useIsSeen()
    return (
        <div className="w-full transition-all  z-30 py-2 px-6  flex justify-between items-center">
            <div>
                <Typography variant={'h4'} capitalize>
                    {navbar.title || title || 'Dashboard'}
                </Typography>

                <NavbarBreadCrumbs
                    links={links}
                    title={navbar?.title || navbar?.subTitle || title}
                />
            </div>

            <div className="flex items-center gap-x-4">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setMessagesExpanded(false)
                    }}
                >
                    <div className="relative">
                        <BadgeButton
                            icon={MdMessage}
                            count={mailCount?.count || 0}
                            max={9}
                            onClick={() =>
                                setMessagesExpanded(!messagesExpanded)
                            }
                            text={'E-mails'}
                        />

                        <MessageDropDown
                            data={allMails}
                            expanded={messagesExpanded}
                            resultSeenMessage={resultSeenMessage}
                            seenMessage={seenMessage}
                        />
                    </div>
                </OutsideClickHandler>

                <OutsideClickHandler
                    onOutsideClick={() => {
                        setNotificationsExpanded(false)
                    }}
                >
                    <div className="relative">
                        <BadgeButton
                            icon={IoMdNotifications}
                            count={count || 0}
                            max={9}
                            onClick={() =>
                                setNotificationsExpanded(!notificationsExpanded)
                            }
                            text={'Notifications'}
                        />

                        <NotificationDropDown
                            expanded={notificationsExpanded}
                            data={data?.data}
                            isReadNotification={isReadNotification}
                            resultIsReadNotification={resultIsReadNotification}
                            setNotificationsExpanded={setNotificationsExpanded}
                        />
                    </div>
                </OutsideClickHandler>
            </div>
        </div>
    )
}

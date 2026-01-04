import { useState } from 'react'
import { HeaderLogo } from '../NavbarLogo'

// Icons
import { IoMdNotifications } from 'react-icons/io'

// components
import { useRouter } from 'next/router'
import OutsideClickHandler from 'react-outside-click-handler'
import {
    BadgeButton,
    PlacementNotificationDropDown,
} from '../AdminNavbar/components'
import { NotificationDropDown } from '../AdminNavbar/components/notifications'

import { AuthorizedUserComponent } from '@components/AuthorizedUserComponent'
import { DisplayNotifications } from '@components/Notification'
import { MediaQueries, UserRoles } from '@constants'
import { CommonApi } from '@queries'
import Link from 'next/link'
import { BsFillTicketDetailedFill } from 'react-icons/bs'
import { FaClipboardList, FaHistory } from 'react-icons/fa'
import { LiaCertificateSolid } from 'react-icons/lia'
import { useMediaQuery } from 'react-responsive'
import { NavLinkItem } from '../NavLinkItem'
import { ProfileOptionsDropDown } from './components'
import { ProfileOptionButton } from './components/profileOption/ProfileOptionButton'
export const DetailNavbar = () => {
    const router = useRouter()

    const isMobile = useMediaQuery(MediaQueries.Mobile)
    const data = CommonApi.Notifications.useNotifications({
        search: `isRead:${false}`,
        skip: 0,
        limit: 30,
    })
    const placementNotifications =
        CommonApi.Notifications.usePlacementNotifications({
            status: 'placementStarted',
            skip: undefined,
            limit: undefined,
        })
    const ticketCount = CommonApi.Tickets.useGetTicketCountQuery()

    const { data: mailCount } = CommonApi.Messages.useMailCount()
    const allMails = CommonApi.Messages.useRecentMails()

    const [isReadNotification, resultIsReadNotification] =
        CommonApi.Notifications.useIsReadNotification()
    const [seenMessage, resultSeenMessage] = CommonApi.Messages.useIsSeen()

    const [messagesExpanded, setMessagesExpanded] = useState(false)
    const [notificationsExpanded, setNotificationsExpanded] = useState(false)
    const [placementNotificationsExpanded, setPlacementNotificationsExpanded] =
        useState(false)
    const [profileOptionsExpanded, setProfileOptionsExpanded] = useState(false)

    // filter over data to get only unread notifications

    const subadminLinkPrefix = '/portals/sub-admin'

    const subadminLinks = [
        {
            link: `${subadminLinkPrefix}/volunteer-requests?tab=pending`,
            text: 'Volunteer Requests',
            Icon: FaClipboardList,
            activeClasses: 'bg-orange-100 text-orange-700',
            inActiveClasses: 'text-slate-700',
        },
        {
            link: `${subadminLinkPrefix}/talent-pool`,
            text: 'Talent Pool',
            Icon: LiaCertificateSolid,
            activeClasses: 'bg-orange-100 text-orange-700',
            inActiveClasses: 'text-slate-700',
        },
        {
            link: `${subadminLinkPrefix}/history`,
            text: 'History',
            Icon: FaHistory,
            activeClasses: 'bg-green-100 text-green-700',
            inActiveClasses: 'text-slate-700',
        },
        {
            link: `${subadminLinkPrefix}/tickets?tab=all-tickets`,
            text: 'Tickets',
            Icon: BsFillTicketDetailedFill,
            activeClasses: 'bg-green-100 text-green-700',
            inActiveClasses: 'text-slate-700',
            count: ticketCount?.data,
        },
        {
            link: `${subadminLinkPrefix}/support-tickets?tab=active`,
            text: 'Support Tickets',
            Icon: BsFillTicketDetailedFill,
            activeClasses: 'bg-green-100 text-green-700',
            inActiveClasses: 'text-slate-700',
            // count: ticketCount?.data,
        },
    ]

    return (
        <div className="w-full z-50 px-2 md:px-8 py-2 bg-white border-b border-secondary-dark flex justify-between items-center">
            <div className="flex justify-between items-center">
                <HeaderLogo />
            </div>

            <div className="flex items-center gap-x-4 md:gap-x-8">
                <AuthorizedUserComponent roles={[UserRoles.STUDENT]}>
                    <Link legacyBehavior href={'/portals/student/history'}>
                        <a
                            className={` ${
                                router.pathname === '/portals/student/history'
                                    ? 'bg-green-100 text-green-700'
                                    : 'text-slate-700'
                            } transition-all duration-300 px-4 py-2 flex gap-x-2 items-center rounded-md hover:bg-green-100 hover:text-green-700`}
                        >
                            <span>
                                <BsFillTicketDetailedFill />
                            </span>
                            <span className="text-sm font-semibold">
                                History
                            </span>
                        </a>
                    </Link>
                </AuthorizedUserComponent>

                <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                    <div className="relative">
                        <Link
                            legacyBehavior
                            href={'/portals/rto/tickets?tab=all-tickets'}
                        >
                            <a
                                className={` ${
                                    router.pathname ===
                                    '/portals/sub-admin/tickets'
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-slate-700'
                                } transition-all duration-300 px-4 py-2 flex gap-x-2 items-center rounded-md hover:bg-green-100 hover:text-green-700`}
                            >
                                <span>
                                    <BsFillTicketDetailedFill />
                                </span>
                                <span className="text-sm font-semibold">
                                    Tickets
                                </span>
                            </a>
                        </Link>
                        <span className="w-5 h-5 flex items-center justify-center text-center text-white absolute -top-2 -right-2 bg-error rounded-full text-xs">
                            {ticketCount?.data}
                        </span>
                    </div>
                </AuthorizedUserComponent>
                <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                    <ul className="list-none flex gap-x-2">
                        {subadminLinks?.map((linksData, i) => (
                            <NavLinkItem
                                key={i}
                                nav={linksData}
                                PREFIX={subadminLinkPrefix}
                            />
                        ))}
                    </ul>
                </AuthorizedUserComponent>
                {/* <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                    <div className="relative">
                        <Link
                            legacyBehavior
                            href={'/portals/sub-admin/downloads'}
                        >
                            <a
                                className={` ${
                                    router.pathname ===
                                    '/portals/sub-admin/downloads'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'text-slate-700'
                                } transition-all duration-300 px-4 py-2 flex gap-x-2 items-center rounded-md hover:bg-orange-100 hover:text-orange-700`}
                            >
                                <span>
                                    <BsFillCloudDownloadFill />
                                </span>
                                <span className="text-sm font-semibold">
                                    Downloads
                                </span>
                            </a>
                        </Link>
                      
                    </div>
                </AuthorizedUserComponent> */}

                {/* <OutsideClickHandler
                    onOutsideClick={() => {
                        setMessagesExpanded(false)
                    }}
                >
                    <div className="relative">
                        <BadgeButton
                            icon={MdMessage}
                            count={mailCount?.count || 0}
                            max={9}
                            onClick={() => setMessagesExpanded(true)}
                            text={'E-mails'}
                        />

                        <MessageDropDown
                            data={allMails}
                            expanded={messagesExpanded}
                            resultSeenMessage={resultSeenMessage}
                            seenMessage={seenMessage}
                        />
                    </div>
                </OutsideClickHandler> */}

                <AuthorizedUserComponent excludeRoles={[UserRoles.OBSERVER]}>
                    {' '}
                    <OutsideClickHandler
                        onOutsideClick={() => {
                            setNotificationsExpanded(false)
                        }}
                    >
                        <div className="relative">
                            <BadgeButton
                                icon={IoMdNotifications}
                                count={data?.data?.data?.length || 0}
                                max={9}
                                onClick={() =>
                                    setNotificationsExpanded(
                                        !notificationsExpanded
                                    )
                                }
                                text={'Notifications'}
                            />

                            <NotificationDropDown
                                expanded={notificationsExpanded}
                                data={data?.data}
                                isReadNotification={isReadNotification}
                                resultIsReadNotification={
                                    resultIsReadNotification
                                }
                                setNotificationsExpanded={(value: boolean) => {
                                    setNotificationsExpanded(value)
                                }}
                            />
                        </div>
                    </OutsideClickHandler>
                </AuthorizedUserComponent>
                {/* <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                    <OutsideClickHandler
                        onOutsideClick={() => {
                            setPlacementNotificationsExpanded(false)
                        }}
                    >
                        <div className="relative">
                            <BadgeButton
                                icon={IoMdNotifications}
                                count={data?.data?.data?.length || 0}
                                max={9}
                                onClick={() =>
                                    setPlacementNotificationsExpanded(
                                        !placementNotificationsExpanded
                                    )
                                }
                                text={'Placement'}
                            />

                            <PlacementNotificationDropDown
                                expanded={placementNotificationsExpanded}
                                data={placementNotifications?.data}
                                isReadNotification={isReadNotification}
                                resultIsReadNotification={
                                    resultIsReadNotification
                                }
                                setNotificationsExpanded={(value: boolean) => {
                                    setPlacementNotificationsExpanded(value)
                                }}
                            />
                        </div>
                    </OutsideClickHandler>
                </AuthorizedUserComponent> */}

                <OutsideClickHandler
                    onOutsideClick={() => {
                        setProfileOptionsExpanded(false)
                    }}
                >
                    <div className="relative">
                        <ProfileOptionButton
                            expanded={profileOptionsExpanded}
                            onClick={() => setProfileOptionsExpanded(true)}
                        />

                        <ProfileOptionsDropDown
                            expanded={profileOptionsExpanded}
                            setExpanded={setProfileOptionsExpanded}
                        />
                    </div>
                </OutsideClickHandler>
            </div>
            <DisplayNotifications />
        </div>
    )
}

'use client'
import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownSeparator,
    DropdownTrigger,
    DropdownLabel,
} from '@components/Dropdown'
import { Bell, ChevronDown, Menu, Plus, Search, Sparkles } from 'lucide-react'
import { NotificationDropDown } from '../AdminNavbar/components'
import { useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import {
    commonApi,
    CommonApi,
    industryApi,
    rtoApi,
    studentApi,
    subAdminApi,
} from '@queries'
import { AuthUtils, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useContextBar } from '@hooks'
import { Typography } from '@components/Typography'
import { Title } from '@partials'

export const RtoNavbarV2 = ({ onOpenSidebar, titleProps }: any) => {
    const [mount, setMount] = useState(false)
    const [notificationsExpanded, setNotificationsExpanded] = useState(false)

    const router = useRouter()

    const dispatch = useDispatch()
    const contextBar = useContextBar()

    const data = CommonApi.Notifications.useNotifications({
        search: `isRead:${false}`,
        skip: 0,
        limit: 30,
    })
    const [isReadNotification, resultIsReadNotification] =
        CommonApi.Notifications.useIsReadNotification()
    const [logoutActivity] = CommonApi.LogoutActivity.perFormAcivityOnLogout()

    useEffect(() => {
        setMount(true)
    }, [])

    const user = getUserCredentials()

    const onLogout = async () => {
        if (AuthUtils.token()) {
            await logoutActivity({})
        }

        AuthUtils.logout(router)
        contextBar.setContent(null)
        contextBar.setTitle(null)
        contextBar.hide()
        dispatch(subAdminApi.util.resetApiState())
        dispatch(rtoApi.util.resetApiState())
        dispatch(industryApi.util.resetApiState())
        dispatch(commonApi.util.resetApiState())
        dispatch(studentApi.util.resetApiState())
    }

    const useMenuItems = [
        {
            title: 'Profile',
            onClick: () => router.push('/portals/rto/my-profile'),
            classes: 'hover:text-white hover:bg-orange-500 focus:bg-orange-500',
            separator: false,
        },

        {
            title: 'Sign Out',
            onClick: () => onLogout(),
            classes:
                'hover:text-red-400 hover:bg-red-200 text-red-500 focus:bg-red-500 ',
            separator: true,
        },
    ]

    if (!mount) {
        return <></>
    }

    return (
        <header className="w-full flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-border bg-transparent backdrop-blur-sm z-30">
            {titleProps && (
                <div className="hidden lg:block">
                    <Title {...titleProps} />
                </div>
            )}
            <div className="flex items-center gap-3">
                <button
                    aria-label="Open menu"
                    onClick={onOpenSidebar}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-muted/30 transition"
                >
                    <Menu className="h-5 w-5 text-foreground" />
                </button>
            </div>
            <div className="flex items-center gap-3">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setNotificationsExpanded(false)
                    }}
                >
                    <div className="relative z-50">
                        <button
                            onClick={() =>
                                setNotificationsExpanded(!notificationsExpanded)
                            }
                            className="relative p-2 rounded-lg hover:bg-muted/30 transition cursor-pointer"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 text-[10px] bg-red-400 text-white rounded-full px-1">
                                {data?.data?.data?.length || 0}
                            </span>
                        </button>
                        <NotificationDropDown
                            expanded={notificationsExpanded}
                            data={data?.data}
                            isReadNotification={isReadNotification}
                            resultIsReadNotification={resultIsReadNotification}
                            setNotificationsExpanded={(value: boolean) => {
                                setNotificationsExpanded(value)
                            }}
                            showArrow={false}
                        />
                    </div>
                </OutsideClickHandler>

                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/10">
                    <Dropdown>
                        <DropdownTrigger>
                            <>
                                <div className="size-6 ring-2 ring-slate-300 rounded-full bg-[#044866] flex items-center justify-center text-white">
                                    <Typography variant="badge">
                                        {user?.name?.charAt(0)}
                                    </Typography>
                                </div>
                                <div className="font-semibold hidden md:block ">
                                    {user?.name}
                                </div>
                            </>
                        </DropdownTrigger>

                        <DropdownContent align="end">
                            <DropdownLabel>
                                <Typography variant="badge">
                                    {user?.name || 'NA'}
                                </Typography>
                            </DropdownLabel>
                            <DropdownSeparator />
                            {useMenuItems.map((item, index) => (
                                <div key={index}>
                                    {item.separator && <DropdownSeparator />}
                                    <DropdownItem
                                        className={item.classes}
                                        onSelect={() => item.onClick()}
                                    >
                                        {item.title}
                                    </DropdownItem>
                                </div>
                            ))}
                        </DropdownContent>
                    </Dropdown>
                </div>
            </div>
        </header>
    )
}

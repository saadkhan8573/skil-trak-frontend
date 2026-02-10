import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { FaInbox } from 'react-icons/fa'
import { IoMdNotifications } from 'react-icons/io'
import { IoSearch, IoSendSharp } from 'react-icons/io5'
import { TopBar } from './components'
import {
    FilterMails,
    ReceiverMailsInbox,
    SenderMailsInbox,
    TabNotification,
} from './tabs'

export const MailsListing = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const router = useRouter()

    const role = getUserCredentials()?.role

    const roleUrl = () => {
        switch (role) {
            case UserRoles.SUBADMIN:
                return '/portals/sub-admin/notifications'
            case UserRoles.INDUSTRY:
                return '/portals/industry/notifications/e-mails'
            case UserRoles.STUDENT:
                return '/portals/student/mails'
            case UserRoles.RTO:
                if (router.pathname.includes('/portals/rto/communications')) {
                    return '/portals/rto/communications/e-mails'
                } else {
                    return '/portals/rto/notifications/e-mails'
                }
            // case UserRoles.RTO:

            default:
                return null
        }
    }

    const mailsTabs = [
        {
            text: 'Inbox',
            Icon: FaInbox,
            href: {
                pathname: roleUrl(),
                query: { tab: 'inbox' },
            },
            component: ReceiverMailsInbox,
        },
        {
            text: 'Sent',
            Icon: IoSendSharp,
            href: {
                pathname: roleUrl(),
                query: { tab: 'sent' },
            },
            component: SenderMailsInbox,
        },
        {
            text: 'All Notifications',
            Icon: IoMdNotifications,
            href: {
                pathname: roleUrl(),
                query: { tab: 'notification' },
            },
            component: TabNotification,
        },
    ]

    const getActiveTab = (tab: string) => tab === router?.query?.tab

    const Component = mailsTabs?.find((tab) =>
        getActiveTab(tab?.href?.query?.tab)
    )?.component

    const DefaultComponent = mailsTabs?.[0]?.component

    const delayedSearch = useCallback(
        debounce((value: any) => {
            setSearchQuery(value)
        }, 700),
        []
    )
    return (
        <div className="my-6 flex items-start gap-x-2">
            <TopBar mailsTabs={mailsTabs} />

            {/* Component */}
            <div className="w-full">
                <div className="relative w-full mb-4">
                    <div className="absolute top-1/2 left-8 ">
                        <IoSearch
                            size={18}
                            className="transform font-bold -translate-y-1/2 text-indigo-400"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Search here..."
                        onChange={(e) => delayedSearch(e?.target?.value)}
                        className="w-full pl-16 pr-8 py-3 bg-[#FFF2D6] border-0 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                </div>
                {searchQuery !== '' ? (
                    <FilterMails query={searchQuery} />
                ) : (
                    <>{Component ? <Component /> : <DefaultComponent />}</>
                )}
            </div>
        </div>
    )
}

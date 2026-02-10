import { Button, Card } from '@components'
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs'
import { UserRoles } from '@constants'
import {
    ComposeMail,
    FilterMails,
    ReceiverMailsInbox,
    SenderMailsInbox,
} from '@partials/common/MailsListing'
import { getUserCredentials } from '@utils'
import { debounce } from 'lodash'
import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { FaInbox } from 'react-icons/fa'
import { IoSearch, IoSendSharp } from 'react-icons/io5'

export const RtoEmails = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [isComposeMail, setIsComposeMail] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState('inbox')
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
            default:
                return null
        }
    }

    const mailsTabs = [
        {
            text: 'Inbox',
            value: 'inbox',
            Icon: FaInbox,
            href: {
                pathname: roleUrl(),
                query: { tab: 'inbox' },
            },
            component: ReceiverMailsInbox,
        },
        {
            text: 'Sent Mails',
            value: 'sent',
            Icon: IoSendSharp,
            href: {
                pathname: roleUrl(),
                query: { tab: 'sent' },
            },
            component: SenderMailsInbox,
        },
    ]

    // Initialize active tab from URL on mount
    useEffect(() => {
        const tabFromUrl = router?.query?.tab as string
        if (tabFromUrl && mailsTabs.some((tab) => tab.value === tabFromUrl)) {
            setActiveTab(tabFromUrl)
        }
    }, [router?.query?.tab])

    const ActiveComponent =
        mailsTabs.find((tab) => tab.value === activeTab)?.component ||
        mailsTabs[0]?.component

    const delayedSearch = useCallback(
        debounce((value: any) => {
            setSearchQuery(value)
        }, 700),
        []
    )

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const selectedTab = mailsTabs.find((tab) => tab.value === value)
        if (selectedTab?.href) {
            router.push(selectedTab.href, undefined, { shallow: true })
        }
    }

    const onComposeMail = useCallback(() => {
        setIsComposeMail(!isComposeMail)
    }, [isComposeMail])

    return (
        <Card className="shadow-premium-lg" noPadding>
            <div className="w-full">
                <div className="flex items-center justify-between px-6 py-2 border-b bg-linear-to-r from-white to-primary/5">
                    <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="flex-1"
                    >
                        <TabsList className="bg-transparent border-0 h-auto p-0 gap-8">
                            {mailsTabs.map((tab) => {
                                const Icon = tab.Icon
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="bg-transparent shadow-none data-[state=active]:rounded-none data-[state=active]:bg-transparent border-0 border-b border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent text-sm data-[state=active]:text-primary hover:text-accent transition-colors px-10 py-2"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className="w-4 h-4" />
                                            <span>{tab.text}</span>
                                        </div>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2.5">
                        <Button
                            Icon={Edit3}
                            text="Compose"
                            onClick={onComposeMail}
                        />
                    </div>
                </div>

                <div className="p-4 bg-[#FFF2D6]">
                    <div className="relative w-full">
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
                            className="w-full pl-16 pr-8 py-3 bg-white border-0 rounded focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                    </div>
                </div>
                {searchQuery !== '' ? (
                    <FilterMails query={searchQuery} />
                ) : (
                    <ActiveComponent />
                )}

                <div
                    className={`fixed bottom-0 right-20 z-333  ${isComposeMail ? 'block' : 'hidden'
                        }`}
                >
                    <ComposeMail onCancelComposeMail={onComposeMail} />
                </div>
            </div>
        </Card>
    )
}

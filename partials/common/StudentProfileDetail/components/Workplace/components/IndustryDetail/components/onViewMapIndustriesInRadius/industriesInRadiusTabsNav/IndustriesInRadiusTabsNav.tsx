import { AuthorizedUserComponent } from '@components'
import { UserRoles } from '@constants'
import { RunListingAutomation } from '@partials/common/FindWorkplaces'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export interface TabProps {
    label: string
    element: React.ReactNode
}

interface TabNavigationProps {
    tabs: TabProps[]
}

export const IndustriesInRadiusTabsNav: React.FC<TabNavigationProps> = ({
    tabs,
}) => {
    // const [activeIndex, setActiveIndex] = useState(0)
    const router = useRouter()
    const tabIndexMap: Record<string, number> = {
        signed: 0,
        future: 1,
    }
    const [activeIndex, setActiveIndex] = useState(
        () => tabIndexMap[String(router.query.tab)] ?? 0
    )
    useEffect(() => {
        if (router.query.tab) {
            setActiveIndex(tabIndexMap[String(router.query.tab)] ?? 0)
        }
    }, [router.query.tab])
    const preserveScroll = () => {
        const y = window.scrollY
        requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: 'auto' })
        })
    }

    return (
        <div>
            {/* Tab headers */}
            <div className="flex justify-between border-b border-gray-300">
                <div className="flex border-b border-gray-300">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                preserveScroll()
                                setActiveIndex(index)
                                router.push(
                                    {
                                        query: {
                                            ...router.query,
                                            tab:
                                                index === 0
                                                    ? 'signed'
                                                    : 'future',
                                            page: 1,
                                        },
                                    },
                                    undefined,
                                    { shallow: true, scroll: false }
                                )
                            }}
                            className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
                                activeIndex === index
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <AuthorizedUserComponent
                    roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                    isAssociatedWithRto={false}
                >
                    <RunListingAutomation />
                </AuthorizedUserComponent>
            </div>

            {/* Tab content */}
            <div className="py-4">{tabs[activeIndex].element}</div>
        </div>
    )
}

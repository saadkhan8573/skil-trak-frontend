'use client'

import {
    ContextBar,
    RtoNavbarV2,
    DisplayAlerts,
    DisplayNotifications,
} from '@components'
import { ReactNode, useState } from 'react'
import { AccessNewPortalOnPermission } from '@partials'
import { RtoSidebar } from '@components/sideBars/rtoSidebarV2'

interface RtoLayoutProps {
    children: ReactNode
    titleProps?: {
        Icon: any
        title: string
        iconClasses?: string
        description?: string
    }
    childrenClasses?: string
}

export const RtoLayoutV2 = ({
    children,
    titleProps,
    childrenClasses,
}: RtoLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeView, setActiveView] = useState('Dashboard')

    return (
        // Disable browser scroll and fix full height
        <AccessNewPortalOnPermission>
            <div className="flex h-screen overflow-hidden bg-background text-foreground">
                {/* Sidebar - scrolls independently */}
                <RtoSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onNavigate={(key: any) => setActiveView(key)}
                    activeKey={activeView}
                />

                {/* Main content area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Navbar - fixed (does not move when content scrolls) */}
                    <div className="shrink-0 relative z-50">
                        <RtoNavbarV2
                            onOpenSidebar={() => setSidebarOpen(true)}
                            titleProps={titleProps}
                        />
                    </div>
                    {/* Main scrollable content */}
                    <main
                        id="main-content-scroll"
                        className={`flex-1 overflow-y-auto p-4 md:p-6 mx-auto w-full ${childrenClasses}`}
                    >
                        <div>
                            {children}
                        </div>
                    </main>
                    <DisplayNotifications />
                    <DisplayAlerts />
                </div>
            </div>
        </AccessNewPortalOnPermission>
    )
}

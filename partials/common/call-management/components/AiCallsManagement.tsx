import React, { useState } from 'react'
import { ConfigTabs, TabConfig, NoData } from '@components'
import { DashboardStats } from './DashboardStats'
import { AgentConfiguration } from './AgentConfiguration'
import { LayoutDashboard, Bot } from 'lucide-react'
import { AuthenticateUserModal } from '@partials/admin/generateKey/modal'

export const AiCallsManagement = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [showAuthModal, setShowAuthModal] = useState<boolean>(true)

    const tabs: TabConfig[] = [
        {
            value: 'call-management',
            label: 'Call Management',
            icon: LayoutDashboard,
            component: DashboardStats,
        },
        {
            value: 'agent-configurations',
            label: 'Agent Configurations',
            icon: Bot,
            component: AgentConfiguration,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {showAuthModal && (
                <AuthenticateUserModal
                    onCancel={() => {
                        setIsAuthenticated(true)
                        setShowAuthModal(false)
                    }}
                />
            )}
            <div className="max-w-[1400px] mx-auto px-6 py-6">
                {isAuthenticated ? (
                    <ConfigTabs tabs={tabs} tabsTriggerClasses="py-1!" />
                ) : (
                    <NoData text="Please authenticate to view call management" />
                )}
            </div>
        </div>
    )
}

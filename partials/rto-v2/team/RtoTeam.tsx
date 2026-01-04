'use client'

import { Badge, Button, Card } from '@components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
    Briefcase,
    Download,
    Headphones,
    Key,
    LifeBuoy,
    Users,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useState } from 'react'
import { ActionRequiredHeader } from '../components'
import { AssignedCoordinators } from './AssignedCoordinators'
import { MyCoordinators } from './MyCoordinators'

const TEAM_TABS = [
    {
        value: 'rto',
        label: 'Your RTO Team',
        icon: Briefcase,
        count: '10',
        queryParam: 'my-team',
        component: MyCoordinators,
        showEmpty: false,
    },
    {
        value: 'skiltrak',
        label: 'Skiltrak Support Team',
        icon: Headphones,
        count: '11',
        queryParam: 'skiltrak-team',
        component: AssignedCoordinators,
        showEmpty: false,
        banner: {
            icon: LifeBuoy,
            title: 'Dedicated Skiltrak Support',
            description:
                'These Skiltrak team members are allocated to support your RTO with platform setup, automation, compliance, and technical assistance. They have read-only or limited access to help you succeed.',
        },
    },
]

export const RtoTeam = () => {
    const router = useRouter()
    const [mount, setMount] = useState(false)
    const [activeTab, setActiveTab] = useState('rto')

    // Sync tab with URL query parameter
    useEffect(() => {
        const tab = router.query.tab
        const matchedTab = TEAM_TABS.find((t) => t.queryParam === tab)
        if (matchedTab) {
            setActiveTab(matchedTab.value)
        }
    }, [router.query.tab])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        // Update URL when tab changes
        const selectedTab = TEAM_TABS.find((t) => t.value === value)
        if (selectedTab) {
            router.push(
                {
                    pathname: 'team',
                    query: { tab: selectedTab.queryParam },
                },
                undefined,
                { shallow: true }
            )
        }
    }

    useEffect(() => {
        setMount(true)
    }, [])

    return (
        <Suspense fallback={''}>
            <div className="space-y-4">
                <ActionRequiredHeader
                    icon={Users}
                    title="Team Management"
                    description="Your RTO team and allocated Skiltrak support members"
                    gradientFrom="primaryNew"
                    gradientTo="primaryNew"
                    iconGradient="from-primaryNew to-primaryNew"
                    actionButton={{
                        label: 'Add Team Member',
                        icon: Users,
                        onClick: () => router.push('team/create'),
                    }}
                />

                <Card noPadding className="border-border/60 shadow-premium-lg">
                    <div className="border-b bg-secondary-light p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primaryNew" />
                                Team Members
                            </div>
                            <div className="flex gap-2">
                                <Button variant="primaryNew" outline>
                                    <Key className="h-4 w-4 mr-2" />
                                    Manage Permissions
                                </Button>
                                <Button variant="primaryNew" outline>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="p-0">
                        <Tabs
                            value={activeTab}
                            onValueChange={handleTabChange}
                            className="w-full"
                        >
                            <div className="border-b bg-muted/20 mt-6">
                                <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                                    {TEAM_TABS.map((tab) => {
                                        const Icon = tab.icon
                                        return (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/5 px-6 py-4"
                                            >
                                                <Icon className="h-4 w-4 mr-2" />
                                                {tab.label}
                                                <Badge
                                                    text={tab.count}
                                                    variant="primaryNew"
                                                />
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>
                            </div>

                            {TEAM_TABS.map((tab) => {
                                const Component = tab.component
                                return (
                                    <TabsContent
                                        key={tab.value}
                                        value={tab.value}
                                        className="m-0"
                                    >
                                        {tab.banner && (
                                            <div className="p-4 bg-primary/12 border-b border-primary/22">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <tab.banner.icon className="h-5 w-5 text-accent" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-sm mb-1">
                                                            {tab.banner.title}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {
                                                                tab.banner
                                                                    .description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {tab.showEmpty ? (
                                            <div className="p-12 text-center">
                                                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                                <p className="text-muted-foreground">
                                                    No {tab.label.toLowerCase()}{' '}
                                                    found
                                                </p>
                                            </div>
                                        ) : (
                                            <Component />
                                        )}
                                    </TabsContent>
                                )
                            })}
                        </Tabs>
                    </div>
                </Card>
            </div>
        </Suspense>
    )
}

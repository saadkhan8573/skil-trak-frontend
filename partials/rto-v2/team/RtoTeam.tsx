'use client'

import { Badge, Button, Card, ConfigTabs, TabConfig } from '@components'
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
import { RtoApi } from '@queries'
import { AssignedCoordinators } from './AssignedCoordinators'
import { MyCoordinators } from './MyCoordinators'

const SkiltrakSupportWrapper = () => {
    const banner = {
        icon: LifeBuoy,
        title: 'Dedicated Skiltrak Support',
        description:
            'These Skiltrak team members are allocated to support your RTO with platform setup, automation, compliance, and technical assistance. They have read-only or limited access to help you succeed.',
    }
    return (
        <>
            <div className="p-4 bg-primary/12 border-b border-primary/22">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <banner.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                            {banner.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {banner.description}
                        </p>
                    </div>
                </div>
            </div>
            <AssignedCoordinators />
        </>
    )
}

export const RtoTeam = () => {
    const router = useRouter()
    const [mount, setMount] = useState(false)

    const rtoTeamData = RtoApi.Coordinator.useList({
        skip: 0,
        limit: 1,
    })

    const skiltrakTeamData = RtoApi.Coordinator.useRtoAssignedCoordinators({
        skip: 0,
        limit: 1,
    })

    const tabs: TabConfig[] = [
        {
            value: 'rto',
            label: 'Your RTO Team',
            icon: Briefcase,
            count: rtoTeamData?.data?.pagination?.totalResult || 0,
            component: MyCoordinators,
        },
        {
            value: 'skiltrak',
            label: 'Skiltrak Support Team',
            icon: Headphones,
            count: skiltrakTeamData?.data?.pagination?.totalResult || 0,
            component: SkiltrakSupportWrapper,
        },
    ]

    useEffect(() => {
        setMount(true)
    }, [])

    if (!mount) return null

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
                        </div>
                    </div>
                    <div className="p-0">
                        <ConfigTabs
                            defaultValue={tabs[0].value}
                            tabs={tabs}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </Suspense>
    )
}

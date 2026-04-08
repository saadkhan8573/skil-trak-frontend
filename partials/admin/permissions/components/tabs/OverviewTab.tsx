import { Badge, Button, Card, Typography } from '@components'
import { Select } from '@components/inputs'
import { useNotification } from '@hooks/useNotification'
import {
    Download,
    History,
    LayoutDashboard,
    PieChart,
    Shield,
    Zap,
} from 'lucide-react'
import React from 'react'
import { PermissionAdminProps } from './types'

export const OverviewTab: React.FC<PermissionAdminProps> = (props) => {
    const { notification } = useNotification()
    const { selectedRTO, stats, packageSettings, permissionGroups } = props

    const handleResetDefaults = () => {
        notification.success({
            title: 'Permissions Reset',
            description:
                'All permissions have been reset to organization defaults.',
        })
    }

    const handleExportConfig = () => {
        notification.info({
            title: 'Configuration Exported',
            description:
                'Organization permission configuration has been downloaded.',
        })
    }

    const rtoOptions = [
        { label: 'Todds Training (Main)', value: 'Todds Training' },
        { label: 'Global Education Group', value: 'Global Education' },
        { label: 'Pacific RTO Services', value: 'Pacific RTO' },
        {
            label: 'Melbourne Training Institute',
            value: 'Melbourne Training Institute',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Quick Actions Bar */}
            <Card
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-background/60 border-2 border-border/40 backdrop-blur-md shadow-lg"
                noPadding
            >
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <Typography variant="subtitle" className="font-bold">
                            System Overview
                        </Typography>
                        <p className="text-sm text-muted-foreground">
                            Real-time status of {selectedRTO} permissions
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                    <Button
                        outline
                        variant="primary"
                        onClick={handleExportConfig}
                        className="h-10"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Config
                    </Button>
                    <Button
                        outline
                        variant="error"
                        onClick={handleResetDefaults}
                        className="h-10 text-error"
                    >
                        <History className="h-4 w-4 mr-2" />
                        Reset Defaults
                    </Button>
                </div>
            </Card>

            {/* RTO Selector & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 space-y-2">
                    <Typography
                        variant="label"
                        className="font-semibold text-sm block"
                    >
                        Selected Training Organisation
                    </Typography>
                    <Select
                        name="rto-selector"
                        options={rtoOptions}
                        value={selectedRTO}
                        onlyValue={true}
                        onChange={(val: any) => props.setSelectedRTO(val)}
                        placeholder="Select RTO"
                    />
                </div>
                <div className="md:col-span-3 grid grid-cols-3 gap-3">
                    <Card
                        className="p-4 rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 shadow-md text-center"
                        noPadding
                    >
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                            ACTIVE USERS
                        </p>
                        <p className="text-2xl font-bold text-primary">1,248</p>
                    </Card>
                    <Card
                        className="p-4 rounded-xl border-2 border-accent/20 bg-linear-to-br from-accent/10 to-accent/5 shadow-md text-center"
                        noPadding
                    >
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                            TOTAL ROLES
                        </p>
                        <p className="text-2xl font-bold text-accent">14</p>
                    </Card>
                    <Card
                        className="p-4 rounded-xl border-2 border-secondary/20 bg-linear-to-br from-secondary/10 to-secondary/5 shadow-md text-center"
                        noPadding
                    >
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                            UPTIME
                        </p>
                        <p className="text-2xl font-bold text-secondary">
                            99.9%
                        </p>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Status */}
                <Card
                    className="lg:col-span-2 border-border/60 shadow-xl overflow-hidden group"
                    noPadding
                >
                    <div className="border-b bg-linear-to-r from-primary/10 to-accent/10 p-4 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/20 text-primary shadow-md group-hover:scale-110 transition-transform">
                                    <PieChart className="h-6 w-6" />
                                </div>
                                <div>
                                    <Typography
                                        variant="subtitle"
                                        className="text-xl"
                                    >
                                        Security Health
                                    </Typography>
                                    <p className="text-sm text-muted-foreground">
                                        Permission compliance status
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="primary"
                                className="text-lg px-4 py-2 border-none"
                            >
                                {`${stats.percentage}%`}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <Typography
                                variant="label"
                                className="text-base font-semibold"
                            >
                                Overall Compliance
                            </Typography>
                            <span className="text-sm font-bold text-primary">
                                Excellent
                            </span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/40 shadow-inner">
                            <div
                                className="h-full bg-linear-to-r from-primary to-accent shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000"
                                style={{ width: `${stats.percentage}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {permissionGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="p-3 rounded-lg bg-background/40 border border-border/40 text-center"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {group.label}
                                    </p>
                                    <p className="text-lg font-bold">
                                        {group.count}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Quick Info */}
                <Card className="border-border/60 shadow-xl group" noPadding>
                    <div className="border-b bg-linear-to-r from-accent/10 to-primary/10 p-4 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-accent/20 text-accent shadow-md group-hover:scale-110 transition-transform">
                                    <LayoutDashboard className="h-6 w-6" />
                                </div>
                                <div>
                                    <Typography
                                        variant="subtitle"
                                        className="text-xl"
                                    >
                                        Billing Tier
                                    </Typography>
                                    <p className="text-sm text-muted-foreground">
                                        Current plan status
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="accent"
                                className="text-lg px-4 py-2 border-none"
                            >
                                {packageSettings.pricingTier}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border-l-4 border-l-accent border-border/40 font-bold">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Plan Type
                                    </p>
                                    <p className="text-lg">
                                        {packageSettings.organizationType}
                                    </p>
                                </div>
                                <Zap className="h-6 w-6 text-accent animate-pulse" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40 text-center">
                                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                                        AI CALLS
                                    </p>
                                    <Badge
                                        variant={
                                            packageSettings.aiCallsAddon
                                                ? 'success'
                                                : 'muted'
                                        }
                                        outline={!packageSettings.aiCallsAddon}
                                        className="w-full justify-center"
                                    >
                                        {packageSettings.aiCallsAddon
                                            ? 'Enabled'
                                            : 'Disabled'}
                                    </Badge>
                                </div>
                                <div className="p-4 rounded-xl bg-background/40 border border-border/40 text-center">
                                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                                        SUPPORT
                                    </p>
                                    <Badge
                                        variant={
                                            packageSettings.adminSupportAddon
                                                ? 'accent'
                                                : 'secondary'
                                        }
                                        outline={
                                            !packageSettings.adminSupportAddon
                                        }
                                        className="w-full justify-center"
                                    >
                                        {packageSettings.adminSupportAddon
                                            ? 'Premium'
                                            : 'Standard'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent/20">
                                        <Shield className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            API Access
                                        </p>
                                        <p className="font-bold">
                                            {packageSettings.apiAccess
                                                ? 'Full Access'
                                                : 'Restricted'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

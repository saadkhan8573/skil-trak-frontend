import React from 'react'
import {
    Check,
    CreditCard,
    Globe,
    Headphones,
    Network,
    Package,
    Phone,
    Zap,
    Building2,
} from 'lucide-react'
import { Card, Button, Badge, Typography } from '@components'
import { Switch, Select, TextInput } from '@components/inputs'
import { PermissionAdminProps } from './types'

export const BillingTab: React.FC<PermissionAdminProps> = (props) => {
    const {
        packageSettings,
        setPackageSettings,
        aiCallingEnabled,
        setAiCallingEnabled,
        aiCallingLimit,
        setAiCallingLimit,
        aiCallingRate,
        aiCallingStages,
        setAiCallingStages,
        industryListingEnabled,
        setIndustryListingEnabled,
        industryListingSectors,
        setIndustryListingSectors,
    } = props

    const organizationTypeOptions = [
        { label: 'RTO (Registered Training Organisation)', value: 'RTO' },
        { label: 'University', value: 'University' },
        { label: 'School', value: 'School' },
        { label: 'Corporate Training', value: 'Corporate' },
    ]

    const pricingTierOptions = [
        { label: 'Starter - $99/month', value: 'Starter' },
        { label: 'Professional - $299/month', value: 'Professional' },
        { label: 'Enterprise - $699/month', value: 'Enterprise' },
        { label: 'Custom - Contact Sales', value: 'Custom' },
    ]

    return (
        <div className="space-y-6">
            {/* Package Settings */}
            <Card className="border-border/60 shadow-xl" noPadding>
                <div className="p-4 border-b bg-linear-to-r from-accent/10 to-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <Package className="h-5 w-5 text-accent" />
                        </div>
                        <Typography variant="subtitle" className="text-lg">
                            Package Settings
                        </Typography>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    {/* Organization Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Typography
                                variant="label"
                                className="font-semibold text-base block"
                            >
                                Organization Type
                            </Typography>
                            <Select
                                name="org-type"
                                options={organizationTypeOptions}
                                value={packageSettings.organizationType}
                                onlyValue
                                onChange={(val: string) =>
                                    setPackageSettings({
                                        ...packageSettings,
                                        organizationType: val,
                                    })
                                }
                                placeholder="Select Organization Type"
                            />
                        </div>

                        {/* Pricing Tier */}
                        <div className="space-y-2">
                            <Typography
                                variant="label"
                                className="font-semibold text-base block"
                            >
                                Pricing Tier
                            </Typography>
                            <Select
                                name="pricing-tier"
                                options={pricingTierOptions}
                                value={packageSettings.pricingTier}
                                onlyValue
                                onChange={(val: string) =>
                                    setPackageSettings({
                                        ...packageSettings,
                                        pricingTier: val,
                                    })
                                }
                                placeholder="Select Pricing Tier"
                            />
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-4">
                        <Typography
                            variant="label"
                            className="font-semibold text-lg block"
                        >
                            Add-ons & Premium Features
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    id: 'ai-calls',
                                    title: 'AI Calls',
                                    desc: 'Automated calling for engagement',
                                    icon: <Phone />,
                                    color: 'primary',
                                    checked: packageSettings.aiCallsAddon,
                                    onChange: (checked: boolean) =>
                                        setPackageSettings({
                                            ...packageSettings,
                                            aiCallsAddon: checked,
                                        }),
                                },
                                {
                                    id: 'admin-support',
                                    title: 'Admin Support',
                                    desc: 'Dedicated student support team',
                                    icon: <Headphones />,
                                    color: 'accent',
                                    checked: packageSettings.adminSupportAddon,
                                    onChange: (checked: boolean) =>
                                        setPackageSettings({
                                            ...packageSettings,
                                            adminSupportAddon: checked,
                                        }),
                                },
                                {
                                    id: 'custom-branding',
                                    title: 'Custom Branding',
                                    desc: 'Your logo and colors',
                                    icon: <Globe />,
                                    color: 'secondary',
                                    checked: packageSettings.customBranding,
                                    onChange: (checked: boolean) =>
                                        setPackageSettings({
                                            ...packageSettings,
                                            customBranding: checked,
                                        }),
                                },
                                {
                                    id: 'api-access',
                                    title: 'API Access',
                                    desc: 'Full API integration',
                                    icon: <Zap />,
                                    color: 'success',
                                    checked: packageSettings.apiAccess,
                                    onChange: (checked: boolean) =>
                                        setPackageSettings({
                                            ...packageSettings,
                                            apiAccess: checked,
                                        }),
                                },
                            ].map((addon) => (
                                <div
                                    key={addon.id}
                                    className={`p-4 rounded-xl border-2 bg-linear-to-br from-${addon.color === 'primary' ? 'orange' : addon.color === 'success' ? 'green' : 'blue'}-500/5 to-transparent border-gray-200 hover:border-gray-300 transition-all`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg bg-${addon.color === 'primary' ? 'orange' : addon.color === 'success' ? 'green' : 'blue'}-100`}
                                            >
                                                {React.cloneElement(addon.icon as React.ReactElement<any>, { className: `h-5 w-5 text-foreground` })}
                                            </div>
                                            <div>
                                                <p className="font-bold">
                                                    {addon.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {addon.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            id={addon.id}
                                            name={addon.id}
                                            isChecked={addon.checked}
                                            onChange={(e: any) =>
                                                addon.onChange(e.target.checked)
                                            }
                                        />
                                    </div>
                                    {addon.checked && (
                                        <Badge
                                            variant="success"
                                            outline
                                            className="text-[10px]"
                                        >
                                            <Check className="h-3 w-3 mr-1" />{' '}
                                            Active
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Network Credits */}
                    <div className="p-5 rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/5 to-accent/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-lg bg-primary/20">
                                <Network className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <Typography
                                    variant="subtitle"
                                    className="font-bold text-lg"
                                >
                                    Network Credits Top-up
                                </Typography>
                                <p className="text-sm text-muted-foreground">
                                    Additional credits for industry network
                                    expansion
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TextInput
                                name="network-credits"
                                type="number"
                                value={packageSettings.networkCreditsTopup.toString()}
                                onChange={(e: any) =>
                                    setPackageSettings({
                                        ...packageSettings,
                                        networkCreditsTopup:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                className="max-w-[200px] h-11 border-2 border-border/40"
                                placeholder="Enter credits"
                            />
                            <span className="text-sm text-muted-foreground font-medium">
                                credits
                            </span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <Button
                            variant="primary"
                            outline
                            className="h-12 w-full gap-2"
                        >
                            <Network className="h-4 w-4" />
                            Manage Network Packs
                        </Button>
                        <Button
                            variant="primary"
                            outline
                            className="h-12 w-full gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            View Billing History
                        </Button>
                    </div>
                </div>
            </Card>

            {/* AI Calling System */}
            <Card className="border-border/60 shadow-xl" noPadding>
                <div className="p-4 border-b bg-linear-to-r from-accent/10 to-secondary/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/10">
                                <Phone className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <Typography
                                    variant="subtitle"
                                    className="text-lg"
                                >
                                    AI Calling System
                                </Typography>
                                <p className="text-sm text-muted-foreground">
                                    Automated calling system - ${aiCallingRate}{' '}
                                    AUD / hour
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="ai-calling-toggle"
                            name="ai-calling-toggle"
                            isChecked={aiCallingEnabled}
                            onChange={(e: any) =>
                                setAiCallingEnabled(e.target.checked)
                            }
                        />
                    </div>
                </div>
                {aiCallingEnabled && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Typography
                                    variant="label"
                                    htmlFor="ai-limit"
                                    className="font-semibold text-base block"
                                >
                                    Monthly Hour Limit
                                </Typography>
                                <div className="flex items-center gap-3">
                                    <TextInput
                                        id="ai-limit"
                                        name="ai-limit"
                                        type="number"
                                        value={aiCallingLimit.toString()}
                                        onChange={(e: any) =>
                                            setAiCallingLimit(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className="h-11 border-2 border-border/40"
                                    />
                                    <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                                        hours/month
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-linear-to-br from-accent/10 to-accent/5 border-2 border-accent/20 text-center">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Estimated Monthly Cost
                                </p>
                                <p className="text-3xl font-bold text-accent">
                                    ${aiCallingLimit * aiCallingRate} AUD
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Typography
                                variant="label"
                                className="font-semibold text-base block"
                            >
                                Calling Stages
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {aiCallingStages.map((stage) => (
                                    <div
                                        key={stage.id}
                                        className="flex items-center justify-between p-3 rounded-lg border-2 border-border/40 hover:border-accent/40 transition-all"
                                    >
                                        <Typography
                                            variant="label"
                                            htmlFor={`stage-${stage.id}`}
                                            className="cursor-pointer font-medium block"
                                        >
                                            {stage.label}
                                        </Typography>
                                        <Switch
                                            id={`stage-${stage.id}`}
                                            name={`stage-${stage.id}`}
                                            isChecked={stage.enabled}
                                            onChange={(e: any) =>
                                                setAiCallingStages(
                                                    aiCallingStages.map((s) =>
                                                        s.id === stage.id
                                                            ? {
                                                                  ...s,
                                                                  enabled:
                                                                      e.target
                                                                          .checked,
                                                              }
                                                            : s
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Industry Listing */}
            <Card className="border-border/60 shadow-xl" noPadding>
                <div className="p-4 border-b bg-linear-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <Typography
                                    variant="subtitle"
                                    className="text-lg"
                                >
                                    Industry Listing per Sector
                                </Typography>
                                <p className="text-sm text-muted-foreground">
                                    Feature industries in specific sectors
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="industry-listing-toggle"
                            name="industry-listing-toggle"
                            isChecked={industryListingEnabled}
                            onChange={(e: any) =>
                                setIndustryListingEnabled(e.target.checked)
                            }
                        />
                    </div>
                </div>
                {industryListingEnabled && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {industryListingSectors.map((sector) => (
                                <div
                                    key={sector.sector}
                                    className={`p-4 rounded-xl border-2 transition-all ${sector.enabled ? 'bg-linear-to-br from-primary/10 to-primary/5 border-primary/30' : 'bg-muted/30 border-border/40'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold">
                                            {sector.sector}
                                        </p>
                                        <Switch
                                            id={`sector-${sector.sector}`}
                                            name={`sector-${sector.sector}`}
                                            isChecked={sector.enabled}
                                            onChange={(e: any) =>
                                                setIndustryListingSectors(
                                                    industryListingSectors.map(
                                                        (s) =>
                                                            s.sector ===
                                                            sector.sector
                                                                ? {
                                                                      ...s,
                                                                      enabled:
                                                                          e
                                                                              .target
                                                                              .checked,
                                                                  }
                                                                : s
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                    {sector.enabled && (
                                        <p className="text-sm text-muted-foreground">
                                            ${sector.costPerMonth}/month
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-green-500/10 to-green-500/5 border-2 border-green-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">
                                        Total Monthly Cost
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {
                                            industryListingSectors.filter(
                                                (s) => s.enabled
                                            ).length
                                        }{' '}
                                        sectors enabled
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-green-600">
                                    $
                                    {industryListingSectors
                                        .filter((s) => s.enabled)
                                        .reduce(
                                            (acc, s) => acc + s.costPerMonth,
                                            0
                                        )}{' '}
                                    AUD
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}

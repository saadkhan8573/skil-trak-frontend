import React from 'react'
import {
    Activity,
    AlertCircle,
    Check,
    CreditCard,
    Globe,
    GraduationCap,
    Headphones,
    Info,
    Lock,
    MapPin,
    Network,
    Sparkles,
    TrendingUp,
    Unlock,
    Users,
    X,
    Zap,
    Building2,
    Shield,
} from 'lucide-react'
import { Card, Button, Badge, Typography } from '@components'
import { Switch } from '@components/inputs'
import { PermissionAdminProps, FeatureUnlock } from './types'

export const FeaturesTab: React.FC<PermissionAdminProps> = (props) => {
    const {
        featureUnlocks,
        sharingPartnersEnabled,
        setSharingPartnersEnabled,
        autoShareNewPartners,
        setAutoShareNewPartners,
        sharePlacementData,
        setSharePlacementData,
        shareStudentData,
        setShareStudentData,
    } = props

    const renderFeatureUnlock = (unlock: FeatureUnlock) => {
        const progress =
            (unlock.currentPartners / unlock.requiredPartners) * 100
        const progressClamped = Math.min(progress, 100)

        return (
            <div
                key={unlock.id}
                className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    unlock.unlocked
                        ? 'bg-linear-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30'
                        : 'bg-linear-to-br from-muted/50 to-muted/30 border-border/60'
                }`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div
                            className={`p-2.5 rounded-lg ${
                                unlock.unlocked ? 'bg-green-100' : 'bg-muted'
                            }`}
                        >
                            {unlock.unlocked ? (
                                <Unlock className="h-5 w-5 text-green-600" />
                            ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <Typography
                                variant="subtitle"
                                className="font-bold text-lg mb-1"
                            >
                                {unlock.feature}
                            </Typography>
                            <p className="text-sm text-muted-foreground mb-2">
                                {unlock.description}
                            </p>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        unlock.unlocked ? 'success' : 'muted'
                                    }
                                    outline={!unlock.unlocked}
                                    className="text-xs"
                                >
                                    {unlock.unlocked ? (
                                        <div className="flex items-center text-green-600">
                                            <Check className="h-3 w-3 mr-1" />{' '}
                                            Unlocked
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Lock className="h-3 w-3 mr-1" />{' '}
                                            Locked
                                        </div>
                                    )}
                                </Badge>
                                {!unlock.unlocked && (
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {unlock.requiredPartners -
                                            unlock.currentPartners}{' '}
                                        more partners needed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">
                            Industry Partners: {unlock.currentPartners} /{' '}
                            {unlock.requiredPartners}
                        </span>
                        <span className="font-bold text-lg">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-3 bg-border/30 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${
                                unlock.unlocked
                                    ? 'bg-linear-to-r from-green-500 to-green-400'
                                    : 'bg-linear-to-r from-primary to-primary/80'
                            }`}
                            style={{ width: `${progressClamped}%` }}
                        />
                    </div>
                    {unlock.benefit && (
                        <div
                            className={`flex items-start gap-2 p-3 rounded-lg ${
                                unlock.unlocked
                                    ? 'bg-green-100'
                                    : 'bg-accent/10'
                            }`}
                        >
                            <Info
                                className={`h-4 w-4 mt-0.5 ${
                                    unlock.unlocked
                                        ? 'text-green-600'
                                        : 'text-accent'
                                }`}
                            />
                            <p className="text-xs font-medium">
                                {unlock.benefit}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Partner Sharing Settings */}
            <Card
                className="border-border/60 shadow-xl bg-linear-to-br from-primary/5 via-accent/5 to-background"
                noPadding
            >
                <div className="p-4 border-b bg-linear-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Network className="h-6 w-6 text-primary" />
                                <Typography
                                    variant="subtitle"
                                    className="text-lg"
                                >
                                    Partner Sharing Settings
                                </Typography>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Control how your industry partners are shared
                                with the SkilTrak global network
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    sharingPartnersEnabled ? 'primary' : 'muted'
                                }
                                outline={!sharingPartnersEnabled}
                                className="text-sm px-3 py-1"
                            >
                                {sharingPartnersEnabled ? (
                                    <div className="flex items-center text-primary-500">
                                        <Check className="h-3 w-3 mr-1" />{' '}
                                        Sharing Enabled
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <X className="h-3 w-3 mr-1" /> Sharing
                                        Disabled
                                    </div>
                                )}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {/* Master Toggle */}
                    <div className="mb-6 p-5 rounded-xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-accent/5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/20">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <Typography
                                        variant="subtitle"
                                        className="font-bold text-lg mb-2"
                                    >
                                        Enable Partner Sharing
                                    </Typography>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                        When enabled, your industry partners
                                        will be added to the SkilTrak global
                                        network, unlocking premium features
                                        based on the number of partners you
                                        share.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <span className="text-muted-foreground">
                                                Current:{' '}
                                                <span className="font-bold text-foreground">
                                                    12 partners shared
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Sparkles className="h-4 w-4 text-accent" />
                                            <span className="text-muted-foreground">
                                                Unlocked:{' '}
                                                <span className="font-bold text-foreground">
                                                    2 features
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Switch
                                name="sharing-enabled"
                                customStyleClass="profileSwitch"
                                isChecked={sharingPartnersEnabled}
                                onChange={(e: any) =>
                                    setSharingPartnersEnabled(e.target.checked)
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Sharing Options - Only show when enabled */}
                    {sharingPartnersEnabled && (
                        <div className="space-y-4">
                            <Typography
                                variant="label"
                                className="font-semibold text-base"
                            >
                                Sharing Options
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Auto Share New Partners */}
                                <div className="p-4 rounded-xl border-2 bg-background/60 border-border/60 hover:border-primary/40 transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div
                                                className={`p-2 rounded-lg ${autoShareNewPartners ? 'bg-green-100' : 'bg-muted'}`}
                                            >
                                                <Zap
                                                    className={`h-4 w-4 ${autoShareNewPartners ? 'text-green-600' : 'text-muted-foreground'}`}
                                                />
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="label"
                                                    htmlFor="auto-share"
                                                    className="cursor-pointer font-semibold block mb-1"
                                                >
                                                    Auto-Share New Partners
                                                </Typography>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Automatically share newly
                                                    added industry partners
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            id="auto-share"
                                            name="auto-share"
                                            customStyleClass="profileSwitch"
                                            isChecked={autoShareNewPartners}
                                            onChange={(e: any) =>
                                                setAutoShareNewPartners(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Share Placement Data */}
                                <div className="p-4 rounded-xl border-2 bg-background/60 border-border/60 hover:border-accent/40 transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div
                                                className={`p-2 rounded-lg ${sharePlacementData ? 'bg-accent/20' : 'bg-muted'}`}
                                            >
                                                <MapPin
                                                    className={`h-4 w-4 ${sharePlacementData ? 'text-accent' : 'text-muted-foreground'}`}
                                                />
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="label"
                                                    htmlFor="share-placement"
                                                    className="cursor-pointer font-semibold block mb-1"
                                                >
                                                    Share Placement Data
                                                </Typography>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Share anonymized placement
                                                    success rates
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            id="share-placement"
                                            name="share-placement"
                                            customStyleClass="profileSwitch"
                                            isChecked={sharePlacementData}
                                            onChange={(e: any) =>
                                                setSharePlacementData(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Share Student Data */}
                                <div className="p-4 rounded-xl border-2 bg-background/60 border-border/60 hover:border-red-400/40 transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div
                                                className={`p-2 rounded-lg ${shareStudentData ? 'bg-red-100' : 'bg-muted'}`}
                                            >
                                                <Users
                                                    className={`h-4 w-4 ${shareStudentData ? 'text-red-500' : 'text-muted-foreground'}`}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Typography
                                                        variant="label"
                                                        htmlFor="share-student"
                                                        className="cursor-pointer font-semibold"
                                                    >
                                                        Share Student Data
                                                    </Typography>
                                                    <Badge
                                                        variant="error"
                                                        outline
                                                        className="text-[10px] text-red-500"
                                                    >
                                                        Sensitive
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Share anonymized student
                                                    performance metrics
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            id="share-student"
                                            name="share-student"
                                            customStyleClass="profileSwitch"
                                            isChecked={shareStudentData}
                                            onChange={(e: any) =>
                                                setShareStudentData(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Privacy Protection - Always On */}
                                <div className="p-4 rounded-xl border-2 bg-linear-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="p-2 rounded-lg bg-green-100">
                                                <Shield className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Typography
                                                        variant="label"
                                                        className="font-semibold block"
                                                    >
                                                        Privacy Protection
                                                    </Typography>
                                                    <Badge
                                                        variant="success"
                                                        outline
                                                        className="text-[10px] text-green-600"
                                                    >
                                                        Always On
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    All shared data is
                                                    anonymized and encrypted.
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            name="privacy-protected"
                                            customStyleClass="profileSwitch"
                                            isChecked={true}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Disabled State Message */}
                    {!sharingPartnersEnabled && (
                        <div className="p-6 rounded-xl bg-muted/50 border-2 border-border/60 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <h3 className="font-bold text-lg mb-2">
                                Partner Sharing Disabled
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Enable sharing above to unlock premium features
                                and industry network rewards.
                            </p>
                            <Badge variant="muted" outline className="text-xs">
                                <X className="h-3 w-3 mr-1" /> Feature Unlocks
                                Unavailable
                            </Badge>
                        </div>
                    )}
                </div>
            </Card>

            {/* Feature Unlocks */}
            <Card
                className={`border-border/60 shadow-xl ${!sharingPartnersEnabled ? 'opacity-60' : ''}`}
                noPadding
            >
                <div className="p-4 border-b bg-linear-to-r from-accent/10 to-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-6 w-6 text-accent" />
                                <Typography
                                    variant="subtitle"
                                    className="text-lg"
                                >
                                    Feature Unlocks
                                </Typography>
                                {!sharingPartnersEnabled && (
                                    <Badge
                                        variant="secondary"
                                        outline
                                        className="text-xs ml-2"
                                    >
                                        <Lock className="h-3 w-3 mr-1" />{' '}
                                        Disabled
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Unlock premium features by sharing industry
                                partners with the SkilTrak network.
                            </p>
                        </div>
                        {!sharingPartnersEnabled && (
                            <Button
                                variant="primary"
                                outline
                                onClick={() => setSharingPartnersEnabled(true)}
                                className="gap-2"
                            >
                                <Unlock className="h-4 w-4" />
                                Enable Sharing
                            </Button>
                        )}
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    {sharingPartnersEnabled ? (
                        featureUnlocks.map((unlock) =>
                            renderFeatureUnlock(unlock)
                        )
                    ) : (
                        <div className="p-12 rounded-xl bg-muted/30 border-2 border-dashed border-border/60 text-center">
                            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="font-bold text-xl mb-2">
                                Feature Unlocks Locked
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Enable Partner Sharing to start unlocking
                                features like AI Search, Talent Pool, and more.
                            </p>
                            <Button
                                onClick={() => setSharingPartnersEnabled(true)}
                                variant="primary"
                                className="shadow-lg"
                            >
                                <Unlock className="h-4 w-4 mr-2" />
                                Enable Partner Sharing
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Departments */}
            <Card
                className="border-border/60 shadow-xl bg-linear-to-br from-primary/5 to-accent/5"
                noPadding
            >
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Typography variant="subtitle" className="text-lg">
                                Departments
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Support Tags (Optional) - Categorize
                                communications by department
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                            {
                                label: 'Student Services',
                                Icon: Users,
                                color: 'primary',
                            },
                            {
                                label: 'Academics',
                                Icon: GraduationCap,
                                color: 'accent',
                            },
                            {
                                label: 'Placements',
                                Icon: Building2,
                                color: 'secondary',
                            },
                            {
                                label: 'IT Support',
                                Icon: Headphones,
                                color: 'success',
                            },
                            {
                                label: 'Finance',
                                Icon: CreditCard,
                                color: 'error',
                            },
                        ].map((dept) => (
                            <Button
                                key={dept.label}
                                variant="dark"
                                outline
                                Icon={() => <dept.Icon className="h-5 w-5" />}
                                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-all group"
                            >
                                <span className="font-semibold text-[10px]">
                                    {dept.label}
                                </span>
                                <Badge variant="muted" className="text-[10px]">
                                    Tag
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}

import { Badge, Button, Card, Typography } from '@components'
import { Switch, TextInput } from '@components/inputs'
import {
    AlertCircle,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Filter,
    Mail,
    Settings,
    ToggleLeft,
    Users,
} from 'lucide-react'
import React from 'react'
import { PermissionAdminProps } from './types'

export const PermissionsTab: React.FC<PermissionAdminProps> = (props) => {
    const {
        searchQuery,
        setSearchQuery,
        showDisabledOnly,
        setShowDisabledOnly,
        expandedSections,
        toggleSection,
        renderPermissionCard,
        dashboardPermissions,
        setDashboardPermissions,
        studentsPermissions,
        setStudentsPermissions,
        communicationsPermissions,
        setCommPermissions,
        managePermissions,
        setManagePermissions,
        moreToolsPermissions,
        setMoreToolsPermissions,
        otherPermissions,
        toggleOtherPermission,
    } = props

    const isExpanded = (section: string) =>
        expandedSections.includes(section) || expandedSections.includes('all')

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Search and Filter Bar */}
            <Card className="border-border/60 shadow-lg" noPadding>
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <TextInput
                                name="search-permissions"
                                placeholder="Search permissions..."
                                value={searchQuery}
                                onChange={(e: any) =>
                                    setSearchQuery(e.target.value)
                                }
                                className="h-11"
                            />
                        </div>
                        <Button
                            variant={showDisabledOnly ? 'primary' : 'dark'}
                            outline={!showDisabledOnly}
                            onClick={() =>
                                setShowDisabledOnly(!showDisabledOnly)
                            }
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {showDisabledOnly ? 'Showing Disabled' : 'Show All'}
                        </Button>
                        <Button
                            variant="primary"
                            outline
                            onClick={() => toggleSection('all')}
                            className="gap-2"
                        >
                            {expandedSections.includes('all') ? (
                                <>
                                    <EyeOff className="h-4 w-4" /> Collapse All
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4" /> Expand All
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Dashboard Permissions */}
            <Card
                className="border-border/60 shadow-xl overflow-hidden"
                noPadding
            >
                <div
                    className="p-4 border-b bg-linear-to-r from-red-500/5 to-accent/5 cursor-pointer hover:from-red-500/10 hover:to-accent/10 transition-all flex items-center justify-between"
                    onClick={() => toggleSection('dashboard')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                Dashboard
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Critical actions and urgent tasks
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="muted" outline>
                            {`${dashboardPermissions.filter((p: any) => p.enabled).length}/${dashboardPermissions.length}`}
                        </Badge>
                        {isExpanded('dashboard') ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
                {isExpanded('dashboard') && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dashboardPermissions.map((p: any) =>
                            renderPermissionCard(
                                p,
                                dashboardPermissions,
                                setDashboardPermissions
                            )
                        )}
                    </div>
                )}
            </Card>

            {/* Students & Placements */}
            <Card
                className="border-border/60 shadow-xl overflow-hidden"
                noPadding
            >
                <div
                    className="p-4 border-b bg-linear-to-r from-primary/5 to-secondary/5 cursor-pointer hover:from-primary/10 hover:to-secondary/10 transition-all flex items-center justify-between"
                    onClick={() => toggleSection('students')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                Students & Placements
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Student management and placement coordination
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="muted" outline>
                            {`${studentsPermissions.filter((p: any) => p.enabled).length}/${studentsPermissions.length}`}
                        </Badge>
                        {isExpanded('students') ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
                {isExpanded('students') && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentsPermissions.map((p: any) =>
                            renderPermissionCard(
                                p,
                                studentsPermissions,
                                setStudentsPermissions
                            )
                        )}
                    </div>
                )}
            </Card>

            {/* Communications */}
            <Card
                className="border-border/60 shadow-xl overflow-hidden"
                noPadding
            >
                <div
                    className="p-4 border-b bg-linear-to-r from-accent/5 to-secondary/5 cursor-pointer hover:from-accent/10 hover:to-secondary/10 transition-all flex items-center justify-between"
                    onClick={() => toggleSection('communications')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <Mail className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                Communications
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Email, SMS, notifications, and messaging
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="muted" outline>
                            {`${communicationsPermissions.filter((p: any) => p.enabled).length}/${communicationsPermissions.length}`}
                        </Badge>
                        {isExpanded('communications') ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
                {isExpanded('communications') && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {communicationsPermissions.map((p: any) =>
                            renderPermissionCard(
                                p,
                                communicationsPermissions,
                                setCommPermissions
                            )
                        )}
                    </div>
                )}
            </Card>

            {/* Manage */}
            <Card
                className="border-border/60 shadow-xl overflow-hidden"
                noPadding
            >
                <div
                    className="p-4 border-b bg-linear-to-r from-secondary/5 to-primary/5 cursor-pointer hover:from-secondary/10 hover:to-primary/10 transition-all flex items-center justify-between"
                    onClick={() => toggleSection('manage')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                Manage
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Core management functions and configuration
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="muted" outline>
                            {`${managePermissions.filter((p: any) => p.enabled).length}/${managePermissions.length}`}
                        </Badge>
                        {isExpanded('manage') ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
                {isExpanded('manage') && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {managePermissions.map((p: any) =>
                            renderPermissionCard(
                                p,
                                managePermissions,
                                setManagePermissions
                            )
                        )}
                    </div>
                )}
            </Card>

            {/* More Tools */}
            <Card
                className="border-border/60 shadow-xl overflow-hidden"
                noPadding
            >
                <div
                    className="p-4 border-b bg-linear-to-r from-primary/5 to-accent/5 cursor-pointer hover:from-primary/10 hover:to-accent/10 transition-all flex items-center justify-between"
                    onClick={() => toggleSection('moreTools')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                More Tools
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Additional utilities and resources
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="muted" outline>
                            {`${moreToolsPermissions.filter((p: any) => p.enabled).length}/${moreToolsPermissions.length}`}
                        </Badge>
                        {isExpanded('moreTools') ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
                {isExpanded('moreTools') && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {moreToolsPermissions.map((p: any) =>
                            renderPermissionCard(
                                p,
                                moreToolsPermissions,
                                setMoreToolsPermissions
                            )
                        )}
                    </div>
                )}
            </Card>

            {/* Other Permissions */}
            <Card className="border-border/60 shadow-xl" noPadding>
                <div className="border-b bg-linear-to-r from-accent/5 to-secondary/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <ToggleLeft className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                Other Permissions
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Granular controls for specific features and
                                capabilities
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {otherPermissions.map((p: any) => (
                            <div
                                key={p.id}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${p.enabled ? 'border-green-500/20 bg-green-500/5 hover:border-green-500/40' : 'border-border/40 hover:border-accent/40'}`}
                            >
                                <div>
                                    <Typography
                                        variant="label"
                                        htmlFor={p.id}
                                        className="cursor-pointer font-medium block"
                                    >
                                        {p.label}
                                    </Typography>
                                    {p.description && (
                                        <p className="text-xs text-muted-foreground">
                                            {p.description}
                                        </p>
                                    )}
                                </div>
                                <Switch
                                    name={p.id}
                                    customStyleClass="profileSwitch"
                                    id={p.id}
                                    isChecked={p.enabled}
                                    onChange={() => toggleOtherPermission(p.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}

import { Card } from '@components'
import { Alert, AlertDescription } from '@components/ui/alert'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import {
    Briefcase,
    CheckCircle,
    CheckCircle2,
    Crown,
    Eye,
    GraduationCap,
    Info,
    LifeBuoy,
    Shield,
    Sparkles,
    Tag,
    UserPlus,
    Zap,
} from 'lucide-react'
import React from 'react'

export const AVAILABLE_TEAMS = [
    'Management',
    'Operations',
    'Partnerships',
    'Assessment',
    'Student Services',
    'Compliance',
    'Training',
    'Analytics',
]

export const TEAM_TAGS = [
    'quality assurance',
    'student services',
    'admin',
    'sourcing team',
    'rto team',
]

export const TeamSetupGuideTab = ({ setActiveTab, setAddMemberOpen }: any) => {
    return (
        <>
            <Card className="border-primaryNew/20 shadow-premium-lg bg-linear-to-br from-primaryNew/5 via-background to-secondaryNew/5 overflow-hidden">
                <div className="border-b border-primaryNew/10 relative text-center pb-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primaryNew to-secondaryNew flex items-center justify-center shadow-premium mt-2">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold">
                            Get Started in 2 Easy Steps
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-2xl">
                            Set up your RTO team in minutes. Just add members,
                            assign roles, and you're ready to go!
                        </p>
                    </div>
                </div>

                <div className="p-4 relative space-y-4">
                    {/* Step 1 - Simplified */}

                    {/* Step 2 - Simplified */}
                    <Card className="border-secondaryNew/30 bg-linear-to-br from-secondaryNew/5 to-background hover:shadow-premium transition-all">
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primaryNew to-yellow-400 flex items-center justify-center shadow-premium shrink-0">
                                    <span className="text-white text-lg">
                                        1
                                    </span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">
                                            Choose Access Levels & Departments
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Select what each person can do and
                                            which parts of the system they can
                                            access.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Access Levels */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-secondaryNew" />
                                                Access Levels (Roles)
                                            </h4>

                                            <div className="space-y-2">
                                                <div className="p-3 rounded-lg bg-card border border-destructive/20">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Crown className="h-4 w-4 text-destructive" />
                                                        <span className="font-semibold text-sm">
                                                            RTO-Admin
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Full access to
                                                        everything
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded-lg bg-card border border-primaryNew/20">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Shield className="h-4 w-4 text-primaryNew" />
                                                        <span className="font-semibold text-sm">
                                                            Coordinator
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Manage students &
                                                        placements
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded-lg bg-card border border-secondaryNew/20">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <GraduationCap className="h-4 w-4 text-secondaryNew" />
                                                        <span className="font-semibold text-sm">
                                                            Assessor
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Assessment tasks only
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded-lg bg-card border border-border">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-semibold text-sm">
                                                            Viewer
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Read-only access
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded-lg bg-card border border-accent/20">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <LifeBuoy className="h-4 w-4 text-accent" />
                                                        <span className="font-semibold text-sm">
                                                            Sourcing
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Sourcing tasks only
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Departments */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-secondaryNew" />
                                                Available Departments
                                            </h4>

                                            <Alert className="border-secondaryNew/40 bg-secondaryNew/5">
                                                <Info className="h-4 w-4 text-secondaryNew" />
                                                <AlertDescription className="ml-2 text-sm">
                                                    Departments control which
                                                    sections of the portal a
                                                    user can see. Choose wisely!
                                                </AlertDescription>
                                            </Alert>

                                            <div className="grid grid-cols-2 gap-2">
                                                {AVAILABLE_TEAMS.slice(
                                                    0,
                                                    8
                                                ).map((team: any) => (
                                                    <div
                                                        key={team}
                                                        className="p-2 rounded-lg bg-muted/50 border border-border text-xs flex items-center gap-2"
                                                    >
                                                        <Briefcase className="h-3 w-3 text-secondaryNew" />
                                                        <span>{team}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Step 3 - Simplified */}
                    <Card className="border-accent/30 bg-linear-to-br from-accent/5 to-background hover:shadow-premium transition-all">
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-yellow-400 flex items-center justify-center shadow-premium shrink-0">
                                    <span className="text-white text-lg">
                                        2
                                    </span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">
                                            Add Support Tags (Optional)
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Tag team members for automatic
                                            ticket routing and support task
                                            distribution.
                                        </p>
                                    </div>

                                    <Alert className="border-accent/40 bg-accent/5">
                                        <Tag className="h-4 w-4 text-accent" />
                                        <AlertDescription className="ml-2 text-sm">
                                            <strong>
                                                Optional but powerful:
                                            </strong>{' '}
                                            Tags automatically route support
                                            tickets to the right team members.
                                            Skip this if you don't need
                                            automated ticket assignment.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold">
                                                Available Tags
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {TEAM_TAGS.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="outline"
                                                        className="bg-muted"
                                                    >
                                                        <Tag className="h-3 w-3 mr-1" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                            <h4 className="font-semibold mb-2 text-sm">
                                                How Tags Work
                                            </h4>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />
                                                    Support tickets auto-assign
                                                    to tagged members
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />
                                                    Work is distributed equally
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />
                                                    Leave empty if not needed
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Summary */}
                    <Card className="border-success/30 bg-linear-to-br from-success/10 via-success/5 to-background shadow-premium-lg">
                        <div className="p-6">
                            <div className="text-center space-y-4">
                                <div className="h-14 w-14 rounded-xl bg-linear-to-br from-success to-emerald-500 flex items-center justify-center shadow-premium mx-auto">
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-1">
                                        That's It! You're Ready to Go
                                    </h3>
                                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                                        Your team is set up and ready to start
                                        managing students and placements.
                                        {/* Add
                                        your first member now to get started. */}
                                    </p>
                                </div>

                                {/* <div className="flex flex-wrap justify-center gap-3">
                                    <Button
                                        onClick={() => {
                                            // setActiveTab('members')
                                            setAddMemberOpen(true)
                                        }}
                                        className="gap-2 bg-linear-to-r from-primaryNew to-secondaryNew"
                                        size="lg"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                        Add Your First Member
                                    </Button>
                                    <Button
                                        variant="outline"
                                        // onClick={() => setActiveTab('members')}
                                        size="lg"
                                    >
                                        View All Members
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
        </>
    )
}

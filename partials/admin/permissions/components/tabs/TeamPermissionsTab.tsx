import React from 'react'
import { Check, Info, Upload, UserCog, Users } from 'lucide-react'
import { Card, Button, Badge, Typography } from '@components'
import { Select } from '@components/inputs'
import { PermissionAdminProps } from './types'

export const TeamPermissionsTab: React.FC<PermissionAdminProps> = (props) => {
    const teamMembers = [
        { label: 'Sarah Chen (Coordinator)', value: 'sarah-chen' },
        { label: 'Michael Ross (Assessor)', value: 'michael-ross' },
        { label: 'Emma Wilson (Admin)', value: 'emma-wilson' },
        { label: 'James Taylor (QA)', value: 'james-taylor' },
        { label: 'Olivia Martin (Sourcing)', value: 'olivia-martin' },
    ]

    const accessLevels = [
        { label: 'Full Access - Can make changes', value: 'full-access' },
        { label: 'View Only - Read-only access', value: 'view-only' },
    ]

    return (
        <div className="space-y-6">
            {/* Team Member Selector */}
            <Card
                className="border-border/60 shadow-xl bg-linear-to-br from-primary/5 to-accent/5"
                noPadding
            >
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <UserCog className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <Typography
                                    variant="subtitle"
                                    className="text-lg"
                                >
                                    Team Member Permissions
                                </Typography>
                                <p className="text-sm text-muted-foreground">
                                    Set granular permissions for each team
                                    member based on their role
                                </p>
                            </div>
                        </div>
                        <Badge variant="primary" outline className="text-sm">
                            12 Team Members
                        </Badge>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Typography
                                variant="label"
                                className="font-semibold text-base block"
                            >
                                Select Team Member
                            </Typography>
                            <Select
                                name="team-member"
                                options={teamMembers}
                                value="sarah-chen"
                                onlyValue
                                onChange={() => {}}
                                placeholder="Select Team Member"
                            />
                        </div>
                        <div className="space-y-2">
                            <Typography
                                variant="label"
                                className="font-semibold text-base block"
                            >
                                Access Level
                            </Typography>
                            <Select
                                name="access-level"
                                options={accessLevels}
                                value="full-access"
                                onlyValue
                                onChange={() => {}}
                                placeholder="Select Access Level"
                            />
                        </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <div className="text-sm flex items-start gap-2">
                            <Info className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                            <span>
                                <strong>Sarah Chen (Coordinator)</strong> - Full
                                Access enabled. Permissions cascade from RTO
                                settings. Members only see buttons for enabled
                                permissions.
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Student Assignment */}
            <Card
                className="border-border/60 shadow-xl bg-linear-to-br from-primary/5 to-secondary/5"
                noPadding
            >
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Typography variant="subtitle" className="text-lg">
                                Student Assignment
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Assign students to team members for personalized
                                coordination
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Button variant="primary" outline className="gap-2">
                                <Users className="h-4 w-4" />
                                Assign Single Student
                            </Button>
                            <Button variant="primary" outline className="gap-2">
                                <Upload className="h-4 w-4" />
                                Bulk Assign Students
                            </Button>
                        </div>

                        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                            <div className="text-sm flex items-start gap-2">
                                <Info className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                                <span>
                                    <strong>Assignment Rules:</strong> Members
                                    can see Allocated/Assigned or All students
                                    based on permissions. When a coordinator is
                                    assigned students, they receive full
                                    responsibility for those placements.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Permission Cascade Info */}
            <Card
                className="border-border/60 shadow-xl bg-linear-to-br from-green-500/5 to-accent/5"
                noPadding
            >
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <Info className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <Typography variant="subtitle" className="text-lg">
                                Permission Cascade Rules
                            </Typography>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <p className="text-sm">
                                <strong>RTO to Member Cascade:</strong> If a
                                permission is ON for the RTO from SkilTrak, the
                                RTO can pass it on to its members. Disabled RTO
                                permissions cannot be enabled for members.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <p className="text-sm">
                                <strong>Button Visibility:</strong> Members will
                                only see buttons and features for which
                                permission is enabled. This ensures a clean,
                                focused interface.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <p className="text-sm">
                                <strong>Team Visibility:</strong> Each RTO can
                                see only their own team members when adding to
                                teams and assigning permissions. Cross-RTO
                                visibility is prevented.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <p className="text-sm">
                                <strong>View vs Full Access:</strong> View Only
                                members can see data but cannot make changes.
                                Full Access members can edit student/industry
                                profiles and take actions.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

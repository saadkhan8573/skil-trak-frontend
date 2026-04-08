import React from 'react'
import { AlertCircle, Ban, Shield, ToggleLeft } from 'lucide-react'
import { Card, Typography } from '@components'
import { Switch } from '@components/inputs'
import { PermissionAdminProps } from './types'

export const AdvancedTab: React.FC<PermissionAdminProps> = (props) => {
    const { otherPermissions, toggleOtherPermission } = props

    return (
        <div className="space-y-6">
            {/* Other Permissions */}
            <Card className="border-border/60 shadow-xl" noPadding>
                <div className="p-4 border-b bg-linear-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Typography variant="h4" className="text-lg">
                                Granular & Advanced Controls
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Fine-tune specific features and capabilities
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {/* Permission Categories */}
                    {[
                        'core',
                        'student-features',
                        'automation',
                        'communications',
                        'billing',
                        'data-management',
                        'security',
                        'efficiency',
                        'customization',
                        'integration',
                        'data-quality',
                    ].map((category) => {
                        const categoryPerms = otherPermissions.filter(
                            (p) => p.category === category
                        )
                        if (categoryPerms.length === 0) return null

                        const categoryNames: Record<string, string> = {
                            core: 'Core Functions',
                            'student-features': 'Student Features',
                            automation: 'Automation & AI',
                            communications: 'Communications',
                            billing: 'Billing & Payments',
                            'data-management': 'Data Management',
                            security: 'Security',
                            efficiency: 'Efficiency Tools',
                            customization: 'Customization',
                            integration: 'Integration',
                            'data-quality': 'Data Quality',
                        }

                        return (
                            <div key={category} className="mb-6 last:mb-0">
                                <Typography
                                    variant="h4"
                                    className="font-bold mb-3 flex items-center gap-2 text-primary"
                                >
                                    <ToggleLeft className="h-4 w-4" />
                                    {categoryNames[category] || category}
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {categoryPerms.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                                                permission.enabled
                                                    ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                                                    : 'bg-muted/30 border-border/40 hover:border-border/60'
                                            }`}
                                        >
                                            <div className="flex-1 mr-4">
                                                <Typography
                                                    variant="label"
                                                    htmlFor={permission.id}
                                                    className="cursor-pointer font-medium block mb-1"
                                                >
                                                    {permission.label}
                                                </Typography>
                                                <p className="text-[10px] text-muted-foreground leading-tight">
                                                    {permission.description}
                                                </p>
                                            </div>
                                            <Switch
                                                id={permission.id}
                                                name={permission.id}
                                                isChecked={permission.enabled}
                                                onChange={() =>
                                                    toggleOtherPermission(
                                                        permission.id
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Security & Compliance */}
            <Card
                className="border-border/60 shadow-xl bg-linear-to-br from-red-500/5 to-red-500/10"
                noPadding
            >
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100">
                            <Ban className="h-5 w-5 text-red-500" />
                        </div>
                        <Typography variant="h4" className="text-lg">
                            Security & Compliance
                        </Typography>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-background/60 border border-red-500/20">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                                <p className="font-semibold mb-1 text-sm">
                                    Important Security Notice
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Some permissions affect system security and
                                    data integrity. Changes to security-related
                                    permissions are logged.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-background/60 border border-border text-center">
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-wider">
                                    2FA Required
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    Yes
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-background/60 border border-border text-center">
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-wider">
                                    Audit Logging
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    Enabled
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-background/60 border border-border text-center">
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-wider">
                                    Last Security Audit
                                </p>
                                <p className="text-lg font-bold">Oct 1, 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

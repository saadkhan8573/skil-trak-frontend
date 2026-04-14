import React from 'react'
import { Badge, Typography } from '@components'
import { Switch } from '@components/inputs'
import { Permission } from './tabs/types'

interface PermissionCardProps {
    permission: Permission | any
    onToggle: (permission: Permission | any) => void | Promise<void>
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
    permission,
    onToggle,
}) => {
    const Icon = permission.icon
    const isLocked = permission.type === 'all'

    const handleToggle = () => {
        onToggle({
            ...permission,
            enabled: !permission.enabled,
        })
    }

    return (
        <div
            key={permission.id}
            className={`group relative p-2.5 rounded-xl border-2 transition-all duration-500 ${permission.enabled
                ? 'bg-white border-primary/30 shadow-lg shadow-primary/5 hover:border-primary/50'
                : 'bg-gray-50/50 border-gray-200 opacity-80 hover:opacity-100 hover:bg-white hover:border-gray-300'
                } hover:shadow-2xl hover:translate-y-[-4px] overflow-hidden`}
        >
            {/* Background Accent for Enabled State */}
            {permission.enabled && (
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            )}

            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4 flex-1">
                    {Icon && (
                        <div
                            className={`p-2 rounded-lg shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${permission.enabled
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-200/50 text-gray-400'
                                }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 m">
                            <Typography
                                variant="label"
                                htmlFor={permission.id}
                                className="cursor-pointer font-bold tracking-tight"
                            >
                                {permission.label}
                            </Typography>
                            {isLocked && (
                                <Badge
                                    variant="primary"
                                    className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider rounded-md"
                                >
                                    Required
                                </Badge>
                            )}
                            {permission.category === 'premium' && (
                                <Badge
                                    variant="accent"
                                    className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider rounded-md shadow-sm"
                                >
                                    Elite Feature
                                </Badge>
                            )}
                        </div>
                        <p className="text-[13px] text-muted-foreground font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                            {permission.description}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <Switch
                        id={permission.id}
                        name={permission.id}
                        customStyleClass="profileSwitch"
                        isChecked={permission.enabled}
                        onChange={handleToggle}
                        disabled={isLocked}
                        className="scale-100 transition-transform hover:scale-110"
                    />
                    <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${permission.enabled ? 'text-primary' : 'text-gray-400'}`}
                    >
                        {permission.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            </div>
        </div>

    )
}

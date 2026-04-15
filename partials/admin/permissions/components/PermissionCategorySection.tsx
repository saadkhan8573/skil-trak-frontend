import { Badge, Card, ShowErrorNotifications, Typography } from '@components'
import { PermissionCardData } from '@partials/admin/permissions'
import { PermissionCard } from '@partials/admin/permissions/components/PermissionCard'
import { AdminApi } from '@redux'
import { ChevronDown } from 'lucide-react'
import React from 'react'

interface PermissionCategorySectionProps {
    category: string
    categoryPermissions: PermissionCardData[]
    config: any
    IconComponent: React.ComponentType<any>
    isExpanded: (section: string) => boolean
    toggleSection: (section: string) => void
    loadingPermissions: Set<string>
    setLoadingPermissions: React.Dispatch<React.SetStateAction<Set<string>>>
    notification: any
    userId: number | undefined
}

export const PermissionCategorySection: React.FC<
    PermissionCategorySectionProps
> = ({
    category,
    categoryPermissions,
    config,
    IconComponent,
    isExpanded,
    toggleSection,
    loadingPermissions,
    setLoadingPermissions,
    notification,
    userId,
}) => {
    const [toggleRtoPermission, toggleRtoPermissionResult] =
        AdminApi.Permissions.useToggleRto()

    const renderPermissionCard = (p: PermissionCardData) => {
        const isLoading = loadingPermissions.has(p.id)

        const handlePermissionChange = async (toggled: any) => {
            if (userId && !isLoading) {
                // Add to loading state
                setLoadingPermissions((prev) => new Set([...prev, p.id]))

                try {
                    // Call API to assign/revoke permission
                    await toggleRtoPermission({
                        userId,
                        permissionId: p.permissionId,
                        userPermissionId: p.userPermissionId,
                    }).unwrap()

                    // Show success notification
                    notification.success({
                        title: 'Permission updated',
                        description: `${p.label} permission has been ${toggled.enabled ? 'enabled' : 'disabled'} successfully.`,
                    })

                    // Remove from loading state
                    setLoadingPermissions((prev) => {
                        const next = new Set(prev)
                        next.delete(p.id)
                        return next
                    })
                } catch (error: any) {
                    // Show error notification
                    // notification.error({
                    //     title: 'Failed to update permission',
                    //     description:
                    //         error?.message ||
                    //         'Unable to update the permission. Please try again.',
                    // })
                    // Remove from loading state
                    setLoadingPermissions((prev) => {
                        const next = new Set(prev)
                        next.delete(p.id)
                        return next
                    })
                }
            }
        }

        return (
            <div
                key={p.id}
                className={`relative transition-opacity duration-200 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
            >
                <ShowErrorNotifications result={toggleRtoPermissionResult} />
                <PermissionCard
                    permission={
                        {
                            ...p,
                            type: isLoading ? 'all' : p.type,
                        } as any
                    }
                    onToggle={handlePermissionChange as any}
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-xl">
                        <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full" />
                    </div>
                )}
            </div>
        )
    }

    return (
        <Card
            key={category}
            className="border border-primary-light shadow-2xl overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:shadow-primary/5 hover:translate-y-[-2px]"
            noPadding
        >
            <div
                className={`p-2.5 border-b border-gray-100 ${config?.bg} ${config?.bgHover} cursor-pointer transition-all flex items-center justify-between group`}
                onClick={() => toggleSection(category)}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`p-2 rounded-xl ${config?.iconBg} shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                        <IconComponent
                            className={`h-3.5 w-3.5 ${config?.iconColor}`}
                        />
                    </div>
                    <div>
                        <Typography
                            variant="subtitle"
                            className="font-bold tracking-tight text-gray-800"
                        >
                            {config?.label}
                        </Typography>
                        <p className="text-xs text-muted-foreground font-medium opacity-80">
                            {config?.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                        <Badge
                            variant="primary"
                            className="px-3 py-0.5 rounded-full font-bold shadow-sm text-xs"
                        >
                            {`${categoryPermissions.filter((p: any) => p.enabled).length}/${categoryPermissions.length}`}
                        </Badge>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/60">
                            Active
                        </span>
                    </div>
                    <div
                        className={`p-1.5 rounded-full transition-all duration-300 ${isExpanded(category) ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
            </div>
            {isExpanded(category) && (
                <div className="p-4 bg-linear-to-b from-white/50 to-transparent grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {(categoryPermissions as PermissionCardData[]).map((p) =>
                        renderPermissionCard(p)
                    )}
                </div>
            )}
        </Card>
    )
}

import { useEffect, FC, useState, useMemo } from 'react'
import { AlertCircle, Eye, EyeOff, Filter, ToggleLeft } from 'lucide-react'
import { Button, Card } from '@components'
import { TextInput } from '@components/inputs'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { PermissionType } from '@types'
import {
    categoryConfig,
    PermissionCardData,
    permissionMetadata,
} from '@partials/admin/permissions'
import { PermissionCategorySection } from '@partials/admin/permissions/components'

interface DynamicPermissionsTabProps {
    userId?: number
}

export const DynamicPermissionsTab: FC<DynamicPermissionsTabProps> = ({
    userId,
}) => {
    const { notification } = useNotification()
    const { data: permissionsData } = AdminApi.Permissions.useListQuery({
        skip: 0,
        limit: 1000,
    })
    const { data: myPermissions } = AdminApi.Permissions.useMyPermissions(
        userId as number,
        {
            skip: !userId,
        }
    )

    const [searchQuery, setSearchQuery] = useState('')
    const [showDisabledOnly, setShowDisabledOnly] = useState(false)
    const [expandedSections, setExpandedSections] = useState<string[]>(
        Object.keys(categoryConfig)
    )
    const [loadingPermissions, setLoadingPermissions] = useState<Set<string>>(
        new Set()
    )

    // Process permissions data
    const groupedPermissions = useMemo(() => {
        if (!permissionsData?.data) return {}

        const grouped: Record<string, PermissionCardData[]> = {}

        permissionsData.data.forEach((permission: any) => {
            const permCode = permission.code as PermissionType
            const metadata = permissionMetadata[permCode]

            if (metadata) {
                const category = metadata.category
                const config =
                    categoryConfig[category as keyof typeof categoryConfig]

                if (!grouped[category]) {
                    grouped[category] = []
                }

                const assigned = myPermissions?.find(
                    (p) => p.permission?.code === permission.code
                )
                const isEnabled = !!assigned
                const userPermissionId = assigned?.id

                if (showDisabledOnly && isEnabled) return

                // Search filter
                const searchLower = searchQuery.toLowerCase()
                const matchesPermission =
                    metadata.label.toLowerCase().includes(searchLower) ||
                    metadata.description.toLowerCase().includes(searchLower)
                const matchesCategory = config?.label
                    .toLowerCase()
                    .includes(searchLower)

                if (searchQuery && !matchesPermission && !matchesCategory)
                    return

                const permissionCard: PermissionCardData = {
                    id: permission.code,
                    permissionId: permission.id,
                    userPermissionId,
                    label: metadata.label,
                    description: metadata.description,
                    icon: metadata.icon,
                    category,
                    enabled: isEnabled,
                    type: 'permission',
                }
                grouped[category].push(permissionCard)
            }
        })

        // Remove empty categories
        const filteredGrouped: Record<string, PermissionCardData[]> = {}
        Object.entries(grouped).forEach(([cat, perms]) => {
            if (perms.length > 0) {
                filteredGrouped[cat] = perms
            }
        })

        return filteredGrouped
    }, [permissionsData, myPermissions, showDisabledOnly, searchQuery])

    const toggleSection = (section: string) => {
        if (section === 'all') {
            const allCategories = Object.keys(groupedPermissions)
            const isAnyCollapsed =
                expandedSections.length < allCategories.length
            setExpandedSections(isAnyCollapsed ? allCategories : [])
        } else {
            setExpandedSections((prev) =>
                prev.includes(section)
                    ? prev.filter((s) => s !== section)
                    : [...prev, section]
            )
        }
    }

    const isExpanded = (section: string) => expandedSections.includes(section)

    if (!permissionsData?.data || permissionsData.data.length === 0) {
        return (
            <Card className="border-border/60 shadow-lg">
                <div className="flex items-center justify-center gap-2 text-muted-foreground py-10">
                    <AlertCircle className="h-5 w-5" />
                    <span>No permissions available</span>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Search and Filter Bar */}
            <Card className="flex flex-col md:flex-row items-center gap-4 bg-white/50 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-xl mb-6">
                <div className="relative flex-1 w-full group  rounded">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary z-10">
                        <Filter className="h-3 w-3 text-muted-foreground/60" />
                    </div>
                    <TextInput
                        name="search"
                        placeholder="Search system capabilities..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        color="bg-gray-50/50 !pl-10 border-transparent focus:border-primary/40"
                        showError={false}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="primary"
                        onClick={() => toggleSection('all')}
                        Icon={
                            expandedSections.length ===
                            Object.keys(groupedPermissions).length
                                ? EyeOff
                                : Eye
                        }
                        text={
                            expandedSections.length ===
                            Object.keys(groupedPermissions).length
                                ? 'Collapse'
                                : 'Expand All'
                        }
                        outline={
                            expandedSections.length !==
                            Object.keys(groupedPermissions).length
                        }
                    />
                </div>
            </Card>

            {/* Dynamic Permission Sections */}
            {Object.keys(groupedPermissions).length > 0 ? (
                Object.keys(categoryConfig)
                    .filter((category) => groupedPermissions[category])
                    .map((category) => {
                        const categoryPermissions = groupedPermissions[category]
                        const config =
                            categoryConfig[
                                category as keyof typeof categoryConfig
                            ]
                        const IconComponent = config?.icon || AlertCircle

                        return (
                            <PermissionCategorySection
                                key={category}
                                category={category}
                                categoryPermissions={
                                    categoryPermissions as PermissionCardData[]
                                }
                                config={config}
                                IconComponent={IconComponent}
                                isExpanded={isExpanded}
                                toggleSection={toggleSection}
                                loadingPermissions={loadingPermissions}
                                setLoadingPermissions={setLoadingPermissions}
                                notification={notification}
                                userId={userId}
                            />
                        )
                    })
            ) : (
                <Card className="border-border/40 shadow-xl bg-white/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                        <div className="p-4 rounded-full bg-gray-100 mb-2">
                            <Filter className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                No matches found
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                                We couldn't find any permissions matching "
                                <span className="font-semibold text-primary">
                                    {searchQuery}
                                </span>
                                ". Try a different keyword or clear your
                                filters.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            outline
                            className="mt-2"
                            onClick={() => {
                                setSearchQuery('')
                                setShowDisabledOnly(false)
                            }}
                        >
                            Clear search & filters
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}

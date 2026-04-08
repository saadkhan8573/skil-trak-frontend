import React from 'react';

export interface Permission {
    id: string
    label: string
    description?: string
    enabled: boolean
    type: 'all' | 'permission' | 'toggle'
    icon?: any
    category?: string
}

export interface FeatureUnlock {
    id: string
    feature: string
    description: string
    requiredPartners: number
    currentPartners: number
    unlocked: boolean
    benefit?: string
}

export interface RTOStats {
    totalUsers: number
    activeStudents: number
    industryPartners: number
    pendingActions: number
    storageUsed: number
    storageLimit: number
    monthlyApiCalls: number
    apiCallLimit: number
}

export interface PackageSettings {
    organizationType: string
    pricingTier: string
    aiCallsAddon: boolean
    adminSupportAddon: boolean
    networkCreditsTopup: number
    customBranding: boolean
    whiteLabel: boolean
    apiAccess: boolean
}

export interface AiCallingStage {
    id: string
    label: string
    enabled: boolean
}

export interface IndustrySector {
    sector: string
    enabled: boolean
    costPerMonth: number
}

export interface PermissionAdminProps {
    selectedRTO: string
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    showDisabledOnly: boolean
    setShowDisabledOnly: React.Dispatch<React.SetStateAction<boolean>>
    expandedSections: string[]
    toggleSection: (section: string) => void
    renderPermissionCard: (
        permission: Permission,
        permissions: Permission[],
        setter: React.Dispatch<React.SetStateAction<Permission[]>>
    ) => React.ReactNode

    rtoStats: RTOStats
    
    dashboardPermissions: Permission[]
    setDashboardPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
    
    studentsPermissions: Permission[]
    setStudentsPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
    
    communicationsPermissions: Permission[]
    setCommPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
    
    managePermissions: Permission[]
    setManagePermissions: React.Dispatch<React.SetStateAction<Permission[]>>
    
    moreToolsPermissions: Permission[]
    setMoreToolsPermissions: React.Dispatch<React.SetStateAction<Permission[]>>
    
    otherPermissions: {
        id: string
        label: string
        description: string
        enabled: boolean
        category: string
    }[]
    toggleOtherPermission: (id: string) => void

    packageSettings: PackageSettings
    setPackageSettings: React.Dispatch<React.SetStateAction<PackageSettings>>
    
    featureUnlocks: FeatureUnlock[]
    
    aiCallingEnabled: boolean
    setAiCallingEnabled: React.Dispatch<React.SetStateAction<boolean>>
    aiCallingLimit: number
    setAiCallingLimit: React.Dispatch<React.SetStateAction<number>>
    aiCallingRate: number
    aiCallingStages: AiCallingStage[]
    setAiCallingStages: React.Dispatch<React.SetStateAction<AiCallingStage[]>>

    industryListingEnabled: boolean
    setIndustryListingEnabled: React.Dispatch<React.SetStateAction<boolean>>
    industryListingSectors: IndustrySector[]
    setIndustryListingSectors: React.Dispatch<React.SetStateAction<IndustrySector[]>>

    sharingPartnersEnabled: boolean
    setSharingPartnersEnabled: React.Dispatch<React.SetStateAction<boolean>>
    autoShareNewPartners: boolean
    setAutoShareNewPartners: React.Dispatch<React.SetStateAction<boolean>>
    shareStudentData: boolean
    setShareStudentData: React.Dispatch<React.SetStateAction<boolean>>
    sharePlacementData: boolean
    setSharePlacementData: React.Dispatch<React.SetStateAction<boolean>>

    handleSaveChanges: () => void
    handleResetDefaults: () => void
    handleExportConfig: () => void
    setSelectedRTO: (val: string) => void
    stats: {
        enabledCount: number
        total: number
        percentage: number
    }
    permissionGroups: {
        id: string
        label: string
        count: number
    }[]
}

import React from 'react'
import {
    Shield,
    Download,
    RefreshCw,
    Save,
    Users,
    Building2,
    AlertCircle,
} from 'lucide-react'
import { Card, Button, Typography } from '@components'
import { Select } from '@components/inputs'

interface AdminHeaderProps {
    selectedRTO: string
    setSelectedRTO: (val: string) => void
    rtoOptions: { label: string; value: string }[]
    rtoStats: {
        activeStudents: number
        industryPartners: number
        pendingActions: number
    }
    handleExportConfig: () => void
    handleResetDefaults: () => void
    handleSaveChanges: () => void
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    selectedRTO,
    setSelectedRTO,
    rtoOptions,
    rtoStats,
    handleExportConfig,
    handleResetDefaults,
    handleSaveChanges,
}) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border-2 border-primaryNew/20 bg-linear-to-br from-primaryNew/10 via-accent/5 to-primary-light/30 p-5 shadow-sm transition-all duration-300">
            {/* Soft decorative grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />

            <div className="relative">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-5 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-br from-primary to-accent rounded-2xl blur-lg opacity-40 animate-pulse" />
                            <div className="relative h-14 w-14 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-xl border border-white/20">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <div>
                            <Typography
                                variant="h2"
                                className="text-2xl font-bold tracking-tight text-slate-900 leading-tight"
                            >
                                SkilTrak Admin Panel
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-slate-500 font-medium text-xs"
                            >
                                Complete control over RTO permissions, features,
                                and package settings
                            </Typography>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 group/actions">
                        <Button
                            outline
                            variant="primary"
                            onClick={handleExportConfig}
                            className="bg-white/80 backdrop-blur-sm border-slate-200 h-9 px-4 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Download className="h-3.5 w-3.5 mr-2" />
                            Export Config
                        </Button>
                        <Button
                            outline
                            variant="primary"
                            onClick={handleResetDefaults}
                            className="bg-white/80 backdrop-blur-sm border-slate-200 h-9 px-4 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            className="bg-linear-to-r from-primary to-accent shadow-lg hover:shadow-xl h-9 px-5 rounded-xl text-xs font-bold border-none transition-all duration-300 transform active:scale-95 group-hover/actions:scale-[1.02]"
                            onClick={handleSaveChanges}
                        >
                            <Save className="h-3.5 w-3.5 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* RTO Selector & Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 border-t border-slate-200/50">
                    <div className="md:col-span-2 space-y-1.5">
                        <Typography
                            variant="label"
                            className="text-slate-900 font-bold text-xs pl-0.5"
                        >
                            Selected Training Organisation
                        </Typography>
                        <div className="relative">
                            <Select
                                name="selectedRTO"
                                options={rtoOptions}
                                value={selectedRTO}
                                onChange={(val: any) => setSelectedRTO(val)}
                                placeholder="Select RTO"
                                onlyValue={true}
                                shadow="none"
                                className="bg-white/80 backdrop-blur-sm h-10 border-2 border-slate-200 rounded-xl text-sm focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <Card
                        noPadding
                        className="bg-white/40 backdrop-blur-sm border-primary/20 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-0 text-slate-900">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        Students
                                    </p>
                                    <p className="text-lg font-black leading-tight tabular-nums">
                                        {rtoStats.activeStudents}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        noPadding
                        className="bg-white/40 backdrop-blur-sm border-accent/20 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-accent/10">
                                    <Building2 className="h-4 w-4 text-accent" />
                                </div>
                                <div className="space-y-0 text-slate-900">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        Partners
                                    </p>
                                    <p className="text-lg font-black leading-tight tabular-nums">
                                        {rtoStats.industryPartners}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        noPadding
                        className="bg-white/40 backdrop-blur-sm border-destructive/20 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                </div>
                                <div className="space-y-0 text-slate-900">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        Pending
                                    </p>
                                    <p className="text-lg font-black leading-tight tabular-nums">
                                        {rtoStats.pendingActions}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

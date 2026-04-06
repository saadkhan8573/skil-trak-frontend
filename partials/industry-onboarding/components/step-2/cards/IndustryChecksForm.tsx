import { Switch, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { AdminApi } from '@queries'
import { ellipsisText } from '@utils'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect } from 'react'

interface IndustryChecksFormProps {
    sector: any
    sectorState: any
    sectorConfig: { color: string }
    onUpdateSector: (updates: any) => void
    onUpdateIndustryCheck: (checkId: any, updates: Record<string, any>) => void
    onToggleCustomCheck: (enabled: boolean) => void
    onUpdateCustomCheckField: (field: string, value: any) => void
}

export function IndustryChecksForm({
    sector,
    sectorState,
    sectorConfig,
    onUpdateSector,
    onUpdateIndustryCheck,
    onToggleCustomCheck,
    onUpdateCustomCheckField,
}: IndustryChecksFormProps) {
    const {
        data: apiChecks,
        isLoading,
        isError,
    } = AdminApi.IndustryChecks.getSectorIndustryChecks(Number(sector.id), {
        skip: !sector?.id,
    })

    // Seed all API checks into sector state once on first load so the payload
    // always has the full list with their required values, not just toggled ones.
    useEffect(() => {
        if (!apiChecks?.length) return
        if (sectorState?.industryChecks?.length) return // already seeded
        onUpdateSector({
            industryChecks: apiChecks.map((c: any) => ({
                id: c.id,
                name: c.name,
                required: !!c.required,
            })),
        })
    }, [apiChecks])

    const customCheck = sectorState?.customCheck || { name: '', enabled: false }

    // Resolve current toggle state: sectorState wins (user edited it),
    // otherwise fall back to whatever the API returned.
    const getIsRequired = (checkId: any) => {
        const saved = sectorState?.industryChecks?.find(
            (c: any) => String(c.id) === String(checkId)
        )
        if (saved !== undefined) return !!saved.required
        const fromApi = (apiChecks || []).find(
            (c: any) => String(c.id) === String(checkId)
        )
        return !!fromApi?.required
    }

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-semibold">
                    Required Industry Checks
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                    💡 When you turn these on, students will be required to
                    upload these documents when applying for placements
                </p>
            </div>

            <div className="space-y-3">
                {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading industry checks...
                    </div>
                )}

                {isError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Failed to load industry checks. Please refresh and try
                        again.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="grid grid-cols-2 gap-4">
                        {(apiChecks || []).map((check: any) => {
                            const isRequired = getIsRequired(check.id)
                            return (
                                <div
                                    key={check.id}
                                    className="flex items-center justify-between p-4 rounded-xl border-2 bg-white/60 transition-colors"
                                    style={{
                                        borderColor: isRequired
                                            ? sectorConfig.color
                                            : '#E2E8F0',
                                    }}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">
                                                {check.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {ellipsisText(
                                                    check?.description,
                                                    80
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Switch
                                        name={`check_${check.id}`}
                                        customStyleClass="profileSwitch"
                                        defaultChecked={isRequired}
                                        onChange={(e: any) =>
                                            onUpdateIndustryCheck(check.id, {
                                                required: e.target.checked,
                                            })
                                        }
                                    />
                                </div>
                            )
                        })}

                        {/* Custom / other check */}
                        <div
                            className="flex items-center justify-between p-4 rounded-xl border-2 bg-white/60 transition-colors"
                            style={{
                                borderColor: customCheck.enabled
                                    ? sectorConfig.color
                                    : '#E2E8F0',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="font-medium text-sm">
                                        {customCheck.enabled && customCheck.name
                                            ? customCheck.name
                                            : 'Other'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Other industry-specific checks
                                    </div>
                                </div>
                            </div>
                            <Switch
                                name="customCheckEnabled"
                                customStyleClass="profileSwitch"
                                defaultChecked={customCheck.enabled}
                                onChange={(e: any) =>
                                    onToggleCustomCheck(e.target.checked)
                                }
                            />
                        </div>

                        {customCheck.enabled && (
                            <div className="col-span-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-200 grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <TextInput
                                        name="customCheckName"
                                        value={customCheck.name}
                                        onChange={(e: any) =>
                                            onUpdateCustomCheckField(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., First Aid Certificate"
                                        className="bg-white border-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Capacity{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <TextInput
                                        name="customCheckCapacity"
                                        value={customCheck.capacity}
                                        onChange={(e: any) =>
                                            onUpdateCustomCheckField(
                                                'capacity',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 1"
                                        className="bg-white border-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Link{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <TextInput
                                        name="customCheckLink"
                                        value={customCheck.link}
                                        onChange={(e: any) =>
                                            onUpdateCustomCheckField(
                                                'link',
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://"
                                        className="bg-white border-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Description
                                    </Label>
                                    <TextInput
                                        name="customCheckDescription"
                                        value={customCheck.description}
                                        onChange={(e: any) =>
                                            onUpdateCustomCheckField(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Folder Description..."
                                        className="bg-white border-2"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <Switch
                                        name="customCheckRequired"
                                        customStyleClass="profileSwitch"
                                        defaultChecked={customCheck.required}
                                        onChange={(e: any) =>
                                            onUpdateCustomCheckField(
                                                'required',
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <Label className="text-xs font-semibold">
                                        Required
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

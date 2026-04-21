import {
    Badge,
    Card,
    ShowErrorNotifications,
    Switch,
    usePermissions,
} from '@components'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'
import { useNotification } from '@hooks'
import { IndustryApi } from '@queries'
import { PermissionType } from '@types'
import { CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'

interface InsuranceDocCardProps {
    docs: any
    industryUserId?: number
}

export function InsuranceDocCard({
    docs,
    industryUserId,
}: InsuranceDocCardProps) {
    const [required, requiredResult] =
        IndustryApi.Insurance.requiredInduranceDoc()
    const hasPermission = usePermissions({
        permission: PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS,
    })

    const { notification } = useNotification()

    const isDocRequired = docs?.industryRequiredDocuments?.[0]?.isRequired

    const onRequiredDocType = async () => {
        try {
            const res: any = await required({
                docId: docs?.id,
                userId: industryUserId,
            })

            if (res?.data) {
                notification?.[isDocRequired ? 'error' : 'success']({
                    title: `Insurance ${isDocRequired ? 'Removed' : 'Added'}`,
                    description: `Insurance document ${
                        isDocRequired ? 'removed from' : 'added to'
                    } required list successfully.`,
                })
            }
        } catch (error) {
            console.error('Error toggling insurance doc status:', error)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={requiredResult} />
            <Card className="p-4 hover:border-[#044866]/20 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Icon */}
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                                isDocRequired
                                    ? 'bg-linear-to-br from-[#044866] to-[#0D5468]'
                                    : 'bg-linear-to-br from-[#F8FAFB] to-[#E8F4F8]'
                            }`}
                        >
                            <ShieldCheck
                                className={`w-5 h-5 ${
                                    isDocRequired
                                        ? 'text-white'
                                        : 'text-[#64748B]'
                                }`}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-[#1A2332]">
                                    {docs?.title}
                                </h4>
                                {isDocRequired && (
                                    <Badge variant="success" outline>
                                        REQUIRED
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {isDocRequired ? (
                                    <>
                                        <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                                        <p className="text-xs text-[#64748B]">
                                            Required for industry compliance
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-3.5 h-3.5 text-[#94A3B8]" />
                                        <p className="text-xs text-[#94A3B8]">
                                            Not currently required
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Toggle */}
                    {!hasPermission ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center">
                                    <Switch
                                        name="required"
                                        label={'Required'}
                                        isChecked={isDocRequired}
                                        customStyleClass="profileSwitch"
                                        onChange={() => onRequiredDocType()}
                                        disabled={!hasPermission}
                                        loading={requiredResult?.isLoading}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                Permission Not granted
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Switch
                            name="required"
                            label={'Required'}
                            isChecked={isDocRequired}
                            customStyleClass="profileSwitch"
                            onChange={() => onRequiredDocType()}
                            disabled={!hasPermission}
                            loading={requiredResult?.isLoading}
                        />
                    )}
                </div>
            </Card>
        </>
    )
}

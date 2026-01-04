import { Button, Typography } from '@components'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@components/ui/collapsible'
import { useAppSelector } from '@redux/hooks'
import {
    Building,
    FileText,
    Users,
    Phone,
    Mail,
    Globe,
    MapPin,
    ExternalLink,
    LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

const CardItem = ({
    Icon,
    label,
    value,
}: {
    Icon: LucideIcon
    label: string
    value: string
}) => {
    return (
        <div className="flex items-center gap-1 p-1 rounded-lg hover:bg-[#F8FAFB] transition-colors">
            <div className="w-5 h-5 bg-[#E8F4F8] rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#044866]" />
            </div>
            <div>
                <Typography variant="label" color="text-[#64748B]">
                    {label}
                </Typography>
                <Typography variant="small" color="text-[#1A2332]">
                    {value || '---'}
                </Typography>
            </div>
        </div>
    )
}

export function BasicDetails() {
    const [showContactInfo, setShowContactInfo] = useState(false)

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    return (
        <div
            id="basic-details"
            className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all flex-1"
        >
            <div className="p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[#1A2332] flex items-center gap-1 text-xs">
                        <div className="w-4 h-4 bg-[#044866]/10 rounded-lg flex items-center justify-center">
                            <Building className="w-2.5 h-2.5 text-[#044866]" />
                        </div>
                        Basic Details
                    </h3>
                </div>

                <div className="space-y-1.5 grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                    <CardItem
                        Icon={FileText}
                        label="ABN"
                        value={industryDetail?.abn || ''}
                    />
                    <CardItem
                        Icon={Building}
                        label="Industry"
                        value={industryDetail?.user?.name || ''}
                    />
                    <CardItem
                        Icon={Users}
                        label="Employees"
                        value={
                            industryDetail?.enrolledStudents?.toString() || ''
                        }
                    />
                </div>
            </div>

            <Collapsible
                open={showContactInfo}
                onOpenChange={setShowContactInfo}
                className="w-full"
            >
                <CollapsibleTrigger className="w-full">
                    <Button
                        variant="secondary"
                        className="w-full px-2.5 py-1.5 border-t border-[#E2E8F0] text-[9px] font-medium text-[#044866] hover:bg-[#F8FAFB] transition-all flex items-center justify-center gap-1 h-auto rounded-none"
                    >
                        <Phone className="w-2.5 h-2.5" />
                        {showContactInfo
                            ? 'Hide Contact Information'
                            : 'Show Contact Information'}
                        <span
                            className={`text-[10px] transition-transform ${
                                showContactInfo ? 'rotate-180' : ''
                            }`}
                        >
                            ▼
                        </span>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {' '}
                    <div className="px-2.5 pb-2.5 pt-1.5 border-t border-[#E2E8F0] bg-[#F8FAFB]/50">
                        <div className="space-y-1.5 grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                            <CardItem
                                Icon={Globe}
                                label="Website"
                                value={industryDetail?.website || ''}
                            />
                            <CardItem
                                Icon={MapPin}
                                label="Address"
                                value={industryDetail?.addressLine1 || ''}
                            />
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Toggle Contact Information Button */}

            {/* Contact Information - Collapsible */}
            {/* {showContactInfo && (
               
            )} */}
        </div>
    )
}

import { Typography } from '@components'
import { useAppSelector } from '@redux/hooks'
import {
    Building,
    FileText,
    Globe,
    LucideIcon,
    MapPin,
    Users,
} from 'lucide-react'

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
            <div className="w-5 h-5 bg-[#E8F4F8] rounded-lg flex items-center justify-center shrink-0">
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
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    return (
        <div
            id="basic-details"
            className="h-auto bg-white rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all flex-1"
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
        </div>
    )
}

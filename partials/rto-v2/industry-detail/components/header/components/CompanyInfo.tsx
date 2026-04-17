import { TrendingUp, MapPin, FileText, Users, Globe } from 'lucide-react'
import { CompanyAvatar } from './CompanyAvatar'
import { CompanyBadges } from './CompanyBadges'
import { Badge, Typography } from '@components'
import { useAppSelector } from '@redux/hooks'
import Link from 'next/link'

export function CompanyInfo() {
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const details = [
        {
            icon: FileText,
            label: 'ABN',
            value: industryDetail?.abn,
        },
        {
            icon: Users,
            label: 'Employees',
            value: industryDetail?.enrolledStudents,
        },
        {
            icon: Globe,
            label: 'Website',
            value: industryDetail?.website,
            isLink: true,
        },
    ]
    console.log('industryDetail', industryDetail)
    return (
        <div className="flex items-start gap-4 flex-1 min-w-0">
            <CompanyAvatar />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 text-wrap">
                    <Typography
                        variant="title"
                        color={'text-[#1A2332]'}
                        bold
                        className="text-xl"
                    >
                        {industryDetail?.user?.name}
                    </Typography>
                    <TrendingUp className="w-4 h-4 text-[#10B981] shrink-0" />
                    {industryDetail?.onboardingCreatedBy && (
                        <Badge
                            variant="primaryNew"
                            text={`${industryDetail?.onboardingCreatedBy?.name} - ${industryDetail?.onboardingCreatedBy?.createdAt?.slice(0, 10)}`}
                            // Icon={BiEnvelope}
                            // onClick={onComposeMailClicked}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-x-4 gap-y-2">
                    <CompanyBadges industry={industryDetail!} />

                    <Typography
                        variant="small"
                        className="flex items-start gap-x-2 wrap-break-word"
                        color={'text-gray-700'}
                    >
                        <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{industryDetail?.addressLine1}</span>
                    </Typography>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        {details.map((detail, idx) =>
                            detail.value ? (
                                <div
                                    key={idx}
                                    className="flex items-center gap-1.5 text-[11px] text-gray-700"
                                >
                                    <detail.icon className="w-3.5 h-3.5 shrink-0 text-[#044866]/60" />
                                    <span className="font-semibold text-gray-500 whitespace-nowrap">
                                        {detail.label}:
                                    </span>
                                    {detail.isLink ? (
                                        <Link
                                            href={
                                                detail.value.startsWith('http')
                                                    ? detail.value
                                                    : `https://${detail.value}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#044866] hover:underline transition-all truncate max-w-[150px]"
                                        >
                                            {detail.value}
                                        </Link>
                                    ) : (
                                        <span className="truncate max-w-[200px]">
                                            {detail.value}
                                        </span>
                                    )}
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

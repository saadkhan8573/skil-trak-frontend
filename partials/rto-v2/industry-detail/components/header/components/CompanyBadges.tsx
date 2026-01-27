import { Badge } from '@components'
import { CommonApi } from '@redux'
import { Industry } from '@types'

interface CompanyBadgesProps {
    industry: Industry
}

export function CompanyBadges({ industry }: CompanyBadgesProps) {
    const overAllRating =
        CommonApi.Feedback.useOverAllIndustryRatingsFromStudent(
            { id: industry?.id || 0 },
            {
                skip: !industry?.id,
            }
        )
    return (
        <div className="flex items-center gap-1 flex-wrap mb-1">
            {industry?.user?.isEmailVerified && (
                <Badge className="px-1.5 py-0.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-full text-[10px] font-medium shadow-lg shadow-[#10B981]/20 border border-[#10B981]/20 hover:from-[#059669] hover:to-[#10B981] transition-all active:scale-95 cursor-pointer h-auto">
                    ✓ Verified Email
                </Badge>
            )}
            {industry?.isPremium && (
                <Badge className="px-1.5 py-0.5 bg-gradient-to-r from-[#F7A619] to-[#EA580C] text-white rounded-full text-[10px] font-medium shadow-lg shadow-[#F7A619]/20 hover:from-[#EA580C] hover:to-[#F7A619] transition-all active:scale-95 cursor-pointer h-auto">
                    ⭐ Premium Member
                </Badge>
            )}
            {overAllRating?.data?.averageRating! > 4 && (
                <Badge className="px-1.5 py-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-full text-[10px] font-medium shadow-lg shadow-[#8B5CF6]/20 hover:from-[#7C3AED] hover:to-[#8B5CF6] transition-all active:scale-95 cursor-pointer h-auto">
                    🏆 Top Rated
                </Badge>
            )}
        </div>
    )
}

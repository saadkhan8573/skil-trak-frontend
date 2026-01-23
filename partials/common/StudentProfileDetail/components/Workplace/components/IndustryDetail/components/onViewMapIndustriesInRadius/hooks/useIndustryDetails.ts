import { useMemo } from 'react'
import { CommonApi, SubAdminApi } from '@queries'

export type IndustryType = 'industry' | 'branch' | 'listing' | null

const resolveIndustryType = (selectedBox: any): IndustryType => {
    if (!selectedBox) return null
    if (selectedBox.type === 'futureIndustry') return 'listing'
    if (selectedBox.type === 'branch') return 'branch'
    return 'industry'
}

export const useIndustryDetails = ({
    selectedBox,
    workplaceId,
    isStudent,
}: {
    selectedBox: any
    workplaceId: number
    isStudent: boolean
}) => {
    const industryType = resolveIndustryType(selectedBox)

    const branchDetails =
        SubAdminApi.Workplace.useSubAdminMapIndustryBranchDetail(
            {
                id: selectedBox?.id,
                params: { wpId: workplaceId },
            },
            {
                skip: isStudent || industryType !== 'branch',
            }
        )

    const futureIndustryDetails =
        CommonApi.FindWorkplace.useGetFutureIndustryDetail(selectedBox?.id, {
            skip: isStudent || industryType !== 'listing',
        })

    const suggestedIndustryDetails =
        SubAdminApi.Workplace.useSubAdminMapSuggestedIndustryDetail(
            { industryId: selectedBox?.id, workplaceId },
            {
                skip:
                    isStudent ||
                    industryType === 'branch' ||
                    industryType === 'listing',
            }
        )

    const industryDetails = useMemo(() => {
        switch (industryType) {
            case 'branch':
                return branchDetails
            case 'listing':
                return futureIndustryDetails
            default:
                return suggestedIndustryDetails
        }
    }, [
        industryType,
        branchDetails,
        futureIndustryDetails,
        suggestedIndustryDetails,
    ])

    return {
        industryType,
        industryDetails,
    }
}

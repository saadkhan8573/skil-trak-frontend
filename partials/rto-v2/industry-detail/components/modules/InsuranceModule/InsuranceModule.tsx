import { LoadingAnimation, NoData } from '@components'
import { IndustryApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { useMemo } from 'react'
import { InsuranceDocCard } from './components'

export const InsuranceModule = () => {
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )
    const industryUserId = industryDetail?.user?.id

    const industryDocsType = IndustryApi.Insurance.industryInsuranceDocs(
        industryUserId,
        {
            skip: !industryUserId,
        }
    )

    const requiredDocs = useMemo(() => {
        if (!industryDocsType?.data) return []

        return [...industryDocsType.data].sort((a: any, b: any) => {
            const aLatest = a?.industryRequiredDocuments?.[0]?.isRequired
                ? 1
                : 0
            const bLatest = b?.industryRequiredDocuments?.[0]?.isRequired
                ? 1
                : 0
            return bLatest - aLatest
        })
    }, [industryDocsType.data])

    if (industryDocsType.isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <LoadingAnimation size={50} />
            </div>
        )
    }

    if (industryDocsType.isError) {
        return (
            <div className="p-8 text-center">
                <NoData
                    text="There was an error loading insurance documents."
                    isError
                />
            </div>
        )
    }

    return (
        <div className="space-y-4 px-4 py-2">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[#1A2332]">
                        Insurance Documents
                    </h3>
                    <p className="text-sm text-[#64748B]">
                        Manage required insurance documents for this industry
                        profile.
                    </p>
                </div>
            </div>

            <div className="grid gap-3">
                {requiredDocs.length > 0 ? (
                    requiredDocs.map((docs: any) => (
                        <InsuranceDocCard
                            key={docs.id}
                            docs={docs}
                            industryUserId={industryUserId}
                        />
                    ))
                ) : (
                    <div className="py-8">
                        <NoData text="No insurance documents found." />
                    </div>
                )}
            </div>
        </div>
    )
}

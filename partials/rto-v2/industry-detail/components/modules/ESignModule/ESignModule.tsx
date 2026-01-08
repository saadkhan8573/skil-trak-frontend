import { NoData } from '@components'
import { CommonApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { ESignCard } from './components/ESignCard'
import { DocumentsTabSkeleton } from '../../../skeletonLoader'

export function ESignModule() {
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )
    const userId = industryDetail?.user?.id

    const {
        data: esignDocs,
        isLoading,
        refetch,
    } = CommonApi.ESign.getIndustryESignDocuments(
        { userId: Number(userId) },
        {
            skip: !userId,
        }
    )

    if (isLoading) {
        return <DocumentsTabSkeleton />
    }

    return (
        <div className="space-y-4 px-4 pb-4">
            <div className="flex items-start justify-between py-2">
                <div>
                    <h3 className="text-[#1A2332] font-bold mb-1 uppercase tracking-tight">
                        Industry E-Sign Documents
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                        View and manage all e-sign documents associated with
                        this industry
                    </p>
                </div>
            </div>

            <div className="grid gap-3">
                {esignDocs && esignDocs.length > 0 ? (
                    esignDocs.map((doc: any) => (
                        <ESignCard
                            key={doc.id}
                            document={doc}
                            onRefetch={refetch}
                        />
                    ))
                ) : (
                    <div className="py-8">
                        <NoData text="No e-sign documents found" />
                    </div>
                )}
            </div>
        </div>
    )
}

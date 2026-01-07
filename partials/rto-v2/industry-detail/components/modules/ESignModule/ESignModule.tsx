import { useState } from 'react'
import { CommonApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { Button, NoData } from '@components'
import { ESignCard } from './components/ESignCard'
import { DocumentsTabSkeleton } from '../../../skeletonLoader'
import { InitiateIndustryEsign } from '@partials/common/IndustryProfileDetail/components/InitiateIndustryEsign'

export function ESignModule() {
    const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false)
    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )
    const industryId = industryDetail?.id
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
            {isInitiateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-xl font-bold text-[#1A2332]">Initiate Industry E-Sign</h2>
                                <p className="text-xs text-[#64748B]">Select a template and start the e-sign process</p>
                            </div>
                            <button
                                onClick={() => setIsInitiateModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-6">
                            <InitiateIndustryEsign
                                industryUserId={Number(userId)}
                                onCancel={() => {
                                    setIsInitiateModalOpen(false)
                                    refetch()
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-start justify-between mb-2 mt-4">
                <div>
                    <h3 className="text-[#1A2332] font-bold mb-1 uppercase tracking-tight">
                        Industry E-Sign Documents
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                        View and manage all e-sign documents associated with this industry
                    </p>
                </div>
                <Button
                    variant="primaryNew"
                    text="New E-Sign"
                    onClick={() => setIsInitiateModalOpen(true)}
                    className="h-9 px-4"
                />
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

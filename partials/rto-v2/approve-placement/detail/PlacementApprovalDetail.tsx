import { useEffect, useState } from 'react'

import {
    Button,
    EmptyData,
    LoadingAnimation,
    TechnicalError,
} from '@components'
import { TooltipProvider } from '@components/ui/tooltip'
import { RtoV2Api } from '@queries'
import { setStudentDetail } from '@redux/slice/student.slice'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import {
    DecisionPanel,
    DetailedView,
    PlacementRequestHeader,
    PlacementRequestStatusAlert,
    QuickSummary,
} from './components'
import { PlacementApprovalSkeleton } from './skeletonLoader'

export const PlacementApprovalDetail = () => {
    const [showDetails, setShowDetails] = useState(true)
    const dispatch = useDispatch()

    const router = useRouter()

    const approvalRequestDetail =
        RtoV2Api.ApprovalRequest.approvalRequestDetail(
            Number(router?.query?.id), {
        }
        )

    useEffect(() => {
        if (
            approvalRequestDetail?.isSuccess &&
            approvalRequestDetail?.data?.student
        ) {
            dispatch(setStudentDetail(approvalRequestDetail?.data?.student))
        }
        return () => {
            dispatch(setStudentDetail(null))
        }
    }, [approvalRequestDetail?.data, approvalRequestDetail?.isSuccess])

    return (
        <>
            {approvalRequestDetail.isError && <TechnicalError />}
            {approvalRequestDetail.isLoading ? (
                <PlacementApprovalSkeleton />
            ) : approvalRequestDetail?.data &&
                approvalRequestDetail?.isSuccess ? (
                <TooltipProvider>
                    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 space-y-3">
                        {/* Header */}
                        <PlacementRequestHeader
                            approval={approvalRequestDetail?.data}
                        />

                        {/* Status Alert */}
                        <PlacementRequestStatusAlert
                            approval={approvalRequestDetail?.data}
                        />

                        {/* Main Content */}
                        <div className="container mx-auto px-4 md:px-6 ">
                            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                                {/* Left Column - Quick Info */}
                                <div className="lg:col-span-2 space-y-3">
                                    <QuickSummary
                                        data={approvalRequestDetail?.data}
                                    />

                                    {!showDetails ? (
                                        <div className="animate-scale-in">
                                            <Button
                                                onClick={() =>
                                                    setShowDetails(true)
                                                }
                                                className="w-full bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white h-14 md:h-16 shadow-lg hover:shadow-xl transition-all group md:text-lg"
                                            >
                                                <span>
                                                    View Detailed Information
                                                </span>
                                                <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform" />
                                            </Button>
                                            <p className="text-center text-sm text-slate-600 mt-3">
                                                Explore compliance checklists,
                                                supervisor qualifications, and
                                                placement requirements
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="animate-slide-in-right">
                                            <DetailedView
                                                approval={
                                                    approvalRequestDetail?.data
                                                }
                                            />
                                            <Button
                                                onClick={() => {
                                                    setShowDetails(false)
                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior: 'smooth',
                                                    })
                                                }}
                                                variant="primaryNew"
                                                className="w-full mt-6 border-2 h-12 text-base hover:bg-slate-50"
                                                outline
                                            >
                                                <ChevronDown className="w-5 h-5 mr-2 rotate-180" />
                                                Hide Detailed Information
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Decision Panel */}
                                <div className="lg:col-span-1">
                                    <div className="lg:sticky lg:top-32 space-y-4">
                                        <DecisionPanel
                                            approval={
                                                approvalRequestDetail?.data
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TooltipProvider>
            ) : (
                approvalRequestDetail?.isSuccess && (
                    <EmptyData
                        title={'No Approved Student!'}
                        description={
                            'You have not approved any Student request yet'
                        }
                        height={'50vh'}
                    />
                )
            )}
        </>
    )
}

import { Card, LoadingAnimation, TechnicalError } from '@components'
import { RtoApi } from '@queries'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PendingPlacementCard } from './card'

export const PendingPlacement = () => {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

    const router = useRouter()

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const wpApprovalRequests = RtoApi.Workplace.wpApprovalRequest(
        {
            limit: itemPerPage,
            skip: itemPerPage * page - itemPerPage,
        },
        {
            refetchOnMountOrArgChange: 30,
        }
    )

    return (
        <div className="space-y-4 animate-fade-in">
            {wpApprovalRequests?.isError && <TechnicalError />}
            {wpApprovalRequests?.isLoading || wpApprovalRequests?.isFetching ? (
                <LoadingAnimation height="h-[60vh]" />
            ) : wpApprovalRequests?.data &&
                wpApprovalRequests?.data?.data.length &&
                wpApprovalRequests?.isSuccess ? (
                wpApprovalRequests?.data?.data?.map((approval: any) => (
                    <PendingPlacementCard
                        key={approval.id}
                        approval={approval}
                    />
                ))
            ) : (
                !wpApprovalRequests?.isError && (
                    <Card className="border-border/60">
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-success" />
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">
                                        All caught up! 🎉
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        No placements pending approval
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )
            )}
        </div>
    )
}

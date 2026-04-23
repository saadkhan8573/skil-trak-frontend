import {
    Badge,
    Button,
    Card,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { Dialog, DialogContent } from '@components/ui/dialog'
import { RtoV2Api } from '@queries'
import { RtoApprovalWorkplaceRequest } from '@types'
import {
    AlertCircle,
    Building2,
    CheckCircle2,
    Loader2,
    MapPin,
    Search,
    Sparkles,
    Zap,
    AlertTriangle,
} from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useNotification } from '@hooks'

export const StartMatchingAutoWP = ({
    onCancel,
    rtoUserId,
}: {
    onCancel: () => void
    rtoUserId?: number
}) => {
    const { notification } = useNotification()
    const wpAutoMatchingList = RtoV2Api.Students.getWpForAutoMatching(
        rtoUserId ? { userId: rtoUserId } : undefined
    )
    const [apply, applyResult] =
        RtoV2Api.Students.runAutomationForAvailabeleStudents()

    const [isProcessing, setIsProcessing] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [accumulatedResults, setAccumulatedResults] = useState<
        RtoApprovalWorkplaceRequest[]
    >([])

    const [failedIndices, setFailedIndices] = useState<number[]>([])
    const [errorMessages, setErrorMessages] = useState<{
        [key: number]: string
    }>({})
    const [hasFinished, setHasFinished] = useState(false)
    const [shouldAutoStart, setShouldAutoStart] = useState(false)

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const activeItemRef = useRef<HTMLDivElement>(null)

    // Auto-scroll logic
    useEffect(() => {
        if (currentIndex !== -1 && activeItemRef.current) {
            setTimeout(() => {
                activeItemRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }, 100)
        }
    }, [currentIndex, accumulatedResults.length])

    const resultData =
        isProcessing || hasFinished || accumulatedResults.length > 0
            ? accumulatedResults
            : applyResult?.data
    const resultMatched = resultData?.filter((res: any) => res) || []

    const onSubmit = useCallback(async () => {
        if (!wpAutoMatchingList?.data?.length) return

        setIsProcessing(true)
        setHasFinished(false)
        setFailedIndices([])
        setErrorMessages({})
        setAccumulatedResults([])
        const total = wpAutoMatchingList.data.length

        let matchesCount = 0
        for (let i = 0; i < total; i++) {
            setCurrentIndex(i)
            const wp = wpAutoMatchingList.data[i]
            try {
                const res = await apply({
                    id: Number(wp?.id),
                }).unwrap()

                if (res) {
                    setAccumulatedResults((prev) => [...prev, res])
                    matchesCount++
                }
            } catch (error: any) {
                const errorMsg =
                    error?.data?.message || error?.message || 'Technical Error'
                setErrorMessages((prev) => ({ ...prev, [i]: errorMsg }))
                setFailedIndices((prev) => [...prev, i])
            }
        }

        setIsProcessing(false)
        setCurrentIndex(-1)
        setHasFinished(true)
        notification.success({
            title: 'Process completed',
            description: `Automation complete: ${matchesCount} matches found for ${total} students processed.`,
            autoDismiss: true,
        })
    }, [wpAutoMatchingList.data, apply])

    // Auto-run after refetch
    useEffect(() => {
        if (
            !wpAutoMatchingList.isFetching &&
            shouldAutoStart &&
            wpAutoMatchingList.isSuccess
        ) {
            setShouldAutoStart(false)
            onSubmit()
        }
    }, [
        wpAutoMatchingList.isFetching,
        shouldAutoStart,
        wpAutoMatchingList.isSuccess,
        onSubmit,
    ])

    // Scroll to bottom on completion
    useEffect(() => {
        if (hasFinished && scrollContainerRef.current) {
            setTimeout(() => {
                scrollContainerRef.current?.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: 'smooth',
                })
            }, 300) // Delay to allow the summary card to render
        }
    }, [hasFinished])

    const handleReset = () => {
        applyResult.reset()
        setAccumulatedResults([])
        setFailedIndices([])
        setErrorMessages({})
        setHasFinished(false)
        setShouldAutoStart(true)

        // Scroll container to top
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }

        wpAutoMatchingList.refetch()
    }

    const isFinished = hasFinished

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open && !isProcessing) onCancel()
            }}
        >
            <DialogContent
                className="max-w-3xl! p-0 overflow-hidden border-none rounded-2xl shadow-2xl **:data-[slot=dialog-close]:opacity-90 **:data-[slot=dialog-close]:hover:opacity-100"
                showCloseButton={!isProcessing}
                aria-describedby={undefined}
            >
                <div
                    className={
                        'relative px-6 pt-6 pb-4 overflow-hidden border-b bg-linear-to-br from-primary/5 via-accent/5 to-transparent'
                    }
                >
                    <div className="relative">
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary backdrop-blur-md flex items-center justify-center shadow-premium border border-white/30 shrink-0">
                                <Zap
                                    className="h-7 w-7 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Typography className="text-primaryNew text-xl">
                                        Automation Matching
                                    </Typography>
                                    {(isProcessing ||
                                        (wpAutoMatchingList.isFetching &&
                                            shouldAutoStart)) && (
                                        <Badge
                                            variant="warning"
                                            text="Processing Sequentially"
                                            className="animate-pulse"
                                        />
                                    )}
                                </div>
                                <Typography className="text-primaryNew text-sm leading-relaxed">
                                    {isProcessing ||
                                    (wpAutoMatchingList.isFetching &&
                                        shouldAutoStart)
                                        ? `Matching in progress... (${currentIndex + 1 >= 0 ? currentIndex + 1 : 0} of ${wpAutoMatchingList?.data?.length || 0})`
                                        : 'Run automation to match students with eligible workplaces'}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                {(isProcessing ||
                    (wpAutoMatchingList.isFetching && shouldAutoStart)) && (
                    <div className="bg-orange-50 border-b border-orange-100 px-6 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-orange-900">
                                Crucial: Processing Automation
                            </p>
                            <p className="text-xs text-orange-700">
                                Please do not close this modal or refresh the
                                page. We are processing requests one by one to
                                ensure system stability.
                            </p>
                        </div>
                        <div className="ml-auto">
                            <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
                        </div>
                    </div>
                )}

                {wpAutoMatchingList?.isError ? (
                    <NoData isError text="There is some technical issue!" />
                ) : null}

                {wpAutoMatchingList?.isLoading ? (
                    <LoadingAnimation />
                ) : wpAutoMatchingList?.data &&
                  wpAutoMatchingList?.data?.length > 0 &&
                  wpAutoMatchingList?.isSuccess ? (
                    <div
                        ref={scrollContainerRef}
                        className="h-[65vh] overflow-auto custom-scrollbar px-4 py-4"
                    >
                        <div className="space-y-4">
                            {!isProcessing && !isFinished && (
                                <div className="bg-gray-50 p-3 rounded-md border border-gray-100 italic">
                                    <Typography className="text-gray-600 text-sm">
                                        <span className="font-semibold text-gray-700">
                                            Note:
                                        </span>{' '}
                                        Automation will run sequentially to
                                        maintain performance.
                                    </Typography>
                                </div>
                            )}

                            {/* Progress Bar */}
                            {isProcessing && (
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${((currentIndex + 1) / wpAutoMatchingList.data.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Students Pending Assignment */}
                            <div>
                                <div className="flex items-center justify-between mb-4 gap-6">
                                    <h3 className="font-semibold flex items-center gap-2 text-primaryNew">
                                        <Badge
                                            text={
                                                wpAutoMatchingList?.data
                                                    ?.length + ''
                                            }
                                        ></Badge>
                                        Students with Workplace Pending Status
                                    </h3>
                                    {!isProcessing && !isFinished && (
                                        <Button
                                            onClick={onSubmit}
                                            Icon={Zap}
                                            loading={isProcessing}
                                            disabled={isProcessing}
                                            text="Run Automation"
                                        />
                                    )}
                                    {isFinished && (
                                        <Button
                                            onClick={handleReset}
                                            variant="primaryNew"
                                            outline
                                            className="gap-2"
                                            Icon={Sparkles}
                                            text="Run Again"
                                        />
                                    )}
                                </div>

                                {/* Students List */}
                                <div className="space-y-3">
                                    {wpAutoMatchingList?.data?.map(
                                        (workplace, index) => {
                                            const result =
                                                accumulatedResults?.find(
                                                    (
                                                        wpApp: RtoApprovalWorkplaceRequest
                                                    ) =>
                                                        wpApp?.student?.id ===
                                                        workplace?.student?.id
                                                )

                                            const isCurrent =
                                                index === currentIndex
                                            const isWaiting =
                                                index > currentIndex &&
                                                currentIndex !== -1
                                            const isFailed =
                                                failedIndices.includes(index)
                                            const isChecked =
                                                index < currentIndex ||
                                                (isFinished &&
                                                    !result &&
                                                    !isFailed)

                                            return (
                                                <div
                                                    key={workplace?.id}
                                                    {...(isCurrent
                                                        ? { ref: activeItemRef }
                                                        : {})}
                                                    className="w-full"
                                                >
                                                    <Card
                                                        className={`border transition-all rounded-md! ${
                                                            result
                                                                ? 'border-success/40 bg-success/5 shadow-sm'
                                                                : isFailed
                                                                  ? 'border-red-400/40 bg-red-50/5'
                                                                  : isChecked ||
                                                                      isFinished
                                                                    ? 'border-orange-400/40 bg-orange-50/5'
                                                                    : isCurrent
                                                                      ? 'border-primary ring-1 ring-primary/20 shadow-md'
                                                                      : 'border-border/60 opacity-80'
                                                        } `}
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <h4 className="font-semibold">
                                                                            {
                                                                                workplace
                                                                                    ?.student
                                                                                    ?.user
                                                                                    .name
                                                                            }{' '}
                                                                            {
                                                                                workplace
                                                                                    ?.student
                                                                                    ?.familyName
                                                                            }
                                                                        </h4>
                                                                        {isCurrent && (
                                                                            <Badge
                                                                                Icon={() => (
                                                                                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                                                                )}
                                                                                text="Checking matches..."
                                                                                variant="primary"
                                                                            />
                                                                        )}
                                                                        {isWaiting && (
                                                                            <Badge
                                                                                text="Queued"
                                                                                variant="secondary"
                                                                            />
                                                                        )}
                                                                        {isFailed && (
                                                                            <Badge
                                                                                text={
                                                                                    errorMessages[
                                                                                        index
                                                                                    ] ||
                                                                                    'Technical Error'
                                                                                }
                                                                                variant="error"
                                                                                Icon={
                                                                                    AlertCircle
                                                                                }
                                                                            />
                                                                        )}
                                                                        {result ? (
                                                                            <Badge
                                                                                Icon={
                                                                                    CheckCircle2
                                                                                }
                                                                                text={
                                                                                    'Match Found'
                                                                                }
                                                                                variant="success"
                                                                            />
                                                                        ) : (
                                                                            !isFailed &&
                                                                            (isChecked ||
                                                                                isFinished) && (
                                                                                <Badge
                                                                                    text="No Auto Match"
                                                                                    variant="primary"
                                                                                    Icon={
                                                                                        AlertCircle
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground mb-1">
                                                                        {
                                                                            workplace
                                                                                ?.courses?.[0]
                                                                                ?.code
                                                                        }
                                                                        {' - '}
                                                                        {
                                                                            workplace
                                                                                ?.courses?.[0]
                                                                                ?.title
                                                                        }
                                                                    </p>
                                                                    <div className="flex items-center gap-3 text-xs">
                                                                        <span className="text-muted-foreground">
                                                                            Batch:{' '}
                                                                            {workplace
                                                                                ?.student
                                                                                ?.batch ||
                                                                                '---'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Match Result Details */}
                                                                    {result && (
                                                                        <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20 animate-in fade-in zoom-in-95">
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-start gap-2">
                                                                                    <Building2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm font-semibold text-success">
                                                                                            {
                                                                                                result
                                                                                                    ?.industry
                                                                                                    ?.user
                                                                                                    ?.name
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                                        <MapPin className="h-3 w-3" />
                                                                                        {
                                                                                            result
                                                                                                ?.industry
                                                                                                ?.addressLine1
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {!result &&
                                                                        isFailed && (
                                                                            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 animate-in fade-in zoom-in-95">
                                                                                <div className="flex items-start gap-2">
                                                                                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                                                                                    <div className="flex-1">
                                                                                        <p className="text-sm font-bold text-red-900">
                                                                                            Process
                                                                                            failed
                                                                                        </p>
                                                                                        <p className="text-xs text-red-700 mt-1">
                                                                                            There
                                                                                            was
                                                                                            an
                                                                                            error
                                                                                            processing
                                                                                            this
                                                                                            request.
                                                                                            This
                                                                                            could
                                                                                            be
                                                                                            due
                                                                                            to
                                                                                            network
                                                                                            or
                                                                                            server
                                                                                            issues.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    {!result &&
                                                                        !isFailed &&
                                                                        (isChecked ||
                                                                            isFinished) && (
                                                                            <div className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-200 animate-in fade-in zoom-in-95">
                                                                                <div className="flex items-start gap-2">
                                                                                    <Search className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                                                                                    <div className="flex-1">
                                                                                        <p className="text-sm font-bold text-orange-900">
                                                                                            Manual
                                                                                            intervention
                                                                                            required
                                                                                        </p>
                                                                                        <p className="text-xs text-orange-700 mt-1">
                                                                                            System
                                                                                            couldn't
                                                                                            find
                                                                                            an
                                                                                            automatic
                                                                                            match
                                                                                            that
                                                                                            satisfies
                                                                                            all
                                                                                            constraints.
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            {isFinished && (
                                <Card className="border-primary/40 bg-linear-to-br from-primary/5 to-transparent animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-6">
                                        <h3 className="font-semibold mb-4 flex items-center gap-2 text-primaryNew">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            Automation Summary
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 rounded-xl bg-success/10 border border-success/20 shadow-sm">
                                                <p className="text-3xl font-bold text-success mb-1">
                                                    {resultMatched?.length || 0}
                                                </p>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                                    Matches
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 shadow-sm">
                                                <p className="text-3xl font-bold text-orange-600 mb-1">
                                                    {(wpAutoMatchingList?.data
                                                        ?.length || 0) -
                                                        (resultMatched?.length ||
                                                            0) -
                                                        (failedIndices?.length ||
                                                            0)}
                                                </p>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                                    Manual
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm">
                                                <p className="text-3xl font-bold text-red-600 mb-1">
                                                    {failedIndices?.length || 0}
                                                </p>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                                    Failed
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 space-y-4">
                                            <div className="p-3 bg-white/50 border border-border/40 rounded-lg">
                                                <p className="text-xs text-center text-muted-foreground">
                                                    Automation process
                                                    completed. You can now
                                                    safely close this window or
                                                    review individual matches.
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleReset}
                                                variant="primaryNew"
                                                className="w-full gap-2 py-6! text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                                                Icon={Sparkles}
                                                text="Run Automation Again"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : wpAutoMatchingList?.isSuccess ? (
                    <NoData text="No Students were found!" />
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

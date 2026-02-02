import {
    Badge,
    Button,
    Card,
    GlobalModal,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    Typography,
} from '@components'
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
} from 'lucide-react'
import { MdCancel } from 'react-icons/md'

export const StartMatchingAutoWP = ({ onCancel }: { onCancel: () => void }) => {
    const wpAutoMatchingList = RtoV2Api.Students.getWpForAutoMatching()
    const [apply, applyResult] =
        RtoV2Api.Students.runAutomationForAvailabeleStudents()

    const resultData = applyResult?.data

    const resultMatched = resultData?.filter((res: any) => res)

    const onSubmit = async () => {
        await apply({
            ids: wpAutoMatchingList?.data?.map((wp) => Number(wp?.id)) || [],
        })
    }

    const handleReset = () => {
        applyResult.reset()
        wpAutoMatchingList.refetch()
    }
    return (
        <GlobalModal className="overflow-hidden! max-w-3xl!">
            <ShowErrorNotifications result={applyResult} />
            <MdCancel
                onClick={() => {
                    if (onCancel) {
                        onCancel()
                    }
                }}
                className="z-30 transition-all duration-500 text-gray-200 hover:text-gray-100 text-3xl cursor-pointer hover:rotate-90 absolute top-2 right-2"
            />
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
                            </div>
                            <Typography className="text-primaryNew text-sm leading-relaxed">
                                Run automation to match students with eligible
                                workplaces
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>

            {wpAutoMatchingList?.isError ? (
                <NoData isError text="There is some technical issue!" />
            ) : null}

            {wpAutoMatchingList?.isLoading || wpAutoMatchingList?.isFetching ? (
                <LoadingAnimation />
            ) : wpAutoMatchingList?.data &&
                wpAutoMatchingList?.data?.length > 0 &&
                wpAutoMatchingList?.isSuccess ? (
                <div className="h-[70vh] overflow-auto custom-scrollbar px-4 py-2">
                    <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                            <Typography className="text-gray-600 text-sm">
                                <span className="font-semibold text-gray-700">Note:</span> Only 5
                                workplaces will be automated per run.
                            </Typography>
                        </div>
                        {/* Students Pending Assignment */}
                        <div>
                            <div className="flex items-center justify-between mb-4 gap-6">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Badge
                                        text={
                                            wpAutoMatchingList?.data?.length +
                                            ''
                                        }
                                    ></Badge>
                                    Students with Workplace Pending Status
                                </h3>
                                {!resultData?.length && (
                                    <Button
                                        onClick={onSubmit}
                                        Icon={Zap}
                                        loading={applyResult.isLoading}
                                        disabled={applyResult.isLoading}
                                        text="Run Automation"
                                    />
                                )}
                                {resultData?.length &&
                                    !applyResult?.isLoading && (
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
                                {wpAutoMatchingList?.data?.map((workplace) => {
                                    const result = applyResult?.data?.find(
                                        (wpApp: RtoApprovalWorkplaceRequest) =>
                                            wpApp?.student?.id ===
                                            workplace?.student?.id
                                    )

                                    return (
                                        <Card
                                            key={workplace?.id}
                                            className={`border transition-all rounded-md! ${result
                                                ? 'border-success/40 bg-success/5'
                                                : applyResult?.data &&
                                                'border-orange-400/40 bg-orange-50/50'
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
                                                                }
                                                            </h4>
                                                            {applyResult?.isLoading && (
                                                                <Badge
                                                                    Icon={() => (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    )}
                                                                    text="Matching..."
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
                                                                applyResult?.data && (
                                                                    <Badge
                                                                        text="Use Manual Finder"
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
                                                            <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20">
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
                                                            applyResult?.data && (
                                                                <div className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                                                                    <div className="flex items-start gap-2">
                                                                        <Search className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-semibold text-orange-900">
                                                                                No
                                                                                automatic
                                                                                match
                                                                                found
                                                                            </p>
                                                                            {/* <p className="text-xs text-orange-700 mt-1">
                                                                                    Please
                                                                                    use
                                                                                    manual
                                                                                    finder
                                                                                    to
                                                                                    search
                                                                                    for
                                                                                    suitable
                                                                                    workplaces
                                                                                </p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Summary */}
                        {resultData?.length > 0 && !applyResult?.isLoading && (
                            <Card className="border-primary/40 bg-linear-to-br from-primary/5 to-transparent">
                                <div className="p-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Matching Summary
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                            <p className="text-2xl font-bold text-success">
                                                {resultMatched?.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Automatic Matches
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                                            <p className="text-2xl font-bold text-orange-600">
                                                {resultData?.length -
                                                    resultMatched.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Requires Manual Finder
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            ) : wpAutoMatchingList?.isSuccess ? (
                <NoData text="No Students were found!" />
            ) : null}
        </GlobalModal>
    )
}

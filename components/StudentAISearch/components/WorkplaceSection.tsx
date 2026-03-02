import {
    Badge,
    Button,
    LoadingAnimation,
    NoData,
    TechnicalError,
} from '@components'
import { CommonApi } from '@queries'
import { Student } from '@types'
import { motion } from 'framer-motion'

import {
    AlertCircle,
    BookOpen,
    Building2,
    CheckCircle2,
    Clock,
    ExternalLink,
    Plus,
} from 'lucide-react'
import { IWorkplaceIndustries } from '@redux/queryTypes'

interface WorkplaceSectionProps {
    student: Student
}

export function WorkplaceSection({ student }: WorkplaceSectionProps) {
    const workplaces = CommonApi.AiAssistant.studentWorkplaceRequest(
        student?.id,
        {
            skip: !student?.id,
        }
    )

    const filterAppliedWorkplaces = (
        placements: IWorkplaceIndustries[] | undefined
    ) => {
        if (placements && placements?.length > 0) {
            return placements
                ?.map((placement) => ({
                    ...placement,
                    industries:
                        placement?.industries &&
                        placement?.industries?.length > 0
                            ? placement?.industries.filter(
                                  (industry: any) => industry.applied === true
                              )
                            : [],
                }))
                .filter((placement) => placement.industries.length > 0)
        }
        return []
    }

    const filteredWp = filterAppliedWorkplaces(workplaces?.data)

    // Scenario 1: No workplaces
    if (filteredWp?.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-md border-2 border-dashed border-border bg-white h-full p-6 shadow-lg lg:col-span-2"
            >
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.7,
                            type: 'spring',
                            stiffness: 200,
                        }}
                        className="rounded-full bg-purple-500/10 p-6"
                    >
                        <Building2 className="h-12 w-12 text-purple-500" />
                    </motion.div>

                    {/* Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                    >
                        <h3 className="flex items-center justify-center gap-2">
                            <Building2 className="h-5 w-5 text-purple-500" />
                            No Workplace Added Yet
                        </h3>
                        <p className="max-w-md text-sm text-muted-foreground">
                            This student hasn't been placed with a host
                            organization yet. Add a workplace to begin tracking
                            their placement progress.
                        </p>
                    </motion.div>

                    {/* Info Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="max-w-md rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground"
                    >
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                            <p>
                                Once added, you'll be able to track placement
                                hours, manage agreements, and monitor student
                                progress at the workplace.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    // Scenario 2 & 3: One or multiple workplaces
    const activeWorkplaces = filteredWp?.filter(
        (w) => w?.status === 'active'
    )?.length
    const totalHoursCompleted = filteredWp
        ?.filter((w: any) => w?.hoursCompleted)
        .reduce((sum: any, w: any) => sum + (w?.hoursCompleted || 0), 0)

    return (
        <>
            {workplaces.isError ? <TechnicalError /> : null}
            {workplaces.isLoading || workplaces.isFetching ? (
                <LoadingAnimation />
            ) : filteredWp && workplaces?.isSuccess ? (
                <>
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <h3 className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-purple-500" />
                                    Host Organisation
                                </h3>
                                <Badge
                                    text={`${filteredWp?.length} 
                            ${
                                filteredWp?.length === 1
                                    ? 'Workplace'
                                    : 'Workplaces'
                            }`}
                                    variant="secondary"
                                    className="gap-1"
                                ></Badge>
                                {Number(activeWorkplaces) > 0 && (
                                    <Badge
                                        Icon={CheckCircle2}
                                        variant="info"
                                        className="gap-1"
                                        text={`${activeWorkplaces} Active`}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Summary for multiple workplaces */}
                        {filteredWp?.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
                            >
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-lg bg-purple-500/10 p-2">
                                            <Building2 className="h-4 w-4 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Total Organisation
                                            </p>
                                            <p>{filteredWp?.length}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-lg bg-green-500/10 p-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Active Placements
                                            </p>
                                            <p>{activeWorkplaces}</p>
                                        </div>
                                    </div>
                                    {totalHoursCompleted > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-blue-500/10 p-2">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Total Hours
                                                </p>
                                                <p>{totalHoursCompleted} hrs</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <div
                            className={`grid gap-4 ${
                                filteredWp?.length === 1 ? '' : 'lg:grid-cols-2'
                            }`}
                        >
                            {filteredWp?.map((workplace, index) => (
                                <motion.div
                                    key={workplace.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className={`rounded-2xl border-2 border-border bg-card shadow-lg transition-all hover:border-primaryNew/50 hover:shadow-xl ${
                                        filteredWp?.length === 1 ? 'p-8' : 'p-6'
                                    }`}
                                    whileHover={{ y: -2 }}
                                >
                                    {/* Header */}
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <h4 className="text-base">
                                                    {
                                                        workplace
                                                            ?.industries?.[0]
                                                            ?.industry?.user
                                                            ?.name
                                                    }
                                                </h4>
                                                {workplace?.status ===
                                                    'active' && (
                                                    <Badge
                                                        shape="pill"
                                                        variant="info"
                                                        className="gap-1 text-xs"
                                                        Icon={CheckCircle2}
                                                        text="Active"
                                                    />
                                                )}
                                                {workplace?.status ===
                                                    'pending' && (
                                                    <Badge
                                                        shape="pill"
                                                        variant="secondary"
                                                        className="gap-1 text-xs"
                                                        Icon={Clock}
                                                        text="Pending"
                                                    />
                                                )}
                                                {workplace?.status ===
                                                    'completed' && (
                                                    <Badge
                                                        shape="pill"
                                                        variant="info"
                                                        outline
                                                        className="gap-1 text-xs"
                                                        Icon={CheckCircle2}
                                                        text="Completed"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    workplace?.industries?.[0]
                                                        ?.industry?.user?.name
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Courses */}
                                    {workplace?.courses &&
                                        workplace?.courses?.length > 0 && (
                                            <>
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {workplace?.courses?.map(
                                                        (course, idx) => (
                                                            <Badge
                                                                outline
                                                                key={idx}
                                                                shape="pill"
                                                                Icon={BookOpen}
                                                                variant="primaryNew"
                                                                text={
                                                                    course?.title
                                                                }
                                                                className="gap-1 text-xs"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                {/* <Separator className="mb-4" /> */}
                                            </>
                                        )}

                                    {/* Progress - if active */}
                                    {(workplace as any)?.status === 'active' &&
                                        (workplace as any)?.hoursCompleted !==
                                            undefined &&
                                        (workplace as any)?.totalHours !==
                                            undefined && (
                                            <>
                                                <div className="mb-4 rounded-lg bg-primary/5 p-3">
                                                    <div className="mb-2 flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Hours Progress
                                                        </span>
                                                        <span>
                                                            {
                                                                (
                                                                    workplace as any
                                                                )
                                                                    ?.hoursCompleted
                                                            }{' '}
                                                            /{' '}
                                                            {
                                                                (
                                                                    workplace as any
                                                                )?.totalHours
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                        <motion.div
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            animate={{
                                                                width: `${
                                                                    ((
                                                                        workplace as any
                                                                    )
                                                                        ?.hoursCompleted /
                                                                        (
                                                                            workplace as any
                                                                        )
                                                                            ?.totalHours) *
                                                                    100
                                                                }%`,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    0.8 +
                                                                    index * 0.1,
                                                                duration: 0.8,
                                                            }}
                                                            className="h-full bg-primary"
                                                        />
                                                    </div>
                                                </div>
                                                {/* <Separator className="mb-4" /> */}
                                            </>
                                        )}

                                    {/* Dates */}
                                    {/* {workplace?.startDate && (
                                        <div className="mb-4 space-y-2 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">
                                                    Start Date
                                                </span>
                                                <span>
                                                    {workplace.startDate}
                                                </span>
                                            </div>
                                            {workplace.endDate && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">
                                                        {workplace.status ===
                                                        'completed'
                                                            ? 'Completed'
                                                            : 'Expected End'}
                                                    </span>
                                                    <span>
                                                        {workplace.endDate}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )} */}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                workplaces?.isSuccess && (
                    <NoData isError text="No student was found!" />
                )
            )}
        </>
    )
}

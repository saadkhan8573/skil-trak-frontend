import { useEffect, useState } from 'react'

// components
import { ActionButton, Card, LoadingAnimation, Typography } from '@components'

import { IndustryNotResponded } from '@partials/common'
import { RejectedIndustries } from '@partials/common/workplace/components/dontHaveWorkplace/RejectedIndustries'
import { useCancelWorkplaceRequestMutation } from '@queries'
import { WorkplaceCurrentStatus } from '@utils'
import { AppliedIndustry } from './AppliedIndustry'
import { ApplyForWorkplace, VerifyStudentDocs } from './components'

export const IndustrySelection = ({
    setActive,
    // selectedCourses,
    workplace,
}: {
    setActive: Function
    // selectedCourses: number[]
    workplace: any
}) => {
    const [industries, setIndustries] = useState<any[] | null>([])
    const [noRespondedIndustries, setNoRespondedIndustries] = useState<
        any | null
    >([])
    const [rejectedIndustries, setRejectedIndustries] = useState<any | null>([])
    const [selectedCourses, setSelectedCourses] = useState<any[] | null>(null)
    const [industrySelection, setIndustrySelection] = useState(null)
    const [appliedIndustry, setAppliedIndustry] = useState<any | null>(null)
    const [workplaceIndustries, setWorkplaceIndustries] = useState<any | null>(
        null
    )
    const assignedCoordinator = workplace.data?.[0]?.assignedTo

    const [cancelRequest, cancelRequestResult] =
        useCancelWorkplaceRequestMutation()

    useEffect(() => {
        if (workplace?.data) {
            const allIndustries = workplace?.data[0]?.industries
            setWorkplaceIndustries(workplace?.data[0])
            setNoRespondedIndustries(
                allIndustries
                    ?.filter((i: any) => i?.industryResponse === 'noResponse')
                    ?.map((i: any) => i?.industry)
            )
            setRejectedIndustries(
                allIndustries
                    ?.filter((i: any) => i?.industryResponse === 'rejected')
                    ?.map((i: any) => i?.industry)
            )
            setIndustries(
                allIndustries?.filter(
                    (industry: any) =>
                        !industry?.applied &&
                        industry?.industryResponse !== 'noResponse' &&
                        industry?.industryResponse !== 'rejected'
                )
            )
            setAppliedIndustry(allIndustries?.find((i: any) => i.applied))
            // setSelectedCourses(
            //     allIndustries
            //         ?.find((i: any) => i.industry.id === industrySelection)
            //         ?.industry.courses.map((c: any) => c.id)
            // )
            setSelectedCourses(workplace?.data[0]?.courses[0]?.id)
        }
    }, [
        workplace,
        industrySelection,
        // applyForWorkplaceResult.isSuccess,
    ])

    useEffect(() => {
        if (cancelRequestResult.isSuccess) {
            setActive(1)
        }
    }, [cancelRequestResult.isSuccess])

    const workplaceCancelRequest = (simple: boolean = false) => {
        const workplaceStatus = [
            WorkplaceCurrentStatus.NotRequested,
            WorkplaceCurrentStatus.Applied,
            WorkplaceCurrentStatus.CaseOfficerAssigned,
            WorkplaceCurrentStatus.Interview,
            WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
        ]

        if (workplaceStatus.includes(workplaceIndustries?.currentStatus)) {
            return (
                <div className="mt-3">
                    <ActionButton
                        variant={'error'}
                        onClick={async () => {
                            await cancelRequest()
                        }}
                        loading={cancelRequestResult.isLoading}
                        disabled={cancelRequestResult.isLoading}
                        simple={simple}
                    >
                        Cancel Request
                    </ActionButton>
                </div>
            )
        }
        return null
    }

    return !industrySelection ? (
        <div className="flex flex-col gap-y-3">
            {appliedIndustry && (
                <>
                    <AppliedIndustry
                        appliedIndustry={appliedIndustry}
                        setIndustrySelection={setIndustrySelection}
                        status={workplaceIndustries?.currentStatus}
                        workplaceRequest={workplaceIndustries}
                        course={workplaceIndustries?.courses?.[0]}
                    />
                </>
            )}
            {/*  */}
            {workplace?.isFetching ? (
                <LoadingAnimation />
            ) : industries && industries.length > 0 ? (
                <Card>
                    <Typography variant={'label'}>Select Industry</Typography>
                    <div className="my-4 flex flex-col gap-y-2">
                        <Typography variant={'muted'} color={'text-gray-400'}>
                            These are most suitable industries we have according
                            to your given criteria.
                        </Typography>
                        {industries?.map((industry: any, i: number) => {
                            return (
                                <ApplyForWorkplace
                                    key={industry.id}
                                    industry={industry}
                                    industries={industries}
                                    appliedIndustry={appliedIndustry}
                                    index={i}
                                />
                            )
                        })}
                    </div>
                </Card>
            ) : (
                !appliedIndustry && (
                    <Card>
                        <div className="flex flex-col gap-y-3 px-5 py-12 border border-dashed rounded-lg">
                            <Typography
                                variant={'subtitle'}
                                color={'text-gray-600'}
                            >
                                Thank you for submitting your Workplace Request!
                            </Typography>
                            <Typography
                                variant={'label'}
                                color={'text-gray-600'}
                            >
                                Your request has been successfully received. Our
                                placement team will now review your information.
                                One of our coordinators will reach out to you
                                within 48 hours. regarding your workplace
                                placement.
                            </Typography>
                            <div>
                                <Typography
                                    variant={'label'}
                                    color={'text-gray-600'}
                                >
                                    If you have any immediate questions, feel
                                    free to reach out to us at:
                                </Typography>
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-600'}
                                    semibold
                                >
                                    Phone: 0393636378
                                </Typography>
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-600'}
                                    semibold
                                >
                                    Email:{' '}
                                    {assignedCoordinator
                                        ? assignedCoordinator?.departmentMember
                                              ?.department?.email ??
                                          'info@skiltrak.com.au'
                                        : 'info@skiltrak.com.au'}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                )
            )}
            {noRespondedIndustries && noRespondedIndustries?.length > 0 ? (
                <IndustryNotResponded industries={noRespondedIndustries} />
            ) : null}
            {rejectedIndustries && rejectedIndustries?.length > 0 ? (
                <RejectedIndustries industries={rejectedIndustries} />
            ) : null}
        </div>
    ) : (
        <VerifyStudentDocs
            setActive={setActive}
            setIndustrySelection={setIndustrySelection}
            id={industrySelection}
            selectedCourses={selectedCourses}
            workplaceId={workplaceIndustries?.id}
        />
    )
}

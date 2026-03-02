import { Typography } from '@components/Typography'
import { useContextBar, useNotification } from '@hooks'
import { useEffect, useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { AddIndustryCB } from '../../contextBar'
import { Actions, IndustryCard } from './components'
import { Student } from '@types'
import { ByAbnActions } from './components/Actions'

export const Industries = ({
    industries,
    workplaceId,
    appliedIndustry,
    workplace,
    courseId,
    folders,
}: {
    industries: WorkplaceWorkIndustriesType[]
    workplaceId: number
    appliedIndustry: WorkplaceWorkIndustriesType
    workplace: IWorkplaceIndustries
    courseId: number
    folders: any
}) => {
    // const ii = industries.map((i) => i.industryResponse)
    // const industryResponse = ii.includes('rejected') || ii.includes('noResponse')

    const [suggestedIndustries, setSuggestedIndustries] = useState<any | null>(
        null
    )

    useEffect(() => {
        setSuggestedIndustries(
            industries
                ?.filter((i: WorkplaceWorkIndustriesType) => !i.applied)
                ?.slice(0, appliedIndustry ? 4 : 3)
        )
    }, [industries])

    const { setContent, show } = useContextBar()
    const { notification } = useNotification()
    return (
        <div>
            <div className="flex justify-between">
                <Typography variant={'xs'} color={'text-gray-400'}>
                    Suggested Industries
                </Typography>
                <Typography
                    variant={'small'}
                    color={'text-info'}
                    // color={appliedIndustry ? 'text-gray-300' : 'text-info'}
                >
                    <span
                        className="font-semibold cursor-pointer"
                        onClick={() => {
                            if (!appliedIndustry) {
                                setContent(
                                    <AddIndustryCB
                                        workplaceId={workplace?.id}
                                        courseId={courseId}
                                    />
                                )
                                show()
                            } else {
                                notification.warning({
                                    title: 'Already Applied',
                                    description:
                                        'Student have already applied to industry',
                                })
                            }
                        }}
                    >
                        {/* + Add Industry */}
                    </span>
                </Typography>
            </div>

            {/* industries List */}
            <div className="border border-dashed border-gray-400 rounded-lg p-1 flex flex-col gap-y-1">
                {/* {appliedIndustry} */}
                {appliedIndustry && (
                    <IndustryCard
                        industry={appliedIndustry}
                        workplace={workplace}
                    />
                )}

                {/* Book Appointment Button */}
                {!appliedIndustry?.cancelled &&
                appliedIndustry?.industryResponse !== 'rejected' ? (
                    workplace?.byExistingAbn ? (
                        <ByAbnActions
                            appliedIndustry={appliedIndustry}
                            workplaceId={workplaceId}
                            workplace={workplace}
                            folders={folders}
                            student={workplace?.student as Student}
                        />
                    ) : (
                        <Actions
                            appliedIndustry={appliedIndustry}
                            workplaceId={workplaceId}
                            workplace={workplace}
                            folders={folders}
                            student={workplace?.student as Student}
                        />
                    )
                ) : null}

                {appliedIndustry?.industryResponse !== 'approved' &&
                    suggestedIndustries?.map(
                        (industry: WorkplaceWorkIndustriesType) => (
                            <IndustryCard
                                key={industry.id}
                                industry={industry}
                                appliedIndustry={appliedIndustry}
                                workplace={workplace}
                            />
                        )
                    )}
            </div>
        </div>
    )
}

import { Button, Badge, Typography } from '@components'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { ReactElement, useState } from 'react'
import { AddIndustryProgramModal } from '../modal'
import { Industry } from '@types'
import { AdminApi } from '@queries'
import { Plus } from 'lucide-react'

export const AddCourseProgramIndustry = ({
    industry,
    approval,
}: {
    approval: any
    industry: Industry
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const industryProgram = AdminApi.Industries.industryCourseProgramsList(
        {
            courseId: approval?.course?.id,
            industryId: industry?.id,
        },
        {
            skip: !approval?.course?.id || !industry?.id,
        }
    )

    const coursePrograms = AdminApi.Courses.courseProgramList({
        id: approval?.course?.id,
        limit: 100,
        skip: 0,
    })

    const isDeletedInternal = !!approval?.deletedAt

    const onCancel = () => {
        setModal(null)
        industryProgram.refetch()
    }

    const onAddIndustryCourseProgram = () => {
        setModal(
            <AddIndustryProgramModal
                industry={industry}
                onCancel={onCancel}
                approval={approval}
            />
        )
    }

    return (
        <div className="flex items-center gap-2">
            {modal}
            {coursePrograms?.data?.data &&
                coursePrograms?.data?.data?.length > 0 && (
                    <Typography variant="label" semibold>
                        Streams:
                    </Typography>
                )}
            {industryProgram?.data?.map((program: any) => (
                <Badge
                    key={program?.id}
                    variant="primaryNew"
                    outline
                    text={program?.courseProgram?.title}
                    className="!py-0.5 !bg-gray-100"
                />
            ))}
            {coursePrograms?.data?.data &&
                coursePrograms?.data?.data?.length > 0 &&
                !isDeletedInternal && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    onClick={onAddIndustryCourseProgram}
                                    Icon={Plus}
                                    mini
                                    iconSize={14}
                                    variant="info"
                                    className="!py-1 !rounded-sm"
                                />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>Add Streams</TooltipContent>
                    </Tooltip>
                )}
        </div>
    )
}

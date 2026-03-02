import {
    Card,
    InitialAvatar,
    Select,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { RtoCellInfo } from '@partials/admin/rto/components'
import {
    ProgressCell,
    StudentCellInfo,
} from '@partials/admin/student/components'
import {
    Industries,
    RequestType,
} from '@partials/sub-admin/workplace/components'

import { AdminApi } from '@queries'
import { Course, OptionType } from '@types'
import {
    CourseSelectOption,
    checkWorkplaceStatus,
    formatOptionLabel,
} from '@utils'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { RiBook2Fill } from 'react-icons/ri'
import { AssignWorkplace } from '../AssignWorkplace'
import { StudentDetail } from '../StudentDetail'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
type Props = {
    workplace: IWorkplaceIndustries
}

export const AdminWorkplaceRequest = ({ workplace }: Props) => {
    const [appliedIndustry, setAppliedIndustry] =
        useState<WorkplaceWorkIndustriesType | null>(null)

    // notification
    const { notification } = useNotification()

    // query
    const [assignCourse, assignCourseResult] = AdminApi.Workplace.assignCourse()

    useEffect(() => {
        setAppliedIndustry(
            workplace.industries?.find(
                (i: WorkplaceWorkIndustriesType) => i.applied
            ) as WorkplaceWorkIndustriesType
        )
    }, [workplace])

    useEffect(() => {
        if (assignCourseResult.isSuccess) {
            notification.success({
                title: 'Course Assigned',
                description: 'Course Assigned Successfully',
            })
        }
    }, [assignCourseResult])

    const steps = checkWorkplaceStatus(workplace?.currentStatus)

    const courseOptions =
        workplace?.student?.courses && workplace?.student?.courses?.length > 0
            ? workplace?.student?.courses?.map((course: Course) => ({
                  item: course,
                  value: course?.id,
                  label: course?.title,
              }))
            : []

    return (
        <div>
            <ShowErrorNotifications result={assignCourseResult} />
            <Card noPadding>
                <div
                    className={`${
                        workplace?.studentProvidedWorkplace ||
                        workplace?.byExistingAbn
                            ? 'bg-gray-100'
                            : ''
                    } p-4 rounded-lg`}
                >
                    <div className="grid grid-cols-4 gap-x-5 items-center pb-2.5 border-b border-dashed">
                        <AssignWorkplace workplace={workplace} />
                        <div className="flex items-center relative">
                            <div className="flex items-center gap-x-2">
                                {workplace?.student?.rto?.user && (
                                    <RtoCellInfo
                                        rto={workplace?.student?.rto}
                                    />
                                )}
                            </div>
                        </div>
                        {/*  */}
                        {workplace?.courses &&
                        workplace?.courses?.length > 0 ? (
                            <div className="flex items-center relative">
                                <div className="flex items-center gap-x-2">
                                    <RiBook2Fill className="text-gray-400 text-2xl" />
                                    <div>
                                        <Typography
                                            color={'black'}
                                            variant={'xs'}
                                        >
                                            {
                                                workplace?.courses[0]?.sector
                                                    ?.name
                                            }
                                        </Typography>
                                        <Typography variant={'muted'}>
                                            <span className="break-all">
                                                {
                                                    workplace?.courses[0]?.code
                                                }{' '}
                                            </span>
                                            -{' '}
                                            <span className="break-all">
                                                {workplace?.courses[0]?.title}
                                            </span>
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Select
                                label={'Course'}
                                name={'course'}
                                options={courseOptions}
                                placeholder={'Select Course...'}
                                onChange={(e: OptionType) => {
                                    if (e?.value) {
                                        assignCourse({
                                            courseId: Number(e?.value),
                                            workplaceId: Number(workplace?.id),
                                        })
                                    }
                                }}
                                components={{ Option: CourseSelectOption }}
                                loading={assignCourseResult.isLoading}
                                disabled={assignCourseResult.isLoading}
                                formatOptionLabel={formatOptionLabel}
                            />
                        )}

                        <ProgressCell
                            appliedIndustry={appliedIndustry}
                            step={steps > 14 ? 14 : steps < 1 ? 1 : steps}
                        />
                    </div>

                    {/* Student Small Details */}
                    <div className="mt-3 flex justify-between items-center">
                        <StudentDetail data={workplace?.student} />

                        {/*  */}
                        <div className="flex items-center gap-x-5">
                            {/* <div className="flex flex-col items-end gap-y-1">
                            <Typography variant={'small'}>
                                <span className="bg-primary-light text-primary rounded-md p-1">
                                    Documents Pending
                                </span>
                            </Typography>
                            <Typography variant={'small'} color={'text-info'}>
                                <span className="font-semibold">
                                    View Folders
                                </span>
                            </Typography>
                        </div> */}
                            <div>
                                <Typography variant={'xs'}>
                                    Recieved On:
                                </Typography>
                                <Typography variant={'small'}>
                                    <span className="font-semibold">
                                        {moment(
                                            workplace?.createdAt,
                                            'YYYY-MM-DD hh:mm:ss Z'
                                        ).format('Do MMM, YYYY')}
                                    </span>{' '}
                                    Date
                                </Typography>
                            </div>
                        </div>
                    </div>

                    {/* Industries and notes */}
                    <div className="grid grid-cols-2 gap-x-3 mt-4">
                        {/* Industries */}
                        <Industries
                            appliedIndustry={appliedIndustry}
                            industries={workplace?.industries}
                            workplaceId={workplace?.id}
                            workplace={workplace}
                            admin
                        />

                        {/* Notes */}
                        {/* <Notes /> */}
                    </div>
                </div>
            </Card>
        </div>
    )
}

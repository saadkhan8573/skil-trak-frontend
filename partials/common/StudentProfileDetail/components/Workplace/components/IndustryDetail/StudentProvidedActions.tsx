import { Button, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { SignAgreement } from '@partials/sub-admin/workplace/components/Industries/components/Actions/components'
import { CommonApi, useChangeCustomIndustryStatusMutation } from '@queries'
import { Course, Student, UserStatus } from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import React, { ReactElement, useEffect, useState } from 'react'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { InitiateSign } from './components'
import { AgreementSignedModal } from '../../modals'

export const StudentProvidedActions = ({
    student,
    workplace,
    appliedIndustry,
    courses,
}: {
    student: Student
    appliedIndustry: WorkplaceWorkIndustriesType
    workplace: any
    courses: Course[]
}) => {
    const [actionStatus, setActionStatus] = useState<any | string>('')

    const { notification } = useNotification()

    const course = courses?.[0]

    const eSignDocument = CommonApi.ESign.useStudentEsignDocument(
        {
            std: student?.user?.id,
            folder: Number(course?.assessmentEvidence?.[0]?.id),
        },
        {
            skip: !course || !course?.assessmentEvidence?.length,
            refetchOnMountOrArgChange: true,
        }
    )
    const [changeCustomIndustryStatus, changeCustomIndustryStatusResult] =
        useChangeCustomIndustryStatusMutation()

    useEffect(() => {
        if (changeCustomIndustryStatusResult.isSuccess) {
            notification.success({
                title: `Industry ${actionStatus}`,
                description: `Industry ${actionStatus} Successfully`,
            })
        }
    }, [changeCustomIndustryStatusResult])

    return (
        <div>
            <ShowErrorNotifications result={changeCustomIndustryStatusResult} />
            {workplace?.industryStatus === UserStatus.Pending ? (
                <div className="flex items-center gap-x-2">
                    <Button
                        text={'Approve Industry'}
                        onClick={() => {
                            setActionStatus(UserStatus.Approved)
                            if (workplace?.assignedTo) {
                                changeCustomIndustryStatus({
                                    industryId:
                                        appliedIndustry?.industry?.user?.id,
                                    workplaceId: workplace?.id,
                                    status: UserStatus.Approved,
                                })
                            } else {
                                notification.error({
                                    title: 'Changing Status Failed',
                                    description:
                                        'You can,t change the status without assigning Workplace',
                                })
                            }
                        }}
                        loading={changeCustomIndustryStatusResult.isLoading}
                        disabled={changeCustomIndustryStatusResult.isLoading}
                    />
                    <Button
                        text={'Reject Industry'}
                        variant={'dark'}
                        onClick={() => {
                            setActionStatus(UserStatus.Rejected)
                            if (workplace?.assignedTo) {
                                changeCustomIndustryStatus({
                                    industryId:
                                        appliedIndustry?.industry?.user?.id,
                                    workplaceId: workplace?.id,
                                    status: UserStatus.Rejected,
                                })
                            } else {
                                notification.error({
                                    title: 'Changing Status Failed',
                                    description:
                                        'You can,t change the status without assigning Workplace',
                                })
                            }
                        }}
                        loading={changeCustomIndustryStatusResult.isLoading}
                        disabled={changeCustomIndustryStatusResult.isLoading}
                    />
                </div>
            ) : null}

            {workplace?.currentStatus ===
            WorkplaceCurrentStatus.AwaitingAgreementSigned ? (
                <div className="flex items-center gap-x-2">
                    <InitiateSign
                        student={student}
                        folder={course?.assessmentEvidence?.[0]}
                        courseId={course?.id}
                        eSignDocument={eSignDocument}
                    />

                    {/* <SignAgreement
                        student={student}
                        courses={courses}
                        studentId={Number(student?.id)}
                        appliedIndustryId={appliedIndustry?.id}
                    /> */}
                </div>
            ) : null}
        </div>
    )
}

import { Select, SelectOption, Typography } from '@components'
import { UserRoles } from '@constants'
import { workplaceQuestionsKeys } from '@partials/common/workplace/enum'
import { CommonApi, SubAdminApi } from '@queries'
import { WorkplaceTypes } from '@types'
import { getUserCredentials } from '@utils'
import { useMemo } from 'react'
import { questionList, workplaceQuestions } from '../questionListData'
import { AvailabilitySelector } from './AvailabilitySelector'
import { DaysQuestions } from './DaysQuestions'
import { DefaultQuestions } from './DefaultQuestions'
import { TextAreaQuestions } from './TextAreaQuestions'
import { TextTypeQuestions } from './TextTypeQuestions'

export const PersonalInfoQuestions = ({
    userId,
    formMethods,
    selectedCourse,
    personalInfoData,
}: {
    userId?: number
    formMethods: any
    personalInfoData: any
    selectedCourse: number
}) => {
    const formValues = formMethods.watch()

    const role = getUserCredentials()?.role

    const wpType = SubAdminApi.Student.getWpTypeByRtoAndCourse(
        {
            courseId: selectedCourse,
            stdId: Number(userId),
        },
        {
            skip: (!userId && role === UserRoles.SUBADMIN) || !selectedCourse,
        }
    )

    const getSectorByCourseId = CommonApi.Courses.getSectorByCourseId(
        Number(selectedCourse),
        {
            skip: !selectedCourse,
        }
    )

    const visibleQuestions = useMemo(() => {
        let filtered = questionList
        if (
            getSectorByCourseId?.isSuccess &&
            getSectorByCourseId?.data?.id !== 1
        ) {
            filtered = filtered.filter(
                (q) => q?.name !== workplaceQuestionsKeys.serviceOffered
            )
        }
        return filtered.filter(
            (q) =>
                q?.name !== workplaceQuestionsKeys.placementPreferences &&
                q?.name !== workplaceQuestionsKeys.autoTalentPool
        )
    }, [getSectorByCourseId?.data?.id])

    const wpTypesOptions =
        wpType?.data?.map((wpType: WorkplaceTypes) => ({
            label: wpType?.workplaceType?.name,
            value: wpType?.workplaceType?.name,
        })) || []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-7">
            {visibleQuestions?.map((ques, i, list) => {
                const textTypeLength = list?.filter(
                    (l) => l?.type === 'text'
                )?.length
                if (ques?.type === 'text') {
                    return (
                        <TextTypeQuestions
                            key={i}
                            index={i}
                            ques={ques}
                            textTypeLength={textTypeLength}
                            formMethods={formMethods}
                        />
                    )
                }
                if (ques?.type === 'days') {
                    return (
                        <DaysQuestions
                            key={i}
                            index={i}
                            ques={ques}
                            textTypeLength={textTypeLength}
                        />
                    )
                }

                if (ques?.type === 'textarea') {
                    if (ques.name === 'preferredContactTime') {
                        return (
                            <div key={i} className="flex flex-col gap-y-2">
                                <Typography variant="label" semibold block>
                                    {ques?.index}. {ques?.title}
                                </Typography>

                                <Typography variant="label">
                                    {
                                        workplaceQuestions[
                                        ques?.name as keyof typeof workplaceQuestions
                                        ]
                                    }
                                </Typography>
                                <AvailabilitySelector name={ques.name} />
                            </div>
                        )
                    } else if (
                        ques.name ===
                        workplaceQuestionsKeys.placementPreferences
                    ) {
                        return (
                            <div key={i} className="flex flex-col gap-y-1">
                                <Typography variant="label" semibold block>
                                    {ques?.index}. {ques?.title}
                                </Typography>
                                <Typography variant="label">
                                    {
                                        workplaceQuestions[
                                        ques?.name as keyof typeof workplaceQuestions
                                        ]
                                    }
                                </Typography>
                                <Select
                                    multi
                                    name={ques?.name}
                                    options={[
                                        { label: 'Default', value: 'Default' },
                                        ...wpTypesOptions,
                                    ]}
                                    loading={wpType?.isLoading}
                                    disabled={wpType?.isLoading}
                                    onlyValue
                                    onChange={(e: SelectOption[]) => {
                                        formMethods.setValue(
                                            ques?.name,
                                            e?.join(', ')
                                        )
                                    }}
                                    passValue={false}
                                />
                            </div>
                        )
                        return <TextAreaQuestions key={i} ques={ques} />
                    }
                }

                return (
                    <DefaultQuestions
                        key={i}
                        ques={ques}
                        personalInfoData={personalInfoData}
                        value={formValues?.[ques?.name]}
                    />
                )
            })}
        </div>
    )
}

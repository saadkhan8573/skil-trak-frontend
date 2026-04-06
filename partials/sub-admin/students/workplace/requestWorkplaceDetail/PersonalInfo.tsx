import { PersonalInfoForm, workplaceQuestions, workplaceQuestionsKeys } from '@partials/common'
import { StudentApi, SubAdminApi } from '@queries'
import { useEffect } from 'react'
import { SkeletonLoader } from '@components'

type PersonalInfoProps = {
    setActive: any
    setPersonalInfoData: any
    personalInfoData: any
    courses: any
    userId?: number
}

export const PersonalInfo = ({
    setActive,
    personalInfoData,
    setPersonalInfoData,
    courses,
    userId,
}: PersonalInfoProps) => {
    const { data: existingQuestions, isLoading } =
        StudentApi.Workplace.useGetStudentWorkplaceQuestions(
            { userId: Number(userId) },
            {
                skip: !userId,
            }
        )

    useEffect(() => {
        const questionsArray = existingQuestions?.questions || []
        if (questionsArray && questionsArray.length > 0) {
            const transformedQuestions = questionsArray.map((q) => {
                let parsedAnswer: any = q.answer
                
                // Specialized parsing for preferredContactTime string
                if (q.type === workplaceQuestionsKeys.preferredContactTime) {
                    const match = q.answer.match(
                        /Days\s*:\s*(.*),\s*Time Slots\s*:\s*(.*)/
                    )
                    if (match) {
                        parsedAnswer = {
                            days: match[1]
                                .split(',')
                                .map((d) => d.trim())
                                .filter(Boolean),
                            timeSlot: match[2].trim(),
                        }
                    }
                } else {
                    try {
                        // Try to parse if it looks like JSON (for suburb, supervisorMeeting etc)
                        if (
                            typeof q.answer === 'string' &&
                            (q.answer.startsWith('{') ||
                                q.answer.startsWith('['))
                        ) {
                            parsedAnswer = JSON.parse(q.answer)
                        }
                    } catch (e) {
                        console.error('Failed to parse answer', q.answer)
                    }
                }

                return {
                    question: q.question,
                    answer: parsedAnswer,
                    type: q.type,
                }
            })

            // Update if questions are not yet populated
            if (
                !personalInfoData?.questions ||
                personalInfoData?.questions?.length === 0
            ) {
                setPersonalInfoData((prev: any) => ({
                    ...prev,
                    questions: transformedQuestions,
                }))
            }
        }
    }, [existingQuestions])

    const onSubmit = (values: any) => {
        let questions: {
            question: string
            answer: string | any
            type: string
        }[] = []
        Object.entries(workplaceQuestions).forEach(([key, value]: string[]) => {
            if (key === workplaceQuestionsKeys.suburb) {
                if (values[key]) {
                    questions.push({
                        question: value,
                        answer: {
                            suburb: values[key],
                            zip: values['zip'],
                        },
                        type: key,
                    })
                }
            } else if (key === workplaceQuestionsKeys.supervisorMeeting) {
                if (values['supervisorMeetingDate1']) {
                    questions.push({
                        question: value,
                        answer: {
                            supervisorMeetingDate1:
                                values['supervisorMeetingDate1'],
                            supervisorMeetingDate2:
                                values['supervisorMeetingDate2'],
                        },
                        type: key,
                    })
                }
            } else if (
                key === workplaceQuestionsKeys.possession ||
                key === workplaceQuestionsKeys.serviceOffered
            ) {
                if (values[key]) {
                    questions.push({
                        question: value,
                        answer: values[key]?.join(','),
                        type: key,
                    })
                }
            } else if (key === workplaceQuestionsKeys.preferredContactTime) {
                if (values[key]) {
                    questions.push({
                        question: value,
                        answer: `Days : ${values[
                            workplaceQuestionsKeys.preferredContactTime
                        ]?.days?.join(', ')}, Time Slots : ${
                            values[workplaceQuestionsKeys.preferredContactTime]
                                ?.timeSlot
                        }`,
                        type: key,
                    })
                }
            } else {
                if (values[key]) {
                    questions.push({
                        question: value,
                        answer: values[key],
                        type: key,
                    })
                }
            }
        })

        setPersonalInfoData({
            // ...values,
            courses: values?.courses?.value,
            preferableLocation: values?.suburb,
            questions,
            // haveTransport: values.haveTransport === 'yes' ? true : false,
            // haveDrivingLicense:
            //     values.haveDrivingLicense === 'yes' ? true : false,
        })
        setActive((active: number) => active + 1)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-y-4">
                <SkeletonLoader height="h-6" width="w-1/2" />
                <SkeletonLoader height="h-40" width="w-full" />
            </div>
        )
    }

    return (
        <div>
            <PersonalInfoForm
                userId={userId}
                courses={courses}
                onSubmit={onSubmit}
                personalInfoData={personalInfoData}
            />
        </div>
    )
}

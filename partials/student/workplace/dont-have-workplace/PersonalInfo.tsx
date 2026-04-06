import {
    PersonalInfoForm,
    workplaceQuestions,
    workplaceQuestionsKeys,
} from '@partials/common'
import { useGetStudentCoursesQuery, StudentApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { SkeletonLoader } from '@components'

type PersonalInfoProps = {
    setActive: any
    setPersonalInfoData: any
    personalInfoData: any
}

export const PersonalInfo = ({
    setActive,
    setPersonalInfoData,
    personalInfoData,
}: PersonalInfoProps) => {
    const router = useRouter()
    const { id } = router.query
    const courses = useGetStudentCoursesQuery()

    const { data: existingQuestions, isLoading } =
        StudentApi.Workplace.useGetStudentWorkplaceQuestions()

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

            // Only update if current personalInfoData is empty or we specifically want to sync
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
    // const [courses, setCourses] = useState<any>([])

    const onSubmit = (values: any) => {
        let questions: {
            question: string
            answer: string | any
            type: string
        }[] = []
        Object.entries(workplaceQuestions).forEach(([key, value]: string[]) => {
            if (key === workplaceQuestionsKeys.suburb) {
                questions.push({
                    question: value,
                    answer: {
                        suburb: values[key],
                        zip: values['zip'],
                    },
                    type: key,
                })
            } else if (key === workplaceQuestionsKeys.supervisorMeeting) {
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
            } else if (key === workplaceQuestionsKeys.possession) {
                questions.push({
                    question: value,
                    answer: values[key]?.join(','),
                    type: key,
                })
            } else {
                questions.push({
                    question: value,
                    answer: values[key],
                    type: key,
                })
            }
        })

        setPersonalInfoData({
            courses: values?.courses?.value,
            preferableLocation: values?.suburb,
            questions,
            // courses: values?.courses?.value,
            // haveTransport: values.haveTransport === 'yes' ? true : false,
            // haveDrivingLicense:
            //     values.haveDrivingLicense === 'yes' ? true : false,
        })
        setActive((active: number) => active + 1)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-y-4 pt-5">
                <SkeletonLoader height="h-6" width="w-1/2" />
                <SkeletonLoader height="h-40" width="w-full" />
            </div>
        )
    }

    return (
        <div>
            <PersonalInfoForm
                courses={courses}
                onSubmit={onSubmit}
                personalInfoData={personalInfoData}
            />
        </div>
    )
}

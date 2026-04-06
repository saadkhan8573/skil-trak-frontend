import { Button, Select, SelectOption } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Card, Typography } from '@components'
import { useNotification } from '@hooks'
import { Course } from '@types'
import { PersonalInfoQuestions } from '../components'
import {
    questionsDefaultValues,
    requiredQuestionsValidation,
} from '../functions'
import { workplaceQuestionsKeys } from '@partials/common/workplace/enum'

type PersonalInfoProps = {
    onSubmit: any
    courses: any
    personalInfoData: any
    userId?: number
}

export const PersonalInfoForm = ({
    userId,
    onSubmit,
    courses,
    personalInfoData,
}: PersonalInfoProps) => {
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [onLocationClicked, setOnLocationClicked] = useState<boolean>(true)

    const { notification } = useNotification()

    useEffect(() => {
        if (
            personalInfoData?.courses ||
            (courses?.data && courses?.data?.length > 0)
        ) {
            const courseData = courses?.data?.find(
                (course: Course) =>
                    course?.id === Number(personalInfoData?.courses)
            )

            const course = courseData || courses?.data?.[0]
            const selectedCourseOption = {
                label: course?.title,
                value: course?.id,
            }
            setSelectedCourse(selectedCourseOption)
            if (selectedCourseOption) {
                formMethods.setValue('courses', selectedCourseOption)
            }
        }
    }, [personalInfoData, courses?.data])

    useEffect(() => {
        if (personalInfoData?.questions && personalInfoData?.questions?.length > 0) {
            formMethods.reset({
                ...formMethods.getValues(),
                ...personalInfoData,
                ...questionsDefaultValues(personalInfoData?.questions),
            })
        }
    }, [personalInfoData?.questions])

    const coursesOptions = courses?.data?.map((course: Course) => ({
        label: course.title,
        value: course.id,
    }))

    const validationSchema = yup.object({
        courses: yup
            .object()
            .shape({
                label: yup.string().required(),
                value: yup.string().required(),
            })
            .nullable()
            .test('course-required', 'Course is Required', (course: any) => {
                return !!course?.value
            }),
        ...requiredQuestionsValidation(),
        // preferableLocation: yup
        //     .string()
        //     .required('Must provide preferableLocation!'),
    })

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            [workplaceQuestionsKeys.placementPreferences]: 'Default',
            [workplaceQuestionsKeys.autoTalentPool]: 'yes',
            ...personalInfoData,
            ...questionsDefaultValues(personalInfoData?.questions),
        },
    })

    const onHandleSubmit = (values: any) => {
        // onSubmit(values)
        if (!onLocationClicked) {
            notification.error({
                title: 'You must select on Address Dropdown',
                description: 'You must select on Address Dropdown',
            })
        } else if (onLocationClicked) {
            onSubmit(values)
        }
    }

    // Get the short names of the weekdays

    return (
        <div className="flex flex-col gap-y-3">
            <Typography variant={'subtitle'} capitalize bold>
                Please provide following information
            </Typography>

            <Card>
                <FormProvider {...formMethods}>
                    <form
                        className="flex flex-col gap-y-7"
                        onSubmit={formMethods.handleSubmit(onHandleSubmit)}
                    >
                        <div>
                            <Select
                                id="courses"
                                placeholder="Select Your Choice"
                                name="courses"
                                label="Course"
                                value={selectedCourse}
                                onChange={(e: any) => {
                                    setSelectedCourse(e)
                                }}
                                options={coursesOptions}
                                loading={courses.isLoading}
                                disabled={courses.isLoading}
                            />
                        </div>

                        {/*  */}
                        <PersonalInfoQuestions
                            formMethods={formMethods}
                            personalInfoData={personalInfoData}
                            selectedCourse={selectedCourse?.value}
                            userId={userId}
                        />

                        <div>
                            {/* <TextInput
                                name={'preferableLocation'}
                                label={
                                    'Where would you want to locate yourself? (Suburb)'
                                }
                                id={'map'}
                                required
                                placeholder="Where would you want to locate your self? (Suburb)"
                                placesSuggetions
                                onChange={() => {
                                    setOnLocationClicked(false)
                                }}
                                onPlaceSuggetions={{
                                    placesSuggetions: onLocationClicked,
                                    setIsPlaceSelected: setOnLocationClicked,
                                }}
                            /> */}

                            <Button text={'Continue'} submit />
                        </div>
                    </form>
                </FormProvider>
            </Card>
        </div>
    )
}

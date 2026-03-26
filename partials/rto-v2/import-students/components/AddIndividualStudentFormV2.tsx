import {
    ActionAlert,
    AddressFieldInput,
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import { UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { RtoV2Api, RtoApi } from '@queries'
import { Course } from '@types'
import {
    CourseSelectOption,
    ageOptions,
    formatOptionLabel,
    genderOptions,
    getDate,
    onlyAlphabets,
} from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { PlacementType } from './PlacementType'
import { PlacementTypeEnum } from '../enum'
import { useNotification } from '@hooks'

export const AddIndividualStudentFormV2 = ({
    onCancel,
}: {
    onCancel?: () => void
}) => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const router = useRouter()

    const { notification } = useNotification()

    const [addStudent, addStudentResult] =
        RtoV2Api.Students.addIndividualStudent()

    const rto = RtoApi.Rto.useProfile()

    const rtoCoursesOptions =
        rto.isSuccess && rto?.data?.courses && rto?.data?.courses?.length > 0
            ? rto?.data?.courses?.map((course: Course) => ({
                  label: course?.title,
                  value: course?.id,
                  item: course,
              }))
            : []

    useEffect(() => {
        if (addStudentResult.isSuccess) {
            setIsSuccess(addStudentResult.isSuccess)
        }
    }, [addStudentResult.isSuccess])
    // get sectors

    const validationSchema = yup.object({
        // Profile Information
        name: yup
            .string()
            .matches(onlyAlphabets(), 'Please enter valid name')
            .required('Must provide your name'),
        studentId: yup.string().required('Must provide your student Id'),
        batch: yup.string().required('Must provide your Batch'),
        phone: yup.string().required('Must provide your phone number'),
        addressLine1: yup.string().required('Must provide your address'),
        age: yup.string().nullable().required('Must Select age'),
        gender: yup.string().required('Must provide gender'),
        email: yup
            .string()
            .email('Invalid Email')
            .required('Must provide email'),

        placementType: yup
            .string()
            .oneOf(
                [PlacementTypeEnum.BLOCK, PlacementTypeEnum.FLEXIBLE],
                'Must select a valid placement type'
            )
            .required('Must select placement type'),

        // Conditional validation for dates
        expiryDate: yup
            .date()
            .transform((value, originalValue) => {
                // Return null for empty strings instead of Invalid Date
                return originalValue === '' ? null : value
            })
            .nullable()
            .when('placementType', {
                is: PlacementTypeEnum.FLEXIBLE,
                then: (schema) => schema.required('Must provide Expiry Date'),
                otherwise: (schema) => schema.notRequired().nullable(),
            }),

        startDate: yup
            .date()
            .transform((value, originalValue) => {
                // Return null for empty strings instead of Invalid Date
                return originalValue === '' ? null : value
            })
            .nullable()
            .when('placementType', {
                is: PlacementTypeEnum.BLOCK,
                then: (schema) => schema.required('Must provide Start Date'),
                otherwise: (schema) => schema.notRequired().nullable(),
            }),

        endDate: yup
            .date()
            .transform((value, originalValue) => {
                // Return null for empty strings instead of Invalid Date
                return originalValue === '' ? null : value
            })
            .nullable()
            .when('placementType', {
                is: PlacementTypeEnum.BLOCK,
                then: (schema) => schema.required('Must provide End Date'),
                otherwise: (schema) => schema.notRequired().nullable(),
            }),

        // sector and courses
        courses: yup.array().min(1, 'Must select at least 1 course').required(),
    })

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: { placementType: PlacementTypeEnum.FLEXIBLE },
    })

    const onSubmitForm = async (values: any) => {
        const filteredValues = { ...values }

        // if (placementType === 'flexible') {
        //     delete filteredValues.startDate
        //     delete filteredValues.endDate
        // } else if (placementType === 'block') {
        //     delete filteredValues.expiryDate
        // }

        const res: any = await addStudent({
            ...filteredValues,
            role: UserRoles.STUDENT,
            age: 'N/A',
            familyName: 'N/A',
            emergencyPerson: 'N/A',
            emergencyPersonPhone: 'N/A',
            state: filteredValues?.state || 'N/A',
            suburb: filteredValues?.suburb || 'N/A',
            zipCode: filteredValues?.zipCode || 'N/A',
            password: 'N/A',
        })

        if (res?.data) {
            notification.success({
                title: 'Student Added',
                description: 'Student Added Successfully',
            })
        }
    }

    const getMinExpiryDate = () => {
        const date = new Date()
        date.setMonth(date.getMonth() + 3)
        return date.toISOString().split('T')[0]
    }

    const placementType: PlacementTypeEnum = formMethods.watch('placementType')

    return (
        <>
            <ShowErrorNotifications result={addStudentResult} />
            {isSuccess && (
                <ActionAlert
                    title={'Student Added Successfully!'}
                    description={
                        'You will be redirected to student list in a moment.'
                    }
                    variant={'primary'}
                    primaryAction={{
                        text: 'Back To List',
                        onClick: () => {
                            router.push({
                                pathname:
                                    '/portals/rto/students-and-placements/all-students',
                                query: { tab: 'active' },
                            })
                            onCancel && onCancel()
                        },
                    }}
                    secondaryAction={{
                        text: 'Add New',
                        onClick: () => {
                            setIsSuccess(false)
                        },
                    }}
                />
            )}
            {!isSuccess && (
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmitForm)}>
                        <PlacementType />

                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                            <TextInput
                                label={'Full Name'}
                                name={'name'}
                                placeholder={'Your Full Name...'}
                                validationIcons
                                required
                            />

                            <TextInput
                                label={'Student Id'}
                                name={'studentId'}
                                placeholder={'Student Id...'}
                                validationIcons
                                required
                            />

                            <Select
                                label={'Select Age'}
                                name={'age'}
                                options={ageOptions}
                                placeholder={'Select Age...'}
                                // loading={rtoResponse.isLoading}
                                // onChange={}
                                validationIcons
                                onlyValue
                            />

                            <Select
                                label={'Gender'}
                                name={'gender'}
                                options={genderOptions}
                                placeholder={'Select Gender...'}
                                validationIcons
                                onlyValue
                            />

                            <TextInput
                                label={'Email'}
                                type={'email'}
                                name={'email'}
                                placeholder={'Email...'}
                                validationIcons
                                required
                            />

                            <TextInput
                                label={'Batch'}
                                name={'batch'}
                                placeholder={'Batch...'}
                                validationIcons
                                required
                            />

                            <TextInput
                                label={'Phone No'}
                                name={'phone'}
                                placeholder={'Phone No...'}
                                validationIcons
                                required
                            />

                            <Select
                                label={'Courses'}
                                name={'courses'}
                                options={rtoCoursesOptions}
                                multi
                                validationIcons
                                onlyValue
                                components={{ Option: CourseSelectOption }}
                                formatOptionLabel={formatOptionLabel}
                            />

                            <AddressFieldInput />
                        </div>

                        <div className="flex items-center gap-x-2 justify-between">
                            {placementType === PlacementTypeEnum.BLOCK ? (
                                <>
                                    <TextInput
                                        label="Start Date"
                                        name="startDate"
                                        type="date"
                                        min={getDate()}
                                    />
                                    <TextInput
                                        label="End Date"
                                        name="endDate"
                                        type="date"
                                        min={getDate()}
                                    />
                                </>
                            ) : (
                                <TextInput
                                    label={'Expiry Date'}
                                    name={'expiryDate'}
                                    placeholder={'Expiry Date...'}
                                    validationIcons
                                    required
                                    type="date"
                                    min={getMinExpiryDate()}
                                />
                            )}
                        </div>

                        {/*  */}
                        <TextArea
                            rows={4}
                            name={'note'}
                            label={'Notes (Optional)'}
                            placeholder={'Add Notes here...'}
                        />

                        <Button
                            submit
                            text={'Add'}
                            variant={'primary'}
                            loading={addStudentResult.isLoading}
                            disabled={addStudentResult.isLoading}
                        />
                    </form>
                </FormProvider>
            )}
        </>
    )
}

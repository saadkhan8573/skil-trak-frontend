import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import _debounce from 'lodash/debounce'
import * as yup from 'yup'

import { useNotification } from '@hooks'
import { AuthApi } from '@queries'
import { SignUpUtils, isEmailValid, onlyAlphabets } from '@utils'

import { Button, Checkbox, Select, TextInput, Typography } from '@components'
import { FormProvider, useForm } from 'react-hook-form'
import { OptionType } from '@types'

// TODO: Remove check from RTO if not exists in the list and student can type any RTO name just signup the student with the given RTO name
// TODO: If student added their own RTO name, then show stripe link to pay for the RTO registration fee


export const StudentSignUpForm = ({ onSubmit }: { onSubmit: any }) => {
    const router = useRouter()
    // const [signUpStudent] = useUpdateStudentSignUpMutation()
    const { notification } = useNotification()

    const sectorResponse = AuthApi.useSectors({})
    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()

    const [courseOptions, setCourseOptions] = useState<OptionType[]>([])
    const [courseLoading, setCourseLoading] = useState(false)

    const [storedData, setStoredData] = useState<any>(null)

    const [lastEnteredEmail, setLastEnteredEmail] = useState('')

    const onEmailChange = (e: any) => {
        _debounce(() => {
            // Regex for email, only valid mail should be sent
            const email = e.target.value
            if (isEmailValid(email)) {
                checkEmailExists({ email })
                setLastEnteredEmail(email)
            }
        }, 300)()
    }

    const onSectorChanged = (sectors: OptionType[]) => {
        setCourseLoading(true)
        const filteredCourses = sectors.map((selectedSector: OptionType) => {
            const sectorExisting = sectorResponse.data.find(
                (sector: any) => sector.id === selectedSector.value
            )
            if (sectorExisting && sectorExisting?.courses?.length) {
                return sectorExisting.courses
            }
        })

        const newCourseOptions: OptionType[] = []
        filteredCourses.map((courseList: any) => {
            if (courseList && courseList.length) {
                return courseList.map((course: any) =>
                    newCourseOptions.push({
                        label: course.title,
                        value: course.id,
                    })
                )
            }
        })

        setCourseOptions(newCourseOptions)
        setCourseLoading(false)
    }

    const validationSchema = yup.object({
        // Profile Information
        name: yup.string().required('Must provide your name'),

        email: yup
            .string()
            .email('Invalid Email')
            .required('Must provide email'),
        password: yup
            .string()
            // .matches(
            // 	strongPassword(),
            // 	"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            // )
            .required('Must provide password'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Must confirm entered password'),

        // Business Information
        businessName: yup.string().required('Must provide business name'),
        phoneNumber: yup.string().required('Must provide phone number'),

        // Sector Information
        sectors: yup.array().min(1, 'Must select at least 1 sector'),
        courses: yup.array().min(1, 'Must select at least 1 course'),

        // Contact Person Information
        contactPersonName: yup
            .string()
            .matches(onlyAlphabets(), 'Must be a valid name'),
        contactPersonEmail: yup.string().email('Must be a valid email'),
        contactPersonNumber: yup.string(),

        // Address Information
        addressLine1: yup.string().required('Must provide address'),
        state: yup.string().required('Must provide name of state'),
        suburb: yup.string().required('Must provide suburb name'),
        zipCode: yup.string().required('Must provide zip code for your state'),

        agreedWithPrivacyPolicy: yup
            .boolean()
            .oneOf(
                [true],
                'Please check if you agree with our terms & policies'
            ),
    })

    const sectorOptions =
        sectorResponse.data && sectorResponse.data?.length > 0
            ? sectorResponse.data?.map((sector: any) => ({
                label: sector.name,
                value: sector.id,
            }))
            : []

    useEffect(() => {
        if (SignUpUtils.getEditingMode()) {
            const values = SignUpUtils.getValuesFromStorage()
            setStoredData(values)
            setCourseOptions(values.courses)
        }
    }, [])

    // useEffect For Email
    useEffect(() => {
        if (emailCheckResult.isError) {
            notification.error({
                title: 'Email Exist',
                description: `'${lastEnteredEmail}' is already being used.`,
            })
        }
    }, [emailCheckResult])

    const onBackToReview = () => {
        SignUpUtils.setEditingMode(false)
        router.push('/auth/signup/review-signup-info')
    }

    const formMethods = useForm({
        mode: 'all',
        // resolver: yupResolver(validationSchema),
    })
    // const submitForm = (values: any) => {
    //     signUpStudent(values)
    //     // setActive((active: number) => active + 1)
    // }

    return (
        <FormProvider {...formMethods}>
            <form
                className="flex flex-col gap-y-4"
                onSubmit={formMethods.handleSubmit(onSubmit)}
            >
                {/* Personal Information */}
                <div className="flex gap-x-16 border-t py-4 ">
                    <div className="w-2/6">
                        <Typography
                            variant={'subtitle'}
                            color={'text-gray-500'}
                        >
                            Personal Information
                        </Typography>
                        <p className="text-gray-400 text-sm leading-6">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Impedit, dolorum voluptate dolores.
                        </p>
                    </div>

                    <div className="w-4/6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                        <TextInput
                            label={'First Name'}
                            name={'firstName'}
                            placeholder={'Your First Name...'}
                            validationIcons
                            required
                        />

                        <TextInput
                            label={'Last Name'}
                            name={'lastName'}
                            placeholder={'Your Last Name...'}
                            validationIcons
                            required
                        />
                        <TextInput
                            label={'Date Of Birth'}
                            name={'dob'}
                            type={'date'}
                            max="2022-12-11"
                            validationIcons
                            required
                        />

                        <TextInput
                            label={'Phone Number'}
                            name={'phoneNo'}
                            placeholder={'Your phone number...'}
                            validationIcons
                            required
                        />
                    </div>
                </div>

                {/* Profile Information */}
                <div className="flex gap-x-16 border-t py-4">
                    <div className="w-2/6">
                        <Typography
                            variant={'subtitle'}
                            color={'text-gray-500'}
                        >
                            Profile Information
                        </Typography>
                        <p className="text-gray-400 text-sm leading-6">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Impedit, dolorum voluptate dolores.
                        </p>
                    </div>

                    <div className="w-4/6">
                        <TextInput
                            label={'Email'}
                            name={'email'}
                            type={'email'}
                            placeholder={'Your Email...'}
                            validationIcons
                            required
                            onBlur={onEmailChange}
                            loading={emailCheckResult.isLoading}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                            <TextInput
                                label={'Password'}
                                name={'password'}
                                type={'password'}
                                placeholder={'Password...'}
                                validationIcons
                                required
                            />

                            <TextInput
                                label={'Confirm Password'}
                                name={'confirmPassword'}
                                type={'password'}
                                placeholder={'Confirm Password...'}
                                validationIcons
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* RTO Information */}
                <div className="flex gap-x-16 border-t py-4">
                    <div className="w-2/6">
                        <Typography
                            variant={'subtitle'}
                            color={'text-gray-500'}
                        >
                            RTO Information
                        </Typography>
                        <p className="text-gray-400 text-sm leading-6">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Impedit, dolorum voluptate dolores.
                        </p>
                    </div>

                    <div className="w-4/6 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2 mt-2">
                        <div className="col-span-2">
                            <TextInput
                                label={'RTO'}
                                name={'firstName'}
                                placeholder={'Your First Name...'}
                                validationIcons
                                required
                            />
                        </div>

                        <TextInput
                            label={'Student ID'}
                            name={'lastName'}
                            placeholder={'Your Last Name...'}
                            validationIcons
                            required
                        />
                    </div>
                </div>

                {/* Sector Information */}
                <div className="flex gap-x-16 border-t py-4">
                    <div className="w-2/6">
                        <Typography
                            variant={'subtitle'}
                            color={'text-gray-500'}
                        >
                            Sector Information
                        </Typography>
                        <p className="text-gray-400 text-sm leading-6">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Impedit, dolorum voluptate dolores.
                        </p>
                    </div>

                    <div className="w-4/6 grid grid-cols-1 gap-y-2">
                        <div>
                            <Select
                                label={'Sector'}
                                {...(storedData
                                    ? {
                                        defaultValue: storedData.sectors,
                                    }
                                    : {})}
                                name={'sectors'}
                                options={sectorOptions}
                                placeholder={'Select Sectors...'}
                                multi
                                loading={sectorResponse.isLoading}
                                onChange={onSectorChanged}
                                validationIcons
                            />
                        </div>
                        <div>
                            <Select
                                label={'Courses'}
                                name={'courses'}
                                defaultValue={courseOptions}
                                options={courseOptions}
                                multi
                                loading={courseLoading}
                                disabled={
                                    storedData
                                        ? storedData?.courses?.length === 0
                                        : courseOptions?.length === 0
                                }
                                validationIcons
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Person Information */}
                <div className="flex gap-x-16 border-t py-4">
                    <div className="w-2/6">
                        <Typography
                            variant={'subtitle'}
                            color={'text-gray-500'}
                        >
                            Emergency Person Information
                        </Typography>
                        <p className="text-gray-400 text-sm leading-6">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Impedit, dolorum voluptate dolores.
                        </p>
                    </div>

                    <div className="w-4/6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                            <TextInput
                                label={'Name'}
                                name={'contactPersonName'}
                                placeholder={'Contact Person Name...'}
                                validationIcons
                            />

                            <TextInput
                                label={'Phone Number'}
                                name={'contactPersonNumber'}
                                placeholder={'Phone Number...'}
                                type={'tel'}
                                validationIcons
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="flex gap-x-16 border-t py-4">
                    <div className="w-2/6">
                        <Typography
                            variant={'subtitle'}
                            color={'text-gray-500'}
                        >
                            Address Information
                        </Typography>
                        <p className="text-gray-400 text-sm leading-6">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Impedit, dolorum voluptate dolores.
                        </p>
                    </div>

                    <div className="w-4/6">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 mt-2">
                            <TextInput
                                label={'Primary Address'}
                                name={'addressLine1'}
                                placeholder={'Your Primary Address...'}
                                validationIcons
                                placesSuggetions
                            />

                            <TextInput
                                label={'Address Line 2'}
                                name={'addressLine2'}
                                placeholder={'Your Address Line 2...'}
                                validationIcons
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2 mt-2 mb-6">
                            <TextInput
                                label={'State'}
                                name={'state'}
                                placeholder={'State...'}
                                validationIcons
                            />

                            <TextInput
                                label={'Suburb'}
                                name={'suburb'}
                                placeholder={'Suburb...'}
                                validationIcons
                                placesSuggetions
                            />

                            <TextInput
                                label={'Zip Code'}
                                name={'zipCode'}
                                placeholder={'Zip Code...'}
                                validationIcons
                            />
                        </div>
                    </div>
                </div>

                <div className="w-4/6 ml-auto pl-12">
                    <div className="mb-6">
                        <Checkbox
                            name={'agreedWithPrivacyPolicy'}
                            label={
                                <>
                                    I agree with{' '}
                                    <Link
                                        legacyBehavior
                                        href="/terms-and-conditions"
                                    >
                                        <a className="text-link">Terms</a>
                                    </Link>{' '}
                                    {'&'}{' '}
                                    <Link legacyBehavior href="/privacy-policy">
                                        <a className="text-link">
                                            Privacy Policy
                                        </a>
                                    </Link>
                                </>
                            }
                        />
                    </div>

                    <div className="flex gap-x-4">
                        <Button text={'Continue'} submit />
                        {SignUpUtils.getEditingMode() && (
                            <Button
                                onClick={onBackToReview}
                                text={'Back To Review'}
                                variant={'secondary'}
                            />
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

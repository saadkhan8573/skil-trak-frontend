import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { FormProvider, useForm } from 'react-hook-form'
import _debounce from 'lodash/debounce'
import * as yup from 'yup'

import { useNotification } from '@hooks'
import { AuthApi } from '@queries'
import {
    isEmailValid,
    onlyAlphabets,
    onlyNumbersAcceptedInYup,
    removeEmptySpaces,
    SignUpUtils,
} from '@utils'

import {
    Button,
    Checkbox,
    Select,
    TextInput,
    Typography,
    Card,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { Course, OptionType, Sector } from '@types'

export const IndustryForm = ({
    addWorkplace,
    setWorkplaceData,
    result,
    industryABN,
}: {
    addWorkplace: any
    setWorkplaceData: any
    result: any
    industryABN: string | null
}) => {
    const router = useRouter()

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

    const onSectorChanged = (sectors: OptionType) => {
        setCourseLoading(true)

        const sectorExisting = sectorResponse?.data?.find(
            (sector: Sector) => sector.id === sectors?.value
        )
        const newCourseOptions: OptionType[] = []
        sectorExisting?.courses?.map((course: Course) =>
            newCourseOptions.push({
                label: course.title,
                value: course.id,
            })
        )
        setCourseOptions(newCourseOptions)
        setCourseLoading(false)
    }

    const validationSchema = yup.object({
        // Profile Information
        name: yup
            .string()
            .matches(onlyAlphabets(), 'Please enter valid name')
            .required('Must provide your name'),

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
        abn: onlyNumbersAcceptedInYup(yup),
        phoneNumber: yup.string().required('Must provide phone number'),

        // Sector Information
        // sectors: yup.string().required('Must select at sector'),
        // courses: yup.string().required('Must select at course'),
        // sectors: yup.array().min(1, 'Must select at least 1 sector'),
        // courses: yup.array().min(1, 'Must select at least 1 course'),

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

    const sectorOptions = sectorResponse.data?.map((sector: Sector) => ({
        label: sector.name,
        value: sector.id,
    }))

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
        defaultValues: { abn: industryABN },
        resolver: yupResolver(validationSchema),
    })
    const onFormSubmit = (values: any) => {
        addWorkplace({
            ...values,
            courses: [values?.courses?.value],
            role: 'industry',
        })
    }

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
    }
    return (
        <Card>
            <div className="">
                <FormProvider {...formMethods}>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={formMethods.handleSubmit(onFormSubmit)}
                    >
                        {/* Personal Information */}
                        <div className="w-4/6">
                            <TextInput
                                label={'Business Name'}
                                name={'name'}
                                placeholder={'Industry Name...'}
                                validationIcons
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                <TextInput
                                    label={'ABN'}
                                    name={'abn'}
                                    placeholder={'ABN...'}
                                    validationIcons
                                    required
                                    onBlur={onBlur}
                                />

                                <TextInput
                                    label={'Website'}
                                    name={'website'}
                                    placeholder={'Website Url...'}
                                    validationIcons
                                />

                                <TextInput
                                    label={'Phone Number'}
                                    name={'phoneNumber'}
                                    placeholder={'Your phone number...'}
                                    validationIcons
                                    required
                                />
                            </div>
                        </div>
                        {/* Business Information */}
                        <div className="w-4/6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                <TextInput
                                    label={'Contact Person Number'}
                                    name={'contactPersonNumber'}
                                    placeholder={'Contact Person Number ...'}
                                    validationIcons
                                    required
                                />
                                <TextInput
                                    label={'Contact Person Name'}
                                    name={'contactPersonName'}
                                    placeholder={'Contact Person Name...'}
                                    validationIcons
                                    required
                                />
                            </div>
                        </div>

                        {/* Sector Information */}

                        <div className="w-4/6 grid grid-cols-1 gap-y-4">
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

                        {/* Profile Information */}

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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
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

                        {/* Address Information */}

                        <div className="w-4/6">
                            <div className="grid grid-cols-1 gap-x-8">
                                <TextInput
                                    label={'Primary Address'}
                                    name={'addressLine1'}
                                    placeholder={'Your Primary Address...'}
                                    validationIcons
                                    placesSuggetions
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8">
                                <TextInput
                                    label={'Suburb'}
                                    name={'suburb'}
                                    placeholder={'Suburb...'}
                                    validationIcons
                                    placesSuggetions
                                />

                                <TextInput
                                    label={'State'}
                                    name={'state'}
                                    placeholder={'State...'}
                                    validationIcons
                                />

                                <TextInput
                                    label={'Zip Code'}
                                    name={'zipCode'}
                                    placeholder={'Zip Code...'}
                                    validationIcons
                                />
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
                                                <a className="text-link">
                                                    Terms
                                                </a>
                                            </Link>{' '}
                                            {'&'}{' '}
                                            <Link
                                                legacyBehavior
                                                href="/privacy-policy"
                                            >
                                                <a className="text-link">
                                                    Privacy Policy
                                                </a>
                                            </Link>
                                        </>
                                    }
                                />
                            </div>

                            <div className="flex gap-x-4">
                                <Button
                                    text={'Continue'}
                                    submit
                                    loading={result.isLoading}
                                    disabled={result.isLoading}
                                />
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
            </div>
        </Card>
    )
}

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import * as yup from 'yup'
import _debounce from 'lodash/debounce'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import { AuthApi, CommonApi } from '@queries'
import { useNotification } from '@hooks'
import {
    CourseSelectOption,
    formatOptionLabel,
    getLatLng,
    getPostalCode,
    isEmailValid,
    onlyAlphabets,
    onlyNumbersAcceptedInYup,
    removeEmptySpaces,
    SignUpUtils,
} from '@utils'

import {
    AddressFieldInput,
    BackButton,
    Button,
    Card,
    Checkbox,
    Select,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { Course, OptionType, ProvideIndustryDetail } from '@types'
import { WorkplaceProgress } from '@partials/student'

export const AddCustomIndustryForm = ({
    setWorkplaceData,
    result,
    industryABN,
    onSubmit,
    setActive,
    courses,
}: {
    setWorkplaceData?: any
    result: any
    industryABN: string | null
    onSubmit: SubmitHandler<ProvideIndustryDetail>
    setActive: any
    courses: Course[]
}) => {
    const router = useRouter()

    const { notification } = useNotification()

    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()

    const courseOptions = courses?.map((course: Course) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const [lastEnteredEmail, setLastEnteredEmail] = useState('')

    const [countryId, setCountryId] = useState(null)
    const [onStateSelect, setOnStateSelect] = useState()
    const country = CommonApi.Countries.useCountriesList()

    const { data: states, isLoading: statesLoading } =
        CommonApi.Countries.useCountryStatesList(countryId, {
            skip: !countryId,
        })

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

        // Business Information
        abn: onlyNumbersAcceptedInYup(yup),
        phoneNumber: yup.string().required('Must provide phone number'),

        // Contact Person Information
        contactPerson: yup
            .string()
            .matches(onlyAlphabets(), 'Please enter valid name')
            .test(
                'min-words',
                'Name must contain at least 2 words',
                (value) => {
                    if (!value) return false
                    const words = value.trim().split(/\s+/)
                    return words.length >= 2
                }
            ),
        contactPersonEmail: yup.string().email('Must be a valid email'),
        contactPersonNumber: yup.string(),

        // Address Information
        addressLine1: yup.string().required('Must provide address'),
        // region: yup.number().required('Must provide name of state'),
        // country: yup.string().required('Must provide country'),
        // suburb: yup.string().required('Must provide suburb name'),
        zipCode: yup.string().required('Must provide zip code for your state'),

        agreedWithPrivacyPolicy: yup
            .boolean()
            .oneOf(
                [true],
                'Please check if you agree with our terms & policies'
            ),
        courses: yup.number().required(),
    })

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

    const formMethods = useForm<ProvideIndustryDetail>({
        mode: 'all',
        defaultValues: { abn: Number(industryABN) },
        resolver: yupResolver(validationSchema),
    })

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
    }

    const onHandleSubmit = (values: ProvideIndustryDetail) => {
        if (!onSuburbClicked) {
            notification.error({
                title: 'You must select on Suburb Dropdown',
                description: 'You must select on Suburb Dropdown',
            })
        } else if (onSuburbClicked) {
            onSubmit({
                ...values,
                state: values.state,
                suburb: 'NA',
                country: values.country,
                isAddressUpdated: true,
            })
        }
    }

    return (
        <>
            <div className="relative flex justify-center items-center w-full my-5">
                <div className="absolute top-0 left-0">
                    <BackButton
                        onClick={() => {
                            setActive(1)
                        }}
                    />
                </div>{' '}
                <Typography center variant="h2" color="text-[#170F49]">
                    Workplace Not Found
                </Typography>
            </div>
            <Card noPadding>
                <div className="w-full py-7 border-b border-[#D9DBE9]">
                    <WorkplaceProgress progressNumber={3} activeNumber={2} />
                </div>
                <div className="p-4">
                    <FormProvider {...formMethods}>
                        <form
                            className="flex flex-col gap-y-4"
                            onSubmit={formMethods.handleSubmit(onHandleSubmit)}
                        >
                            {/* Personal Information */}
                            <div>
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
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                    <TextInput
                                        label={'Contact Person Name'}
                                        name={'contactPerson'}
                                        placeholder={'Contact Person Name...'}
                                        validationIcons
                                        required
                                    />
                                    <TextInput
                                        label={'Contact Person Number'}
                                        name={'contactPersonNumber'}
                                        placeholder={
                                            'Contact Person Number ...'
                                        }
                                        validationIcons
                                        required
                                    />
                                </div>
                            </div>

                            {/* Sector Information */}

                            <div className="grid grid-cols-1 gap-x-3">
                                <Select
                                    label={'Course'}
                                    name={'courses'}
                                    options={courseOptions}
                                    validationIcons
                                    onlyValue
                                    components={{
                                        Option: CourseSelectOption,
                                    }}
                                    formatOptionLabel={formatOptionLabel}
                                />
                            </div>

                            {/* Profile Information */}

                            <div>
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
                            </div>

                            {/* Address Information */}

                            <div>
                                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mb-4">
                                    <Select
                                        name="country"
                                        label={'Country'}
                                        options={
                                            country?.data?.map((country: any) => ({
                                                label: country.name,
                                                value: country.id,
                                            })) || []
                                        }
                                        loading={country.isLoading}
                                        onChange={(e: any) => {
                                            setCountryId(e?.value)
                                            formMethods.setValue('country', e?.label)
                                        }}
                                        value={country?.data?.find(
                                            (c: OptionType) => c?.value === countryId
                                        )}
                                        validationIcons
                                        required
                                    />
                                    <Select
                                        name="region"
                                        label={'State'}
                                        options={states?.map((state: any) => ({
                                            label: state.name,
                                            value: state.id,
                                        }))}
                                        placeholder={'Select State...'}

                                        loading={statesLoading}
                                        disabled={!countryId}
                                        validationIcons
                                        required
                                        value={states?.find(
                                            (state: OptionType) =>
                                                state?.value === onStateSelect
                                        )}
                                    />
                                </div> */}
                                <div className="grid grid-cols-4 gap-x-8">
                                    <div className="col-span-3">
                                        <AddressFieldInput
                                            placesSuggetions={{
                                                placesSuggetions:
                                                    onSuburbClicked,
                                                setIsPlaceSelected:
                                                    setOnSuburbClicked,
                                            }}
                                            onChange={() => {
                                                setOnSuburbClicked(false)
                                            }}
                                        />
                                        {/* <TextInput
                                            label={'Primary Address'}
                                            name={'addressLine1'}
                                            placeholder={
                                                'Your Primary Address...'
                                            }
                                            validationIcons
                                            placesSuggetions
                                            onChange={async (e: any) => {
                                                setOnSuburbClicked(false)
                                                if (
                                                    e?.target?.value?.length > 4
                                                ) {
                                                    try {
                                                        const latLng =
                                                            await getLatLng(
                                                                e?.target?.value
                                                            )
                                                        const postalCode =
                                                            await getPostalCode(
                                                                latLng
                                                            )

                                                        if (postalCode) {
                                                            formMethods.setValue(
                                                                'zipCode',
                                                                postalCode
                                                            )
                                                        }
                                                    } catch (error) {
                                                        console.error(
                                                            'Error fetching postal code:',
                                                            error
                                                        )
                                                    }
                                                }
                                            }}
                                            onPlaceSuggetions={{
                                                placesSuggetions:
                                                    onSuburbClicked,
                                                setIsPlaceSelected:
                                                    setOnSuburbClicked,
                                            }}
                                        /> */}
                                    </div>
                                    <TextInput
                                        label={'Zip Code'}
                                        name={'zipCode'}
                                        placeholder={'Zip Code...'}
                                        validationIcons
                                    />
                                </div>

                                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8">
                                    <TextInput
                                        label={'Suburb'}
                                        name={'suburb'}
                                        placeholder={'Suburb...'}
                                        validationIcons
                                        placesSuggetions
                                        onChange={() => {
                                            setOnSuburbClicked(false)
                                        }}
                                        onPlaceSuggetions={{
                                            placesSuggetions: onSuburbClicked,
                                            setIsPlaceSelected:
                                                setOnSuburbClicked,
                                        }}
                                    />

                                    <TextInput
                                        label={'State'}
                                        name={'state'}
                                        placeholder={'State...'}
                                        validationIcons
                                    />
                                </div> */}
                            </div>

                            <div className="">
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
        </>
    )
}

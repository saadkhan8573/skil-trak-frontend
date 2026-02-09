import Link from 'next/link'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import _debounce from 'lodash/debounce'
import * as yup from 'yup'

import { useNotification, useSectorsAndCoursesOptions } from '@hooks'
import { AuthApi, CommonApi } from '@queries'
import {
    CourseSelectOption,
    SignUpUtils,
    formatOptionLabel,
    isEmailValid,
    onlyAlphabets,
    onlyNumbersAcceptedInYup,
    removeEmptySpaces,
} from '@utils'

import {
    AddressFieldInput,
    Button,
    Checkbox,
    Select,
    SelectOption,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { OptionType } from '@types'

export const IndustrySignUpForm = ({ onSubmit }: { onSubmit: any }) => {
    const router = useRouter()

    const { notification } = useNotification()

    const sectorResponse = AuthApi.useSectors({})
    const [onStateSelect, setOnStateSelect] = useState()
    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()
    const [checkAbnExist, checkAbnExistResult] = AuthApi.useAbn()

    // const [sectorOptions, setSectorOptions] = useState<any>([])
    // const [selectedSector, setSelectedSector] = useState<any>(null)
    // const [courseOptions, setCourseOptions] = useState([])
    // const [courseLoading, setCourseLoading] = useState(false)

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const [storedData, setStoredData] = useState<any>(null)

    const [lastEnteredEmail, setLastEnteredEmail] = useState('')
    const [lastEnteredAbn, setLastEnteredAbn] = useState('')

    const [countryId, setCountryId] = useState(null)
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

    // const onAbnChange = (e: any) => {
    //     _debounce(() => {
    //         // Regex for email, only valid mail should be sent
    //         const abn = e.target.value
    //         if (abn) {
    //             checkAbnExist({ abn })
    //             setLastEnteredAbn(abn)
    //         }
    //     }, 300)()
    // }

    // ...

    const onAbnChange = (e: any) => {
        _debounce(() => {
            const abn = e.target.value
            const suburbValue = formMethods.getValues('suburb')

            removeEmptySpaces(formMethods, abn)

            if (abn && suburbValue) {
                checkAbnExist({ abn, suburb: suburbValue })
                setLastEnteredAbn(abn)
            } else {
            }
        }, 300)()
    }

    // const onSectorChanged = (sectors: any) => {
    //     setSelectedSector(sectors)
    //     setCourseLoading(true)
    //     const filteredCourses = sectors?.map((selectedSector: any) => {
    //         const sectorExisting = sectorResponse?.data?.find(
    //             (sector: any) => sector.id === selectedSector.value
    //         )
    //         if (sectorExisting && sectorExisting?.courses?.length) {
    //             return sectorExisting.courses
    //         }
    //     })

    //     const newCourseOptions: any = []
    //     filteredCourses.map((courseList: any) => {
    //         if (courseList && courseList.length) {
    //             return courseList.map((course: any) =>
    //                 newCourseOptions.push({
    //                     item: course,
    //                     value: course.id,
    //                     label: course.title,
    //                 })
    //             )
    //         }
    //     })

    //     setCourseOptions(newCourseOptions)
    //     setCourseLoading(false)
    // }

    const {
        courseLoading,
        courseOptions,
        courseValues,
        onCourseChange,
        onSectorChanged,
        sectorOptions,
        selectedSector,
        setSelectedSector,
        setCourseOptions,
        sectorLoading,
        setSelectedCourses,
    } = useSectorsAndCoursesOptions()

    const validationSchema = yup.object({
        // Profile Information
        name: yup
            .string()
            //    .matches(onlyAlphabets(), 'Please enter valid name')
            .required('Must provide your name'),
        website: yup.string().required('Must provide website url'),

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
        sectors: yup.array().min(1, 'Must select at least 1 sector').required(),
        courses: yup.array().min(1, 'Must select at least 1 course').required(),
        // country and state
        // country: yup
        //     .object({
        //         label: yup.string().required('Required '),
        //         value: yup.number().required('Required '),
        //     })
        //     .typeError('Must provide country')
        //     .required('Must provide country'),
        // region: yup
        //     .object({
        //         label: yup.string().required('Required '),
        //         value: yup.number().required('Required '),
        //     })
        //     .typeError('Must provide country')
        //     .required('Must provide country'),

        // Contact Person Information
        contactPerson: yup
            .string()
            .matches(onlyAlphabets(), 'Must be a valid name')
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
        // state: yup.string().required('Must provide name of state'),
        // suburb: yup.string().required('Must provide suburb name'),
        zipCode: yup.string().required('Must provide zip code for your state'),

        agreedWithPrivacyPolicy: yup
            .boolean()
            .oneOf(
                [true],
                'Please check if you agree with our terms & policies'
            ),
    })

    // useEffect(() => {
    //     if (sectorResponse.data?.length) {
    //         console.log({ state, data: data?.data })
    //         const stateData = data?.data?.find(
    //             (item: any) => item?.name === state
    //         )
    //         console.log({ stateData })
    //     }
    // }, [sectorResponse?.data])

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

    // Use Effect For ABN
    useEffect(() => {
        if (checkAbnExistResult.isError) {
            notification.error({
                title: 'Abn in same suburb Exist',
                description: `'${lastEnteredAbn}' in same suburb is already exists.`,
            })
        }
    }, [checkAbnExistResult])

    const onBackToReview = () => {
        SignUpUtils.setEditingMode(false)
        router.push('/auth/signup/review-signup-info')
    }

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const selectedRowDataString = localStorage?.getItem('signup-data')
    useEffect(() => {
        const selectedRowData = selectedRowDataString
            ? JSON.parse(selectedRowDataString)
            : {}

        const sectors = selectedRowData?.sector?.map((s: any) => ({
            label: s?.name,
            value: s?.id,
        }))

        formMethods.setValue('name', selectedRowData?.businessName || '')
        formMethods.setValue('email', selectedRowData?.email || '')
        formMethods.setValue('phoneNumber', selectedRowData?.phone || '')
        formMethods.setValue('addressLine1', selectedRowData?.address || '')
        formMethods.setValue('sectors', sectors || [])
        setSelectedSector(selectedRowData?.sector ? sectors : [])
    }, [formMethods.setValue, selectedRowDataString])
    useEffect(() => {
        const selectedRowData = selectedRowDataString
            ? JSON.parse(selectedRowDataString)
            : {}

        if (selectedRowData?.sectors) {
            setSelectedSector(selectedRowData.sectors)
            onSectorChanged(selectedRowData.sectors)
        }
    }, [selectedRowDataString])

    useEffect(() => {
        if (selectedSector) {
            onSectorChanged(selectedSector)
        }
    }, [selectedSector])

    const onHandleSubmit = (values: any) => {
        if (!onSuburbClicked) {
            notification.error({
                title: 'You must select on Address Dropdown',
                description: 'You must select on Address Dropdown',
            })
        } else if (onSuburbClicked) {
            onSubmit({ ...values, suburb: values?.suburb || 'NA', state: 'NA' })
        }
    }

    return (
        <FormProvider {...formMethods}>
            <form
                className="flex flex-col gap-y-4"
                onSubmit={formMethods.handleSubmit(onHandleSubmit)}
            >
                {/* Personal Information */}
                <div className="w-full">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Industry Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        Your information is required to make things clear and
                        transparent
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-16 border-t py-4">
                    <div className="w-full">
                        <TextInput
                            label={'Name'}
                            name={'name'}
                            placeholder={'Industry Name...'}
                            validationIcons
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                            <TextInput
                                required
                                name={'abn'}
                                label={'ABN'}
                                validationIcons
                                onBlur={onAbnChange}
                                placeholder={'ABN...'}
                                loading={checkAbnExistResult.isLoading}
                            />

                            <TextInput
                                validationIcons
                                name={'website'}
                                label={'Website'}
                                placeholder={'Website Url...'}
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
                </div>
                {/* Business Information */}
                <div className="w-full">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Business Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        Your information is required to make things clear and
                        transparent
                    </p>
                    <div className="flex flex-col lg:flex-row gap-x-16 border-t py-4"></div>

                    <div className="w-full">
                        {/* <TextInput
                            label={'Business Name'}
                            name={'businessName'}
                            placeholder={'Industry Name...'}
                            validationIcons
                            required
                        /> */}
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
                                placeholder={'Contact Person Number ...'}
                                validationIcons
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Sector Information */}
                <div className="w-full">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Sector Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        Select your eligible sectors, and related courses.
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-16 border-t py-4">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
                        <div>
                            <Select
                                label={'Sector'}
                                {...(storedData
                                    ? {
                                        defaultValue: storedData.sectors,
                                    }
                                    : {})}
                                value={selectedSector}
                                name={'sectors'}
                                options={sectorOptions}
                                placeholder={'Select Sectors...'}
                                multi
                                loading={sectorResponse.isLoading}
                                disabled={sectorResponse.isLoading}
                                onChange={onSectorChanged}
                                validationIcons
                            />
                        </div>
                        <div>
                            <Select
                                label={'Courses'}
                                name={'courses'}
                                value={courseValues}
                                defaultValue={courseOptions}
                                options={courseOptions}
                                multi
                                onChange={(e: SelectOption[]) => {
                                    onCourseChange(
                                        e?.map(
                                            (course: SelectOption) =>
                                                course?.value
                                        )
                                    )
                                }}
                                loading={courseLoading}
                                components={{
                                    Option: CourseSelectOption,
                                }}
                                disabled={courseOptions.length === 0}
                                validationIcons
                                formatOptionLabel={formatOptionLabel}
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="w-full">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Profile Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        This will be your information used as account login.
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-16 border-t py-4">
                    <div className="w-full">
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
                </div>

                {/* Address Information */}
                <div className="w-full mt-4">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Address Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        This will help us to find out about your nearby sites
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-16 border-t pt-4 lg:pt-0">
                    <div className="w-full mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
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
                                }}
                                value={country?.data?.find(
                                    (c: OptionType) => c?.value === countryId
                                )}
                                // onlyValue
                                validationIcons
                            />
                            <Select
                                name="region"
                                label={'State'}
                                options={states?.map((state: any) => ({
                                    label: state.name,
                                    value: state.id,
                                }))}
                                placeholder={'Select State...'}
                                onChange={(e: any) => {
                                    formMethods.setValue('state', e?.label)
                                    setOnStateSelect(e?.value)
                                }}
                                loading={statesLoading}
                                disabled={!countryId}
                                // onlyValue
                                validationIcons
                                value={states?.find(
                                    (state: OptionType) =>
                                        state?.value === onStateSelect
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-x-3">
                            <div className="col-span-3">
                                <AddressFieldInput
                                    placesSuggetions={{
                                        placesSuggetions: onSuburbClicked,
                                        setIsPlaceSelected: setOnSuburbClicked,
                                    }}
                                    onChange={() => {
                                        setOnSuburbClicked(false)
                                    }}
                                />
                            </div>
                            <TextInput
                                label={'Zip Code'}
                                name={'zipCode'}
                                placeholder={'Zip Code...'}
                                validationIcons
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8">
                            {/* <TextInput
                                label={'Suburb'}
                                name={'suburb'}
                                placeholder={'Suburb...'}
                                validationIcons
                                placesSuggetions
                                onChange={() => {
                                    setOnSuburbClicked(false)
                                }}
                                // onChange={onSuburbChange}
                                onPlaceSuggetions={{
                                    placesSuggetions: onSuburbClicked,
                                    setIsPlaceSelected: setOnSuburbClicked,
                                }}
                            /> */}
                        </div>
                    </div>
                </div>

                <div className="w-full">
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

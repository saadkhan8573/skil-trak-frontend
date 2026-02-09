import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UserRoles } from '@constants'

import _debounce from 'lodash/debounce'
import * as yup from 'yup'

import { useContextBar, useNotification } from '@hooks'
import { AuthApi, CommonApi, useAddCustomIndustryMutation } from '@queries'
import { OptionType } from '@types'
import {
    CourseSelectOption,
    formatOptionLabel,
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
    ShowErrorNotifications,
    TextInput,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'

export const AddCustomIndustryForm = ({ workplaceId }: any) => {
    const { notification } = useNotification()
    const { hide } = useContextBar()

    const sectorResponse = AuthApi.useSectors({})
    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()
    const [addCustomIndustry, addCustomIndustryResult] =
        useAddCustomIndustryMutation()

    const [sectorOptions, setSectorOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [courseLoading, setCourseLoading] = useState(false)

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const [storedData, setStoredData] = useState<any>(null)

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

    const onSectorChanged = (sectors: any) => {
        setCourseLoading(true)

        const sectorExisting = sectorResponse?.data?.find(
            (sector: any) => sector.id === sectors?.value
        )
        const newCourseOptions: any = []
        sectorExisting?.courses?.map((course: any) =>
            newCourseOptions.push({
                item: course,
                value: course.id,
                label: course.title,
            })
        )
        setCourseOptions(newCourseOptions)
        setCourseLoading(false)
    }

    // const onSectorChanged = (sectors: any) => {
    //     setCourseLoading(true)
    //     const filteredCourses = sectors.map((selectedSector: any) => {
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
    //                     label: course.title,
    //                     value: course.id,
    //                 })
    //             )
    //         }
    //     })

    //     setCourseOptions(newCourseOptions)
    //     setCourseLoading(false)
    // }

    // const onSectorChanged = (sectors: any) => {
    //     setCourseLoading(true)

    //     const sectorExisting = sectorResponse?.data?.find(
    //         (sector: any) => sector.id === sectors?.value
    //     )
    //     const newCourseOptions: any = []
    //     sectorExisting?.courses?.map((course: any) =>
    //         newCourseOptions.push({
    //             label: course.title,
    //             value: course.id,
    //         })
    //     )
    //     setCourseOptions(newCourseOptions)
    //     setCourseLoading(false)
    // }

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

        // Sector Information
        sectors: yup.object().nullable().required(),
        courses: yup.number().required(),
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
        // region: yup.number().required('Must provide name of state'),
        suburb: yup.string().required('Must provide suburb name'),
        zipCode: yup.string().required('Must provide zip code for your state'),

        agreedWithPrivacyPolicy: yup
            .boolean()
            .oneOf(
                [true],
                'Please check if you agree with our terms & policies'
            ),
    })

    useEffect(() => {
        if (sectorResponse.data?.length) {
            const options = sectorResponse.data?.map((sector: any) => ({
                label: sector.name,
                value: sector.id,
            }))
            setSectorOptions(options)
        }
    }, [sectorResponse?.data])

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

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
    })

    useEffect(() => {
        if (addCustomIndustryResult.isSuccess) {
            notification.success({
                title: 'Industry Added Successfully',
                description: 'Industry Added Successfully',
            })
            formMethods.reset()
            hide()
        }
    }, [addCustomIndustryResult])

    const onHandleSubmit = (values: any) => {
        if (!onSuburbClicked) {
            notification.error({
                title: 'You must select on Suburb Dropdown',
                description: 'You must select on Suburb Dropdown',
            })
        } else if (onSuburbClicked) {
            addCustomIndustry({
                id: workplaceId,
                body: {
                    ...values,
                    password: 'N/A',
                    role: UserRoles.INDUSTRY,
                    courses: [values.courses],
                    sectors: [values.sectors.value],
                },
            })
        }
    }

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
    }

    return (
        <>
            <ShowErrorNotifications result={addCustomIndustryResult} />
            <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onHandleSubmit)}>
                    {/* Personal Information */}
                    <TextInput
                        label={'Name'}
                        name={'name'}
                        placeholder={'Industry Name...'}
                        validationIcons
                        required
                    />

                    <TextInput
                        label={'ABN'}
                        name={'abn'}
                        placeholder={'ABN...'}
                        validationIcons
                        required
                        onBlur={onBlur}
                    />

                    <TextInput
                        label={'Website (Optional)'}
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

                    {/* Sector Information */}
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

                    <Select
                        label={'Courses'}
                        name={'courses'}
                        defaultValue={courseOptions}
                        options={courseOptions}
                        loading={courseLoading}
                        onlyValue
                        disabled={
                            storedData
                                ? storedData?.courses?.length === 0
                                : courseOptions?.length === 0
                        }
                        validationIcons
                        components={{
                            Option: CourseSelectOption,
                        }}
                        formatOptionLabel={formatOptionLabel}
                    />

                    {/* Profile Information */}
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

                    {/* Address Information */}
                    <TextInput
                        label={'Primary Address'}
                        name={'addressLine1'}
                        placeholder={'Your Primary Address...'}
                        validationIcons
                        placesSuggetions
                    />

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
                            setIsPlaceSelected: setOnSuburbClicked,
                        }}
                    />

                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                methods.setValue('country', e?.label)
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
                           
                        />
                    </div> */}

                    <TextInput
                        label={'Zip Code'}
                        name={'zipCode'}
                        placeholder={'Zip Code...'}
                        validationIcons
                    />

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
                        <Button
                            text={'Continue'}
                            submit
                            loading={addCustomIndustryResult?.isLoading}
                            disabled={addCustomIndustryResult?.isLoading}
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import * as yup from 'yup'
import _debounce from 'lodash/debounce'
import { FormProvider, useForm } from 'react-hook-form'

import { useNotification } from '@hooks'
import { AuthApi, CommonApi } from '@queries'
import {
    CourseSelectOption,
    formatOptionLabel,
    getAddressData,
    getLatLng,
    getPostalCode,
    getSuburb,
    isEmailValid,
    onlyAlphabets,
    onlyNumbersAcceptedInYup,
    removeEmptySpaces,
    SignUpUtils,
} from '@utils'

import {
    AddressFieldInput,
    Button,
    Card,
    Checkbox,
    Select,
    SelectOption,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AddIndustryQuestionForm } from '../IndustryProfileDetail/forms'
import { industryQuestions } from '@partials/admin/industry/components'
import { IndustryQuestionsEnum } from '@partials/admin/industry/enum'
import { OptionType } from '@types'
import { IndustryDetailConfirmationModal } from './modal/IndustryDetailConfirmationModal'

export const FutureIndustrySignUpForm = ({
    result,
    industryABN,
    onSubmit,
}: // setActive,
// courses,
{
    result?: any
    industryABN?: string | null
    onSubmit: any
    // setActive: any
    // courses?: Course[]
}) => {
    const router = useRouter()
    const { notification } = useNotification()
    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const [lastEnteredEmail, setLastEnteredEmail] = useState('')
    const [sectorOptions, setSectorOptions] = useState<any>([])
    const [selectedSector, setSelectedSector] = useState<any>(null)
    const [courseOptions, setCourseOptions] = useState([])
    const [courseLoading, setCourseLoading] = useState(false)
    const [storedData, setStoredData] = useState<any>(null)
    const [courseValues, setCourseValues] = useState<SelectOption[]>([])
    // countries and states
    const [countryId, setCountryId] = useState(null)
    const [onStateSelect, setOnStateSelect] = useState()

    const country = CommonApi.Countries.useCountriesList()
    const { data: states, isLoading: statesLoading } =
        CommonApi.Countries.useCountryStatesList(countryId, {
            skip: !countryId,
        })
    // check email
    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()
    const sectorResponse = AuthApi.useSectors({})
    const courses = sectorResponse?.data?.flatMap((obj: any) => obj?.courses)

    const [
        getAbnDetails,
        { data: abnData, isFetching: isAbnFetching, isLoading: isAbnLoading },
    ] = CommonApi.FindWorkplace.useLazyGetAbnDetails()
    const [showAbnDialog, setShowAbnDialog] = useState(false)
    const [abnConfirmed, setAbnConfirmed] = useState(false)
    const [abnError, setAbnError] = useState<any>(null)

    const onSectorChanged = (sectors: any) => {
        setSelectedSector(sectors)
        setCourseLoading(true)
        const filteredCourses = sectors?.map((selectedSector: any) => {
            const sectorExisting = sectorResponse?.data?.find(
                (sector: any) => sector?.id === selectedSector?.value
            )
            if (sectorExisting && sectorExisting?.courses?.length) {
                return sectorExisting.courses
            }
        })

        const newCourseOptions: any = []
        filteredCourses.map((courseList: any) => {
            if (courseList && courseList.length) {
                return courseList.map((course: any) =>
                    newCourseOptions.push({
                        item: course,
                        value: course.id,
                        label: course.title,
                    })
                )
            }
        })

        setCourseOptions(newCourseOptions)
        setCourseLoading(false)
    }

    useEffect(() => {
        if (sectorResponse.data?.length) {
            const options = sectorResponse.data?.map((sector: any) => ({
                label: sector?.name,
                value: sector?.id,
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
        name: yup.string().required('Must provide your name'),
        website: yup.string().required('Must provide website url'),

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
        region: yup.number().required('Must provide name of state'),
        // country: yup.string().required('Must provide country'),
        // suburb: yup.string().required('Must provide suburb name'),
        zipCode: yup.string().required('Must provide zip code for your state'),

        agreedWithPrivacyPolicy: yup
            .boolean()
            .oneOf(
                [true],
                'Please check if you agree with our terms & policies'
            ),
        sectors: yup.array().min(1, 'Must select at least 1 sector'),
        courses: yup.array().min(1, 'Must select at least 1 course'),
        // [IndustryQuestionsEnum.CAPACITY]: yup
        //     .string()
        //     .required('Must provide Capacity')
        //     .min(1, 'Min Capacity is 1')
        //     .max(10, 'Max Capacity is 10'),
    })

    // useEffect For Email
    useEffect(() => {
        if (emailCheckResult.isError) {
            notification.error({
                title: 'Email Exist',
                description: `${lastEnteredEmail} is already being used`,
            })
        }
    }, [emailCheckResult])
    useEffect(() => {
        if (SignUpUtils.getEditingMode()) {
            const values = SignUpUtils.getValuesFromStorage()
            setStoredData(values)
            setCourseOptions(values?.courses)
        }
    }, [])

    const onBackToReview = () => {
        SignUpUtils.setEditingMode(false)
        router.push('/auth/signup/review-signup-info')
    }

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const watchAddress = formMethods.watch('addressLine1')

    useEffect(() => {
        const fetchAddressDetails = async () => {
            if (watchAddress && watchAddress.length > 4) {
                try {
                    const latLng = await getLatLng(watchAddress)
                    const postalCode = await getPostalCode(latLng)

                    const suburb = await getSuburb(watchAddress)
                    const { state } = await getAddressData(watchAddress)

                    if (postalCode) {
                        formMethods.setValue('zipCode', postalCode)
                    }

                    if (suburb) {
                        formMethods.setValue('suburb', suburb)
                    }

                    if (state) {
                        formMethods.setValue('state', state)
                    }
                } catch (error) {
                    console.error('Error fetching postal code:', error)
                }
            }
        }
        fetchAddressDetails()
    }, [watchAddress])

    useEffect(() => {
        if (courseOptions && courseOptions?.length > 0) {
            formMethods.setValue('courses', courseOptions)
        }
    }, [courseOptions])

    // get data from local storage
    const selectedRowDataString = localStorage?.getItem('signup-data')
    const jsonData = selectedRowDataString
        ? JSON.parse(selectedRowDataString)
        : {}

    useEffect(() => {
        const selectedRowData = selectedRowDataString
            ? JSON.parse(selectedRowDataString)
            : {}

        const sectors = selectedRowData?.sector?.map((s: any) => ({
            label: s?.name,
            value: s?.id,
        }))
        formMethods.setValue('website', selectedRowData?.website || '')
        formMethods.setValue('name', selectedRowData?.businessName || '')
        formMethods.setValue('email', selectedRowData?.email || '')
        formMethods.setValue('phoneNumber', selectedRowData?.phone || '')
        formMethods.setValue('addressLine1', selectedRowData?.address || '')
        formMethods.setValue('sectors', sectors || [])
        formMethods.setValue(
            IndustryQuestionsEnum.SECTOR,
            sectors?.map((sector: OptionType) => sector?.label)?.join(', ')
        )
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

    // useEffect(() => {
    //     if (selectedSector) {
    //         onSectorChanged(selectedSector)
    //     }
    // }, [selectedSector])
    useEffect(() => {
        if (
            selectedSector &&
            sectorResponse?.data &&
            sectorResponse?.data?.length > 0
        ) {
            onSectorChanged(selectedSector)
        }
    }, [selectedSector, sectorResponse])
    const signUpValues = {
        name: formMethods.watch('name'),
        email: formMethods.watch('email'),
        phoneNumber: formMethods.watch('phoneNumber'),
        addressLine1: formMethods.watch('addressLine1'),
        courses: formMethods.watch('courses'),
        sectors: selectedSector,
    }

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
        setAbnConfirmed(false)
        setAbnError(null)
    }

    const handleConfirmABN = () => {
        setAbnConfirmed(true)
        setShowAbnDialog(false)
        formMethods.handleSubmit(onHandleSubmit)
        // onHandleSubmit(formMethods.getValues())
    }

    const onHandleSubmit = async (values: any) => {
        if (!onSuburbClicked) {
            notification.error({
                title: 'You must select on Address Dropdown',
                description: 'You must select on Address Dropdown',
            })
            return
        }
        if (values.abn && values.abn.length === 11 && !abnConfirmed) {
            try {
                setAbnError(null)
                await getAbnDetails(values.abn).unwrap()
                setShowAbnDialog(true)
                return
            } catch (error) {
                setAbnError(error)
                setShowAbnDialog(true)
                return
            }
        }

        let questions: {
            [key: string]: any
        }[] = []
        const sectorBaseCapacity = values?.sectorsBaseCap
        Object.entries(industryQuestions).forEach(([key, value]: any) => {
            if (
                key !== IndustryQuestionsEnum.SECTORS_BASE_CAPACITY &&
                key !== IndustryQuestionsEnum.TRAINING &&
                key !== IndustryQuestionsEnum.APPLICATIONS
            ) {
                questions.push({
                    question: value,
                    answer: values?.[key],
                })
            }
            // delete values?.[key]
        })

        if (values?.training === 'yes') {
            questions.push({
                question: industryQuestions[IndustryQuestionsEnum.TRAINING],
                answer: values?.trainingDetails,
            })
        } else if (values?.training === 'no') {
            questions.push({
                question: industryQuestions[IndustryQuestionsEnum.TRAINING],
                answer: values?.training,
            })
        }
        if (values?.application === 'yes') {
            questions.push({
                question: industryQuestions[IndustryQuestionsEnum.APPLICATIONS],
                answer: values?.applicationLink,
            })
        } else if (values?.application === 'no') {
            questions.push({
                question: industryQuestions[IndustryQuestionsEnum.APPLICATIONS],
                answer: values?.application,
            })
        }

        if (sectorBaseCapacity?.length) {
            questions.push({
                question:
                    industryQuestions[
                        IndustryQuestionsEnum.SECTORS_BASE_CAPACITY
                    ],
                answer: sectorBaseCapacity,
            })
        }

        if (onSuburbClicked) {
            onSubmit({
                ...values,
                state: values.state,
                country: values.country,
                suburb: values?.suburb || 'N/A',
                isAddressUpdated: true,
                questions,
            })
        }
    }

    return (
        <Card>
            <div
                className={
                    'group max-w-max transition-all text-xs flex justify-start items-center py-2.5 text-muted hover:text-muted-dark rounded-lg cursor-pointer'
                }
                // onClick={() => {
                //     setActive((active: number) => active - 1)
                // }}
            >
                {/* <IoIosArrowRoundBack className="transition-all inline-flex text-base group-hover:-translate-x-1" />
                <span className="ml-2">{'Back To Previous'}</span> */}
            </div>
            <div className="">
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
                                    placeholder={'Contact Person Number ...'}
                                    validationIcons
                                    required
                                />
                            </div>
                        </div>

                        {/* Sector Information */}
                        <div className="grid grid-cols-2 gap-x-3">
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
                            <Select
                                label={'Courses'}
                                name={'courses'}
                                defaultValue={courseOptions}
                                options={courseOptions}
                                multi
                                loading={courseLoading}
                                components={{
                                    Option: CourseSelectOption,
                                }}
                                disabled={courseOptions.length === 0}
                                validationIcons
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mb-4">
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
                                        (c: OptionType) =>
                                            c?.value === countryId
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
                                    onlyValue
                                    placeholder={'Select State...'}
                                    onChange={(e: any) => {
                                        setOnStateSelect(e?.value)
                                    }}
                                    loading={statesLoading}
                                    disabled={!countryId}
                                    validationIcons
                                    required
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
                                            setIsPlaceSelected:
                                                setOnSuburbClicked,
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
                                {/* <Select
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
                            /> */}
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
                                        setIsPlaceSelected: setOnSuburbClicked,
                                    }}
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
                            </div> */}
                        </div>

                        <div>
                            <Typography variant="title">
                                You are about to register a new industry from
                                the future industry list. Please provide
                                accurate and detailed information about the
                                industry to ensure smooth onboarding and
                                collaboration.
                            </Typography>
                            <AddIndustryQuestionForm
                                methods={formMethods}
                                signUpValues={signUpValues}
                            />
                        </div>

                        <div className="">
                            <div className="mb-6">
                                <Checkbox
                                    name={'agreedWithPrivacyPolicy'}
                                    label={
                                        <>
                                            I agree with{' '}
                                            <Link
                                                href="/terms-and-conditions"
                                                className="text-link"
                                            >
                                                Terms
                                            </Link>{' '}
                                            {'&'}{' '}
                                            <Link
                                                href="/privacy-policy"
                                                className="text-link"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </>
                                    }
                                />
                            </div>

                            <div className="flex gap-x-4">
                                <Button
                                    text={'Continue'}
                                    submit
                                    loading={
                                        result?.isLoading ||
                                        isAbnFetching ||
                                        isAbnLoading
                                    }
                                    disabled={
                                        result?.isLoading ||
                                        isAbnFetching ||
                                        isAbnLoading
                                    }
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
            <IndustryDetailConfirmationModal
                showAbnDialog={showAbnDialog}
                setShowAbnDialog={setShowAbnDialog}
                abnResult={abnData}
                error={abnError}
                handleConfirmABN={handleConfirmABN}
            />
        </Card>
    )
}

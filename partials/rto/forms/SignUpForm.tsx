import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import _debounce from 'lodash/debounce'
import * as yup from 'yup'

import { useNotification } from '@hooks'
import { AuthApi } from '@queries'
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
    SelectOption,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { RtoFormData } from '@types'
import { fromAddress, geocode, GeocodeOptions, setKey } from 'react-geocode'
import { FormProvider, useForm } from 'react-hook-form'

export const RtoSignUpForm = ({
    onSubmit,
}: {
    onSubmit: (values: RtoFormData) => void
}) => {
    const router = useRouter()

    const { notification } = useNotification()

    const sectorResponse = AuthApi.useSectors({})
    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()

    const [sectorOptions, setSectorOptions] = useState([])
    const [courseOptions, setCourseOptions] = useState([])
    const [courseLoading, setCourseLoading] = useState(false)

    const [courseValues, setCourseValues] = useState<SelectOption[]>([])

    const [storedData, setStoredData] = useState<any>(null)

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

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

    useEffect(() => {
        setKey(process.env.NEXT_PUBLIC_MAP_KEY as string)
    }, [])

    const onSectorChanged = (sectors: any) => {
        setCourseLoading(true)
        const filteredCourses = sectors.map((selectedSector: any) => {
            const sectorExisting = sectorResponse.data.find(
                (sector: any) => sector.id === selectedSector.value
            )
            if (sectorExisting && sectorExisting?.courses?.length) {
                return sectorExisting.courses
            }
        })

        const abc =
            sectors?.length > 0
                ? sectorResponse.data
                    .find(
                        (sector: any) =>
                            sector.id === sectors[sectors?.length - 1].value
                    )
                    ?.courses?.map((c: any) => ({
                        label: c?.title,
                        value: c?.id,
                    }))
                : []
        const abcIds = abc?.map((a: any) => a?.value)

        // setCourseValues((preVal: any) => [
        //     ...preVal?.filter((p: any) => !abcIds?.includes(p?.id)),
        //     ...abc,
        // ])

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
        setCourseValues(newCourseOptions)
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
        phone: yup.string().required('Must provide phone number'),

        // Sector Information
        // sectors: yup.array().min(1, 'Must select at least 1 sector'),
        // courses: yup.array().min(1, 'Must select at least 1 course'),

        // Contact Person Information
        contactPersonName: yup
            .string()
            .matches(onlyAlphabets(), 'Must be a valid name'),
        contactPersonEmail: yup.string().email('Must be a valid email'),
        contactPersonNumber: yup.string(),

        // Address Information
        // addressLine1: yup.string().when('onSuburbClicked', {
        //     is: true,
        //     then: (schema) =>
        //         schema
        //             .required('Address is required when the flag is true')
        //             .min(5, 'Address must be at least 5 characters long'),
        //     otherwise: (schema) => schema,
        // }),
        addressLine1: yup.string().required('Must provide address'),
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
    }, [sectorResponse.data])

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

    const formMethods = useForm<RtoFormData>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    useEffect(() => {
        if (courseValues && courseValues?.length > 0) {
            formMethods.setValue('courses', courseValues)
        }
    }, [courseValues])

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
    }

    const onHandleSubmit = (values: any) => {
        onSubmit(values)
        // if (!onSuburbClicked) {
        //     notification.error({
        //         title: 'You must select on Address Dropdown',
        //         description: 'You must select on Address Dropdown',
        //     })
        // } else if (onSuburbClicked) {
        //     onSubmit(values)
        // }
    }

    const handleAddressChange = (e: any) => {
        setOnSuburbClicked(false)
        // formMethods.setValue('addressLine1', e.target?.value, {
        //     shouldValidate: true,
        //     shouldDirty: true,
        // })

        // if (!onSuburbClicked) {
        //     formMethods.setError('addressLine1', {
        //         type: 'manual',
        //         message: 'Please select an address from the dropdown',
        //     })
        // }
        if (e?.target?.value?.length > 4) {
            fromAddress(e?.target?.value)
                .then(({ results }: any) => {
                    const { lat, lng } = results[0].geometry.location
                    geocode('latlng', `${lat},${lng}`, {
                        key: process.env.NEXT_PUBLIC_MAP_KEY,
                    } as GeocodeOptions)
                        .then((response) => {
                            // const s = getAddressData(e?.target?.value)
                            const addressComponents =
                                response.results[0].address_components

                            const state = addressComponents.find(
                                (component: any) =>
                                    component.types.includes(
                                        'administrative_area_level_1'
                                    )
                            )?.long_name

                            formMethods.setValue('state', state || 'N/A')

                            for (let component of addressComponents) {
                                if (component.types.includes('postal_code')) {
                                    formMethods.setValue(
                                        'zipCode',
                                        component.long_name
                                    )

                                    break
                                }
                            }
                        })
                        .catch((error) => {
                            console.error({
                                error,
                            })
                        })
                })
                .catch(console.error)
        }
    }

    const addressValue = formMethods.watch('addressLine1')

    useEffect(() => {
        if (addressValue && !onSuburbClicked) {
            formMethods.setError('addressLine1', {
                type: 'manual',
                message: 'Please select an address from the dropdown',
            })
            formMethods.trigger('addressLine1') // Force UI update
        } else {
            // setTimeout(() => {
            //     formMethods.clearErrors('addressLine1')
            // }, 500)
        }
    }, [onSuburbClicked, addressValue, formMethods])

    return (
        <FormProvider {...formMethods}>
            <form
                className="flex flex-col gap-y-4"
                onSubmit={formMethods.handleSubmit(onHandleSubmit)}
            >
                {/* Personal Information */}
                <div className="w-full">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Training Organization Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        Your information is required to make things clear and
                        transparent
                    </p>
                </div>
                <div className=" border-t py-4">
                    <div className="w-full">
                        <TextInput
                            label={'Name'}
                            name={'name'}
                            placeholder={'Training Organization Name...'}
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
                                label={'Code'}
                                name={'rtoCode'}
                                placeholder={'Code...'}
                                validationIcons
                                required
                            />

                            <TextInput
                                label={'Phone Number'}
                                name={'phone'}
                                placeholder={'Your phone number...'}
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
                                value={courseValues}
                                options={courseOptions}
                                multi
                                loading={courseLoading}
                                onChange={(e: any) => {
                                    setCourseValues(e)
                                }}
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
                <div className="w-full">
                    <Typography variant={'subtitle'} color={'text-gray-500'}>
                        Address Information
                    </Typography>
                    <p className="text-gray-400 text-sm leading-6">
                        This will help us to find out about your nearby sites
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-16 border-t lg:py-4 pt-4 lg:pt-0">
                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                            <div className="md:col-span-2">
                                <TextInput
                                    label={'Primary Address'}
                                    name={'addressLine1'}
                                    placeholder={'Your Primary Address...'}
                                    validationIcons
                                    placesSuggetions
                                    onChange={(e: any) =>
                                        handleAddressChange(e)
                                    }
                                    // onChange={async (e: any) => {
                                    //     setOnSuburbClicked(false)
                                    //     if (e?.target?.value?.length > 4) {
                                    //         try {
                                    //             const { state } =
                                    //                 await getAddressData(
                                    //                     e?.target?.value
                                    //                 )
                                    //             const latLng = await getLatLng(
                                    //                 e?.target?.value
                                    //             )
                                    //             const postalCode =
                                    //                 await getPostalCode(latLng)

                                    //             if (postalCode) {
                                    //                 formMethods.setValue(
                                    //                     'zipCode',
                                    //                     postalCode
                                    //                 )
                                    //             }
                                    //             if (state) {
                                    //                 formMethods.setValue(
                                    //                     'state',
                                    //                     state
                                    //                 )
                                    //             }
                                    //             // formMethods.setError(
                                    //             //     'addressLine1',
                                    //             //     {
                                    //             //         type: 'address',
                                    //             //         message:
                                    //             //             'You must select on Suburb Dropdown',
                                    //             //     }
                                    //             // )
                                    //         } catch (error) {
                                    //             console.error(
                                    //                 'Error fetching postal code:',
                                    //                 error
                                    //             )
                                    //         }
                                    //     }
                                    // }}
                                    onPlaceSuggetions={{
                                        placesSuggetions: onSuburbClicked,
                                        setIsPlaceSelected: (
                                            selected: boolean
                                        ) => {
                                            setOnSuburbClicked(selected)
                                            // if (selected) {
                                            //     formMethods.clearErrors(
                                            //         'addressLine1'
                                            //     )
                                            // }
                                        },
                                    }}
                                />
                            </div>
                            {/* <TextInput
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
                            /> */}

                            <TextInput
                                label={'Zip Code'}
                                name={'zipCode'}
                                placeholder={'Zip Code...'}
                                validationIcons
                            />
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

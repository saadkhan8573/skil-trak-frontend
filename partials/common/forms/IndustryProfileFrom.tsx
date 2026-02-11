import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

// components
import {
    AddressFieldInput,
    AuthorizedUserComponent,
    Avatar,
    Button,
    Card,
    Select,
    SelectOption,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'

// hooks
import {
    useActionModal,
    useContextBar,
    useNotification,
    useSubadminProfile,
} from '@hooks'

// utills
import { UserRoles } from '@constants'
import { AuthApi, CommonApi } from '@queries'
import { Course } from '@types'
import {
    CourseSelectOption,
    formatOptionLabel,
    getUserCredentials,
    onlyNumbersAcceptedInYup,
    removeEmptySpaces,
} from '@utils'
import { useRouter } from 'next/router'

const validationSchema = yup.object({
    // Profile Information
    name: yup.string().required('Must provide your name'),

    email: yup
        .string()
        // .test('test-name', 'Validation failure message', function (value) {
        //     const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        //     return false
        //     // return value ? isEmailValid(value) : false
        // })
        // .email('Invalid Email')
        .required('Must provide email'),

    // Business Information
    abn: onlyNumbersAcceptedInYup(yup),
    phoneNumber: yup.string().required('Must provide phone number'),

    courses: yup.array().min(1, 'Must select at least 1 course'),

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
    contactPerson: yup.string().required(),
    contactPersonEmail: yup.string().email('Must be a valid email'),
    contactPersonNumber: yup.string(),

    // Address Information
    addressLine1: yup.string().required('Must provide address'),
    // state: yup.string().required('Must provide name of state'),
    // suburb: yup.string().required('Must provide suburb name'),
    zipCode: yup.string().required('Must provide zip code for your state'),
})

export const IndustryProfileFrom = ({
    result,
    profile,
    onSubmit,
}: {
    result: any
    profile: any
    onSubmit: any
}) => {
    const { notification } = useNotification()
    const contextBar = useContextBar()

    const router = useRouter()

    const subadmin = useSubadminProfile()

    const sectorResponse = AuthApi.useSectors({})
    const [sectorDefaultOptions, setSectorDefaultOptions] = useState<
        any | null
    >(null)
    const [courseValues, setCourseValues] = useState<SelectOption[]>([])
    const [sectors, setSectors] = useState<any | null>(null)
    const [courseOptions, setCourseOptions] = useState([])
    const [courseDefaultOptions, setCourseDefaultOptions] = useState([])
    const [isAddressUpdated, setIsAddressUpdated] = useState<boolean>(false)

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const { onUpdatePassword, passwordModal } = useActionModal()

    const sectorOptions = sectorResponse?.data
        ? sectorResponse.data?.map((sector: any) => ({
            label: sector.name,
            value: sector.id,
        }))
        : []

    useEffect(() => {
        if (profile.isSuccess && profile?.data?.courses?.length > 0) {
            const courseAddedOptions = profile?.data?.courses?.map(
                (course: any) => ({
                    item: course,
                    value: course?.id,
                    label: course?.title,
                })
            )
            setCourseValues(courseAddedOptions)
            setCourseOptions(courseAddedOptions)
        }
    }, [profile])

    // remove duplicate Sectors
    useEffect(() => {
        if (profile?.data) {
            setSectors([
                ...new Map(
                    profile?.data?.courses
                        ?.map((c: any) => c.sector)
                        ?.map((v: any) => [v.id, v])
                ).values(),
            ])
        }
    }, [profile?.data])

    useEffect(() => {
        if (sectors && sectors?.length > 0) {
            setSectorDefaultOptions(
                sectors?.map((sector: any) => ({
                    label: sector?.name,
                    value: sector?.id,
                }))
            )
        }
    }, [sectors])

    useEffect(() => {
        if (sectorDefaultOptions && sectorDefaultOptions?.length > 0) {
            onSectorChanged(sectorDefaultOptions, false)
        }
    }, [sectorDefaultOptions, sectorResponse])

    useEffect(() => {
        contextBar.setContent(null)
        contextBar.hide()
    }, [])

    useEffect(() => {
        if (result.isSuccess) {
            notification.success({
                title: 'Profile Updated',
                description: 'Profile Updated Successfully',
            })
            router.back()
        }
    }, [result])

    const onSectorChanged = (
        sectors: any,
        chkDefaultOptions: boolean = true
    ) => {
        setSectorDefaultOptions(sectors)
        const filteredCourses = sectors.map((selectedSector: any) => {
            const sectorExisting = sectorResponse.data?.find(
                (sector: any) => sector.id === selectedSector.value
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

        const courses = profile?.data?.courses?.map((c: Course) => c.title)
        setCourseDefaultOptions(
            newCourseOptions?.filter((s: any) => courses.includes(s.label))
        )
        setCourseOptions(newCourseOptions)
        chkDefaultOptions && setCourseValues(newCourseOptions)
    }

    const role = getUserCredentials()?.role

    useEffect(() => {
        if (profile?.data && profile.isSuccess) {
            const {
                id,
                courses,
                createdByStudent,
                location,
                // isPartner,
                stripeCustomerId,
                user,
                isActive,
                skiltrakId,
                updatedAt,
                createdAt,
                branches,
                country,
                region,
                headQuarter,
                ...rest
            } = profile?.data
            const {
                socketId,
                avatar,
                createdAt: userCreatedAt,
                updatedAt: userUpdatedAt,
                messageCount,
                notificationViaEmail,
                notificationViaSms,
                password,
                refreshToken,
                skiltrakId: userSkiltrakId,
                role,
                id: { userId },
                statusChangeHistory,
                statusChange,
                status,
                ...userRest
            } = user
            const values = {
                ...rest,
                ...userRest,
                courses: courses?.map((c: Course) => ({
                    item: c,
                    value: c?.id,
                    label: c?.title,
                })),
                state: profile?.data?.region?.name,
                // isPartner: isPartner ? 'yes' : 'no',
            }
            for (const key in values) {
                formMethods.setValue(key, values[key])
            }

            setIsAddressUpdated(profile?.data?.isAddressUpdated)
            // setIsPartner(profile?.data?.isPartner ? 'yes' : 'no')
        }
    }, [profile])

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
    }

    const onHandleSubmit = (values: any) => {
        if (!onSuburbClicked) {
            notification.error({
                title: 'You must select on Suburb Dropdown',
                description: 'You must select on Suburb Dropdown',
            })
        } else if (onSuburbClicked) {
            onSubmit({
                ...values,
                // isPartner: values?.isPartner === 'yes' ? true : false,
                // studentCapacity:
                //     isPartner === 'yes' ? values?.studentCapacity : 0,
                region: values?.region?.value,
                country: null,
                isAddressUpdated,
            })
        }
    }

    return (
        <>
            <Avatar
                avatar={profile?.data?.user?.avatar}
                user={profile?.data?.user?.id}
            />
            <Card>
                {passwordModal && passwordModal}
                <ShowErrorNotifications result={result} />
                <AuthorizedUserComponent excludeRoles={[UserRoles.SUBADMIN]}>
                    <div className="mb-3 flex justify-end">
                        <Button
                            text={'Update Password'}
                            onClick={() => onUpdatePassword(profile?.data)}
                        />
                    </div>
                </AuthorizedUserComponent>
                <FormProvider {...formMethods}>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={formMethods.handleSubmit(onHandleSubmit)}
                    >
                        {/* Personal Information */}
                        <div className="flex gap-x-16 border-t py-4">
                            <div className="w-2/6">
                                <Typography
                                    variant={'subtitle'}
                                    color={'text-gray-500'}
                                >
                                    Industry Information
                                </Typography>
                                <p className="text-gray-400 text-sm leading-6">
                                    Your information is required to make things
                                    clear and transparent
                                </p>
                            </div>

                            <div className="w-4/6">
                                <TextInput
                                    label={'Name'}
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
                                </div>
                            </div>
                        </div>
                        {/* Business Information */}
                        <div className="flex gap-x-16 border-t py-4">
                            <div className="w-2/6">
                                <Typography
                                    variant={'subtitle'}
                                    color={'text-gray-500'}
                                >
                                    Business Information
                                </Typography>
                                <p className="text-gray-400 text-sm leading-6">
                                    Your information is required to make things
                                    clear and transparent
                                </p>
                            </div>

                            <div className="w-4/6">
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
                        </div>

                        <div className="w-4/6 grid grid-cols-1 gap-y-4">
                            <div>
                                <Select
                                    label={'Sector'}
                                    value={sectorDefaultOptions}
                                    name={'sectors'}
                                    options={sectorOptions}
                                    placeholder={'Select Sectors...'}
                                    multi
                                    loading={sectorResponse.isLoading}
                                    disabled
                                    onChange={onSectorChanged}
                                    validationIcons
                                />
                            </div>
                            <div>
                                <Select
                                    label={'Courses'}
                                    name={'courses'}
                                    // defaultValue={courseDefaultOptions}
                                    options={courseOptions}
                                    value={courseValues}
                                    multi
                                    disabled
                                    // disabled={
                                    //     courseOptions?.length === 0 ||
                                    //     role === UserRoles.SUBADMIN
                                    // }
                                    validationIcons
                                    onChange={(e: any) => {
                                        setCourseValues(e)
                                    }}
                                    components={{
                                        Option: CourseSelectOption,
                                    }}
                                    formatOptionLabel={formatOptionLabel}
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
                                    This will be your information used as
                                    account login.
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
                                    disabled={
                                        role === UserRoles.SUBADMIN &&
                                        !subadmin?.departmentMember?.isHod
                                    }
                                />
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
                                    This will help us to find out about your
                                    nearby sites
                                </p>
                            </div>

                            <div className="w-4/6">
                                <div className="grid grid-cols-3 gap-x-8">
                                    <div className="col-span-2">
                                        {/* <TextInput
                                            label={'Primary Address'}
                                            name={'addressLine1'}
                                            placeholder={
                                                'Your Primary Address...'
                                            }
                                            validationIcons
                                            placesSuggetions
                                            onChange={async (e: any) => {
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

                                                        setIsAddressUpdated(
                                                            true
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
                                        /> */}
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
                                        options={countryOptions}
                                        value={countryOptions?.find(
                                            (c: any) => c?.value === countryId
                                        )}
                                        loading={country.isLoading}
                                        onChange={(e: any) => {
                                            setCountryId(e?.value)
                                        }}
                                        validationIcons
                                    /> */}
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
                                        onPlaceSuggetions={{
                                            placesSuggetions: onSuburbClicked,
                                            setIsPlaceSelected:
                                                setOnSuburbClicked,
                                        }}
                                    /> */}

                                    {/* <Select
                                        name="region"
                                        label={'State'}
                                        options={statesOption}
                                        value={statesOption?.find(
                                            (s: any) => s?.value === stateId
                                        )}
                                        onChange={(e: any) => {
                                            formMethods.setValue(
                                                'state',
                                                e?.label
                                            )
                                            setStateId(e?.id)
                                        }}
                                        loading={statesLoading}
                                        disabled={!countryId}
                                        // onlyValue
                                        validationIcons
                                    /> */}

                                    {/* <TextInput
                                        label={'Zip Code'}
                                        name={'zipCode'}
                                        placeholder={'Zip Code...'}
                                        validationIcons
                                    /> */}
                                </div>

                                {/* <AuthorizedUserComponent
                                    roles={[
                                        UserRoles.ADMIN,
                                        UserRoles.INDUSTRY,
                                    ]}
                                >
                                    <div className="w-full md:w-1/2">
                                        <RadioGroup
                                            name={'isPartner'}
                                            label={
                                                'You want to use as a partner or single'
                                            }
                                            options={[
                                                {
                                                    label: 'use once',
                                                    value: 'no',
                                                },
                                                {
                                                    label: 'Is Partner',
                                                    value: 'yes',
                                                },
                                            ]}
                                            onChange={(e: any) =>
                                                setIsPartner(e?.target?.value)
                                            }
                                        />
                                        {isPartner === 'yes' && (
                                            <TextInput
                                                name={'studentCapacity'}
                                                label={'Student Capacity'}
                                                type={'number'}
                                            />
                                        )}
                                    </div>
                                </AuthorizedUserComponent> */}
                            </div>
                        </div>

                        <div className="w-4/6 ml-auto pl-12">
                            <Button
                                submit
                                text={'Update'}
                                loading={result.isLoading}
                                disabled={result.isLoading}
                            />
                        </div>
                    </form>
                </FormProvider>
            </Card>
        </>
    )
}

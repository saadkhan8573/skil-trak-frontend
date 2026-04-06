import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { ReactElement, useEffect, useState } from 'react'

// components
import {
    Button,
    Card,
    RadioGroup,
    Select,
    SelectOption,
    ShowErrorNotifications,
    TextInput,
    Tooltip,
    Typography,
    useAuthorizedUserComponent,
} from '@components'

// utils
import { UserRoles } from '@constants'
import { useSubadminProfile } from '@hooks'
import { AuthApi } from '@queries'
import { Course, OptionType, Rto, StudentStatusEnum } from '@types'
import {
    CourseSelectOption,
    ageOptions,
    formatOptionLabel,
    getAddressData,
    getLatLng,
    getPostalCode,
    getUserCredentials,
    onlyAlphabets,
} from '@utils'
import { IoInformationCircle } from 'react-icons/io5'
import { UpdateDateModal } from '../StudentProfileDetail/modals'

export const StudentProfileForm = ({
    profile,
    result,
    onSubmit,
    courses,
    rtoDetail,
    student,
    isHod,
}: {
    result: any
    profile: any
    courses: any
    onSubmit: any
    isHod?: boolean
    rtoDetail?: Rto
    student?: boolean
}) => {
    const role = getUserCredentials()?.role

    const sectorResponse = AuthApi.useSectors({})
    const rtoResponse = AuthApi.useRtos({})

    const [sectorDefaultOptions, setSectorDefaultOptions] = useState<any>([])

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const [courseValues, setCourseValues] = useState<any>([])
    const [selectedRto, setSelectedRto] = useState<any>(null)
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [sectors, setSectors] = useState<any | null>(null)
    const [courseOptions, setCourseOptions] = useState([])
    const [courseDefaultOptions, setCourseDefaultOptions] = useState([])
    const [selectedAge, setSelectedAge] = useState<any>(null)
    const [isAddressUpdated, setIsAddressUpdated] = useState<boolean>(false)
    const [sectorsValue, setSectorsValue] = useState<any>([
        ...sectorDefaultOptions,
    ])

    const sectorOptions = sectorResponse?.data
        ? sectorResponse.data?.map((sector: any) => ({
              label: sector.name,
              value: sector.id,
          }))
        : []

    const rtoOptions = rtoResponse.data?.length
        ? rtoResponse?.data?.map((rto: any) => ({
              label: rto.user.name,
              value: rto.id,
          }))
        : []
    const rtoDefaultOptions = rtoDetail
        ? {
              label: rtoDetail?.user?.name,
              value: rtoDetail?.id,
          }
        : {}

    useEffect(() => {
        if (courses.isSuccess && courses?.data?.length > 0) {
            const courseAddedOptions = courses?.data?.map((course: any) => ({
                item: course,
                value: course?.id,
                label: `${course?.title} ${course?.code}`,
            }))
            setCourseValues(courseAddedOptions)
            setCourseOptions(courseAddedOptions)
        }
    }, [courses])

    useEffect(() => {
        if (courses?.data?.length > 0 && courses?.isSuccess) {
            setSectors([
                ...new Map(
                    courses?.data
                        ?.map((c: any) => c.sector)
                        ?.map((v: any) => [v.id, v])
                ).values(),
            ])
        }
    }, [courses])

    useEffect(() => {
        if (sectors && sectors?.length > 0) {
            const defaultSectors = sectors?.map((sector: any) => ({
                label: sector?.name,
                value: sector?.id,
            }))
            setSectorDefaultOptions(defaultSectors)
            setSectorsValue(defaultSectors)
        }
    }, [sectors])
    useEffect(() => {
        if (sectorDefaultOptions && sectorDefaultOptions?.length > 0) {
            onSectorChanged(sectorDefaultOptions, false)
        }
    }, [sectorDefaultOptions, sectorResponse, courses])

    const onSectorChanged = (
        sectors: any,
        chkDefaultOptions: boolean = true
    ) => {
        const filteredCourses = sectors.map((selectedSector: any) => {
            const sectorExisting = sectorResponse.data?.find(
                (sector: any) => sector?.id === selectedSector?.value
            )
            if (sectorExisting && sectorExisting?.courses?.length) {
                return sectorExisting?.courses
            }
        })

        let newCourseOptions: any = []
        filteredCourses.map((courseList: any) => {
            if (courseList && courseList.length) {
                return courseList.map((course: any) =>
                    newCourseOptions.push({
                        item: course,
                        value: course.id,
                        label: `${course?.title} ${course?.code}`,
                    })
                )
            }
        })

        // if (chkDefaultOptions) {
        //     newCourseOptions = newCourseOptions?.filter((s: any) =>
        //         courses.includes(s.label)
        //     )
        // }
        const coursesTitle = courses?.data?.map((c: Course) => c.title)
        setCourseDefaultOptions(
            newCourseOptions?.filter((s: any) =>
                coursesTitle?.includes(s.label)
            )
        )
        // setCourseValues(
        //     newCourseOptions?.filter((s: any) =>
        //         coursesTitle?.includes(s.label)
        //     )
        // )

        setCourseOptions(newCourseOptions)
        chkDefaultOptions && setCourseValues(newCourseOptions)
    }

    const validationSchema = yup.object({
        // Profile Information
        name: yup.string().required('Must provide your name'),
        familyName: yup.string().required('Must provide your Family Name'),

        email: yup
            .string()
            .email('Invalid Email')
            .required('Must provide email'),

        // dob: yup.date().required('Must provide Date of Birth'),
        age: yup.string().nullable().required('Must Select age'),
        gender: yup.string().nullable().required('Gender is Required!'),

        phone: yup.string().required('Must provide phone number'),
        // rto: yup.number().required('RTO is required'),
        rto: yup
            .number()
            .test('rto-validation', 'RTO is required', function (value) {
                if (role === UserRoles.RTO) return true // optional for RTO role
                return value != null // required for other roles
            }),

        // Contact Person Information
        emergencyPerson: yup
            .string()
            .matches(onlyAlphabets(), 'Must be a valid name')
            .required(),
        emergencyPersonPhone: yup.string().required(),

        // Sector Information
        sectors: yup.array().min(1, 'Must select at least 1 sector'),
        courses: yup.array().min(1, 'Must select at least 1 course'),

        // Address Information
        addressLine1: yup.string().required('Must provide address'),
        // state: yup.string().required('Must provide name of state'),
        // suburb: yup.string().required('Must provide suburb name'),
        zipCode: yup.string().required('Must provide zip code for your state'),
    })

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    useEffect(() => {
        if (profile?.data && profile.isSuccess) {
            const {
                courses,
                result,
                cv,
                rto,
                savedJobs,
                user,
                workplace,
                location,
                industries,
                studentStatus,
                skiltrakId,
                nonContactable,
                isActive,
                expiryDate,
                updatedAt,
                createdAt,
                isInternational,
                ...rest
            } = profile?.data

            const userValues = {
                name: user?.name,
                email: user?.email,
            }

            const values = {
                courses: courses?.map((c: Course) => c.id),
                rto: rto?.id,
                ...rest,
                ...userValues,
            }

            for (const key in values) {
                values[key] !== 'NA' && formMethods.setValue(key, values[key])
            }
            formMethods.setValue(
                'isInternational',
                isInternational
                    ? 'international'
                    : isInternational === false
                      ? 'domestic'
                      : ''
            )
            setSelectedRto(profile?.data?.rto?.id)
            setSelectedAge(profile?.data?.age)
            setIsAddressUpdated(profile?.data?.isAddressUpdated)
        }
    }, [profile])

    useEffect(() => {
        if (courseValues && courseValues?.length > 0) {
            formMethods.setValue('courses', courseValues)
        }
    }, [courseValues])

    const onHandleSubmit = (values: any) => {
        // if (!onSuburbClicked) {
        //     notification.error({
        //         title: 'You must select on Address Dropdown',
        //         description: 'You must select on Address Dropdown',
        //     })
        // } else if (onSuburbClicked) {
        onSubmit({
            ...values,
            suburb: 'N/A',
            isAddressUpdated,
        })
        // }
    }

    const onCancel = () => setModal(null)

    const onUpdateDates = () => {
        setModal(
            <UpdateDateModal
                profile={profile?.data}
                onCancelClick={() => {
                    onCancel()
                }}
            />
        )
    }

    const subadmin = useSubadminProfile()
    const isPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN, UserRoles.STUDENT, UserRoles.RTO],
        isHod: subadmin?.departmentMember?.isHod,
    })

    return (
        <>
            {modal}
            <ShowErrorNotifications result={result} />
            <Card>
                <FormProvider {...formMethods}>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={formMethods.handleSubmit(onHandleSubmit)}
                    >
                        {/* Personal Information */}
                        <div className="flex flex-col md:flex-row gap-x-16 border-t py-4">
                            <div className="w-full md:w-2/6">
                                <div className="flex items-center gap-x-1">
                                    <Typography
                                        variant={'subtitle'}
                                        color={'text-gray-500'}
                                    >
                                        Student Information
                                    </Typography>
                                    <div className="relative group">
                                        <IoInformationCircle size={18} />
                                        <Tooltip>
                                            Add Student Information
                                        </Tooltip>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-6">
                                    Your information is required to make things
                                    clear and transparent
                                </p>
                            </div>

                            <div className="w-full md:w-4/6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                    <TextInput
                                        label={'Name'}
                                        name={'name'}
                                        placeholder={'Student Name...'}
                                        validationIcons
                                        required
                                    />
                                    <TextInput
                                        label={'Family Name'}
                                        name={'familyName'}
                                        placeholder={'Family Name...'}
                                        validationIcons
                                        required
                                    />
                                    {isPermission && (
                                        <TextInput
                                            label={'Phone Number'}
                                            name={'phone'}
                                            placeholder={'Your phone number...'}
                                            validationIcons
                                            required
                                        />
                                    )}

                                    <TextInput
                                        label={'Batch'}
                                        name={'batch'}
                                        placeholder={'Enter Student Batch...'}
                                        validationIcons
                                        required
                                    />

                                    <TextInput
                                        label={'Student ID'}
                                        name={'studentId'}
                                        placeholder={'Student ID...'}
                                        validationIcons
                                        required
                                        disabled={student}
                                    />

                                    <Select
                                        label={'Select Age'}
                                        name={'age'}
                                        value={ageOptions?.find(
                                            (age: SelectOption) =>
                                                age?.value === selectedAge
                                        )}
                                        onChange={(e: any) => {
                                            setSelectedAge(e)
                                        }}
                                        options={ageOptions}
                                        placeholder={'Select Age...'}
                                        validationIcons
                                        onlyValue
                                    />
                                    <RadioGroup
                                        name={'gender'}
                                        label={'Gender'}
                                        options={[
                                            { label: 'Male', value: 'Male' },
                                            {
                                                label: 'Female',
                                                value: 'Female',
                                            },
                                            {
                                                label: 'Other',
                                                value: 'Other',
                                            },
                                        ]}
                                    />
                                    <div>
                                        <RadioGroup
                                            gridColumns="2"
                                            layout="grid"
                                            // value={'yes'}
                                            name="isInternational"
                                            label="Are you international student domestic?"
                                            options={[
                                                {
                                                    value: 'international',
                                                    label: 'International',
                                                },
                                                {
                                                    value: 'domestic',
                                                    label: 'Domestic',
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                    <TextInput
                                        label={'Emergency Person'}
                                        name={'emergencyPerson'}
                                        placeholder={'Emergency Person...'}
                                        validationIcons
                                        required
                                    />
                                    <TextInput
                                        label={'Emergency Person Phone'}
                                        name={'emergencyPersonPhone'}
                                        placeholder={'emergencyPersonPhone...'}
                                        validationIcons
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <Select
                            label={'RTO'}
                            // value={sectorsValue}
                            {...(Object.values(rtoDefaultOptions)?.filter(
                                (f) => f !== undefined
                            )?.length > 0 && {
                                defaultValue: rtoDefaultOptions,
                            })}
                            name={'rto'}
                            options={rtoOptions}
                            placeholder={'Select RTO...'}
                            onlyValue
                            loading={rtoResponse.isLoading}
                            validationIcons
                            disabled={student || role === UserRoles.RTO}
                            value={rtoOptions?.find(
                                (rto: OptionType) => rto?.value === selectedRto
                            )}
                            onChange={(e: any) => {
                                setSelectedRto(e)
                            }}
                        />

                        {/* {Object.values(rtoDefaultOptions)?.filter(
                            (f) => f !== undefined
                        )?.length > 0 && (
                            <Select
                                label={'RTO'}
                                // value={sectorsValue}
                                {...(Object.values(rtoDefaultOptions)?.filter(
                                    (f) => f !== undefined
                                )?.length > 0 && {
                                    defaultValue: rtoDefaultOptions,
                                })}
                                name={'rto'}
                                options={rtoOptions}
                                placeholder={'Select RTO...'}
                                onlyValue
                                loading={rtoResponse.isLoading}
                                validationIcons
                                disabled={student}
                            />
                        )}
                        {!Object.keys(rtoDefaultOptions)?.length && (
                            <Select
                                label={'RTO'}
                                name={'rto'}
                                options={rtoOptions}
                                // value={sectorsValue}
                                placeholder={'Select RTO...'}
                                onlyValue
                                loading={rtoResponse.isLoading}
                                validationIcons
                                disabled={student}
                            />
                        )} */}

                        {courses.isSuccess && (
                            <div className="w-full md:w-4/6 grid grid-cols-1 gap-y-4">
                                <div>
                                    {sectorDefaultOptions &&
                                        sectorDefaultOptions?.length > 0 && (
                                            <Select
                                                label={'Sector'}
                                                value={sectorsValue}
                                                {...(sectorDefaultOptions &&
                                                    sectorDefaultOptions?.length >
                                                        0 && {
                                                        defaultValue:
                                                            sectorDefaultOptions,
                                                    })}
                                                name={'sectors'}
                                                options={sectorOptions}
                                                placeholder={
                                                    'Select Sectors...'
                                                }
                                                multi
                                                loading={
                                                    sectorResponse.isLoading
                                                }
                                                disabled={
                                                    sectorResponse.isLoading ||
                                                    isHod
                                                }
                                                onChange={(e: any) => {
                                                    onSectorChanged(e)
                                                    setSectorsValue(e)
                                                }}
                                                validationIcons
                                            />
                                        )}
                                    {!sectorDefaultOptions?.length && (
                                        <Select
                                            label={'Sector'}
                                            name={'sectors'}
                                            value={sectorsValue}
                                            options={sectorOptions}
                                            placeholder={'Select Sectors...'}
                                            multi
                                            loading={sectorResponse.isLoading}
                                            disabled={
                                                sectorResponse.isLoading ||
                                                isHod
                                            }
                                            onChange={(e: any) => {
                                                onSectorChanged(e)
                                                setSectorsValue(e)
                                            }}
                                            validationIcons
                                        />
                                    )}
                                </div>
                                <div>
                                    {/* {courseOptions &&
                                        courseOptions?.length > 0 && ( */}
                                    <Select
                                        label={'Courses'}
                                        name={'courses'}
                                        value={courseValues}
                                        // defaultValue={courseDefaultOptions}
                                        options={courseOptions}
                                        multi
                                        validationIcons
                                        onChange={(e: any) => {
                                            setCourseValues(e)
                                        }}
                                        disabled={isHod}
                                        components={{
                                            Option: CourseSelectOption,
                                        }}
                                        formatOptionLabel={formatOptionLabel}
                                    />
                                    {/* )} */}
                                    {/* {!courseOptions?.length && (
                                        <Select
                                            label={'Courses'}
                                            name={'courses'}
                                            options={courseOptions}
                                            value={courseValues}
                                            multi
                                            components={{
                                                Option: CourseSelectOption,
                                            }}
                                            onChange={(e: any) => {
                                                setCourseValues(e)
                                            }}
                                            validationIcons
                                            disabled={isHod}
                                            formatOptionLabel={
                                                formatOptionLabel
                                            }
                                        />
                                    )} */}
                                </div>
                            </div>
                        )}

                        {/* Profile Information */}
                        {([
                            UserRoles.ADMIN,
                            UserRoles.STUDENT,
                            UserRoles.RTO,
                        ].includes(role) ||
                            isHod) && (
                            <div className="flex flex-col md:flex-row gap-x-16 border-t py-2 md:py-4">
                                <div className="w-full md:w-2/6">
                                    <div className="flex items-center gap-x-1">
                                        <Typography
                                            variant={'subtitle'}
                                            color={'text-gray-500'}
                                        >
                                            Profile Information
                                        </Typography>
                                        <div className="relative group">
                                            <IoInformationCircle size={18} />
                                            <Tooltip>
                                                Add Profile Information
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-6">
                                        This will be your information used as
                                        account login.
                                    </p>
                                </div>

                                <div className="w-full md:w-4/6">
                                    <TextInput
                                        label={'Email'}
                                        name={'email'}
                                        type={'email'}
                                        placeholder={'Your Email...'}
                                        validationIcons
                                        required
                                        disabled={student || isHod}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Address Information */}
                        <div className="flex flex-col md:flex-row gap-x-16 border-t py-0 md:py-4">
                            <div className="w-full md:w-2/6">
                                <div className="flex items-center gap-x-1">
                                    <Typography
                                        variant={'subtitle'}
                                        color={'text-gray-500'}
                                    >
                                        Address Information
                                    </Typography>
                                    <div className="relative group">
                                        <IoInformationCircle
                                            size={18}
                                            onDoubleClick={() => {
                                                if (
                                                    [
                                                        UserRoles.ADMIN,
                                                        UserRoles.RTO,
                                                        UserRoles.SUBADMIN,
                                                    ]?.includes(role) &&
                                                    rtoDetail?.allowUpdate &&
                                                    profile?.data
                                                        ?.studentStatus ===
                                                        StudentStatusEnum.COMPLETED
                                                ) {
                                                    onUpdateDates()
                                                }
                                            }}
                                        />
                                        <Tooltip>
                                            Add Address Information
                                        </Tooltip>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-6">
                                    This will help us to find out about your
                                    nearby sites
                                </p>
                            </div>

                            <div className="w-full md:w-4/6">
                                <div className="grid grid-cols-3 gap-x-8">
                                    <div className="col-span-2">
                                        <TextInput
                                            label={'Primary Address'}
                                            name={'addressLine1'}
                                            placeholder={
                                                'Your Primary Address...'
                                            }
                                            validationIcons
                                            required
                                            placesSuggetions
                                            onPlaceSuggetions={{
                                                placesSuggetions:
                                                    onSuburbClicked,
                                                setIsPlaceSelected:
                                                    setOnSuburbClicked,
                                            }}
                                            onChange={async (e: any) => {
                                                setOnSuburbClicked(false)
                                                if (
                                                    e?.target?.value?.length > 4
                                                ) {
                                                    try {
                                                        const { state } =
                                                            await getAddressData(
                                                                e?.target?.value
                                                            )

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
                                                        if (state) {
                                                            formMethods.setValue(
                                                                'state',
                                                                state
                                                            )
                                                        }
                                                    } catch (error) {}
                                                }
                                            }}
                                        />
                                    </div>
                                    <TextInput
                                        label={'Zip Code'}
                                        name={'zipCode'}
                                        placeholder={'Zip Code...'}
                                        validationIcons
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8">
                                    <div className="col-span-2">
                                        <TextInput
                                            label={
                                                'Secondary Address (optional)'
                                            }
                                            name={'addressLine2'}
                                            placeholder={
                                                'Your Secondary Address...'
                                            }
                                            placesSuggetions
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-4/6 ml-auto pl-0 md:pl-12">
                            <Button
                                text={'Update'}
                                submit
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

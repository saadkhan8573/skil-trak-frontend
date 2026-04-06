import { useEffect, useState } from 'react'

import * as yup from 'yup'

import {
    CourseSelectOption,
    formatOptionLabel,
    getAddressData,
    getLatLng,
    getPostalCode,
    onlyAlphabets,
    removeEmptySpaces,
} from '@utils'

import {
    Button,
    TextInput,
    Typography,
    Card,
    Avatar,
    ShowErrorNotifications,
    Select,
    LoadingAnimation,
    TechnicalError,
    EmptyData,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { Course, Sector } from '@types'
import { AuthApi } from '@queries'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'

export const RTOProfileEditForm = ({
    onSubmit,
    profile,
    result,
}: {
    onSubmit: any
    profile: any
    result: any
}) => {
    const router = useRouter()

    const sectorResponse = AuthApi.useSectors({})
    const [sectorDefaultOptions, setSectorDefaultOptions] = useState<
        any | null
    >(null)
    const [sectors, setSectors] = useState<any | null>(null)
    const [courseOptions, setCourseOptions] = useState([])
    const [courseDefaultOptions, setCourseDefaultOptions] = useState([])

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const [isPlaceSelected, setIsPlaceSelected] = useState<{
        isFocused: boolean
        isAddressSelected: boolean
    }>({
        isFocused: false,
        isAddressSelected: false,
    })
    const [isSuburbSelected, setIsSuburbSelected] = useState<{
        isFocused: boolean
        isSuburbSelected: boolean
    }>({
        isFocused: false,
        isSuburbSelected: false,
    })

    const { notification } = useNotification()

    const sectorOptions = sectorResponse?.data
        ? sectorResponse.data?.map((sector: any) => ({
              label: sector.name,
              value: sector.id,
          }))
        : []

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
        if (result.isSuccess) {
            notification.success({
                title: 'Profile updated',
                description: 'Profile Updated Successfully',
            })
            profile.refetch()
            router.back()
        }
    }, [result])

    useEffect(() => {
        if (sectorDefaultOptions && sectorDefaultOptions?.length > 0) {
            onSectorChanged(sectorDefaultOptions)
        }
    }, [sectorDefaultOptions, sectorResponse])

    const onSectorChanged = (sectors: any) => {
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
    }

    const validationSchema = yup.object({
        // Profile Information
        name: yup.string().required('Must provide your name'),

        email: yup
            .string()
            .email('Invalid Email')
            .required('Must provide email'),

        // Business Information
        phone: yup.string().required('Must provide phone number'),

        // Contact Person Information
        contactPersonName: yup
            .string()
            .matches(onlyAlphabets(), 'Must be a valid name'),
        contactPersonEmail: yup.string().email('Must be a valid email'),
        contactPersonNumber: yup.string(),

        // Address Information
        addressLine1: yup.string().required('Must provide address'),

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
                package: RtoPackage,
                students,
                subadmin,
                user,
                id,
                updatedAt,
                createdAt,
                timeRewind,
                reportType,
                allowAutoComplete,
                allowAutoReport,
                allowUpdate,
                autoReleaseLogBook,
                skiltrakId: ski,
                isActive: act,
                contactPersons,
                sectors,
                ...rest
            } = profile?.data
            const {
                id: userId,
                notes,
                notificationViaEmail,
                notificationViaSms,
                avatar,
                isActive,
                messageCount,
                skiltrakId,
                refreshToken,
                password,
                updatedAt: userUpdatedAt,
                createdAt: userCreatedAt,
                socketId,
                statusChangeHistory,
                role,
                ...userRest
            } = user
            const values = {
                courses: courses?.map((c: Course) => c.id),
                ...rest,
                ...userRest,
            }
            for (const key in values) {
                formMethods.setValue(key, values[key])
            }
            // formMethods.setValue('sector', sectorDefaultOptions)
        }
    }, [profile, sectorResponse])

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
            onSubmit({ ...values, suburb: 'N/A' })
        }
    }

    return (
        <>
            {profile.isError && <TechnicalError />}
            {profile.isLoading ? (
                <LoadingAnimation height={'h-[50vh]'} />
            ) : profile?.data ? (
                <Card>
                    <ShowErrorNotifications result={result} />
                    <div className="flex justify-between gap-x-16 border-t py-4">
                        <div className="w-4/6">
                            <FormProvider {...formMethods}>
                                <form
                                    className="flex flex-col gap-y-4"
                                    onSubmit={formMethods.handleSubmit(
                                        onHandleSubmit
                                    )}
                                >
                                    {/* Personal Information */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                        <TextInput
                                            label={'Name'}
                                            name={'name'}
                                            placeholder={'RTO Name...'}
                                            validationIcons
                                            required
                                        />
                                        <TextInput
                                            label={'Abn'}
                                            name={'abn'}
                                            placeholder={'RTO ABN...'}
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

                                    {/* Profile Information */}
                                    <div className="flex gap-x-16 border-t py-4">
                                        <TextInput
                                            label={'Email'}
                                            name={'email'}
                                            type={'email'}
                                            placeholder={'Your Email...'}
                                            validationIcons
                                            required
                                        />
                                    </div>

                                    <div className="w-4/6 grid grid-cols-1 gap-y-4">
                                        <div>
                                            {sectorDefaultOptions &&
                                                sectorDefaultOptions?.length >
                                                    0 && (
                                                    <Select
                                                        label={'Sector'}
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
                                                        onChange={
                                                            onSectorChanged
                                                        }
                                                        validationIcons
                                                    />
                                                )}
                                            {!sectorDefaultOptions?.length && (
                                                <Select
                                                    label={'Sector'}
                                                    name={'sectors'}
                                                    options={sectorOptions}
                                                    placeholder={
                                                        'Select Sectors...'
                                                    }
                                                    multi
                                                    loading={
                                                        sectorResponse.isLoading
                                                    }
                                                    onChange={onSectorChanged}
                                                    validationIcons
                                                />
                                            )}
                                        </div>
                                        <div>
                                            {courseOptions &&
                                                courseOptions?.length > 0 && (
                                                    <Select
                                                        label={'Courses'}
                                                        name={'courses'}
                                                        defaultValue={
                                                            courseDefaultOptions
                                                        }
                                                        options={courseOptions}
                                                        multi
                                                        onlyValue
                                                        disabled={
                                                            courseOptions?.length ===
                                                            0
                                                        }
                                                        validationIcons
                                                        components={{
                                                            Option: CourseSelectOption,
                                                        }}
                                                        formatOptionLabel={
                                                            formatOptionLabel
                                                        }
                                                    />
                                                )}
                                            {!courseOptions?.length && (
                                                <Select
                                                    label={'Courses'}
                                                    name={'courses'}
                                                    options={courseOptions}
                                                    multi
                                                    onlyValue
                                                    disabled={
                                                        courseOptions?.length ===
                                                        0
                                                    }
                                                    validationIcons
                                                    components={{
                                                        Option: CourseSelectOption,
                                                    }}
                                                    formatOptionLabel={
                                                        formatOptionLabel
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div className="flex flex-col gap-x-16 border-t py-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8">
                                            <div className="col-span-2">
                                                <TextInput
                                                    label={'Primary Address'}
                                                    name={'addressLine1'}
                                                    placeholder={
                                                        'Your Primary Address...'
                                                    }
                                                    validationIcons
                                                    placesSuggetions
                                                    onChange={async (
                                                        e: any
                                                    ) => {
                                                        setOnSuburbClicked(
                                                            false
                                                        )
                                                        if (
                                                            e?.target?.value
                                                                ?.length > 4
                                                        ) {
                                                            try {
                                                                const {
                                                                    state,
                                                                } =
                                                                    await getAddressData(
                                                                        e
                                                                            ?.target
                                                                            ?.value
                                                                    )
                                                                const latLng =
                                                                    await getLatLng(
                                                                        e
                                                                            ?.target
                                                                            ?.value
                                                                    )
                                                                const postalCode =
                                                                    await getPostalCode(
                                                                        latLng
                                                                    )

                                                                if (
                                                                    postalCode
                                                                ) {
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
                                                    onPlaceSuggetions={{
                                                        placesSuggetions:
                                                            onSuburbClicked,
                                                        setIsPlaceSelected:
                                                            setOnSuburbClicked,
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
                                    </div>

                                    <div>
                                        <Button
                                            submit
                                            text={'Continue'}
                                            loading={result.isLoading}
                                            disabled={result.isLoading}
                                        />
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                        <Avatar
                            user={profile?.data?.user?.id}
                            avatar={profile?.data?.user?.avatar}
                        />
                    </div>
                </Card>
            ) : (
                !profile.isError &&
                profile.isSuccess && (
                    <EmptyData
                        title={'RTO Not Found'}
                        description={
                            'RTO has been removed or it doesnot exist in our system'
                        }
                    />
                )
            )}
        </>
    )
}

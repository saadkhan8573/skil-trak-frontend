import { Button, Select, ShowErrorNotifications, TextInput } from '@components'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import _debounce from 'lodash/debounce'
import {
    CourseSelectOption,
    formatOptionLabel,
    getLatLng,
    getPostalCode,
    isEmailValid,
    onlyNumbersAcceptedInYup,
    removeEmptySpaces,
} from '@utils'

import { AuthApi, SubAdminApi } from '@queries'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContextBar, useNotification } from '@hooks'
import { UserRoles } from '@constants'
import { OptionType, ProvideIndustryDetail } from '@types'

export const AddSecondWorkplaceForm = ({
    studentId,
    studentUserId,
    courseOptions,
}: {
    studentId: number
    studentUserId: number
    courseOptions: OptionType[]
}) => {
    const [lastEnteredEmail, setLastEnteredEmail] = useState('')

    const contextBar = useContextBar()

    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    const { notification } = useNotification()

    const [checkEmailExists, emailCheckResult] = AuthApi.useEmailCheck()
    const sectorResponse = AuthApi.useSectors({})
    const [addWorkplaceIndustry, addWorkplaceIndustryResult] =
        SubAdminApi.Student.useAddCustomWorkplace()

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
        if (addWorkplaceIndustryResult.isSuccess) {
            notification.success({
                title: 'Workplace Industry Added',
                description: 'Workplace Indiustry Added Successfully',
            })
            contextBar.hide()
            contextBar.setTitle('')
            contextBar.setContent(null)
        }
    }, [addWorkplaceIndustryResult])

    const validationSchema = yup.object({
        // Profile Information
        name: yup.string().required('Must provide your name'),

        email: yup
            .string()
            .email('Invalid Email')
            .required('Must provide email'),

        // Business Information
        abn: onlyNumbersAcceptedInYup(yup),
        phoneNumber: yup.string().required('Must provide phone number'),

        // Sector Information
        // sectors: yup.object().nullable().required(),
        courses: yup.number().required(),

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
    const formMethods = useForm<ProvideIndustryDetail>({
        mode: 'all',
        resolver: yupResolver(validationSchema) as any,
    })

    const onBlur = (e: any) => {
        const abn = e.target?.value
        removeEmptySpaces(formMethods, abn)
    }

    const onHandleSubmit = (values: any) => {
        if (!onSuburbClicked) {
            notification.error({
                title: 'You must select on Address Dropdown',
                description: 'You must select on Address Dropdown',
            })
        } else if (onSuburbClicked) {
            addWorkplaceIndustry({
                ...values,
                role: UserRoles.INDUSTRY,
                studentId: studentUserId,
                courses: [Number(values?.courses)],
                isAddressUpdated: true,
                suburb: values?.suburb || 'N/A',
                state: 'NA',
            })
        }
    }

    return (
        <div>
            <ShowErrorNotifications result={addWorkplaceIndustryResult} />
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
                        name={'contactPerson'}
                        placeholder={'Contact Person Name...'}
                        validationIcons
                        required
                    />

                    {/* Sector Information */}

                    <Select
                        label={'Courses'}
                        name={'courses'}
                        defaultValue={courseOptions}
                        options={courseOptions}
                        onlyValue
                        components={{
                            Option: CourseSelectOption,
                        }}
                        formatOptionLabel={formatOptionLabel}
                        validationIcons
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
                        onChange={async (e: any) => {
                            setOnSuburbClicked(false)
                            if (e?.target?.value?.length > 4) {
                                try {
                                    const latLng = await getLatLng(
                                        e?.target?.value
                                    )
                                    const postalCode = await getPostalCode(
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
                            placesSuggetions: onSuburbClicked,
                            setIsPlaceSelected: setOnSuburbClicked,
                        }}
                    />

                    <TextInput
                        label={'Zip Code'}
                        name={'zipCode'}
                        placeholder={'Zip Code...'}
                        validationIcons
                    />

                    <div className="flex gap-x-4">
                        <Button
                            text={'Continue'}
                            submit
                            loading={addWorkplaceIndustryResult?.isLoading}
                            disabled={addWorkplaceIndustryResult?.isLoading}
                        />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

import {
    Button,
    Checkbox,
    ContentEditor,
    RadioButton,
    RadioGroup,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AddAppointmentFormType, AppointmentType, Sector } from '@types'
import { isBrowser } from '@utils'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface AppointmentTypeFormProps {
    onSubmit: (values: any) => void
    edit?: boolean
    initialValues?: AppointmentType
    emailContent: string
    setEmailContent: Function
    result: any
}

export const AppointmentTypeForm = ({
    onSubmit,
    edit,
    initialValues,
    emailContent,
    setEmailContent,
    result,
}: AppointmentTypeFormProps) => {
    const validationSchema = yup.object({
        duration: yup.string().required('Duration is required'),
        title: yup.string().required('Title is required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: 'all',
    })

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <div className="">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                        <TextInput
                            label={'Title'}
                            name={'title'}
                            placeholder={'Appointment Type Title...'}
                            required
                            validationIcons
                        />

                        <TextInput
                            label={'Color'}
                            name={'color'}
                            type={'color'}
                            required
                        />

                        <TextInput
                            label={'Duration'}
                            name={'duration'}
                            type={'number'}
                            placeholder={'Appointment Duration...'}
                            required
                        />

                        <TextInput
                            label={'Break Duration'}
                            name={'breakDuration'}
                            type={'number'}
                            placeholder={'Appointment Break Duration...'}
                        />

                        <div>
                            <div className="flex items-center gap-x-4">
                                <RadioGroup
                                    name="appointmentFor"
                                    label={'Appointment Type for'}
                                    options={[
                                        {
                                            label: 'Student',
                                            value: 'student',
                                        },
                                        {
                                            label: 'RTO',
                                            value: 'rto',
                                        },
                                        {
                                            label: 'Industry',
                                            value: 'industry',
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                        <div>
                            <Typography variant={'label'}>
                                Participants
                            </Typography>

                            <div className="flex items-center gap-x-4 mt-2">
                                <Checkbox
                                    value={'student'}
                                    label={'Student'}
                                    name={'appointmentParticipants'}
                                />
                                <Checkbox
                                    value={'industry'}
                                    label={'Industry'}
                                    name={'appointmentParticipants'}
                                />
                                <Checkbox
                                    value={'rto'}
                                    label={'RTO'}
                                    name={'appointmentParticipants'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="">
                        {isBrowser() && (
                            <ContentEditor
                                label="Email Content"
                                content={emailContent}
                                setContent={setEmailContent}
                            />
                        )}
                    </div>

                    <div className="my-4">
                        <Checkbox
                            name={'videoAppointment'}
                            label={'Is Video Appointment'}
                        />
                    </div>

                    <div className="mt-4">
                        <Button
                            submit
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        >
                            {edit ? 'Update' : 'Add'} Appointment Type
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

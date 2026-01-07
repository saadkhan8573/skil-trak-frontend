import { Select, ShowErrorNotifications } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

// components
import { Button, TextInput, Typography } from '@components'

// query
import { useNotification } from '@hooks'
import { IndustryApi } from '@queries'
import { OptionType } from '@types'
import { SupervisorQualification } from '../data'

export const AddSupervisor = ({
    industry,
    initialValues,
    edit,
    sector,
    onCloseModal,
}: any) => {
    const { notification } = useNotification()

    const [selectedQualification, setSelectedQualification] = useState<
        number | null
    >(null)

    useEffect(() => {
        if (initialValues?.level) {
            setSelectedQualification(initialValues?.level)
        }
    }, [initialValues])

    const [addSupervisor, addSupervisorResult] =
        IndustryApi.Supervisor.addSupervisor()
    const [editSupervisor, editSupervisorResult] =
        IndustryApi.Supervisor.editSupervisor()

    useEffect(() => {
        if (addSupervisorResult.isSuccess) {
            notification.success({
                title: 'Supervisor Added',
                description: 'Supervisor Added Successfully',
            })
            onCloseModal && onCloseModal()
        }
    }, [addSupervisorResult])

    useEffect(() => {
        if (editSupervisorResult.isSuccess) {
            notification.success({
                title: 'Supervisor Updated',
                description: 'Supervisor Updated Successfully',
            })
            onCloseModal && onCloseModal()
        }
    }, [editSupervisorResult])

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required!'),
        position: Yup.string().required('Role is required!'),
        level: Yup.number().required('Qualification is required!'),
        title: Yup.string().required('Course Title is required!'),
        experience: Yup.string().required('Experience is required!'),
        phone: Yup.string().required('Phone is required!'),
        email: Yup.string().email('Invalid email').required('Email is required!'),
    })

    const methods = useForm({
        mode: 'all',
        defaultValues: initialValues || {
            name: '',
            position: '',
            level: null,
            title: '',
            experience: '',
            phone: '',
            email: '',
        },
        resolver: yupResolver(validationSchema),
    })

    const onSubmit = async (values: any) => {
        const payload = {
            ...values,
            industry: industry?.id,
            sector: sector?.id,
        }

        edit
            ? editSupervisor({
                ...payload,
                id: initialValues?.id,
            })
            : addSupervisor(payload)
    }

    const isLoading = edit
        ? editSupervisorResult.isLoading
        : addSupervisorResult.isLoading

    return (
        <div className="w-full md:w-[600px]">
            <ShowErrorNotifications result={addSupervisorResult} />
            <ShowErrorNotifications result={editSupervisorResult} />
            <div className="mb-4">
                <Typography variant={'small'} color={'text-gray-500'} semibold>
                    {edit ? 'Edit' : 'Add'} Supervisor Details
                </Typography>
                <p className="text-[11px] text-gray-400">
                    Please provide the professional details for the supervisor.
                </p>
            </div>

            <FormProvider {...methods}>
                <form
                    className="space-y-3"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="col-span-2">
                            <TextInput
                                label={'Full Name'}
                                name={'name'}
                                placeholder={'e.g., Sarah Johnson'}
                                validationIcons
                                required
                            />
                        </div>

                        <TextInput
                            label={'Role/Position'}
                            name={'position'}
                            placeholder={'e.g., Senior Manager'}
                            validationIcons
                            required
                        />

                        <TextInput
                            label={'Years of Experience'}
                            name={'experience'}
                            placeholder={'e.g., 12'}
                            validationIcons
                            required
                        />

                        <div className="relative z-30">
                            <Select
                                name="level"
                                label={'Qualification'}
                                options={SupervisorQualification}
                                onlyValue
                                onChange={(e: number) => {
                                    setSelectedQualification(e)
                                }}
                                value={SupervisorQualification?.find(
                                    (l: OptionType) =>
                                        l.value === selectedQualification
                                )}
                            />
                        </div>

                        <TextInput
                            label={'Qualification Title'}
                            name={'title'}
                            placeholder={'e.g., Bachelor of Nursing'}
                            validationIcons
                            required
                        />

                        <TextInput
                            label={'Phone Number'}
                            name={'phone'}
                            placeholder={'+61 ...'}
                            validationIcons
                            required
                        />
                        <TextInput
                            label={'Email Address'}
                            name={'email'}
                            placeholder={'supervisor@company.com'}
                            validationIcons
                            required
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-3">
                        <Button
                            variant="secondary"
                            onClick={onCloseModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            submit
                            loading={isLoading}
                            disabled={isLoading}
                            variant={edit ? 'secondary' : 'primary'}
                            className="px-8"
                        >
                            {edit ? 'Update Supervisor' : 'Add Supervisor'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

import {
    Button,
    Checkbox,
    InputRichTextEditor,
    RadioButton,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppointmentType } from '@types'
import { isBrowser } from '@utils'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import dynamic from 'next/dynamic'

interface AppointmentTypeFormProps {
    onSubmit: any
    edit?: boolean
    initialValues?: AppointmentType
    emailContent: string
    setEmailContent: Function
}

export const AppointmentTypeForm = ({
    onSubmit,
    edit,
    initialValues,
    emailContent,
    setEmailContent,
}: AppointmentTypeFormProps) => {
    const validationSchema = yup.object({
        duration: yup.string().required('Duration is required'),
        title: yup.string().required('Title is required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            ...initialValues,
            emailContent,
        },
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
                            <div className="mb-2">
                                <Typography variant={'label'}>
                                    Appointment Type for
                                </Typography>
                            </div>
                            <div className="flex items-center gap-x-4">
                                <RadioButton
                                    name={'appointmentFor'}
                                    value={'student'}
                                    label={'Student'}
                                    defaultChecked
                                />
                                <RadioButton
                                    name={'appointmentFor'}
                                    value={'rto'}
                                    label={'RTO'}
                                />
                                <RadioButton
                                    name={'appointmentFor'}
                                    value={'industry'}
                                    label={'Industry'}
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
                        {isBrowser() && <InputRichTextEditor
                            label="Email Content"
                            name="emailContent"
                            onChange={(value: string) => setEmailContent(value)}
                        />}
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
                        // disabled={!(isValid && dirty)}
                        // loading={loginResult.isLoading}
                        >
                            {edit ? 'Update' : 'Add'} Appointment Type
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

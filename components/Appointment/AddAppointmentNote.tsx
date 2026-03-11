import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { Typography } from '@components/Typography'
import { Button } from '@components/buttons'
import { TextArea } from '@components/inputs'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FaTimes } from 'react-icons/fa'

export const AddAppointmentNote = ({ onCancel, id }: any) => {
    const { notification } = useNotification()
    const [addAppointmentNote, addAppointmentNoteResult] =
        CommonApi.Appointments.addNoteOnAppointment()

    const methods = useForm({
        mode: 'all',
        // resolver: yupResolver(validationSchema),
        // defaultValues: { ...editValues, body: bodyData },
    })
    useEffect(() => {
        if (addAppointmentNoteResult.isSuccess) {
            notification.success({
                title: 'Note',
                description: 'Note On Appointment Added Successfully',
            })
            onCancel()
        }
    }, [addAppointmentNoteResult])

    const onSubmit = (data: any) => {
        addAppointmentNote({
            appointment: id,
            body: data?.note,
        })
    }
    return (
        <>
            <ShowErrorNotifications result={addAppointmentNoteResult} />
            <div className="bg-[#00000050] w-full h-screen flex items-center justify-center fixed top-0 left-0 z-1001">
                <div className="relative bg-white rounded-2xl flex flex-col items-center gap-y-6 shadow-xl min-w-112.5 px-8 py-4">
                    <FaTimes
                        onClick={onCancel}
                        className="absolute top-3 right-3 text-lg text-gray-500 cursor-pointer"
                    />
                    <div className=" w-full overflow-auto custom-scrollbar">
                        <div className="mb-2">
                            <Typography variant={'subtitle'} left>
                                Add Note Here
                            </Typography>
                        </div>
                        <FormProvider {...methods}>
                            <form
                                className="mt-2 w-full"
                                onSubmit={methods.handleSubmit(onSubmit)}
                            >
                                <TextArea
                                    rows={6}
                                    name="note"
                                    placeholder="Add note here..."
                                />
                                <Button
                                    submit
                                    text="Add Note"
                                    loading={
                                        addAppointmentNoteResult?.isLoading
                                    }
                                    disabled={
                                        addAppointmentNoteResult?.isLoading
                                    }
                                />
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </div>
        </>
    )
}

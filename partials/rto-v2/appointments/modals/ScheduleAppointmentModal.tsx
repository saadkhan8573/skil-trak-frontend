import {
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui'
import { Label } from '@components/ui/label'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi, RtoApi } from '@queries'
import { CalendarIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PuffLoader } from 'react-spinners'
import { RtoAppointmentSearchCard, SearchedUserCourseCard } from '../card'

export const ScheduleAppointmentModal = ({
    scheduleOpen,
    setScheduleOpen,
    defaultSelectedUser,
    defaultSelectedParicipantType,
}: any) => {
    const [participantType, setParticipantType] = useState<string>(
        defaultSelectedParicipantType || ''
    )
    const [selectedUser, setSelectedUser] = useState<any>(
        defaultSelectedUser || null
    )
    const [selectedCourse, setSelectedCourse] = useState<any>(null)

    const { notification } = useNotification()
    const today = new Date().toISOString().split('T')[0]
    const [createAppointment, createAppointmentResult] =
        RtoApi.Appointments.useCreateRtoAppointment()
    const appointmentTypes = CommonApi.Appointments.appointmentType(
        participantType,
        { skip: participantType === '' }
    )
    const searchedUserCourses = RtoApi.Appointments.useRtoSearchedUserCourse(
        {
            id: selectedUser?.id,
            params: {
                role: participantType,
            },
        },
        {
            skip: !selectedUser?.id,
        }
    )
    const coursesOptions =
        selectedUser?.courses?.length > 0 &&
        selectedUser?.courses?.map((course: any) => ({
            label: `${course?.code} ${course?.title}`,
            value: course?.id,
        }))

    useEffect(() => {
        if (createAppointmentResult.isSuccess) {
            notification.success({
                title: 'success',
                description: 'Appointment created successfully',
            })
            setScheduleOpen(false)
        }
    }, [createAppointmentResult.isSuccess])

    const appointmentTypesOptions =
        appointmentTypes?.data && appointmentTypes?.data?.length > 0
            ? appointmentTypes?.data?.map((type: any) => ({
                  label: type.title,
                  value: type.id,
              }))
            : []

    const methods = useForm({
        mode: 'all',
    })
    const onSubmit = (values: any) => {
        // if (!values.date || !values.startTime) return;
        const { participants, ...rest } = values
        const course = selectedCourse?.id ?? values?.course
        const appointmentFor = selectedUser?.user?.id
        const fullDateTime = new Date(`${values.date}T${values.startTime}:00`)
        const date = fullDateTime?.toISOString()

        const payload = {
            ...rest,
            date,
            course,
            appointmentFor,
        }
        createAppointment(payload)
    }
    return (
        <>
            <ShowErrorNotifications result={createAppointmentResult} />
            {scheduleOpen && (
                <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                    <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Schedule New Appointment</DialogTitle>
                        </DialogHeader>

                        <FormProvider {...methods}>
                            <form
                                className="space-y-4 pt-4"
                                onSubmit={methods.handleSubmit(onSubmit)}
                            >
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    <div className="space-y-3 col-span-2">
                                        <Label>Participants</Label>
                                        <div className="space-y-3">
                                            <Select
                                                name="participants"
                                                value={participantType}
                                                disabled={
                                                    defaultSelectedParicipantType
                                                }
                                                options={[
                                                    {
                                                        label: 'Student',
                                                        value: UserRoles.STUDENT,
                                                    },

                                                    {
                                                        label: 'Coordinators',
                                                        value: UserRoles.SUBADMIN,
                                                    },
                                                    {
                                                        label: 'Industries',
                                                        value: UserRoles.INDUSTRY,
                                                    },
                                                ]}
                                                required
                                                onChange={(e: any) => {
                                                    setParticipantType(
                                                        e ? e.value : ''
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select
                                            name="type"
                                            disabled={participantType === ''}
                                            options={appointmentTypesOptions}
                                            loading={appointmentTypes.isLoading}
                                            onlyValue
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <TextInput
                                            name="date"
                                            type="date"
                                            min={today}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <TextInput
                                            label={'Start time'}
                                            name="startTime"
                                            type="time"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <TextInput
                                            label={'End time'}
                                            name="endTime"
                                            type="time"
                                        />
                                    </div>

                                    {selectedUser ? (
                                        <>
                                            {!defaultSelectedParicipantType && (
                                                <div className="flex justify-end col-span-2 pt-4 border-t">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedUser(null)
                                                        }
                                                        className="text-[10px] text-white bg-primaryNew px-1 py-0.5 rounded cursor-pointer"
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            )}
                                            <div className="border border-blue-500 rounded-lg bg-blue-50 col-span-2 p-2">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {selectedUser?.user?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {selectedUser?.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 col-span-2 border-t pt-4 mt-2">
                                                {searchedUserCourses?.data &&
                                                    searchedUserCourses?.data
                                                        ?.length > 0 &&
                                                    searchedUserCourses?.data?.map(
                                                        (course: any) => (
                                                            <SearchedUserCourseCard
                                                                setSelectedCourse={
                                                                    setSelectedCourse
                                                                }
                                                                selectedCourse={
                                                                    selectedCourse
                                                                }
                                                                key={course.id}
                                                                course={course}
                                                            />
                                                        )
                                                    )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {participantType && (
                                                <div className="space-y-2 col-span-2">
                                                    <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                                        <RtoAppointmentSearchCard
                                                            role={participantType}
                                                            setSelectedUser={
                                                                setSelectedUser
                                                            }
                                                            selectedUser={
                                                                selectedUser
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {defaultSelectedParicipantType ===
                                        'industry' && (
                                        <>
                                            {' '}
                                            <Select
                                                name="course"
                                                disabled={participantType === ''}
                                                options={coursesOptions}
                                                loading={appointmentTypes.isLoading}
                                                label="Select Course"
                                                placeholder="Select course"
                                                onlyValue
                                            />
                                        </>
                                    )}

                                    <div className="space-y-2 col-span-2">
                                        <Label>Description</Label>
                                        <TextArea
                                            name="note"
                                            placeholder="Meeting description and agenda..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        variant="action"
                                        onClick={() => setScheduleOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        submit
                                        variant="primaryNew"
                                        disabled={createAppointmentResult.isLoading}
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {createAppointmentResult.isLoading ? (
                                            <PuffLoader
                                                size={24}
                                                data-testid="puff-loader"
                                            />
                                        ) : (
                                            'Schedule Appointment'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

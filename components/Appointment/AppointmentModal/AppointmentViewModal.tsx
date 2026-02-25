import { getAppointmentTypeIcon } from '@partials/appointmentType/AppointmentTypeCard'
import moment from 'moment'
import Image from 'next/image'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'
// import { GoDotFill } from 'react-icons/go'
import { Typography } from '@components/Typography'
import { UserRoles } from '@constants'
import { UserCellInfo } from './UserCellInfo'

import { NoData } from '@components/ActionAnimations'
import { AuthorizedUserComponent } from '@components/AuthorizedUserComponent'
import { Badge } from '@components/Badge'
import { ActionButton } from '@components/buttons'
import { LoadingAnimation } from '@components/LoadingAnimation'
import { Portal } from '@components/Portal'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { useMaskText, useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { Appointment, appointmentWithUser } from '@types'
import { getUserCredentials, isLessThan24HoursDifference } from '@utils'
import { MouseEvent, ReactElement, useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { GiNotebook } from 'react-icons/gi'
import { GoDotFill } from 'react-icons/go'
import { TbCalendarTime } from 'react-icons/tb'
import { AddAppointmentNote } from '../AddAppointmentNote'
import { RescheduleAppointmentModal } from '../UpcomingAppointmentCard/RescheduleAppointmentModal'
import { ApproveAppointmentModal } from './ApproveAppointmentModal'
import { StudentRtoCellInfo } from './StudentRtoCellInfo'

export const AppointmentViewModal = ({
    id,
    onCancel,
    upcomming,
}: {
    id: number
    upcomming?: boolean
    onCancel: () => void
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const appointment = CommonApi.Appointments.appointmentDetail(id, {
        skip: !id,
    })
    const [cancellAppointment, cancellAppointmentResult] =
        CommonApi.Appointments.cancellAppointment()

    const { notification } = useNotification()

    const userId = getUserCredentials()?.id
    const role = getUserCredentials()?.role

    const appointmentWith =
        appointment?.data?.appointmentBy?.id === userId
            ? 'appointmentFor'
            : 'appointmentBy'

    const appointmentUser: appointmentWithUser = appointment?.data
        ? appointment?.data[appointmentWith]
        : ({} as appointmentWithUser)

    const onCancelClicked = () => {
        setModal(null)
    }

    const onAddNote = () => {
        setModal(
            <Portal>
                <AddAppointmentNote onCancel={onCancelClicked} id={id} />
            </Portal>
        )
    }
    const onRescheduleClicked = () => {
        setModal(
            <RescheduleAppointmentModal
                onCancel={onCancelClicked}
                appointment={appointment?.data as Appointment}
            />
        )
    }

    const onCancelAppointment = () => {
        if (appointment?.data) {
            cancellAppointment(appointment?.data?.id).then((res: any) => {
                if (res?.data) {
                    notification.success({
                        title: 'Appointment Cancelled',
                        description: 'Appointment Cancelled Successfully',
                    })
                    onCancel()
                }
            })
        }
    }

    const onApproveModal = () => {
        setModal(
            <Portal>
                <ApproveAppointmentModal
                    onCancel={() => {
                        onCancelClicked()
                        onCancel()
                    }}
                    appointment={appointment?.data}
                    appointmentUser={appointmentUser}
                />
            </Portal>
        )
    }

    return (
        <>
            {modal}
            <ShowErrorNotifications result={cancellAppointmentResult} />
            <Portal>
                <div className="fixed w-full h-screen bg-black/50 top-0 left-0 z-1000 flex items-center justify-center">
                    <div className="bg-white shadow-lg rounded-md min-w-[500px]">
                        {appointment.isError && (
                            <div className="relative">
                                <NoData
                                    text={
                                        'No Appointment were found, try reload'
                                    }
                                />
                                <div className="absolute top-0 right-0">
                                    <button
                                        onClick={onCancel}
                                        className="p-4 text-lg text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        )}
                        {appointment?.isLoading ? (
                            <LoadingAnimation />
                        ) : (
                            appointment?.isSuccess && (
                                <>
                                    <div className="pl-4 py-2 flex justify-between items-center border-b">
                                        <div>
                                            <div
                                                className={
                                                    'flex items-center gap-x-4'
                                                }
                                            >
                                                <p className="text-md font-semibold">
                                                    Appointment Detail
                                                </p>
                                                {appointment?.data
                                                    ?.isCancelled ? (
                                                    <Badge
                                                        text="Cancelled"
                                                        variant="error"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-x-2">
                                                        <Typography
                                                            variant={'small'}
                                                            color={
                                                                'text-gray-400'
                                                            }
                                                        >
                                                            {!appointment?.data
                                                                ?.isApproved
                                                                ? '(Pending Appointment)'
                                                                : ''}
                                                        </Typography>
                                                        {appointment?.data
                                                            ?.future ? (
                                                            <>
                                                                {!appointment
                                                                    ?.data
                                                                    ?.isApproved ? (
                                                                    <AuthorizedUserComponent
                                                                        roles={[
                                                                            UserRoles.ADMIN,
                                                                            UserRoles.SUBADMIN,
                                                                        ]}
                                                                    >
                                                                        <ActionButton
                                                                            Icon={
                                                                                FaCircleCheck
                                                                            }
                                                                            mini
                                                                            title={
                                                                                'Approve Appointment'
                                                                            }
                                                                            variant={
                                                                                'warning'
                                                                            }
                                                                            onClick={() => {
                                                                                onApproveModal()
                                                                            }}
                                                                            loading={
                                                                                cancellAppointmentResult?.isLoading
                                                                            }
                                                                            disabled={
                                                                                cancellAppointmentResult?.isLoading
                                                                            }
                                                                        />
                                                                    </AuthorizedUserComponent>
                                                                ) : null}
                                                                <AuthorizedUserComponent
                                                                    roles={[
                                                                        UserRoles.ADMIN,
                                                                        UserRoles.SUBADMIN,
                                                                    ]}
                                                                >
                                                                    <ActionButton
                                                                        Icon={
                                                                            GiNotebook
                                                                        }
                                                                        mini
                                                                        title={
                                                                            'Add Note'
                                                                        }
                                                                        variant={
                                                                            'success'
                                                                        }
                                                                        onClick={() => {
                                                                            onAddNote()
                                                                        }}
                                                                    />
                                                                </AuthorizedUserComponent>
                                                                <AuthorizedUserComponent
                                                                    excludeRoles={[
                                                                        UserRoles.OBSERVER,
                                                                        UserRoles.RTO,
                                                                    ]}
                                                                >
                                                                    <ActionButton
                                                                        Icon={
                                                                            TbCalendarTime
                                                                        }
                                                                        mini
                                                                        title={
                                                                            'Reschedule Appointment'
                                                                        }
                                                                        variant={
                                                                            'info'
                                                                        }
                                                                        onClick={() => {
                                                                            onRescheduleClicked()
                                                                        }}
                                                                        loading={
                                                                            cancellAppointmentResult?.isLoading
                                                                        }
                                                                        disabled={
                                                                            cancellAppointmentResult?.isLoading
                                                                        }
                                                                    />
                                                                    {/* <GiNotebook /> */}
                                                                    <ActionButton
                                                                        Icon={
                                                                            FaTimes
                                                                        }
                                                                        mini
                                                                        title={
                                                                            'Cancell Appointment'
                                                                        }
                                                                        variant={
                                                                            'error'
                                                                        }
                                                                        onClick={(
                                                                            e: MouseEvent<HTMLElement>
                                                                        ) => {
                                                                            e?.stopPropagation()
                                                                            if (
                                                                                !isLessThan24HoursDifference(
                                                                                    appointment
                                                                                        ?.data
                                                                                        ?.date
                                                                                ) ||
                                                                                role ===
                                                                                UserRoles.ADMIN
                                                                            ) {
                                                                                onCancelAppointment()
                                                                            } else {
                                                                                notification.error(
                                                                                    {
                                                                                        title: 'Appointment Cant be cancel',
                                                                                        description:
                                                                                            'Appointment Cant cancel before 1 day',
                                                                                    }
                                                                                )
                                                                            }
                                                                        }}
                                                                        loading={
                                                                            cancellAppointmentResult?.isLoading
                                                                        }
                                                                        disabled={
                                                                            cancellAppointmentResult?.isLoading
                                                                        }
                                                                    />
                                                                </AuthorizedUserComponent>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-gray-400">
                                                Detail for appointment you have
                                                selected
                                            </p>
                                            {appointment?.data?.isCancelled &&
                                                appointment?.data?.cancelledBy ? (
                                                <div className="mt-2">
                                                    <Typography
                                                        variant="small"
                                                        color="text-gray-500"
                                                    >
                                                        Cancelled By
                                                    </Typography>
                                                    <Typography
                                                        variant="label"
                                                        color={'text-gray-600'}
                                                    >
                                                        {
                                                            appointment?.data
                                                                ?.cancelledBy
                                                                ?.name
                                                        }
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color={'text-gray-500'}
                                                    >
                                                        {useMaskText({
                                                            key: appointment
                                                                ?.data
                                                                ?.cancelledBy
                                                                ?.email,
                                                        })}
                                                    </Typography>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <button
                                            onClick={onCancel}
                                            className="p-4 text-lg text-gray-400 hover:text-gray-600"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <div className="h-[75vh] overflow-auto custom-scrollbar">
                                        <div className="flex border-b">
                                            {/* Type & With */}
                                            <div className="border-r px-8 py-4">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-400 mb-2">
                                                        Appointment Type
                                                    </p>
                                                    <div className="flex items-center gap-x-2">
                                                        <div className="border p-2 rounded-md">
                                                            <Image
                                                                src={getAppointmentTypeIcon(
                                                                    appointment
                                                                        ?.data
                                                                        ?.type
                                                                        ?.title
                                                                )}
                                                                width={16}
                                                                height={16}
                                                                alt="appointment type"
                                                            />
                                                        </div>
                                                        <p className="text-lg font-semibold">
                                                            {
                                                                appointment
                                                                    ?.data?.type
                                                                    ?.title
                                                            }
                                                        </p>
                                                        <div
                                                            className={`w-4 h-4 rounded-full`}
                                                            style={{
                                                                backgroundColor: `${appointment?.data?.type?.color}`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="my-4" />

                                                <div>
                                                    <p className="text-xs font-medium text-slate-600">
                                                        Appointment Between
                                                    </p>

                                                    {/* Date & Time */}
                                                    <div>
                                                        <UserCellInfo
                                                            user={
                                                                appointment
                                                                    ?.data
                                                                    ?.appointmentFor
                                                            }
                                                        />
                                                        <p className="text-sm text-gray-700 font-semibold">
                                                            and
                                                        </p>
                                                        <UserCellInfo
                                                            user={
                                                                appointment
                                                                    ?.data
                                                                    ?.appointmentBy
                                                            }
                                                        />
                                                        {/* <p className="text-md font-semibold">
                                    {appointment?.appointmentFor?.name}(
                                    {appointment?.appointmentFor?.role})
                                </p>
                                <p className="text-sm text-gray-600 font-semibold">
                                    and
                                </p>
                                <p className="text-md font-semibold">
                                    {appointment?.appointmentBy?.name}(
                                    {appointment?.appointmentBy?.role})
                                </p> */}
                                                        {/* <p className="text-sm font-medium text-slate-600">
                                    {appointment?.appointmentFor?.email ||
                                        appointment?.appointmentBy?.email}
                                </p> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-8 py-4">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-400">
                                                        Venue
                                                    </p>

                                                    {/* Date & Time */}
                                                    <div>
                                                        <div className="">
                                                            <p className="text-xl font-bold">
                                                                {moment(
                                                                    appointment
                                                                        ?.data
                                                                        ?.startTime,
                                                                    'hh:mm:ss'
                                                                ).format(
                                                                    'hh:mm a'
                                                                )}{' '}
                                                                -{' '}
                                                                {moment(
                                                                    appointment
                                                                        ?.data
                                                                        ?.endTime,
                                                                    'hh:mm:ss'
                                                                ).format(
                                                                    'hh:mm a'
                                                                )}
                                                            </p>
                                                            <div className="flex items-center gap-x-2 -mt-1.5">
                                                                <p className="text-xs flex gap-x-1 items-center mt-0.5">
                                                                    {/* <span className=" text-slate-300">
                                                <GoDotFill />
                                            </span> */}
                                                                    <span className="text-indigo-500">
                                                                        ~
                                                                        {
                                                                            appointment
                                                                                ?.data
                                                                                ?.type
                                                                                ?.duration
                                                                        }{' '}
                                                                        Minutes
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs flex gap-x-1 items-center mt-0.5">
                                                                    <span className=" text-slate-300">
                                                                        {/* <GoDotFill /> */}
                                                                        <GoDotFill />
                                                                    </span>
                                                                    <span className="text-orange-400">
                                                                        {
                                                                            appointment
                                                                                ?.data
                                                                                ?.type
                                                                                ?.breakDuration
                                                                        }{' '}
                                                                        Minutes
                                                                        Break
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="my-4" />
                                                        <p className="text-md font-medium text-slate-600">
                                                            {moment(
                                                                appointment
                                                                    ?.data?.date
                                                            ).format(
                                                                'dddd, Do MMMM, YYYY'
                                                            )}
                                                        </p>

                                                        {/* <div className="mt-2 flex items-center gap-x-2">
                                    <span className="text-slate-300 text-sm">
                                        <FaMapMarkerAlt />
                                    </span>
                                    <p className="text-sm text-slate-400">
                                        Address Not Provided
                                    </p>
                                </div> */}
                                                    </div>
                                                    {appointment?.data?.notes
                                                        ?.length > 0 && (
                                                            <>
                                                                <div className="border-t mt-2 py-1">
                                                                    <Typography variant="subtitle">
                                                                        Notes
                                                                    </Typography>
                                                                </div>
                                                                <div className="flex flex-col gap-2 mt-2 overflow-auto custom-scrollbar h-44 bg-gray-100 p-2">
                                                                    {appointment
                                                                        ?.data
                                                                        ?.notes
                                                                        ?.length >
                                                                        0 &&
                                                                        appointment?.data?.notes?.map(
                                                                            (
                                                                                note: any
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        appointment
                                                                                            ?.data
                                                                                            ?.id
                                                                                    }
                                                                                    className="p-2 bg-white shadow-sm rounded-md"
                                                                                >
                                                                                    <Typography variant="small">
                                                                                        {
                                                                                            note?.body
                                                                                        }
                                                                                    </Typography>
                                                                                    <div className="flex items-center gap-x-2 mt-2">
                                                                                        <Typography variant="muted">
                                                                                            Added
                                                                                            by:
                                                                                        </Typography>
                                                                                        <Typography variant="muted">
                                                                                            {
                                                                                                note
                                                                                                    ?.addedBy
                                                                                                    ?.name
                                                                                            }
                                                                                        </Typography>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                </div>
                                                            </>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex border-b">
                                            {/* Type & With */}
                                            <div className="border-r px-8 py-4">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-400">
                                                        Course
                                                    </p>
                                                    {appointment?.data
                                                        ?.course ? (
                                                        <div className="">
                                                            <p className="text-sm">
                                                                {
                                                                    appointment
                                                                        ?.data
                                                                        .course
                                                                        .code
                                                                }
                                                            </p>
                                                            <p className="text-md font-medium">
                                                                {
                                                                    appointment
                                                                        ?.data
                                                                        .course
                                                                        .title
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-orange-500 text-xs font-medium flex items-center gap-x-2">
                                                            <span>
                                                                <FaExclamationTriangle />
                                                            </span>
                                                            <span>
                                                                No Course Was
                                                                Selected
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                {(appointment?.data
                                                    .appointmentBy?.role ===
                                                    UserRoles.STUDENT ||
                                                    appointment?.data
                                                        .appointmentFor
                                                        ?.role ===
                                                    UserRoles.STUDENT) && (
                                                        <div>
                                                            <Typography
                                                                variant={'title'}
                                                            >
                                                                RTO
                                                            </Typography>
                                                            <StudentRtoCellInfo
                                                                rto={
                                                                    appointment
                                                                        ?.data
                                                                        .appointmentFor
                                                                        ?.student
                                                                        ?.rto ||
                                                                    appointment
                                                                        ?.data
                                                                        .appointmentBy
                                                                        ?.student
                                                                        ?.rto
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">
                                                    Attached Note
                                                </p>

                                                {/* Date & Time */}
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">
                                                        {appointment?.data.note}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>
            </Portal>
        </>
    )
}

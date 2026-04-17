import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { ReactNode, useState } from 'react'
import { Appointment, appointmentWithUser } from '@types'
import { AppointmentViewModal } from '@components/Appointment/AppointmentModal'
import { Badge, TruncatedTextWithTooltip, Typography } from '@components'
import { GrLocation } from 'react-icons/gr'
import moment from 'moment'
import { LuClock } from 'react-icons/lu'
import { RxCalendar } from 'react-icons/rx'
import Image from 'next/image'
import classNames from 'classnames'
import { AppointmentTypeEnum } from './appointment.enum'

export const ProfileAppointmentsCard = ({
    type,
    upcomming,
    appointment,
    short,
}: {
    short?: boolean
    type: AppointmentTypeEnum
    upcomming?: boolean
    appointment: Appointment
}) => {
    const [modal, setModal] = useState<ReactNode | null>(null)

    const id = getUserCredentials()?.id
    const appointmentWith =
        appointment?.appointmentBy?.id === id
            ? 'appointmentFor'
            : 'appointmentBy'

    const appointmentUser: appointmentWithUser = appointment[appointmentWith]

    const appointmentWithUser = appointmentUser
        ? appointmentUser[
              appointmentUser?.role === UserRoles.SUBADMIN
                  ? ('coordinator' as keyof typeof appointmentUser)
                  : (appointmentUser?.role as keyof typeof appointmentUser)
          ]
        : {}

    const appointmentWithUserProfile = appointmentUser
        ? appointmentUser?.role === UserRoles.SUBADMIN
            ? appointmentWithUser?.[0]
            : appointmentWithUser
        : appointment?.coordinator

    const onAppointmentClicked = () => {
        setModal(
            <AppointmentViewModal
                id={appointment?.id}
                onCancel={() => setModal(null)}
                upcomming
            />
        )
    }

    const bgClasses = classNames({
        'bg-[#E9E9FF]': type === AppointmentTypeEnum.Upcoming,
        'bg-[#6A6A6A]':
            type === AppointmentTypeEnum.Past ||
            type === AppointmentTypeEnum.Cancelled,
    })
    const barBgClasses = classNames({
        'bg-white': type === AppointmentTypeEnum.Upcoming,
        'bg-[#3D434D]': type === AppointmentTypeEnum.Past,
        'bg-[#FF3A29]': type === AppointmentTypeEnum.Cancelled,
    })
    const typeBgClasses = classNames({
        'bg-primary': type === AppointmentTypeEnum.Upcoming,
        'bg-[#3D434D]': type === AppointmentTypeEnum.Past,
        'bg-[#FF3A29]': type === AppointmentTypeEnum.Cancelled,
    })
    const barTextClasses = classNames({
        'text-primaryNew': type === AppointmentTypeEnum.Upcoming,
        'text-white':
            type === AppointmentTypeEnum.Past ||
            type === AppointmentTypeEnum.Cancelled,
    })

    return (
        <>
            {modal}
            <div className={`${bgClasses} rounded-lg px-1.5 pt-3 pb-2`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3.5">
                        <div>
                            <Typography
                                variant="xxs"
                                normal
                                capitalize
                                color={barTextClasses}
                            >
                                {appointment?.appointmentFor?.role ===
                                UserRoles.SUBADMIN
                                    ? 'Coordinator'
                                    : appointment?.appointmentFor?.role}
                            </Typography>
                            <Typography
                                variant={short ? 'label' : 'body'}
                                normal
                                color={barTextClasses}
                            >
                                {appointment?.appointmentFor?.name}
                            </Typography>
                        </div>
                        <Typography
                            variant="badge"
                            normal
                            color={barTextClasses}
                        >
                            &
                        </Typography>
                        <div>
                            <Typography
                                variant="xxs"
                                normal
                                capitalize
                                color={barTextClasses}
                            >
                                {appointment?.appointmentBy?.role ===
                                UserRoles.SUBADMIN
                                    ? 'Coordinator'
                                    : appointment?.[
                                          appointment?.appointmentBy
                                              ? 'appointmentBy'
                                              : 'coordinator'
                                      ]?.role}
                            </Typography>
                            <Typography
                                normal
                                color={barTextClasses}
                                variant={short ? 'label' : 'body'}
                                as="div"
                            >
                                <TruncatedTextWithTooltip
                                    text={
                                        appointment?.[
                                            appointment?.appointmentBy
                                                ? 'appointmentBy'
                                                : 'coordinator'
                                        ]?.name
                                    }
                                    textColor={
                                        type === AppointmentTypeEnum.Upcoming
                                            ? 'var(--theme-primaryNew-dark)'
                                            : 'white'
                                    }
                                    maxLength={20}
                                />
                            </Typography>
                        </div>
                    </div>

                    {!short ? (
                        <div>
                            <div
                                className={`w-[104px] h-6 rounded ${typeBgClasses} flex justify-center items-center`}
                            >
                                <Typography
                                    bold
                                    variant="xxs"
                                    color="text-white"
                                >
                                    {type}
                                </Typography>
                            </div>
                            {appointment?.isSuccessfull ? (
                                <Badge text="Successfull" variant="success" />
                            ) : appointment?.isSuccessfull === false ? (
                                <Badge text="UnSuccessfull" variant="error" />
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {/*  */}
                <div className="mt-3.5 grid grid-cols-3 gap-x-1.5">
                    <div
                        className={`flex flex-col gap-y-2 ${
                            short ? 'col-span-3' : 'col-span-2'
                        } `}
                    >
                        <div
                            className={`flex items-center gap-x-2.5 ${barBgClasses} py-1 px-2.5 rounded`}
                        >
                            {/* <div className="w-[30px] h-[30px] rounded-lg bg-primary flex justify-center items-center"> */}
                            <RxCalendar className={`${barTextClasses}`} />
                            {/* </div> */}
                            <Typography variant="small" color={barTextClasses}>
                                {moment(new Date(appointment?.date)).format(
                                    'dddd, MMMM DD YYYY'
                                )}{' '}
                            </Typography>
                        </div>
                        <div
                            className={`flex items-center gap-x-2.5 ${barBgClasses} py-1 px-2.5 rounded`}
                        >
                            <LuClock className={`${barTextClasses}`} />
                            <div className="flex items-center gap-x-2">
                                <Typography
                                    variant="small"
                                    color={barTextClasses}
                                >
                                    {moment(
                                        appointment?.startTime,
                                        'hh:mm'
                                    ).format('hh:mm a')}{' '}
                                    -{' '}
                                    {moment(
                                        appointment?.endTime,
                                        'hh:mm'
                                    ).format('hh:mm a')}
                                </Typography>
                                <Typography
                                    variant="badge"
                                    normal
                                    color={barTextClasses}
                                >
                                    ~ {appointment?.type?.breakDuration} Min
                                    Break
                                </Typography>
                            </div>
                        </div>
                        <div
                            className={`flex items-center gap-x-2.5 ${barBgClasses} py-1 px-2.5 rounded`}
                        >
                            <GrLocation className={`${barTextClasses}`} />
                            <Typography variant="small" color={barTextClasses}>
                                {`${
                                    appointmentWithUserProfile?.addressLine1 ||
                                    'Address Not Provided'
                                }`}
                            </Typography>
                        </div>
                    </div>

                    {/*  */}
                    {!short ? (
                        <div
                            className={`flex flex-col items-center justify-center gap-y-2.5 ${barBgClasses}`}
                        >
                            <Image
                                src={
                                    type === AppointmentTypeEnum.Past ||
                                    type === AppointmentTypeEnum.Cancelled
                                        ? '/images/appointments/lightVideoConference.svg'
                                        : '/images/appointments/darkVideoConference.svg'
                                }
                                alt={'Upcoming Appointments'}
                                width={40}
                                height={40}
                            />
                            <Typography
                                variant="badge"
                                color={barTextClasses}
                                normal
                                capitalize
                                center
                            >
                                {appointment?.type?.title}
                            </Typography>
                        </div>
                    ) : null}
                </div>

                {/*  */}
                <div
                    onClick={() => {
                        onAppointmentClicked()
                    }}
                    className="mt-2"
                >
                    <Typography
                        underline
                        variant="xs"
                        bold
                        color="text-[#F67F1E]"
                        cursorPointer
                        center
                    >
                        VIEW DETAILS
                    </Typography>
                </div>
            </div>
        </>
    )
}

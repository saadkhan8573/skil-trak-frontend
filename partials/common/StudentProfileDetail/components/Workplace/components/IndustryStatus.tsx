import moment from 'moment'
import { useRouter } from 'next/router'
import { OutsideClickHandler, Typography } from '@components'
import { useNotification } from '@hooks'
import { useEffect, useState } from 'react'
import { getUserCredentials, WorkplaceCurrentStatus } from '@utils'
import { IoIosArrowDown } from 'react-icons/io'

import { useRequestType } from '@partials/common/StudentProfileDetail/hooks'
import { UserRoles } from '@constants'
import { Appointment, Student } from '@types'

export const IndustryStatus = ({
    student,
    folders,
    workplace,
    appliedIndustry,
    appointmentDetail,
}: {
    folders: any
    workplace: any
    student: Student
    appliedIndustry?: any
    appointmentDetail?: Appointment
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [selectedRequestType, setSelectedRequestType] = useState<
        number | null
    >(0)
    const router = useRouter()

    const role = getUserCredentials()?.role

    const { notification } = useNotification()

    const {
        modal,
        requestTypeActions,
        abnRequestTypeActions,
        studentProvidedRequestTypeActions,
    } = useRequestType({
        folders,
        workplace,
        appliedIndustry,
        student,
        appointmentDetail,
    })

    const requestsTypes = () => {
        if (workplace?.studentProvidedWorkplace) {
            return studentProvidedRequestTypeActions
        } else if (workplace?.byExistingAbn) {
            return abnRequestTypeActions
        } else {
            return requestTypeActions
        }
    }

    const types = requestsTypes()

    const findStatusIndex = types?.findIndex(
        (r) => r.status === workplace?.currentStatus
    )

    useEffect(() => {
        if (findStatusIndex || findStatusIndex === 0) {
            setSelectedRequestType(findStatusIndex)
        }
    }, [findStatusIndex, workplace?.currentStatus])

    const excludedRoles = [UserRoles.RTO, UserRoles.OBSERVER]

    return (
        <div className="flex flex-col gap-y-1.5">
            {modal}
            {router.pathname !== '/portals/sub-admin/tasks/workplace' && (
                <Typography variant="label" medium>
                    Industry Status
                </Typography>
            )}

            <OutsideClickHandler
                onOutsideClick={() => {
                    setIsOpened(false)
                }}
            >
                <div className="w-40 mt-2 relative">
                    <div
                        onClick={() => {
                            if (!excludedRoles.includes(role)) {
                                if (
                                    workplace?.cancelledRequests &&
                                    workplace?.cancelledRequests?.length > 0
                                ) {
                                    notification.warning({
                                        title: 'Workplace Cancelation Request Sent !',
                                        description:
                                            'Workplace Cancelation Request already sent to the admin!',
                                        dissmissTimer: 6666,
                                        position: 'bottomleft',
                                    })
                                } else if (true) {
                                    if (workplace?.assignedTo) {
                                        if (
                                            !appliedIndustry?.terminated &&
                                            !appliedIndustry?.isCompleted &&
                                            !appliedIndustry?.cancelled
                                        ) {
                                            setIsOpened(!isOpened)
                                        } else {
                                            notification.warning({
                                                title: 'Action cant perform',
                                                description:
                                                    'Action cant perform',
                                            })
                                        }
                                    } else {
                                        notification.warning({
                                            title: 'Assign the workplace',
                                            description:
                                                'Assign the workplace before changing status',
                                        })
                                    }
                                }
                            }
                        }}
                        className={`${workplace?.currentStatus ===
                                WorkplaceCurrentStatus.PlacementStarted
                                ? 'bg-success-dark'
                                : 'bg-white'
                            } w-full relative cursor-pointer p-2.5 flex justify-evenly gap-x-2 rounded-md border border-[#128C7E] overflow-hidden`}
                    >
                        <Typography
                            variant="xs"
                            color={
                                workplace?.currentStatus ===
                                    WorkplaceCurrentStatus.PlacementStarted
                                    ? 'text-white'
                                    : types[
                                        selectedRequestType &&
                                            selectedRequestType > 0
                                            ? selectedRequestType
                                            : (0 as any)
                                    ]?.color
                            }
                            semibold
                            uppercase
                        >
                            {
                                types[
                                    selectedRequestType &&
                                        selectedRequestType > 0
                                        ? selectedRequestType
                                        : (0 as any)
                                ]?.primaryText
                            }
                        </Typography>

                        {role !== UserRoles.RTO ? (
                            <IoIosArrowDown
                                className={
                                    workplace?.currentStatus ===
                                        WorkplaceCurrentStatus.PlacementStarted
                                        ? 'text-white'
                                        : 'text-[#128C7E]'
                                }
                            />
                        ) : null}
                    </div>
                    <div
                        className={`w-auto  bg-white shadow-md rounded-md z-10 absolute top-full left-0 overflow-auto custom-scrollbar transition-all duration-500 ${isOpened ? 'max-h-72' : 'max-h-0'
                            }`}
                    >
                        {types.map((status, index) => (
                            <div
                                className={`px-2 border-b border-gray-100 py-2 w-full cursor-pointer hover:bg-gray-100 ${workplace?.currentStatus === status?.status
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                    }`}
                                key={index}
                                onClick={() => {
                                    setIsOpened(false)
                                    if (findStatusIndex < index) {
                                        const isCleared = (clear = true) => {
                                            clear &&
                                                setSelectedRequestType(index)
                                        }

                                        status.onClick(isCleared)
                                    } else {
                                        notification.error({
                                            title: 'You already performed this action',
                                            description:
                                                'You already performed this action',
                                        })
                                    }
                                }}
                            >
                                <Typography
                                    variant="small"
                                    medium
                                    color={status?.color}
                                >
                                    {status.primaryText}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </OutsideClickHandler>
            {types[selectedRequestType as any]?.date && (
                <Typography variant="badge" semibold>
                    Status Updated :{' '}
                    {moment(types[selectedRequestType as any]?.date).format(
                        'Do MMM YYYY'
                    )}
                </Typography>
            )}
        </div>
    )
}

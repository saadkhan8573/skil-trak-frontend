import { ActionButton } from '@components/buttons'
import { Select, TextInput } from '@components/inputs'
import { useEffect, useState } from 'react'
import { FaCheck, FaQuestionCircle, FaTimes } from 'react-icons/fa'
import * as Yup from 'yup'

// query
import {
    useCompletePlacementMutation,
    useTerminatePlacementMutation,
    useCancelWorkplaceStatusMutation,
    SubAdminApi,
} from '@queries'
import { StudentStatusEnum, UserStatus } from '@types'
import { Typography } from '@components/Typography'
import { useNotification } from '@hooks'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'

interface onSubmitType {
    status: StudentStatusEnum
    comment?: string
}
export const StudentStatus = ({
    id,
    currentStatus,
}: {
    id: number
    currentStatus: StudentStatusEnum
}) => {
    const [edit, setEdit] = useState(false)

    const { notification } = useNotification()

    // query
    const [terminate, terminateResult] = useTerminatePlacementMutation()
    const [complete, completeResult] = useCompletePlacementMutation()
    const [cancel, cancelResult] = useCancelWorkplaceStatusMutation()
    const [changeCurrentStatus, changeCurrentStatusResult] =
        SubAdminApi.Student.changeCurrentStatus()

    const validationSchema = Yup.object({
        status: Yup.mixed<StudentStatusEnum>()
            .oneOf(Object.values(StudentStatusEnum))
            .required('Status is required!'),
        comment: Yup.string().optional(),
    })

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    useEffect(() => {
        if (changeCurrentStatusResult.isSuccess) {
            notification.success({
                title: 'Status Changed',
                description: 'Status Changed Successfully',
            })
            onChangeClicked()
            methods.reset()
        }
    }, [changeCurrentStatusResult])

    const onChangeClicked = () => setEdit(!edit)

    const onStatusChange: SubmitHandler<onSubmitType> = (values) => {
        changeCurrentStatus({ ...values, id })
    }

    const isLoading =
        terminateResult?.isLoading ||
        completeResult?.isLoading ||
        cancelResult?.isLoading

    const statusColor = () => {
        switch (currentStatus) {
            case StudentStatusEnum.ACTIVE:
                return 'text-blue-500'
            case StudentStatusEnum.COMPLETED:
                return 'text-success'
            case StudentStatusEnum.CANCELLED:
                return 'text-error'
            case StudentStatusEnum.EXPIRED:
                return 'text-error'
            case StudentStatusEnum.TERMINATED:
                return 'text-error'
            default:
                return
        }
    }

    const studentStatusOptions = [
        {
            label: 'Completed',
            value: StudentStatusEnum.COMPLETED,
        },
        {
            label: 'Active',
            value: StudentStatusEnum.ACTIVE,
        },
        {
            label: 'Terminated',
            value: StudentStatusEnum.TERMINATED,
        },
        {
            label: 'Cancelled',
            value: StudentStatusEnum.CANCELLED,
        },
    ]

    return (
        <>
            <ShowErrorNotifications result={changeCurrentStatusResult} />
            <div className="mt-4">
                <div className="flex justify-between items-end">
                    <div className="flex gap-x-2 items-center">
                        <p className="text-gray-500 text-xs">Student Status</p>
                        <div className="group">
                            <span className="text-gray-400 group-hover:text-gray-700">
                                <FaQuestionCircle size={12} />
                            </span>
                        </div>
                    </div>
                    {!edit ? (
                        <button
                            className="text-blue-500 text-xs font-medium"
                            onClick={() => onChangeClicked()}
                        >
                            Change
                        </button>
                    ) : (
                        <button
                            className="text-blue-500 text-xs font-medium"
                            onClick={() => onChangeClicked()}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    {edit ? (
                        <div className="w-full">
                            <FormProvider {...methods}>
                                <form
                                    className="mt-2 w-full"
                                    onSubmit={methods.handleSubmit(
                                        onStatusChange
                                    )}
                                >
                                    <div className="grow w-full mb-3">
                                        <Select
                                            name="status"
                                            options={studentStatusOptions}
                                            onlyValue
                                            disabled={
                                                changeCurrentStatusResult.isLoading
                                            }
                                        />
                                    </div>
                                    <TextInput
                                        name={'comment'}
                                        placeholder={'Add Comment'}
                                    />

                                    <div className="flex justify-end items-center gap-x-1">
                                        <ActionButton
                                            variant="success"
                                            Icon={FaCheck}
                                            submit
                                            loading={
                                                changeCurrentStatusResult.isLoading
                                            }
                                            disabled={isLoading}
                                        >
                                            Save
                                        </ActionButton>
                                        <ActionButton
                                            variant="error"
                                            Icon={FaTimes}
                                            onClick={onChangeClicked}
                                        >
                                            Cancel
                                        </ActionButton>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full mt-2">
                            {/* <div className="text-indigo-500 text-sm font-semibold">
                                Current Status
                            </div> */}
                            <Typography
                                variant={'label'}
                                color={statusColor()}
                                capitalize
                            >
                                {currentStatus}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

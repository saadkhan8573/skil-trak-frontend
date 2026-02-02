import React, { useEffect, useState } from 'react'
import {
    LoadingAnimation,
    ShowErrorNotifications,
    Tooltip,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'
enum CallType {
    Answer = 'answer',
    NotAnswer = 'notAnswer',
}

export const CallActions = ({
    callLog,
    rowId,
    loadingRowId,
    setLoadingRowId,
}: any) => {
    const [callType, setCallType] = useState<CallType>(CallType.Answer)
    const [loadingAction, setLoadingAction] = useState<CallType | null>(null)

    const isThisRowLoading = loadingRowId === rowId

    const [isAnsweredCall, isAnsweredCallResult] =
        SubAdminApi.Student.useStudentAnsweredCall()

    const { notification } = useNotification()
    useEffect(() => {
        if (isAnsweredCallResult.isSuccess) {
            notification[
                callType === CallType.Answer
                    ? 'success'
                    : callType === CallType.NotAnswer
                      ? 'error'
                      : 'error'
            ]({
                title: `Call ${
                    callType === CallType.NotAnswer ? 'Not' : ''
                } Answered`,
                description: `Call ${
                    callType === CallType.NotAnswer ? 'Not' : ''
                } Answered`,
            })
        }
    }, [isAnsweredCallResult])
    return (
        <>
            <ShowErrorNotifications result={isAnsweredCallResult} />
            <div className="flex justify-end items-center gap-x-2">
                {callLog?.isAnswered ? (
                    <div className="px-3 py-2 bg-green-200 rounded-md">
                        <Typography
                            variant="small"
                            medium
                            color="text-green-500"
                            uppercase
                        >
                            Answered
                        </Typography>
                    </div>
                ) : callLog?.isAnswered === false ? (
                    <div className="px-3 py-2 bg-red-200 rounded-md">
                        <Typography
                            variant="small"
                            medium
                            color="text-red-500"
                            uppercase
                        >
                            Not Answered
                        </Typography>
                    </div>
                ) : (
                    <>
                        <div
                            className="group relative p-2 rounded-full bg-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                                setLoadingRowId(rowId)
                                setLoadingAction(CallType.NotAnswer)

                                isAnsweredCall({
                                    id: rowId,
                                    status: 'false',
                                }).finally(() => {
                                    setLoadingRowId(null)
                                    setLoadingAction(null)
                                })
                            }}
                        >
                            {isThisRowLoading &&
                            loadingAction === CallType.NotAnswer ? (
                                <LoadingAnimation size={17} />
                            ) : (
                                <>
                                    <ImPhoneHangUp className="text-white text-lg" />
                                    <Tooltip>Not Answered Call</Tooltip>
                                </>
                            )}
                        </div>
                        <div
                            className="group relative p-2 rounded-full bg-success cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                                setLoadingRowId(rowId)
                                setLoadingAction(CallType.Answer)

                                isAnsweredCall({
                                    id: rowId,
                                    status: 'true',
                                }).finally(() => {
                                    setLoadingRowId(null)
                                    setLoadingAction(null)
                                })
                            }}
                        >
                            {isThisRowLoading &&
                            loadingAction === CallType.Answer ? (
                                <LoadingAnimation size={17} />
                            ) : (
                                <>
                                    <ImPhone className="text-white text-lg" />
                                    <Tooltip>Answered Call</Tooltip>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

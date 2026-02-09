import {
    ActionButton,
    InputRichTextEditor,
    inputRichTextEditorErrorMessage,
    Modal,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { getUserCredentials } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FaEdit } from 'react-icons/fa'
import { TiArrowForward } from 'react-icons/ti'
import * as yup from 'yup'
import { TicketUser } from './TicketUser'
export const StatusEnum = {
    FORWARDED: 'forwarded',
    REPLY: 'reply',
    CLOSED: 'closed',
}
export const TicketMessageCard = ({
    message,
    ticketDetail,
    replyId,
}: {
    message: any
    ticketDetail?: any
    replyId?: any
}) => {
    const [modal, setModal] = useState<any | null>(null)
    const [replyContent, setReplyContent] = useState<any>(null)
    const { notification } = useNotification()
    const id = getUserCredentials()?.id
    const forwarded = message?.action
    const router = useRouter()
    const role = getUserCredentials()?.role
    // update api call
    const [updateReply, updateReplyResult] = CommonApi.Tickets.useUpdateReply()
    // const plainText: any = message?.message?.replace(/<[^>]+>/g, '')

    const validationSchema = yup.object().shape({
        message: yup
            .string()
            .ensure()
            .test('Message', 'Must Provide Message', inputRichTextEditorErrorMessage),
    })
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })
    const onSubmit = async (values: any) => {
        const message = values?.message

        try {
            if (message) {
                await updateReply({
                    id: replyId,
                    message,
                })
            }
        } catch (error) {
            notification.error({
                title: 'Update Failed',
                description: 'There was an error updating the reply.',
            })
        }
        setModal(null)
    }

    const handleEdit = () => {
        setReplyContent(message?.message)
        setModal(
            <Modal
                onCancelClick={onCancel}
                onConfirmClick={methods.handleSubmit(onSubmit)}
                title={'Edit'}
                confirmText={'Update'}
                subtitle={'Edit your reply'}
            >
                <>
                    <FormProvider {...methods}>
                        <form className="mt-2 w-full">
                            <Controller
                                name="message"
                                control={methods.control as any}
                                defaultValue={
                                    message?.message || ''
                                }
                                render={({ field }) => (
                                    <InputRichTextEditor
                                        name={field?.name}
                                        label={'Message'}
                                        height={'h-44'}
                                    // {...field}
                                    />
                                )}
                            />
                        </form>
                    </FormProvider>
                </>
            </Modal>
        )

        // You can perform any additional actions if needed
    }

    const onCancel = () => {
        setModal(null)
    }

    useEffect(() => {
        if (updateReplyResult.isSuccess) {
            notification.success({
                title: 'Reply Updated',
                description: 'Reply Updated Successfully',
            })
            methods.reset()
        }
    }, [updateReplyResult, replyId])

    return (
        <>
            {modal && modal}
            <div
                className={`${id === message?.author?.id ? 'bg-gray-200' : 'bg-white'
                    } border-2 border-dashed border-gray-400 shadow px-4 py-2`}
            >
                {forwarded?.action === StatusEnum.FORWARDED && (
                    <div className="flex justify-end">
                        <span className="text-gray-400 font-medium text-xs">
                            Forwarded by: {forwarded?.actionBy?.name}
                        </span>

                        <TiArrowForward className="text-gray-500" />
                    </div>
                )}
                <div className="flex justify-between items-center ">
                    <TicketUser
                        ticket={message?.author}
                        forwarded={forwarded}
                    />
                    <div className="flex items-center gap-x-2">
                        <Typography variant={'small'} color={'text-gray-500'}>
                            {moment(message?.createdAt).format(
                                'dddd DD MMMM, YYYY - hh:mm a'
                            )}
                        </Typography>
                        {/* {ticketDetail.assignedTo.id === id ||
                        (ticketDetail.createdBy.id === id && (
                            <ForwardTicket ticketDetail={ticketDetail} />
                        ))} */}
                        <div>
                            {id === message?.author?.id && (
                                // <Button
                                //     text={'Edit'}
                                //     variant={'info'}
                                //     onClick={handleEdit}
                                // />
                                <ActionButton
                                    onClick={handleEdit}
                                    variant={'info'}
                                >
                                    <FaEdit />
                                </ActionButton>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className="text-sm text-gray-500 mt-1 py-1 customTailwingStyles-inline-style customTailwingStyles"
                    dangerouslySetInnerHTML={{
                        __html: message?.message,
                    }}
                />
            </div>
        </>
    )
}

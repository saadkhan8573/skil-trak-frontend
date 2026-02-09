import { Card, ShowErrorNotifications } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Bell } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { UrgencyLevel } from './enum'
import { MessageForm } from './forms'
import { MessagePreview, RTOSelector } from './components'

export const CreateMessageCenter = () => {
    const { notification } = useNotification()

    const [sendRtoMessage, sendRtoMessageResult] =
        AdminApi.RtoMessageCenter.sendRtoMessage()

    const validationSchema = Yup.object({
        rtoIds: Yup.array().when('type', {
            is: 'multiple',
            then: (schema) =>
                schema
                    .min(1, 'At least one RTO must be selected')
                    .required('RTO selection is required'),
            otherwise: (schema) => schema.optional(),
        }),

        urgencyLevel: Yup.string()
            .oneOf(Object.values(UrgencyLevel), 'Invalid urgency level')
            .required('Urgency level is required'),

        senderName: Yup.string()
            .min(2, 'Sender name must be at least 2 characters')
            .max(100, 'Sender name must not exceed 100 characters')
            .required('Sender name is required'),

        expiryDate: Yup.string().required('Expiry Date is required'),

        message: Yup.string()
            .min(10, 'Message must be at least 10 characters')
            .max(1000, 'Message must not exceed 1000 characters')
            .required('Message is required'),

        title: Yup.string().required('Title is required'),
        type: Yup.string().optional()
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            title: '40 Critical Actions Required - Priority Focus Needed',
            rtoIds: [],
            type: 'all',
            urgencyLevel: UrgencyLevel.URGENT,
            senderName: 'Julie Anderson',
            message:
                'Multiple urgent items require immediate attention: 5 e-sign documents due Monday, 3 placement approvals waiting, 2 student submissions pending review, and 30 active issues requiring resolution. Please prioritize critical tasks to avoid delays in student placements.',
        },
    })

    const onSubmit = async (values: any) => {
        const response: any = await sendRtoMessage(values)

        if (response?.data) {
            notification.success({
                title: 'Message Sent',
                description: 'Message Sent Successfully',
            })
        }
    }

    return (
        <>
            <ShowErrorNotifications result={sendRtoMessageResult} />
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    {' '}
                    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
                        <div className="container mx-auto p-3 space-y-3">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2.5 sm:p-3 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-gray-900">
                                        RTO Message Center
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                                        Send critical action notifications to
                                        RTOs
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                                    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="pb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                                    1
                                                </div>
                                                <div>
                                                    <div>Compose Message</div>
                                                    <div className="mt-0.5">
                                                        Create your notification
                                                        content
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <MessageForm />
                                        </div>
                                    </Card>

                                    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="pb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                                    2
                                                </div>
                                                <div>
                                                    <div>Select Recipients</div>
                                                    <div className="mt-0.5">
                                                        Choose which RTOs will
                                                        receive this message
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <RTOSelector />
                                        </div>
                                    </Card>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <MessagePreview />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

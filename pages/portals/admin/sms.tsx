import { ReactElement, useEffect } from 'react'

import { AdminLayout } from '@layouts'
import { NextPageWithLayout, SMSFormType } from '@types'

import {
    Button,
    Card,
    PhoneInputWithCountry,
    ShowErrorNotifications,
    TextArea,
} from '@components'
import { PageHeading } from '@components/headings'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavbar, useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

const SMS: NextPageWithLayout = () => {
    const navBar = useNavbar()
    const { notification } = useNotification()

    const [sendSMS, sendSMSResult] = AdminApi.SMS.sendSMS()

    useEffect(() => {
        navBar.setTitle('SMS')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    useEffect(() => {
        if (sendSMSResult.isSuccess) {
            notification.success({
                title: 'Message Sent',
                description: 'Message Sent Successfully',
            })
        }
    }, [sendSMSResult])

    const validationSchema = yup.object({
        number: yup
            .string()
            .nullable()
            .required('Contact Number is Required'),
        message: yup.string().required('Message is required'),
    })

    const methods = useForm<SMSFormType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = (values: SMSFormType) => {
        sendSMS(values)
    }
    return (
        <>
            <ShowErrorNotifications result={sendSMSResult} />
            <div className="p-4">
                <PageHeading
                    title={'SMS'}
                    subtitle={'Send a SMS to your client'}
                />
                <Card>
                    <FormProvider {...methods}>
                        <form
                            className="mt-2 w-full"
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            <div className="mb-8">
                                <PhoneInputWithCountry
                                    label={'To'}
                                    required
                                    name={'number'}
                                    validationIcons
                                    countries={['AU']}
                                    defaultCountry={'AU'}
                                    placeholder={'Enter your number'}
                                    isInternational={false}
                                />

                                <TextArea
                                    label={'Message'}
                                    name={'message'}
                                    placeholder={'Send Message...'}
                                    required
                                    validationIcons
                                    rows={10}
                                />

                                <div>
                                    <Button
                                        submit
                                        variant={'success'}
                                        loading={sendSMSResult.isLoading}
                                        disabled={sendSMSResult.isLoading}
                                    >
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </Card>
            </div>
        </>
    )
}
SMS.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}
export default SMS

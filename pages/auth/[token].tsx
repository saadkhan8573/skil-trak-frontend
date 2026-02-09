import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import * as Yup from 'yup'

import {
    BackButton,
    Button,
    Card,
    DisplayNotifications,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AuthApi } from '@queries'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'

const ResetPassword: NextPage = () => {
    const router = useRouter()

    const [emailSent, setEmailSent] = useState(false)
    const [resetPassword, resetPasswordResult] = AuthApi.useResetPassword()
    const initialValues = {
        newPassword: '',
        confirmPassword: '',
    }

    const validationSchema = Yup.object({
        newPassword: Yup.string().required('Password is required!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match!')
            .required('Confirm your password!'),
    })
    const methods = useForm({
        defaultValues: initialValues,
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const onSubmit = async (values: any) => {
        // send reset password email
        const res: any = await resetPassword({
            body: {
                password: values.newPassword,
                confirmPassword: values.confirmPassword,
            },
            token: router.query.token,
        })
        setEmailSent(true)

        if (res?.data) {
            router.push('/auth/login')
        }
    }

    const onBackToLogin = () => {
        router.push('/auth/login')
    }

    return (
        <>
            <ShowErrorNotifications result={resetPasswordResult} />
            <Head>
                <title>Reset Password</title>
                <meta
                    name="description"
                    content="Login in to your account to access your dashboard"
                    key="desc"
                />
            </Head>
            <div className="flex justify-center items-center choose-portal-type-bg">
                <div className="mx-auto flex items-center justify-between">
                    <div className="flex flex-col grow">
                        <div className="w-full mb-8 flex flex-col justify-center items-center">
                            <Link href={'/'}>
                                <Image
                                    src="/images/auth/skiltrak-logo.png"
                                    alt="logo"
                                    width={201}
                                    height={60}
                                />
                            </Link>
                            <BackButton />
                            <div className="mt-5">
                                <Typography
                                    variant={'h3'}
                                    color={'text-primaryNew'}
                                    center
                                >
                                    Reset Password
                                </Typography>
                            </div>
                        </div>

                        <Typography>
                            Please provide us with your new password.
                        </Typography>
                        <FormProvider {...methods}>
                            <form
                                className="mt-2"
                                onSubmit={methods.handleSubmit(onSubmit)}
                            >
                                <Card>
                                    <div className="">
                                        <TextInput
                                            label={'New Password'}
                                            name={'newPassword'}
                                            type={'password'}
                                            placeholder={
                                                'Your New Password Here...'
                                            }
                                            validationIcons
                                            required
                                        />

                                        <TextInput
                                            label={'Confirm Password'}
                                            name={'confirmPassword'}
                                            type={'password'}
                                            placeholder={
                                                'Confirm Your Password Here...'
                                            }
                                            validationIcons
                                            required
                                        />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <Button
                                            submit
                                            disabled={
                                                resetPasswordResult.isLoading
                                            }
                                            loading={
                                                resetPasswordResult.isLoading
                                            }
                                            text={'Update Password'}
                                        />
                                    </div>
                                </Card>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </div>
            <DisplayNotifications />
        </>
    )
}

export default ResetPassword

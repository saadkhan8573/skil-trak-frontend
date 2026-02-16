import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'

import * as Yup from 'yup'

import { Animations } from '@animations'
import { AuthLayout } from '@layouts'

import {
    BackButton,
    Button,
    Card,
    DisplayNotifications,
    GlobalModal,
    LottieAnimation,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import Image from 'next/image'
import { AuthApi } from '@queries'
import { EmailNotExistsModal, PasswordSentModal } from '@partials/auth'
import Head from 'next/head'

const ForgotPassword: NextPage = () => {
    const router = useRouter()
    const [emailSent, setEmailSent] = useState(false)

    const [modal, setModal] = useState<ReactNode | null>(null)
    const [forgotPassword, forgotPasswordResult] = AuthApi.useForgotPassword()
    const [emailExists, emailExistsResult] = AuthApi.useEmailCheck()

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid Email')
            .required('Email is required!'),
    })

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    const onBackToLogin = () => {
        router.push('/auth/login')
    }
    const onCloseModal = () => {
        setModal(null)
    }
    const onPasswordSent = (email: string) => {
        setModal(
            <GlobalModal>
                <PasswordSentModal
                    email={email}
                    onBackToLogin={onBackToLogin}
                />
            </GlobalModal>
        )
    }
    const onEmailNotExists = () => {
        setModal(
            <GlobalModal>
                <EmailNotExistsModal onCloseModal={onCloseModal} />
            </GlobalModal>
        )
    }
    const onSubmit = async (values: any) => {
        const checkEmail: any = await emailExists({ email: values?.email })

        if (checkEmail?.data?.exists) {
            await forgotPassword({ email: values?.email })
            setEmailSent(true)
            if (forgotPasswordResult.isSuccess) {
                onPasswordSent(values?.email)
            }
        } else {
            // setModalVisible(true)
            onEmailNotExists()
        }
    }

    return (
        <>
            {modal && modal}
            <ShowErrorNotifications result={forgotPasswordResult} />
            <Head>
                <title>Forgot Password</title>
                <meta
                    name="description"
                    content="Login in to your account to access your dashboard"
                    key="desc"
                />
            </Head>
            <div className="flex flex-col justify-center items-center h-screen choose-portal-type-bg">
                <div className="mx-auto flex items-center justify-between">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-full mb-8 flex flex-col justify-center items-center">
                            <BackButton />
                            <Link href={'/'}>
                                <Image
                                    src="/images/auth/skiltrak-logo.png"
                                    alt="logo"
                                    width={201}
                                    height={60}
                                />
                            </Link>

                            <div className="mt-5">
                                <Typography
                                    variant={'h3'}
                                    color={'text-primaryNew'}
                                    center
                                >
                                    Forgot Password?
                                </Typography>
                            </div>
                        </div>

                        <div className="md:w-1/2 px-4 md:px-0 md:mb-5">
                            <Typography color={'text-primaryNew'} center italic>
                                This feature is exclusively for students. Please
                                enter the email address you use to log in to the
                                SkilTrak Portal, and we will send your
                                credentials to your email.
                            </Typography>
                        </div>

                        <FormProvider {...methods}>
                            <form
                                className="mt-2 w-full px-4 md:px-0 md:w-1/2"
                                onSubmit={methods.handleSubmit(onSubmit)}
                            >
                                <Card>
                                    <TextInput
                                        label={'Email'}
                                        name={'email'}
                                        type={'email'}
                                        placeholder={'Your Email Here...'}
                                        validationIcons
                                        required
                                    />
                                </Card>

                                <div className="mt-6 flex items-center justify-center">
                                    <Button
                                        submit
                                        loading={forgotPasswordResult.isLoading}
                                        text={'Send Password'}
                                        disabled={
                                            forgotPasswordResult.isLoading
                                        }
                                    />
                                </div>
                            </form>
                        </FormProvider>
                        <div className="md:mt-16 mt-0 flex justify-center">
                            <Typography variant="body">
                                Already have account?{' '}
                                <Link href="/auth/login" className="text-link">
                                    Login
                                </Link>
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
            <DisplayNotifications />
        </>
    );
}

export default ForgotPassword

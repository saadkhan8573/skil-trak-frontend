import { ReactElement, useEffect, useState } from 'react'

import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
    AccountStatus,
    AuthNavbar,
    Footer,
    LoginForm,
    LottieAnimation,
    Typography,
} from '@components'

import { Animations } from '@animations'
import { AuthLayout } from '@layouts'
import { AuthApi } from '@queries'
import { LoginCredentials, StatusType, UserStatus } from '@types'
import { AuthUtils, isBrowser } from '@utils'
import { UserRoles } from '@constants'
import { LoginErrorAfterHoursModal } from '@modals'
import Image from 'next/image'
import Head from 'next/head'

const Login: NextPage = () => {
    const router = useRouter()

    const [login, loginResult] = AuthApi.useLogin()

    const [modal, setModal] = useState<ReactElement | null>(null)

    const [requested, setRequested] = useState(false)
    const [rejected, setRejected] = useState(false)
    const [archived, setArchived] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const [rememberLogin, setRememberLogin] = useState<boolean>(false)
    const [autoLogoutUrl, setAutoLogoutUrl] = useState<{
        url: URL | null
        role: string | null | undefined
    }>({
        url: null,
        role: '',
    })

    const chkRoleAndUrl = (role: string) =>
        autoLogoutUrl.url && autoLogoutUrl.role === role

    const nextDestination = (role: string) => {
        switch (role) {
            case UserRoles.ADMIN:
                chkRoleAndUrl(role)
                    ? router.push(autoLogoutUrl.url as URL)
                    : router.push('/portals/admin')
                break
            case UserRoles.INDUSTRY:
                chkRoleAndUrl(role)
                    ? router.push(autoLogoutUrl.url as URL)
                    : router.push('/portals/industry')
                break
            case UserRoles.RTO:
                chkRoleAndUrl(role)
                    ? router.push(autoLogoutUrl.url as URL)
                    : router.push('/portals/rto/dashboard')
                break
            case UserRoles.STUDENT:
                chkRoleAndUrl(role)
                    ? router.push(autoLogoutUrl.url as URL)
                    : router.push('/portals/student')
                break
            case UserRoles.SUBADMIN:
                chkRoleAndUrl(role)
                    ? router.push(autoLogoutUrl.url as URL)
                    : router.push('/portals/sub-admin')
                break
        }
    }

    const onLogin = (status: StatusType, role: UserRoles) => {
        switch (status) {
            case UserStatus.Pending:
                setRequested(true)
                break
            case UserStatus.Archived:
                // setArchived(true)
                nextDestination(role)
                break
            case UserStatus.Blocked:
                setBlocked(true)
                break
            case UserStatus.Rejected:
                setRejected(true)
                break
            case UserStatus.Approved:
                nextDestination(role)
                break
        }
    }
    useEffect(() => {
        if (loginResult.isSuccess) {
            if (loginResult.data) {
                if (rememberLogin) {
                    AuthUtils.setToken(loginResult.data.access_token)
                    AuthUtils.setRefreshToken(loginResult.data.refreshToken)
                    if (isBrowser()) {
                        localStorage.setItem('rememberMe', 'true')
                    }
                } else {
                    AuthUtils.setTokenToSession(loginResult.data.access_token)
                    AuthUtils.setRefreshTokenToSessionStorage(
                        loginResult.data.refreshToken
                    )
                }

                onLogin(loginResult.data.status, loginResult.data?.role)
            }
        }
    }, [loginResult.isSuccess])

    const onSubmit = async (values: LoginCredentials) => {
        if (isBrowser()) {
            const autoLogoutUrl = localStorage.getItem('autoLogoutPath')
            const role = autoLogoutUrl?.split('/')[2]
            setAutoLogoutUrl({
                url: localStorage.getItem('autoLogoutPath') as any,
                role: role === 'sub-admin' ? UserRoles.SUBADMIN : role,
            })
        }

        AuthUtils.logout()
        setRememberLogin(values?.remember as boolean)
        await login(values).then((res: any) => {
            if (res?.error?.data?.error === 'ahle') {
                setModal(
                    <LoginErrorAfterHoursModal
                        onCancel={() => {
                            setModal(null)
                        }}
                        error={res?.error?.data}
                    />
                )
            }
        })
    }

    return (
        <>
            {modal}
            {requested && <AccountStatus status={UserStatus.Pending} />}
            {rejected && <AccountStatus status={UserStatus.Rejected} />}
            {archived && <AccountStatus status={UserStatus.Archived} />}
            {blocked && <AccountStatus status={UserStatus.Blocked} />}
            <AuthNavbar type={'log-in'} />
            <Head>
                <title>Login</title>
                <meta
                    name="description"
                    content="Login in to your account to access your dashboard"
                    key="desc"
                />
            </Head>
            {!requested && !rejected && !archived && !blocked && (
                // <div className="w-4/5 mx-auto flex items-center justify-between">

                (<div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between md:mb-0 mb-10">
                    <div className="flex flex-col items-center flex-grow mt-8 md:w-1/2 md:px-12 px-4">
                        <div className="w-full mb-8">
                            <Typography variant={'h3'}>
                                Login To Your Account
                            </Typography>
                        </div>

                        {loginResult.isError && (
                            <p className="text-sm text-error w-full border border-error px-2 py-1 rounded shadow text-center">
                                Invalid Email or Password
                            </p>
                        )}

                        <LoginForm onSubmit={onSubmit} result={loginResult} />

                        {!loginResult.isLoading || !loginResult.isSuccess ? (
                            <div className="mt-16">
                                <Typography variant="muted">
                                    Don&apos;t have account?{' '}
                                    <Link href="/auth/signup" className="text-link">
                                        
                                            Create Account
                                        
                                    </Link>
                                </Typography>
                            </div>
                        ) : null}
                    </div>
                    <div className="hidden md:block h-48 my-auto w-px bg-gray-300 mx-16"></div>
                    <div className="md:w-1/2 md:-mr-32 ">
                        <div className="flex md:flex-row flex-col gap-y-3 md:items-start items-center  justify-between gap-x-28 mt-8 ">
                            <div className="flex flex-col gap-0.5 whitespace-nowrap">
                                <Typography variant="h2">
                                    Skiltrak App
                                </Typography>
                                <Typography variant="label">
                                    Exclusive access for students:
                                </Typography>
                                <Typography variant="label" bold>
                                    Download Skiltrak App now!
                                </Typography>
                            </div>
                            <div className="flex flex-col md:items-start items-center gap-1.5 w-full">
                                <div className="flex md:justify-start justify-center items-center gap-x-1.5 w-full">
                                    <div className="w-36">
                                        <Image
                                            src={'/images/skiltrak_IOS.svg'}
                                            alt="Skiltrak App"
                                            width={206}
                                            height={206}
                                            sizes="100vw"
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="w-36">
                                        <Image
                                            src={
                                                '/images/scan-qr-code-text.svg'
                                            }
                                            alt="Skiltrak App"
                                            width={204}
                                            height={110}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <Link
                                    className="cursor-pointer"
                                    href="https://apps.apple.com/pk/app/skiltrak/id6479631404"
                                >
                                    <div>
                                        <Image
                                            src={'/images/download-btn.svg'}
                                            alt="Skiltrak App"
                                            width={106}
                                            height={34}
                                        />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block absolute right-0 bottom-0">
                        <Image
                            src="/images/skiltrak-app.svg"
                            alt="Skiltrak App"
                            width={550}
                            height={550}
                            className="w-auto h-full object-cover"
                        />
                    </div>
                </div>)
            )}
            <div className="w-full fixed bottom-0 left-0">
                <Footer />
            </div>
        </>
    );
}

export default Login

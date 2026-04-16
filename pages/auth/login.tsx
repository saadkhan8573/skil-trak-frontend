import { ReactElement, useEffect, useState } from 'react'

import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { AccountStatus, LoginForm, Typography } from '@components'

import { UserRoles } from '@constants'
import { LoginErrorAfterHoursModal } from '@modals'
import { AuthApi } from '@queries'
import { LoginCredentials, StatusType, UserStatus } from '@types'
import { AuthUtils, isBrowser } from '@utils'
import Head from 'next/head'
import Image from 'next/image'

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
            case UserRoles.OBSERVER:
                chkRoleAndUrl(role)
                    ? router.push(autoLogoutUrl.url as URL)
                    : router.push('/portals/observer')
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
                <div className="flex flex-col-reverse md:flex-row gap-y-6 md:items-center gap-x-6 w-full ">
                    <div className="signup-bg overflow-hidden  w-full md:w-1/2">
                        {/* QR CODE */}
                        <div className="flex flex-col items-center justify-center gap-1.5 w-full mt-8">
                            <div className="flex justify-center items-center gap-x-1.5 w-full">
                                <div className="w-36">
                                    <Image
                                        width={200}
                                        height={200}
                                        sizes="100vw"
                                        alt="Skiltrak App"
                                        className="object-contain"
                                        src={'/images/skiltrak_IOS.svg'}
                                    />
                                </div>
                                <div className="w-36">
                                    <Image
                                        src={'/images/scan-qr-code-text.svg'}
                                        alt="Skiltrak App"
                                        width={200}
                                        height={100}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PLAY BUTTON */}
                        <div className="flex items-center justify-center gap-x-4 mt-8 md:mt-6">
                            <Link className="cursor-pointer" href="#">
                                <div>
                                    <Image
                                        src={'/images/google-play-button.svg'}
                                        alt="Skiltrak App"
                                        width={106}
                                        height={34}
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            </Link>
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
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            </Link>
                        </div>

                        <div className="flex flex-col items-center gap-0.5 whitespace-nowrap mt-9">
                            <Typography variant="h4">Skiltrak App</Typography>
                            <Typography variant="label" italic>
                                Exclusive access for students:
                            </Typography>
                            <Typography variant="label" bold italic>
                                Download Skiltrak App now!
                            </Typography>
                        </div>

                        <div className="mt-8 flex justify-center ">
                            <Image
                                src={'/images/our-story/mobile-screens.png'}
                                alt="Twitter"
                                width={535}
                                height={500}
                                priority
                                className="hidden md:block"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                            <Image
                                src={'/images/our-story/mobile-screens.png'}
                                alt="Twitter"
                                width={535}
                                height={500}
                                priority
                                className="block md:hidden"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col grow mt-8 md:w-1/2 md:px-12 px-4">
                        <Link href={'/'} className="mb-10">
                            <Image
                                src="/images/auth/skiltrak-logo.png"
                                alt="logo"
                                width={201}
                                height={60}
                            />
                        </Link>
                        <div className="w-full mb-8">
                            <Typography variant={'h3'}>
                                Welcome Back !
                            </Typography>
                            <Typography variant={'small'}>
                                Log In to your account
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
                                <Typography variant="small" medium>
                                    Don&apos;t have account?{' '}
                                    <Link
                                        href="/auth/signup"
                                        className="text-link"
                                    >
                                        Create Account
                                    </Link>
                                </Typography>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </>
    )
}

export default Login

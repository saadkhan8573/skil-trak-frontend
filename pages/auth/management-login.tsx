import { useEffect, useState } from 'react'

import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { ManagementLoginForm, Typography } from '@components'

import { AuthLayout } from '@layouts'
import { AuthApi } from '@queries'
import { LoginCredentials } from '@types'
import { AuthUtils, isBrowser } from '@utils'
import Image from 'next/image'
import { UserRoles } from '@constants'

const Login: NextPage = () => {
    const router = useRouter()

    const [login, loginResult] = AuthApi.useManagementLogin()

    const [rememberLogin, setRememberLogin] = useState<boolean>(false)

    const nextDestination = (role: string) => {
        if (role === UserRoles.MANAGER) {
            router.push('/portals/management/dashboard') // Assuming '/portals/manager' is the correct destination
        } else if (role === UserRoles.MARKETING) {
            router.push(
                '/portals/management/blogs?tab=published&page=1&pageSize=50'
            )
        } else {
            // Handle other roles or default behavior as needed
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

                nextDestination(loginResult?.data?.role)
            }
        }
    }, [loginResult.isSuccess])

    const onSubmit = async (values: LoginCredentials) => {
        AuthUtils.logout()
        setRememberLogin(values?.remember as boolean)
        await login(values)
    }

    return (
        // <AuthLayout type="log-in">
        <div className="management-portal-log w-full">
            <div className="pt-[7%]">
                <div className="w-[500px] rounded-md mx-auto bg-white/80 p-8">
                    <div className="flex justify-center mb-10">
                        <Image
                            src={'/images/management-portal/logo.png'}
                            width={171}
                            height={51}
                            alt="logo"
                        />
                    </div>
                    <div className="mb-12">
                        <Typography
                            variant={'h3'}
                            color="text-[#2B5B6E]"
                            center
                        >
                            Welcome
                        </Typography>
                        <Typography
                            variant={'small'}
                            color="text-[#2B5B6E]"
                            center
                        >
                            Login To Your Account
                        </Typography>
                    </div>
                    {loginResult.isError && (
                        <p className="text-sm text-error w-full border border-error px-2 py-1 rounded shadow text-center">
                            Invalid Email or Password
                        </p>
                    )}
                    <ManagementLoginForm
                        onSubmit={onSubmit}
                        result={loginResult}
                    />
                </div>
            </div>
        </div>
        // </AuthLayout>
    )
}

export default Login

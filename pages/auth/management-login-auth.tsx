import { useEffect, useState, ReactElement } from 'react'

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
import { signIn, useSession } from 'next-auth/react'
import { LoginErrorAfterHoursModal } from '@modals'

const Login: NextPage = () => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const data: any = useSession()

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
        if (data?.data) nextDestination(data?.data?.role)
    }, [data?.data])

    const handleSubmit = async (values: LoginCredentials, event: any) => {
        event.preventDefault()
        setIsLoading(true)
        setIsError(false)

        try {
            const result = await signIn('credentials', {
                ...values,
                url: 'manager/login',
                redirect: false,
            })
            if (result?.error) {
                setIsLoading(false)
                setIsError(true)
                const error = JSON.parse(result.error)
                if (error?.error === 'ahle') {
                    setModal(
                        <LoginErrorAfterHoursModal
                            onCancel={() => {
                                setModal(null)
                            }}
                            error={error}
                        />
                    )
                }
                // Handle error (e.g., show error message to user)
            } else if (result?.ok) {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
        }
    }

    const onSubmit = async (values: LoginCredentials, event: any) => {
        AuthUtils.logout()
        setRememberLogin(values?.remember as boolean)
        handleSubmit(values, event)
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
                    {isError && (
                        <p className="text-sm text-error w-full border border-error px-2 py-1 rounded shadow text-center">
                            Invalid Email or Password
                        </p>
                    )}
                    <ManagementLoginForm
                        onSubmit={onSubmit}
                        result={{
                            isLoading,
                            isError,
                            isSuccess,
                        }}
                    />
                </div>
            </div>
        </div>
        // </AuthLayout>
    )
}

export default Login

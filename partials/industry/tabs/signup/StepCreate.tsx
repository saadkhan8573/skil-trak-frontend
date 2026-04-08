import { useEffect } from 'react'
import { Popup, ShowErrorNotifications } from '@components'
import { UserRoles } from '@constants'
import { AuthApi } from '@queries'
import { OptionType, RtoFormData } from '@types'
import { AuthUtils, SignUpUtils } from '@utils'
import { useRouter } from 'next/router'

export const StepCreate = () => {
    const router = useRouter()
    const formData: any = SignUpUtils.getValuesFromStorage()
    const [register, registerResult] = AuthApi.useRegisterIndustry()
    const [login, loginResult] = AuthApi.useLogin()

    useEffect(() => {
        const createAccount = async () => {
            if (formData) {
                const values = {
                    ...formData,
                    sectors: formData.sectors?.map((s: OptionType) => s?.value),
                    country: formData?.country?.value,
                    region: formData?.region?.value,
                    role: UserRoles.INDUSTRY,
                    isAddressUpdated: true,
                }

                await register(values)
            }
        }

        createAccount()
    }, [])

    useEffect(() => {
        if (registerResult.isSuccess) {
            const loginUser = async () => {
                await login({
                    email: formData.email,
                    password: formData.password,
                })
            }

            loginUser()
        }
        if (registerResult.isError) {
            router.push({ query: { step: 'account-info' } })
        }
    }, [registerResult])

    useEffect(() => {
        if (loginResult.isSuccess) {
            if (loginResult.data) {
                AuthUtils.setToken(loginResult.data.access_token)
            }

            router.push('/portals/industry')
        }
    }, [loginResult])

    return (
        <div>
            <ShowErrorNotifications result={registerResult} />
            <Popup
                variant="info"
                title={'Creating Account...'}
                subtitle={
                    'You will be redirected to dashboard once your account is created'
                }
            />
        </div>
    )
}

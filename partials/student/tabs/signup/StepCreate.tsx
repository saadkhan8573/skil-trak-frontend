import { Popup, ShowErrorNotifications } from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { AuthApi } from '@queries'
import {
    OptionType,
    RtoFormData,
    StudentFormQueryType,
    StudentFormType,
} from '@types'
import { AuthUtils, SignUpUtils } from '@utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const StepCreate = () => {
    const router = useRouter()
    const formData: StudentFormType = SignUpUtils.getValuesFromStorage()
    const [register, registerResult] = AuthApi.useRegisterStudent()
    const [login, loginResult] = AuthApi.useLogin()
    const { notification } = useNotification()
    const hader = router?.pathname?.split('/')?.[4]

    // Helper function to prepare payload based on RTO selection
    const preparePayload = (formData: StudentFormType) => {
        const basePayload = {
            addressLine1: formData.addressLine1,
            agreedWithPrivacyPolicy: formData.agreedWithPrivacyPolicy,
            confirmPassword: formData.confirmPassword,
            email: formData.email,
            name: formData.name,
            password: formData.password,
            phone: formData.phone,
            state: formData.state,
            suburb: formData.suburb,
            zipCode: formData.zipCode,
            role: UserRoles.STUDENT,
            isAddressUpdated: true,
        }

        // Check if RTO is selected as "other" or if it's a string value (but not a numeric string)
        const isRtoOther =
            typeof formData.rto === 'string' && isNaN(Number(formData.rto))

        if (isRtoOther) {
            // RTO is "other" - use string format and include courseInfo
            return {
                ...basePayload,
                rto: formData.rto, // This will be the string value
                courseDescription: formData?.courseDescription || '',
            }
        } else {
            // RTO is selected from dropdown - use number format and include courses/sectors
            // Extract only IDs from courses and sectors arrays
            const courseIds =
                formData.courses?.map((course) =>
                    typeof course === 'object' && course.value
                        ? course.value
                        : course
                ) || []

            const sectorIds =
                formData.sectors?.map((sector) =>
                    typeof sector === 'object' && sector.value
                        ? sector.value
                        : sector
                ) || []

            return {
                ...basePayload,
                rto:
                    typeof formData.rto === 'string'
                        ? parseInt(formData.rto)
                        : formData.rto,
                courses: courseIds,
                sectors: sectorIds,
            }
        }
    }

    useEffect(() => {
        const createAccount = async () => {
            if (formData) {
                const payload = preparePayload(formData)
                await register(payload as any)
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
            SignUpUtils.setEditingMode(true)
            router.push({ query: { ...router.query, step: 'account-info' } })
        }
    }, [registerResult])

    useEffect(() => {
        if (loginResult.isSuccess) {
            if (loginResult.data) {
                AuthUtils.setToken(loginResult.data.access_token)
            }

            router.push('/portals/student')
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

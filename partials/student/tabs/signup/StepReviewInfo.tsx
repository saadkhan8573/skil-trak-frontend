import {
    Button,
    Card,
    CustomPaymentModal,
    GlobalModal,
    LoadingAnimation,
    Popup,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { InfoboxCard } from '@partials/common'
import { AuthApi, RtoApi, usePayAsNewUserMutation } from '@queries'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { OptionType, StudentFormType } from '@types'
import { AuthUtils, SignUpUtils } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)
export const StepReviewInfo = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)
    const [loadingPayment, setLoadingPayment] = useState(false)
    const { notification } = useNotification()
    const router = useRouter()
    const [paymentId, setPaymentId] = useState<string | null>(null)
    const [register, registerResult] = AuthApi.useRegisterStudent()
    const [login, loginResult] = AuthApi.useLogin()
    const formData: any = SignUpUtils.getValuesFromStorage()

    const id = formData?.rto
    const { data, isLoading, isError } = RtoApi.Rto.useRtoSelfPayment(id, {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })
    const [newUserPayment, resultNewUserPayment] = usePayAsNewUserMutation()

    const onCancel = () => {
        setModal(null)
    }

    const sectorResponse = AuthApi.useSectorsByRto(Number(id), {
        skip: !id,
    })

    // rtos/id
    const onEditData = () => {
        SignUpUtils.setEditingMode(true)
        // navigate to form
        router.push({ query: { ...router.query, step: 'account-info' } })
    }

    const onSubmitData = () => {
        // await signUp(industryFormData);
        SignUpUtils.setEditingMode(false)

        // set-up account type from here
        if (!data?.allowStudentSelfPayment || !(formData?.rtoInfo !== '')) {
            router.push({ query: { ...router.query, step: 'requested' } })
        }
    }

    // Helper function to prepare payload based on RTO selection
    const preparePayload = (
        formData: StudentFormType,
        currentPaymentId: string | null
    ) => {
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
            paymentId: currentPaymentId, // Use the passed paymentId
        }

        // Check if RTO is selected as "other" or if it's a string value (but not a numeric string)
        const isRtoOther =
            formData?.rtoInfo && formData?.rtoInfo !== '' && !formData?.rto
        if (isRtoOther) {
            // RTO is "other" - use string format and include courseDescription
            return {
                ...basePayload,
                rtoInfo: formData?.rtoInfo, // This will be the string value
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
                rto: formData?.rto,
                courses: courseIds,
                sectors: sectorIds,
            }
        }
    }

    // useEffect(() => {
    //     const createAccount = async () => {
    //         if (formData) {
    //             const payload = preparePayload(formData)
    //             await register(payload as any)
    //         }
    //     }

    //     createAccount()
    // }, [])

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

    const fetchPaymentIntent = async () => {
        const res = await newUserPayment({
            amount: formData?.rto ? 250 : 390,
            email: formData?.email,
            currency: 'aud',
            payment_method_types: ['card'],
            idempotencyKey: uuid(),
        }).unwrap()

        setModal(
            <GlobalModal>
                <Elements
                    stripe={stripePromise}
                    options={{ clientSecret: res?.clientSecret }}
                >
                    <CustomPaymentModal
                        onCancel={onCancel}
                        setPaymentConfirmed={setPaymentConfirmed}
                        paymentConfirmed={paymentConfirmed}
                        formData={formData}
                        onSuccess={async (paymentIntentId: string) => {
                            // Accept paymentId as parameter
                            setModal(null)
                            setPaymentId(paymentIntentId) // Set the paymentId in state
                            const payload = preparePayload(
                                formData,
                                paymentIntentId
                            ) // Pass paymentId
                            await register(payload as any)
                        }}
                    />
                </Elements>
            </GlobalModal>
        )
    }

    // Map course IDs to full course objects using sectorResponse data
    const mappedCourses =
        sectorResponse?.data
            ?.filter(
                (course: any) =>
                    formData?.courses?.includes(course?.id) ||
                    formData?.courses?.some(
                        (c: any) => (c?.value || c) === course?.id
                    )
            )
            ?.map((course: any) => ({
                label: course?.title,
                value: course?.id,
            })) || []

    return (
        <>
            {modal && modal}
            <ShowErrorNotifications
                result={registerResult || resultNewUserPayment}
            />
            {registerResult.isLoading ? (
                <Popup
                    variant="info"
                    title={'Creating Account...'}
                    subtitle={
                        'You will be redirected to dashboard once your account is created'
                    }
                />
            ) : isLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="max-w-7xl mx-auto mt-4 px-2 xl:px-0">
                    <div>
                        <p className="font-semibold text-lg">
                            Please Review Your Information
                        </p>
                        <p className="font-medium text-sm text-gray-400">
                            Confirm your input to proceed, if there are changes
                            to made, you can edit them
                        </p>
                    </div>

                    <div>
                        <div className="w-full pb-10 lg:pr-10">
                            <div className="">
                                {/* RTO Information */}
                                <div className="grow">
                                    <div className="border-b  border-secondary-dark mt-8">
                                        <Typography
                                            variant={'xs'}
                                            color={'text-gray-400'}
                                        >
                                            Student Information
                                        </Typography>
                                    </div>

                                    <Card>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:max-w-lg mt-4">
                                            <InfoboxCard>
                                                <Typography
                                                    variant={'xs'}
                                                    color={'text-gray-500'}
                                                >
                                                    Name
                                                </Typography>
                                                <Typography variant={'label'}>
                                                    {formData?.name || ''}
                                                </Typography>
                                            </InfoboxCard>

                                            <InfoboxCard>
                                                <Typography
                                                    variant={'xs'}
                                                    color={'text-gray-500'}
                                                >
                                                    Phone Number
                                                </Typography>
                                                <Typography variant={'label'}>
                                                    {formData.phone || ''}
                                                </Typography>
                                            </InfoboxCard>

                                            {/* <InfoboxCard>
                                        <Typography
                                            variant={'xs'}
                                            color={'text-gray-500'}
                                        >
                                            Date of birth
                                        </Typography>
                                        <Typography variant={'label'}>
                                            {moment(formData.dob).format(
                                                'MMM, Do YYYY'
                                            ) || ''}
                                        </Typography>
                                    </InfoboxCard> */}
                                        </div>
                                    </Card>
                                </div>

                                {/* Profile Information */}
                                <div className="grow">
                                    <div className="border-b  border-secondary-dark mt-8">
                                        <Typography
                                            variant={'xs'}
                                            color={'text-gray-400'}
                                        >
                                            Profile Information
                                        </Typography>
                                    </div>

                                    <Card>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:max-w-lg mt-4">
                                            <InfoboxCard>
                                                <Typography
                                                    variant={'xs'}
                                                    color={'text-gray-500'}
                                                >
                                                    E-Mail
                                                </Typography>
                                                <Typography variant={'label'}>
                                                    {formData?.email || ''}
                                                </Typography>
                                            </InfoboxCard>
                                        </div>
                                    </Card>
                                    {/* <div>
                                <Typography
                                    variant={'xs'}
                                    color={'text-gray-500'}
                                >
                                    RTO
                                </Typography>
                                <Typography variant={'label'}>
                                    {formData.rto.label || ''}
                                </Typography>
                            </div> */}
                                </div>
                            </div>

                            {/* Sector Info */}
                            <div>
                                {formData?.sectors &&
                                formData?.sectors?.length > 0 ? (
                                    <>
                                        <div className="border-b  border-secondary-dark mt-8">
                                            <Typography
                                                variant={'xs'}
                                                color={'text-gray-400'}
                                            >
                                                Sector Information
                                            </Typography>
                                        </div>
                                        <div className="w-full mt-4 flex flex-col gap-y-5">
                                            <Card>
                                                <div className="mb-1">
                                                    <Typography
                                                        variant={'xs'}
                                                        color={'text-gray-500'}
                                                    >
                                                        Sector(s)
                                                    </Typography>
                                                </div>

                                                <div className="flex flex-col gap-y-1">
                                                    {formData.sectors?.map(
                                                        (
                                                            sector: OptionType
                                                        ) => (
                                                            <InfoboxCard
                                                                key={Number(
                                                                    sector?.value ||
                                                                        sector
                                                                )}
                                                            >
                                                                <div className="">
                                                                    <Typography
                                                                        variant={
                                                                            'label'
                                                                        }
                                                                    >
                                                                        {
                                                                            sector?.label
                                                                        }
                                                                    </Typography>
                                                                </div>
                                                            </InfoboxCard>
                                                        )
                                                    )}
                                                </div>
                                            </Card>
                                            {mappedCourses?.length > 0 && (
                                                <Card>
                                                    <div className="mb-2">
                                                        <Typography
                                                            variant={'xs'}
                                                            color={
                                                                'text-gray-500'
                                                            }
                                                        >
                                                            Course(s)
                                                        </Typography>
                                                    </div>
                                                    <div className="flex flex-col gap-y-1">
                                                        {mappedCourses?.map(
                                                            (course: any) => (
                                                                <InfoboxCard
                                                                    key={Number(
                                                                        course.value
                                                                    )}
                                                                >
                                                                    <div className="">
                                                                        <Typography
                                                                            variant={
                                                                                'label'
                                                                            }
                                                                        >
                                                                            {
                                                                                course?.label
                                                                            }
                                                                        </Typography>
                                                                    </div>
                                                                </InfoboxCard>
                                                            )
                                                        )}
                                                    </div>
                                                </Card>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full mt-4 flex flex-col gap-y-5">
                                        <Card>
                                            <div className="mb-2">
                                                <Typography
                                                    variant={'xs'}
                                                    color={'text-gray-500'}
                                                >
                                                    Course Info
                                                </Typography>
                                            </div>
                                            <div className="flex flex-col gap-y-1">
                                                <InfoboxCard>
                                                    <Typography variant="label">
                                                        {formData?.courseDescription ||
                                                            'NA'}
                                                    </Typography>
                                                </InfoboxCard>
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <div className="border-b  border-secondary-dark mt-8">
                                    <Typography
                                        variant={'xs'}
                                        color={'text-gray-400'}
                                    >
                                        Address Information
                                    </Typography>
                                </div>

                                <Card>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:max-w-lg mt-4">
                                        <InfoboxCard>
                                            <Typography
                                                variant={'xs'}
                                                color={'text-gray-500'}
                                            >
                                                Primary Address
                                            </Typography>
                                            <Typography variant={'label'}>
                                                {formData.addressLine1 || '-'}
                                            </Typography>
                                        </InfoboxCard>

                                        <InfoboxCard>
                                            <Typography
                                                variant={'xs'}
                                                color={'text-gray-500'}
                                            >
                                                Zip Code
                                            </Typography>
                                            <Typography variant={'label'}>
                                                {formData.zipCode || '-'}
                                            </Typography>
                                        </InfoboxCard>
                                        {formData.addressLine2 ? (
                                            <InfoboxCard>
                                                <Typography
                                                    variant={'xs'}
                                                    color={'text-gray-500'}
                                                >
                                                    Secondary Address
                                                </Typography>
                                                <Typography variant={'label'}>
                                                    {formData.addressLine2 ||
                                                        '-'}
                                                </Typography>
                                            </InfoboxCard>
                                        ) : null}
                                    </div>
                                </Card>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex items-center gap-x-8">
                                {data?.allowStudentSelfPayment ||
                                formData?.rtoInfo !== '' ? (
                                    paymentConfirmed ? (
                                        <Button
                                            variant={'primary'}
                                            onClick={onSubmitData}
                                        >
                                            Create Account
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            onClick={fetchPaymentIntent}
                                            loading={loadingPayment}
                                        >
                                            Pay & Continue
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        variant={'primary'}
                                        onClick={onSubmitData}
                                    >
                                        Create Account
                                    </Button>
                                )}
                                <Button
                                    variant={'secondary'}
                                    onClick={onEditData}
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

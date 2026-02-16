import { Animations } from '@animations'
import {
    Button,
    LottieAnimation,
    ShowErrorNotifications
} from '@components'
import {
    useCreateCheckoutSessionMutation,
    useGetStudentProfileDetailQuery,
} from '@queries'
import { StatusType, UserStatus } from '@types'
import { AuthUtils } from '@utils'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

interface AccountStatusProps {
    status: StatusType
}

const getStatusComponent = ({
    animation,
    title,
    description,
    action,
}: {
    animation: any
    title: string
    description: string
    action?: { onClick: () => void; text: string }
}) => {
    return (
        <div className="h-[50vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-y-8">
                <div>
                    <LottieAnimation
                        height={250}
                        width={250}
                        animation={animation}
                    />
                </div>

                <div className="w-5/6 text-center">
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>

                {action && (
                    <Button
                        text={action.text || 'Action'}
                        outline
                        onClick={() => {
                            action.onClick()
                        }}
                    />
                )}
            </div>
        </div>
    )
}
export const AccountStatus = ({ status }: AccountStatusProps) => {
    const router = useRouter()
    const role = AuthUtils.getUserCredentials().role
    const { data } = useGetStudentProfileDetailQuery()
    const [checkoutSession, checkoutSessionResult] =
        useCreateCheckoutSessionMutation()

    const onAgreeAndContinueClicked = async () => {
        const idempotency = uuid()
        await checkoutSession({ idempotency })
    }

    switch (status) {
        case UserStatus.Pending:
            return getStatusComponent({
                animation: Animations.Auth.SignUp.Waiting,
                title: `Your Account Request Is Under Review`,
                description: `You will be redirected to page, once your
                    request got approved by one of our Admin.`,
                action: {
                    text: 'My Account',
                    onClick: () => {
                        switch (role) {
                            case 'admin':
                                router.push('/portals/admin')
                                break
                            case 'industry':
                                router.push('/portals/industry')
                                break
                            case 'rto':
                                router.push('/portals/rto')
                                break
                            case 'student':
                                router.push('/portals/student')
                                break
                            case 'subadmin':
                                router.push('/portals/sub-admin')
                                break
                        }
                    },
                },
            })
        case UserStatus.Archived:
            return (
                <div>
                    <ShowErrorNotifications result={checkoutSessionResult} />
                    {getStatusComponent({
                        animation: Animations.Auth.SignUp.Waiting,
                        title: `Your Account Is Archived`,
                        description: `To reactivate your account, Please follow the prompt below.`,
                    })}
                    <div className="border rounded-md border-dashed px-8 py-4 mt-4">
                        <p className="font-semibold mb-2">
                            Terms &amp; Conditions
                        </p>
                        <ul className="list-disc text-sm">
                            <li>
                                I understand that my Skiltrak account will be
                                reactivated for one month from the date of
                                payment. Please note there will be no
                                reimbursement if WBT is completed prior to this
                                new timeline end date.
                            </li>
                            <li>
                                I understand that this timeline extension
                                request is applicable to my Skiltrak account
                                (only) and not applicable to any course
                                extension.
                            </li>
                            <li>
                                I understand that if I am an international
                                student, I will need to contact my school to
                                ensure that I am in accordance with my COE end
                                date prior to proceeding with th WBT course
                                extension timeline.
                            </li>
                        </ul>

                        <div>
                            <div className="my-2">
                                <Button
                                    disabled={
                                        checkoutSessionResult.isLoading ||
                                        checkoutSessionResult.isSuccess
                                    }
                                    loading={
                                        checkoutSessionResult.isLoading ||
                                        checkoutSessionResult.isSuccess
                                    }
                                    text={'Agree & Continue'}
                                    onClick={() => onAgreeAndContinueClicked()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )

        case UserStatus.Blocked:
            return getStatusComponent({
                animation: Animations.Auth.SignUp.Rejected,
                title: `Your Account Has Been Blocked`,
                description: `If you'd like to unblock your account, please reach out to our support team. For any queries, contact us at info@skiltrak.com.au.`,
            })

        case UserStatus.Rejected:
            return getStatusComponent({
                animation: Animations.Auth.SignUp.Rejected,
                title: `Your Account Is Rejected`,
                description: `Please contact regarding authority to re-open`,
                action: {
                    text: 'Request To Re-Open',
                    onClick: () => { },
                },
            })

        default:
            return <></>
    }
}

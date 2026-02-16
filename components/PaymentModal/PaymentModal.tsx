import React, { useEffect } from 'react'
import { useCreateCheckoutSessionMutation } from '@queries'
import { AuthUtils, getStripe } from '@utils'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { Button } from '@components/buttons'
import { uuid } from 'uuidv4'
import { useRouter } from 'next/router'
export const PaymentModal = ({ onCancel }: any) => {
    const router = useRouter()
    const [checkoutSession, checkoutSessionResult] =
        useCreateCheckoutSessionMutation()

    const onAgreeAndContinueClicked = async () => {
        const idempotency = uuid()
        await checkoutSession({ idempotency })
    }
    useEffect(() => {
        if (checkoutSessionResult.isSuccess) {
            router.push(checkoutSessionResult?.data?.url)
        }
    }, [checkoutSessionResult])
    return (
        <div className="p-5">
            <ShowErrorNotifications result={checkoutSessionResult} />
            {/* <p>

                {animation: Animations.Auth.SignUp.Waiting,
                title: `Your Account Is Archived`,
                description: `To reactivate your account, Please follow the prompt below.`,}
            
           </p> */}
            <div>
                <p>Your Account Is Archived</p>
                <p>
                    To reactivate your account, Please follow the prompt below.
                </p>
            </div>
            <div className="border rounded-md border-dashed px-8 py-4 mt-4">
                <p className="font-semibold mb-2">Terms &amp; Conditions</p>
                <ul className="list-disc text-sm">
                    <li>
                        I understand that my Skiltrak account will be
                        reactivated for one month from the date of payment.
                        Please note there will be no reimbursement if WBT is
                        completed prior to this new timeline end date.
                    </li>
                    <li>
                        I understand that this timeline extension request is
                        applicable to my Skiltrak account (only) and not
                        applicable to any course extension.
                    </li>
                    <li>
                        I understand that if I am an international student, I
                        will need to contact my school to ensure that I am in
                        accordance with my COE end date prior to proceeding with
                        th WBT course extension timeline.
                    </li>
                </ul>

                <div>
                    <div className="my-2 flex items-center gap-x-3">
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
                        <Button
                            text="close"
                            variant={'error'}
                            onClick={onCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

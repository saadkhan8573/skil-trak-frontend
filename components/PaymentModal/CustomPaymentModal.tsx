import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

import { Button } from '@components/buttons'
import { useNotification } from '@hooks'

export const CustomPaymentModal = ({
    onCancel,
    setPaymentConfirmed,
    paymentConfirmed,
    onSuccess,
    formData,
}: any) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { notification } = useNotification()
    const stripe = useStripe()
    const elements = useElements()
    const handlePay = async () => {
        if (!stripe || !elements) return

        setLoading(true)
        setError(null)

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href, // or custom thank-you page
            },
            redirect: 'if_required', // prevents full redirect for card payments
        })

        if (result.error) {
            setError(result.error.message || 'Payment failed')
        } else if (result.paymentIntent?.status === 'succeeded') {
            const paymentIntentId = result.paymentIntent.id
            // You can show success UI or trigger success logic
            setPaymentConfirmed(true)
            onSuccess(paymentIntentId)
            onCancel()
        }

        setLoading(false)
    }
    useEffect(() => {
        if (error) {
            notification.error({
                title: 'Payment Error',
                description:
                    'Payment could not be processed. Please try again.',
            })
        } else if (paymentConfirmed) {
            notification.success({
                title: 'Payment Successful',
                description: 'Your payment has been processed successfully.',
            })
        }
    }, [error, paymentConfirmed])

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg max-h-[500px] overflow-y-auto remove-scrollbar">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Activate Your Account
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Make a payment to access your student portal.
                </p>
            </div>

            <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                    }).format(formData?.rto ? 250 : 390)}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    🔒 Your payment is secure and encrypted via Stripe.
                </p>
            </div>

            <div className="mb-6">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card'],
                    }}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    text="Pay Now"
                    onClick={handlePay}
                    loading={loading}
                    disabled={!stripe}
                />
                {/* <Button text="Cancel" variant="error" onClick={onCancel} /> */}
            </div>
        </div>
    )
}

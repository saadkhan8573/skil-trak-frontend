import { useRouter } from 'next/router'

import { SignUpUtils } from '@utils'
import { IndustrySignUpForm } from '@partials/industry/forms'

export const StepAccountInfo = () => {
    const router = useRouter()

    const onSubmit = (values: any) => {
        SignUpUtils.setValuesToStorage({
            ...values,
        })
        router.push({ query: { step: 'review-info' } })
    }

    return (
        <div>
            <div>
                <div className="w-full mt-4 pb-10 md:px-0 px-4">
                    <IndustrySignUpForm onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    )
}

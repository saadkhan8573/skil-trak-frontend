import { useRouter } from 'next/router'

import { StudentSignUpForm } from '@partials/student/forms'
import { StudentFormType } from '@types'
import { SignUpUtils } from '@utils'

export const StepAccountInfo = () => {
    const router = useRouter()

    const onSubmit = (values: StudentFormType) => {
        SignUpUtils.setValuesToStorage({
            ...values,
        })
        router.push({ query: { ...router.query, step: 'review-info' } })
    }

    return (
        <div className="w-full mt-4 pb-10 md:px-0 px-4">
            <StudentSignUpForm onSubmit={onSubmit} />
        </div>
    )
}

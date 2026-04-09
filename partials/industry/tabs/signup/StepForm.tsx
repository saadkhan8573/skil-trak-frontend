import {
    BackButton,
    IndicatorChildrenPropType,
    IndicatorStep,
    StepIndicator,
    Typography,
} from '@components'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StepAccountInfo } from './StepAccountInfo'
import { StepCreate } from './StepCreate'
import { StepOnBoarding } from './StepOnBoarding'
import { StepReviewInfo } from './StepReviewInfo'

export const StepForm = () => {
    const router = useRouter()
    const { query } = router

    const FormSteps: IndicatorStep[] = [
        {
            label: 'Account Info',
            visited: true,
            query: 'account-info',
            element: <StepAccountInfo />,
        },
        // {
        //     label: 'Notification Method',
        //     visited: false,
        //     query: 'notification-method',
        //     element: <StepNotificationMethod />,
        // },
        // {
        //     label: 'On Boarding',
        //     visited: false,
        //     query: 'on-boarding',
        //     element: <StepOnBoarding />,
        // },
        {
            label: 'Review Info',
            visited: false,
            query: 'review-info',
            element: <StepReviewInfo />,
        },
        {
            label: 'Account Request',
            visited: false,
            last: true,
            query: 'requested',
            element: <StepCreate />,
        },
    ]

    const currentStep = FormSteps.find((step) => query.step === step.query)

    return (
        <div>
            {currentStep ? (
                <StepIndicator
                    steps={FormSteps}
                    currentStep={currentStep!!}
                    horizontal
                >
                    {({ steps, element }: IndicatorChildrenPropType) => {
                        return (
                            <div className="flex flex-col md:flex-row md:justify-between gap-x-16 w-full">
                                <div className="signup-bg md:pl-28 md:pt-24 pl-4 pt-4 md:fixed md:-left-10 md:top-0 md:w-1/2">
                                    <BackButton />
                                    <div className="">
                                        <Link href={'/'}>
                                            <Image
                                                src="/images/auth/skiltrak-logo.png"
                                                alt="logo"
                                                width={201}
                                                height={60}
                                            />
                                        </Link>
                                        <div className="my-9">
                                            <Typography
                                                variant={'body'}
                                                color="text-[#255168]"
                                                italic
                                            >
                                                Sign Up To
                                            </Typography>
                                            <Typography
                                                variant={'h1'}
                                                color="text-[#255168]"
                                            >
                                                Industry Portal
                                            </Typography>
                                        </div>
                                    </div>
                                    {steps}
                                </div>
                                <div className="mt-6 w-full md:w-1/2 md:ml-auto">
                                    {element}
                                </div>
                            </div>
                        )
                    }}
                </StepIndicator>
            ) : (
                <div></div>
            )}
        </div>
    )
}

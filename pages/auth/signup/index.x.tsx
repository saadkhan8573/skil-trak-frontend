import type { NextPage } from 'next'
import { useState } from 'react'

import { PortalDetail, PortalSelectButton, Typography } from '@components'
import Link from 'next/link'
import { AuthLayout } from '@layouts'
import Head from 'next/head'

const PortalTypeOptions = [
    {
        text: 'Student',
        link: '/auth/signup/student?step=account-info',
        Icon: '/images/portal-icons/ic_portal_student.svg',
        videoUrl: 'https://www.youtube.com/watch?v=OSaVf1WjzJY',
    },
    {
        text: 'RTO',
        link: '/auth/signup/rto?step=account-info',
        Icon: '/images/portal-icons/ic_portal_rto.svg',
        videoUrl: 'https://www.youtube.com/watch?v=gqTXp7KA458',
    },
    {
        text: 'Industry',
        link: '/auth/signup/industry?step=account-info',
        Icon: '/images/portal-icons/ic_portal_industry.svg',
        videoUrl: 'https://www.youtube.com/watch?v=ofU6wV2yclQ',
    },
]

const SignUp: NextPage = () => {
    const [selectedPortal, setSelectedPortal] = useState(PortalTypeOptions[0])

    const handleMouseEnter = (index: number) => {
        setSelectedPortal(PortalTypeOptions[index])
    }

    return (
        <AuthLayout type="sign-up">
            <Head>
                <title>Create an account</title>
                <meta
                    name="description"
                    content="Choose your portal type to sign up on the platform"
                    key="desc"
                />
            </Head>
            <div className="w-[70%] mx-auto mt-16">
                <div>
                    <Typography variant={'h1'}>
                        Choose Your Portal Type
                    </Typography>
                </div>
                <div className="flex mt-8">
                    <div className="flex flex-col items-center justify-center gap-y-6 lg:border-r pb-10 lg:pb-0 lg:px-16 lg:mr-16 border-secondary-dark">
                        {PortalTypeOptions.map(
                            ({ text, link, Icon }, index) => (
                                <PortalSelectButton
                                    key={index}
                                    Icon={Icon}
                                    link={link}
                                    onMouseEnter={() => {
                                        handleMouseEnter(index)
                                    }}
                                >
                                    {text}
                                </PortalSelectButton>
                            )
                        )}

                        <div className="mt-16">
                            <Typography variant="muted">
                                Already have account?{' '}
                                <Link href="/auth/login" className="text-link">
                                    Login
                                </Link>
                            </Typography>
                        </div>
                    </div>
                    {/* <div>
                        <PortalDetail
                            text={selectedPortal.text}
                            videoUrl={selectedPortal.videoUrl}
                        />
                    </div> */}
                </div>
            </div>
        </AuthLayout>
    );
}

export default SignUp

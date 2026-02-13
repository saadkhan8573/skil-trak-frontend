import type { NextPage } from 'next'
import { useState } from 'react'

import { PortalDetail, PortalSelectButton, Typography } from '@components'
import Link from 'next/link'
import { AuthLayout } from '@layouts'
import Head from 'next/head'
import Image from 'next/image'

const PortalTypeOptions = [
    {
        text: 'Student',
        link: '/auth/signup/student?step=account-info',
        Icon: '/images/auth/student-icon.svg',
        videoUrl: 'https://www.youtube.com/watch?v=OSaVf1WjzJY',
    },
    {
        text: 'Training Organization',
        link: '/auth/signup/rto?step=account-info',
        Icon: '/images/auth/rto-icon.svg',
        videoUrl: 'https://www.youtube.com/watch?v=gqTXp7KA458',
    },
    {
        text: 'Industry',
        link: '/auth/signup/industry?step=account-info',
        Icon: '/images/auth/industry-icon.svg',
        videoUrl: 'https://www.youtube.com/watch?v=ofU6wV2yclQ',
    },
]

const SignUp: NextPage = () => {
    const [selectedPortal, setSelectedPortal] = useState(PortalTypeOptions[0])

    const handleMouseEnter = (index: number) => {
        setSelectedPortal(PortalTypeOptions[index])
    }

    return (
        <>
            <Head>
                <title>Create an account</title>
                <meta
                    name="description"
                    content="Choose your portal type to sign up on the platform"
                    key="desc"
                />
            </Head>
            <div className="choose-portal-type-bg flex flex-col items-center justify-center gap-y-5">
                <Link href={'/'}>
                    <Image
                        src="/images/auth/skiltrak-logo.png"
                        alt="logo"
                        width={201}
                        height={60}
                    />
                </Link>
                <div className="flex justify-center items-center flex-col gap-y-3">
                    <Typography variant={'h1'} color="text-[#255168]" center>
                        Welcome to Skiltrak
                    </Typography>
                    <Typography
                        variant={'title'}
                        italic
                        center
                        color="text-[#255168]"
                    >
                        Choose Your Portal Type
                    </Typography>
                </div>
                <div className="mt-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-6 gap-x-10 lg:border-r pb-10 lg:pb-0 lg:px-16 lg:mr-16 border-secondary-dark">
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
                    </div>
                    <div className="md:mt-16 mt-0 flex justify-center">
                        <Typography variant="body">
                            Already have account?{' '}
                            <Link href="/auth/login" className="text-link">
                                Login
                            </Link>
                        </Typography>
                    </div>
                    {/* <div>
                        <PortalDetail
                            text={selectedPortal.text}
                            videoUrl={selectedPortal.videoUrl}
                        />
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default SignUp

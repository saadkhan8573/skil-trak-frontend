'use client'

import { Typography } from '@components/Typography'
import Image from 'next/image'
import React from 'react'
import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaPinterest,
    FaTiktok,
} from 'react-icons/fa'
import { AiOutlineYoutube } from 'react-icons/ai'
import Link from 'next/link'

export const SocialLinks = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const flags = [
        {
            src: '/images/site/home-page-v3/footer/mauritius-flag.png',
            alt: 'Mauritius Flag',
        },
        {
            src: '/images/site/home-page-v3/footer/torres-strait-islander-flag.png',
            alt: 'Torres Strait Islander Flag',
        },
        {
            src: '/images/site/home-page-v3/footer/australian-national-flag.png',
            alt: 'Australian Flag',
        },
    ]

    const socialLinks = [
        {
            href: 'https://www.facebook.com/skiltrak.com.au',
            icon: FaFacebookF,
            color: 'text-blue-900',
            bg: 'bg-blue-200',
        },
        {
            href: 'https://www.linkedin.com/company/skiltrak/',
            icon: FaLinkedinIn,
            color: 'text-blue-900',
            bg: 'bg-blue-200',
        },
        {
            href: 'https://www.instagram.com/skiltrak/',
            icon: FaInstagram,
            color: 'text-blue-900',
            bg: 'bg-blue-200',
        },
        {
            href: 'https://www.youtube.com/@SkilTrak',
            icon: AiOutlineYoutube,
            color: 'text-blue-900',
            bg: 'bg-blue-200',
        },
        {
            href: 'https://www.pinterest.com/skiltrak/',
            icon: FaPinterest,
            color: 'text-black',
            bg: 'bg-blue-200',
        },
        {
            href: 'https://www.tiktok.com/@skiltrak_placements',
            icon: FaTiktok,
            color: 'text-black',
            bg: 'bg-blue-200',
        },
    ]

    return (
        <div className="flex flex-col gap-y-10">
            <Typography color="text-primaryNew">
                SkilTrak acknowledges the Aboriginal and Torres Strait Islander
                people, the Traditional Custodians of the land on which our
                business is located. We pay our respects to Elders past and
                present, and extend that respect to all Aboriginal and Torres
                Strait Islander peoples.
            </Typography>

            <div className="flex items-center gap-x-4 mt-5">
                {flags.map((flag, idx) => (
                    <Image
                        key={idx}
                        src={flag.src}
                        alt={flag.alt}
                        width={62}
                        height={32}
                        priority
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-x-4 mt-5">
                <div className="bg-blue-200 rounded-full p-2">
                    <FaFacebookF className="text-blue-900" />
                </div>
                <div className="bg-blue-200 rounded-full p-2">
                    <FaLinkedinIn className="text-blue-900" />
                </div>
                <div className="bg-blue-200 rounded-full p-2">
                    <FaInstagram className="text-blue-900" />
                </div>
                <div className="bg-blue-200 rounded-full p-2">
                    <AiOutlineYoutube className="text-blue-900" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-y-2 md:gap-y-0 w-full mt-5">
                <Typography>All Rights Reserved - {currentYear}</Typography>
                <Typography>ABN: 58 634 992 706</Typography>
                <Link href="/terms-and-conditions">
                    <Typography className="underline">
                        Terms & Conditions
                    </Typography>
                </Link>
            </div>
        </div>
    )
}

import Image from 'next/image'
import React from 'react'
import { QuickLinks } from './QuickLinks'
import { ContactDetailsFooter } from './ContactDetailsFooter'
import { FooterAddressOnMap } from './FooterAddressOnMap'
import { Typography } from '@components/Typography'
import { SocialLinks } from './SocialLinks'

export const FooterVIII = () => {
    return (
        <div className="bg-[#F3F3F3] w-full py-4 md:py-8 px-4 md:px-0">
            <div className="md:max-w-7xl md:mx-auto">
                <Image
                    className={'w-24 md:w-32 h-auto'}
                    src={`/images/site/home-page-v3/footer/skiltrak-logo-2.svg`}
                    alt="Logo"
                    height={40}
                    width={100}
                    priority
                />
                <QuickLinks />
                <div className="flex justify-between flex-col md:flex-row items-center md:gap-x-12 mt-10">
                    <SocialLinks />
                    <div className="space-y-4">
                        <ContactDetailsFooter />
                        <FooterAddressOnMap />
                    </div>
                </div>
            </div>
        </div>
    )
}

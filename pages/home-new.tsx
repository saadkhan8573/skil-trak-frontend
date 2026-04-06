import {
    AssuredPlacement,
    CollaborationAddOns,
    ContactAndBlogs,
    CountsSection,
    HeroSection,
    StudentSuccessStories,
    TrustedByMarquee,
    WhoWeServe,
} from '@components/site'
import { SiteLayout } from '@layouts'
import TechnicalPartners from '@partials/frontPages/home2/TechnicalPartners/TechnicalPartners'
import { NextPageWithLayout } from '@types'
import { ReactElement } from 'react'

const HomeV3: NextPageWithLayout = ({ featuredBlogs, homepageCounts }: any) => {
    return (
        <>
            <HeroSection />
            <TrustedByMarquee />
            <WhoWeServe />

            <CountsSection homepageCounts={homepageCounts} />

            <AssuredPlacement />
            <CollaborationAddOns />

            <ContactAndBlogs featuredBlogs={featuredBlogs} />

            <StudentSuccessStories />
            <TechnicalPartners />
        </>
    )
}

HomeV3.getLayout = (page: ReactElement) => {
    return <SiteLayout>{page}</SiteLayout>
}

// ✅ Fetch both featured blogs and homepage counts
export const getStaticProps = async () => {
    try {
        // Fetch featured blogs
        const blogRes = await fetch(
            `${process.env.NEXT_PUBLIC_END_POINT}/blogs/site`
        )
        const blogData = await blogRes.json()

        const featuredBlogs =
            blogData?.filter((item: any) => item?.isFeatured) || []

        // Fetch homepage counts
        const countsRes = await fetch(
            `${process.env.NEXT_PUBLIC_END_POINT}/admin/homepage-counts`
        )
        const homepageCounts = await countsRes.json()

        return {
            props: {
                featuredBlogs,
                homepageCounts,
            },
            revalidate: 60, // ISR - rebuild every 60 seconds
        }
    } catch (error) {
        return {
            props: {
                featuredBlogs: [],
                homepageCounts: null,
            },
        }
    }
}

export default HomeV3

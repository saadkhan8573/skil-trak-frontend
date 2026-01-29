import { useEffect, useState } from 'react'

import Image from 'next/image'

import { SiteLayout } from '@layouts'
import axios from 'axios'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { NextPage } from 'next'
import Marquee from 'react-fast-marquee'
import { Button } from '../components/site/Button'
import { FigureCard } from '../components/site/FigureCard'
import { NewsCard } from '../components/site/NewsCard'
import { PackageCard } from '../components/site/PackageCard'
import { HomeSlider } from '../components/site/slider/HomeSlider'
import { JobSlider } from '../components/site/slider/JobSlider'
import { NewsSlider } from '../components/site/slider/NewsSlider'
import { ReviewSlider } from '../components/site/slider/ReviewSlider'
import { Wrapper } from '../components/site/wrapper'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en)

const packageCards = [
    {
        name: 'SkilTrak LMS PORTAL',
        tagline: 'Do It Yourself',
        features: [
            'Student Progress Tracking',
            'Mapped WBT assessment tools available',
            'Online appointment booking',
            'Innovative way to track and monitor your work placement units',
            'Stay compliant and liaise directly with Industry partners',
            'SMS/LMS to assist your everyday business needs',
            'Workplaces automatically assigned as per students&apos; location',
            'Video conference with recording available',
        ],
        link: '/contact-us',
    },
    {
        name: 'THE START-UP PACKAGE',
        tagline: 'WE GET IT GOING',
        features: [
            'Skiltrak LMS portal featuring all services',
            'Automated push notifications',
            'Induction class Skiltrak consultant',
            'Chat system',
            'Placement workplace visits',
            'Interview tutorials',
            'Ticket systems',
            'Liaison between students',
            'RTO and industry',
        ],
        link: '/contact-us',
    },
    {
        name: 'THE COMPLETE PACKAGE',
        tagline: 'WE DO IT ALL',
        features: [
            'Skiltrak LMS portal featuring all services',
            'Automated push notifications',
            'Induction class Skiltrak consultant',
            'Chat system',
            'Skiltrak Coordinator assigned to class',
            'Placement workplace visits',
            'Placement observation visits/remote',
            'Interview tutorials',
            'Coaching calls',
            'Ticket systems',
            'Online assessing and learning materials',
            'Student final outcome displayed with feedback',
            'Liaison between students, RTO and industry',
        ],
        link: '/contact-us',
    },
]

// markup
const Page: NextPage = () => {
    const [newsList, setNewsList] = useState(null)
    const [first4News, setFirst4News] = useState<any>(null)
    const [sliderNews, setSliderNews] = useState<any>(null)
    useEffect(() => {
        axios
            .get('https://www.skiltrak.com.au/api/active-news')
            .then((res) => {
                setNewsList(res.data)

                if (res.data.length >= 4) {
                    setFirst4News(res.data.slice(0, 4))
                    setSliderNews(res.data.slice(4, res.data.length))
                }
            })
            .catch((err) => { })
    }, [])

    const showNewsOrLoader = () => {
        if (sliderNews && sliderNews.length > 4)
            return <NewsSlider newsList={sliderNews} />
        else if (sliderNews && sliderNews.length > 0)
            return (
                <div className="flex flex-col md:flex-row w-full md:w-10/12 mx-auto justify-around">
                    {sliderNews.map((news: any, key: number) => (
                        <NewsCard news={news} key={key} />
                    ))}
                </div>
            )
        else
            return (
                <div className="flex flex-col md:flex-row w-full md:w-10/12 mx-auto justify-around">
                    {Array(4)
                        .fill(null)
                        .map((_, key) => (
                            <NewsCard key={key} loader />
                        ))}
                </div>
            )
    }

    const [value, setvalue] = useState(5)

    return (
        <SiteLayout title="Home">
            <HomeSlider />

            <Wrapper sectionName="introduction">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="w-full sm:w-3/5 md:w-2/4">
                        <h2 className="text-theme-secondary text-5xl font-bold">
                            Experience Digitally
                        </h2>
                        <p className="text-theme-primary text-3xl mt-8">
                            SkilTrak&apos;s philosophy is a reflection of the
                            values established by over 15 years of industry
                            experience.
                        </p>
                        <p className="mt-9 text-2xl text-gray-500">
                            These values are simple: we rely on genuine
                            integrity, industry-leading partnership and the
                            highest-quality services to build authentic
                            relationships with our clients.
                        </p>
                        <Button
                            text="Join Now"
                            to={'/contact-us'}
                            asLink
                            className="mt-12"
                            state={{ scorllToForm: true }}
                        />
                    </div>
                    <div className="w-full sm:w-2/5 md:w-2/5 mt-4 md:mt-0 relative">
                        <Image
                            src="/images/site/st_intro.png"
                            alt="Illustration for online education"
                            width={0}
                            height={0}
                            sizes={'100vw'}
                            className="w-full"
                        />
                    </div>
                </div>
            </Wrapper>

            <div
                className="bg-no-repeat bg-cover"
                style={{ backgroundImage: `url('/images/site/bg_orange.png')` }}
            >
                <Wrapper sectionName="packages">
                    <div className="wrapper-text flex ">
                        <div className="heading-wrapper inline-block mx-auto">
                            <h2 className="font-bold uppercase text-xl lg:text-4xl text-white">
                                Packages
                            </h2>
                            <span className="block bg-white w-2/4 h-1.5 mt-4"></span>
                        </div>
                    </div>

                    <div className="flex flex-col flex-wrap md:flex-nowrap md:flex-row md:items-center gap-x-4 justify-center lg:justify-between mt-16">
                        {packageCards.map((packageCard, i) => (
                            <PackageCard
                                key={i}
                                heading={packageCard.name}
                                subheading={packageCard.tagline}
                                features={packageCard.features}
                                link={packageCard.link}
                            />
                        ))}
                    </div>
                </Wrapper>
            </div>

            <Wrapper>
                <div
                    className="heading-wrapper inline-block"
                    data-sal-duration="1000"
                    data-sal-easing="ease"
                >
                    <h2 className="font-bold uppercase text-xl lg:text-4xl">
                        Our Global Community {new Date().getFullYear()}
                    </h2>
                    <span className="block bg-black w-2/4 h-1.5 mt-4"></span>
                </div>

                <div>
                    <div className="grid grid-cols-2 sm:flex sm:justify-around gap-4 mt-16 mb-8">
                        <FigureCard
                            img={'/images/site/figures/ic_students.png'}
                            caption={'Our Students'}
                            figures={'1,813'}
                        />
                        <FigureCard
                            img={'/images/site/figures/ic_globe.png'}
                            caption={'Industry Partners'}
                            figures={'651'}
                        />
                        <FigureCard
                            img={'/images/site/figures/ic_industry.png'}
                            caption={'Employment Awarded'}
                            figures={'261'}
                        />
                        <FigureCard
                            img={'/images/site/figures/ic_awards.png'}
                            caption={'Nationalities'}
                            figures={'23'}
                        />
                    </div>
                </div>
            </Wrapper>

            <div>
                <Wrapper noVerticalPadding>
                    <div className="inline-block">
                        <h2 className="font-bold uppercase text-xl lg:text-4xl">
                            Paid Jobs
                        </h2>
                        <span className="block bg-black w-2/4 h-1.5 mt-4"></span>
                    </div>
                </Wrapper>

                <div className="relative md:-mt-32">
                    <img
                        src={'/images/site/img_sillhoute.png'}
                        className="w-full"
                        alt=""
                    />

                    <div
                        className="
              px-5
              absolute
              -bottom-16
              md:bottom-4
              lg:bottom-4
              w-full
            "
                    >
                        <JobSlider />
                    </div>

                    {/* <div className="nav-left hidden lg:visible">
            <img
              className="absolute -bottom-10 left-0"
              src="./assets/images/img_slider_overlay_mask_l.png"
              alt=""
            />
          </div>

          <div className="nav-right hidden lg:visible">
            <img
              className="absolute -bottom-10 right-0"
              src="./assets/images/img_slider_overlay_mask_r.png"
              alt=""
            />
          </div> */}
                </div>
            </div>

            <section
                className="
          section section-reviews
          bg-gradient-to-b
          from-primary
          to-primary-dark
        "
            >
                <Wrapper>
                    <div
                        className="
                row
                flex flex-col
                lg:flex-row
                justify-between
                items-center
                overflow-hidden
              "
                    >
                        {/* mt-16 */}
                        <div className="w-full lg:w-8/12 md:h-96">
                            <ReviewSlider />
                        </div>

                        <div className="review-pagination flex lg:flex-wrap justify-between content-start lg:w-3/12 md:h-96 overflow-y-auto mt-8 lg:mt-0 gap-y-5"></div>
                    </div>
                </Wrapper>
            </section>

            {/* <Wrapper>
                <div className="heading-wrapper inline-block">
                    <h2 className="font-bold uppercase text-xl lg:text-4xl">
                        News &amp; Events
                    </h2>
                    <span className="block bg-black w-2/4 h-1.5 mt-4"></span>
                </div>

                {first4News && first4News.length > 0 ? (
                    <div
                        className="
              news-headlines-wrapper
              flex flex-col
              lg:flex-row
              justify-between
              w-full
              mt-8
            "
                    >
                        <NewsCard news={first4News[0]} large />

                        <div
                            className="
                news-headline-secondary-wrapper
                flex flex-col
                justify-between
                lg:w-48/100
                w-full
              "
                        >
                            <NewsCard news={first4News[1]} small />
                            <NewsCard news={first4News[2]} small />
                            <NewsCard news={first4News[3]} small />
                        </div>
                    </div>
                ) : (
                    <div
                        className="
                news-headlines-wrapper
                flex flex-col
                lg:flex-row
                justify-between
                w-full
                mt-8
              "
                    >
                        <NewsCard large loader />

                        <div
                            className="
                  news-headline-secondary-wrapper
                  flex flex-col
                  justify-between
                  lg:w-48/100
                  w-full
                "
                        >
                            <NewsCard small loader />
                            <NewsCard small loader />
                            <NewsCard small loader />
                        </div>
                    </div>
                )}
            </Wrapper> */}

            {/* <div className="w-11/12 sm:w-full mx-auto">
              
                {showNewsOrLoader()}
            </div> */}

            <div
                className="bg-no-repeat bg-cover"
                style={{ backgroundImage: `url('/images/bg_orange.png')` }}
            >
                <Wrapper>
                    <div className="heading-wrapper inline-block">
                        <h2 className="font-bold uppercase text-xl lg:text-4xl text-white">
                            Our Partners
                        </h2>
                        <span className="block bg-white w-2/4 h-1.5 mt-4"></span>
                    </div>
                </Wrapper>
            </div>

            <div className="partners">
                <div className="marquee overflow-hidden">
                    <div className="row flex">
                        <Marquee>
                            <img
                                src={'/images/site/partners/p1.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p2.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p3.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p4.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p5.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p6.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p7.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p8.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p9.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p10.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p11.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p12.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p13.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p14.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p15.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p16.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                            <img
                                src={'/images/site/partners/p17.png'}
                                alt=""
                                className="h-32 mr-5"
                            />
                        </Marquee>
                    </div>
                </div>
            </div>

            <Wrapper>
                <section className="section section-faqs">
                    <div className="wrapper">
                        <div className="wrapper-text">
                            <div
                                className="heading-wrapper inline-block"
                                data-sal-duration="1000"
                                data-sal-easing="ease"
                            >
                                <h2 className="font-bold uppercase text-xl lg:text-4xl">
                                    Frequently Asked Questions
                                </h2>
                                <span className="block bg-black w-2/4 h-1.5 mt-4"></span>
                            </div>
                        </div>

                        <div className="wrapper-content mt-8">
                            <div
                                className="
                question-container
                flex flex-col
                lg:flex-row
                flex-wrap
                justify-between
              "
                            >
                                <div className="question-wrapper w-full lg:w-2/5 my-8">
                                    <p className="question font-semibold mb-3">
                                        Q1. Why is Work Placement important?
                                    </p>
                                    <p className="answer">
                                        Placements give students the opportunity
                                        to gain skills specific to their subject
                                        or industry of choice as well as the
                                        employability skills required for
                                        real-life work. It also increases their
                                        knowledge of an industry or sector,
                                        allowing them to make better-informed
                                        decisions about future career choices.
                                        And as this is an accredited unit it
                                        needs to be completed as part of your
                                        Certificate.
                                    </p>
                                </div>

                                <div className="question-wrapper w-full lg:w-2/5 my-8">
                                    <p className="question font-semibold mb-3">
                                        Q2. How long does the Certificate III
                                        (SITHCCC020) work placement take?
                                    </p>
                                    <p className="answer">
                                        It is your responsibility to complete
                                        the Work Placement, we allocate 10 to 12
                                        weeks for completion. A re-enrolment fee
                                        may occur if you do not complete on the
                                        final due date.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Wrapper>
        </SiteLayout>
    )
}

export async function getStaticProps() {
    return {
        props: {
            data: [],
        },
    }
}

export default Page

// import { PhoneInputWithCountry } from '@components'
// import type { NextPage } from 'next'
// import { useRouter } from 'next/router'
// import { useEffect } from 'react'
// import { FormProvider, useForm } from 'react-hook-form'

// import UnderConstruction from './under-construction'

// const Home: NextPage = () => {
//     const router = useRouter()

//     return (
//         <>
//             <UnderConstruction />
//         </>
//     )
// }

// export default Home

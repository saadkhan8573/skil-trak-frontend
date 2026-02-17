import { Typography } from '@components'
import Image from 'next/image'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PackageCard } from './Cards'
import { PackageDetail } from './components'
import { PackageSliderContainer } from './styles'

const packageTypes = {
    PlacementManagement: 'Placement Management Portal',
    StartupPackage: 'The Startup Package',
    CompletePackage: 'The Complete Package',
}

const data = [
    {
        title: packageTypes.PlacementManagement,
        subTitle: 'Do it yourself',
        price: '2',
    },
    {
        title: packageTypes.StartupPackage,
        subTitle: 'We Get It Going',
        price: '08',
    },
    {
        title: packageTypes.CompletePackage,
        subTitle: 'We Do It All',
        price: '111',
    },
]

const OurPackages = () => {
    const [selectedPackage, setSelectedPackage] = useState(data?.[0]?.title)

    const isMobile = useMediaQuery({ maxWidth: 768 })

    return (
        <div className="sticky top-0">
            <div className="py-10 relative z-10">
                <Image
                    src={'/images/site/packages/packagesShadow.png'}
                    alt={'Shadow'}
                    width={0}
                    height={0}
                    sizes={'100vh 100vw'}
                    className="w-full h-full absolute right-0 -z-10"
                    priority
                />
                <div>
                    <Typography variant={isMobile ? 'title' : 'h2'} center bold>
                        Our Packages For Training Organisation
                    </Typography>
                </div>

                <div
                    className="max-w-7xl mx-auto mt-5 grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-4 sticky top-0 px-4 xl:px-0"
                    id={'helloPackages'}
                >
                    <div className="lg:hidden">
                        <PackageSliderContainer className="relative w-full">
                            <Swiper
                                spaceBetween={10}
                                slidesPerGroup={1}
                                slidesPerView={1}
                                loop={true}
                                modules={[Pagination]}
                                pagination={{
                                    clickable: true,
                                }}
                                onSlideChange={(e: any) => {
                                    setSelectedPackage(
                                        data?.[e?.activeIndex]?.title
                                    )
                                }}
                                className="mySwiper"
                            >
                                {data?.map((packageData, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="h-48">
                                            <PackageCard
                                                key={i}
                                                active={
                                                    selectedPackage ===
                                                    packageData?.title
                                                }
                                                packageData={packageData}
                                                packageTypes={packageTypes}
                                                onClick={() => {
                                                    setSelectedPackage(
                                                        packageData?.title
                                                    )
                                                }}
                                                data-package={
                                                    packageData?.title
                                                }
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </PackageSliderContainer>
                    </div>
                    <div className="hidden lg:block">
                        <div className=" flex flex-col justify-between gap-y-4 h-full ">
                            {data?.map((packageData, i) => (
                                <PackageCard
                                    key={i}
                                    active={
                                        selectedPackage === packageData?.title
                                    }
                                    packageData={packageData}
                                    packageTypes={packageTypes}
                                    onClick={() => {
                                        setSelectedPackage(packageData?.title)
                                    }}
                                    data-package={packageData?.title}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <PackageDetail
                            packageTypes={packageTypes}
                            selectedPackage={selectedPackage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OurPackages

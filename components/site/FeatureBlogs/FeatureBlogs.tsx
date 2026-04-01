import { Typography } from '@components/Typography'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { BlogCard } from './card'
import { FeatureBlogContainer } from './style'

const FeatureBlogs = ({ blogs }: { blogs: any }) => {
    const filterFeaturedBlogs = blogs?.filter((item: any) => item?.isFeatured)

    return (
        <div className="w-full max-w-7xl mx-auto py-12">
            <div className="flex justify-between items-center">
                <Typography variant="h2">Featured Blogs</Typography>
                <Link href={'/blogs'} rel="canonical">
                    <Typography bold color={'text-primary'} underline>
                        View All Blogs
                    </Typography>
                </Link>
            </div>

            {/*  */}

            <FeatureBlogContainer className="relative mt-3.5">
                <Swiper
                    breakpoints={{
                        300: {
                            width: 300,
                            slidesPerView: 1,
                        },
                        767: {
                            width: 767,
                            slidesPerView: 2,
                        },
                        1280: {
                            width: 1280,
                            slidesPerView: 3,
                        },
                    }}
                    // slidesPerView={2}
                    spaceBetween={43}
                    slidesPerGroup={3}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {filterFeaturedBlogs?.map((blog: any) => (
                        <SwiperSlide key={blog?.id}>
                            <BlogCard blog={blog} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </FeatureBlogContainer>
        </div>
    )
}

export default FeatureBlogs

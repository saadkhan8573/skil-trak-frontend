import { StarRating, Typography } from '@components'
import Image from 'next/image'
import { CgQuote } from 'react-icons/cg'

{
    /* <Image src={"/images/site/services/industry-services/our-professional-workflow.svg"} alt="" width={800} height={500} className='w-full' />  */
}
export const IndustryServicesTestimonial = () => {
    return (
        <div className="bg-[#9B2000] flex items-center flex-col md:flex-row gap-5 md:gap-2 md:pb-10 md:!pt-20 w-full ">
            <div className="w-full relative z-20">
                <Image
                    width={900}
                    height={860}
                    // sizes="100vw"
                    alt="Testimonial Background"
                    className="w-full"
                    src={
                        '/images/site/services/industry-services/testimonial.png'
                    }
                />
                <div className="inline-flex items-center justify-center ml-10 mt-5 gap-x-4 bg-[#156E9A] rounded-lg  px-4 ">
                    <span className="text-white font-medium ">
                        Review Us On
                    </span>
                    <Image
                        width={350}
                        height={64}
                        // sizes="100vw"
                        alt="Testimonial Background"
                        className="h-16 w-auto"
                        src={
                            '/images/site/services/student-services/student-features/trustpilot-logo.png'
                        }
                    />
                </div>
                <div
                    className="size-80 md:flex justify-end items-end absolute top-60 left-40 -z-10 hidden "
                    style={{
                        borderRadius: '327.5px',
                        background:
                            'linear-gradient(180deg, rgba(249, 163, 7, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%)',
                        filter: 'blur(50px)',
                    }}
                ></div>
            </div>
            <div className="md:flex items-center justify-between block gap-x-14 w-full md:px-0 px-4">
                <div className="md:w-3/5">
                    <div className="md:space-y-6 space-y-4 ">
                        <div className="">
                            <Typography
                                variant="body"
                                color="text-white"
                                medium
                                uppercase
                            >
                                Testimonial
                            </Typography>
                            <div className="">
                                <div className="flex justify-end">
                                    <CgQuote
                                        className="text-primary"
                                        size={45}
                                    />
                                </div>
                                <Typography
                                    variant="h1"
                                    color="text-white"
                                    bold
                                >
                                    Feedbacks That Drive Us Forward
                                </Typography>
                            </div>
                        </div>
                        <Typography variant="body" color='text-white'>
                            SkilTrak stands behind every learner’s success, and
                            their stories speak for themselves. Discover how our
                            learners turned education into measurable progress.
                        </Typography>
                    </div>
                    <div className="flex gap-x-4 items-start mt-10">
                        <div className="bg-white rounded-lg md:py-4 md:px-6 p-4 mb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <Image
                                        width={120}
                                        height={120}
                                        // sizes="100vw"
                                        alt="Testimonial Background"
                                        className=""
                                        src={
                                            '/images/site/services/student-services/student-features/ellipse-1.png'
                                        }
                                    />
                                    <div className="">
                                        <Typography variant="title">
                                            Albert Flores
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            color="text-gray-400"
                                        >
                                            Web Designer
                                        </Typography>
                                        <StarRating
                                            count={5}
                                            value={4.5}
                                            edit={false}
                                            size={18}
                                            activeColor={'#ffd700'}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <CgQuote
                                        className="text-primaryNew"
                                        size={35}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 ml-20">
                                <Typography variant="small">
                                    Penatibus et magnis dis parturient montes,
                                    nascetur ridiculus mus. Ut id lorem ac enim
                                    vestibulum blandit nec sit amet felis. Fusce
                                    quis diam odio. Cras mattis mi quis
                                    tincidunt
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative w-2/5 md:block hidden">
                    <Image
                        width={242}
                        height={560}
                        // sizes="100vw"
                        alt="Testimonial Background"
                        className="h-[560px] w-[242px] object-cover"
                        src={
                            '/images/site/services/student-services/student-features/testimonial-lines.svg'
                        }
                    />
                    <div
                        className="size-80 flex justify-end items-end absolute top-40 right-0"
                        style={{
                            borderRadius: '327.5px',
                            background:
                                'linear-gradient(180deg, rgba(249, 163, 7, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%)',
                            filter: 'blur(50px)',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

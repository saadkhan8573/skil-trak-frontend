import { Appointment } from '@types'
import { useRef, useState, useEffect } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { UpcomingAppointmentCard } from './UpcomingAppointmentCard'
import { HeroSliderContainer } from './style'

export const FutureAppointments = ({
    appointments,
    onAppointmentClicked,
}: {
    appointments: Appointment[]
    onAppointmentClicked?:
        | ((apointment: Appointment) => void | undefined)
        | undefined
}) => {
    const navigationPrevRef = useRef(null)
    const navigationNextRef = useRef(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [iconClasses] = useState(
        'absolute top-1/2 -mt-2 z-10 cursor-pointer bg-white shadow-md rounded-full hover:scale-150 transition-all hover:opacity-100 w-5 h-5 flex justify-center items-center'
    )

    // ✅ Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <HeroSliderContainer className="mt-4 relative">
            <div className="swiper-container w-full relative">
                <Swiper
                    breakpoints={{
                        300: {
                            width: 300,
                            slidesPerView: 1,
                        },
                        992: {
                            width: 992,
                            slidesPerView: 2,
                        },
                    }}
                    // slidesPerView={2}
                    spaceBetween={10}
                    slidesPerGroup={1}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}
                    onSwiper={(swiper: any) => {
                        // Delay execution for the refs to be defined
                        // ✅ Store timeout handle for cleanup
                        timeoutRef.current = setTimeout(() => {
                            // Override prevEl & nextEl now that refs are defined
                            swiper.params.navigation.prevEl =
                                navigationPrevRef.current
                            swiper.params.navigation.nextEl =
                                navigationNextRef.current

                            // Re-init navigation
                            swiper.navigation.destroy()
                            swiper.navigation.init()
                            swiper.navigation.update()
                            // ✅ Clear ref after execution
                            timeoutRef.current = null
                        })
                    }}
                    modules={[Navigation]}
                    className="mySwiper static"
                >
                    {appointments?.map(
                        (appointment: Appointment, index: number) => {
                            return (
                                <SwiperSlide key={appointment.id}>
                                    <UpcomingAppointmentCard
                                        key={index}
                                        totalMinutes={
                                            appointment?.type?.duration
                                        }
                                        type={appointment?.type?.title}
                                        appointment={appointment}
                                        coordinator={appointment?.coordinator}
                                        onAppointmentClicked={
                                            onAppointmentClicked
                                        }
                                    />
                                </SwiperSlide>
                            )
                        }
                    )}
                    <div
                        ref={navigationPrevRef}
                        className={`${iconClasses} left-0 lg:-left-3`}
                    >
                        <MdKeyboardArrowLeft className="text-2xl text-info" />
                    </div>
                    <div
                        ref={navigationNextRef}
                        className={`${iconClasses} right-0 lg:-right-3`}
                    >
                        <MdKeyboardArrowRight className="text-2xl text-info" />
                    </div>
                </Swiper>
            </div>
        </HeroSliderContainer>
    )
}

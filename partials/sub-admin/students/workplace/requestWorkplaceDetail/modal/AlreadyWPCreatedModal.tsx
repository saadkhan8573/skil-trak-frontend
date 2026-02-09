import { GlobalModal, Typography } from '@components'
import { useRouter } from 'next/router'
import { Animations } from '@animations'
import dynamic from 'next/dynamic'

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
})

export const AlreadyWPCreatedModal = () => {
    const router = useRouter()


    return (
        <GlobalModal>
            <div className="max-w-2xl p-5 relative flex flex-col gap-y-2 py-10">
                <div className="flex flex-col gap-y-2 justify-between items-center">
                    <Lottie
                        animationData={Animations.Common.WorkplaceInfo}
                        loop={true}
                        autoplay={true}
                        style={{ height: 180, width: 180 }}
                    />
                    {/* <GiCheckMark className="text-success-dark text-8xl" /> */}
                </div>
                <div>
                    <Typography center>
                        <span className="text-[15px] leading-4 text-center">
                            There are already 2 workplaces created, You cant
                            create more then 2 workplaces
                        </span>
                    </Typography>
                </div>

                <div className="mx-auto mt-5">
                    <div
                        onClick={() => {
                            router.push(
                                `/portals/sub-admin/students/${router.query?.id}/detail`
                            )
                        }}
                        className="cursor-pointer w-40 h-14 flex items-center justify-center text-lg font-medium uppercase transition-all duration-300 border px-4 py-2 shadow focus:outline-none focus:ring-4 rounded-md bg-primary text-white hover:bg-primary-dark border-transparent ring-primary-light"
                    >
                        Go Back
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}

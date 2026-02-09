import { GlobalModal, Typography } from '@components'
import { useRouter } from 'next/router'
import { Animations } from '@animations'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'

import dynamic from 'next/dynamic'

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
})

export const WorkplaceCreatedModal = ({
    onCancel,
}: {
    onCancel?: () => void
}) => {
    const router = useRouter()


    const role = getUserCredentials()?.role
    return (
        <GlobalModal>
            <div className="max-w-2xl p-5 relative flex flex-col gap-y-2 py-10">
                <div className="flex flex-col gap-y-2 justify-between items-center">
                    <Lottie
                        animationData={Animations.Common.Success}
                        loop={true}
                        autoplay={true}
                        style={{ height: 180, width: 180 }}
                    />
                    {/* <GiCheckMark className="text-success-dark text-8xl" /> */}
                    <div className="mx-auto">
                        <Typography center semibold>
                            Workplace Request Successfully Generated
                        </Typography>
                    </div>
                </div>
                <div>
                    <Typography center>
                        <span className="text-[15px] leading-4 text-center">
                            We have successfully processed your workplace
                            request. A case officer will be assigned to your
                            case promptly to assist you further.
                        </span>
                    </Typography>
                </div>

                <div className="mx-auto mt-5">
                    <div
                        onClick={() => {
                            if (role === UserRoles.STUDENT) {
                                router.back()
                            } else {
                                router.push(
                                    `/portals/sub-admin/students/${router.query?.id}/detail`
                                )
                            }
                        }}
                        className="cursor-pointer w-40 h-14 flex items-center justify-center text-lg font-medium uppercase transition-all duration-300 border px-4 py-2 shadow focus:outline-none focus:ring-4 rounded-md bg-success text-white hover:bg-success-dark border-transparent ring-success-light"
                    >
                        OK
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}

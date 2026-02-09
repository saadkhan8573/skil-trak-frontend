// import { GiCardboardBox } from "react-icons/gi";

import { Animations } from '@animations'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
})

interface EmptyDataProps {
    title?: string
    description?: string
    actionLink?: any
    actionText?: string
    height?: string
    imageUrl?: string
}
export const EmptyData = ({
    title,
    description,
    actionLink,
    actionText,
    height,
    imageUrl,
}: EmptyDataProps) => {

    // const Icon = icon || GiCardboardBox;
    return (
        <div
            className="flex justify-center items-center my-10"
            style={{ height: height || '70vh' }}
        >
            <div className="flex flex-col justify-center items-center p-16 rounded-lg">
                {/* <div className="text-gray-500">
					<Icon className="text-6xl" />
				</div> */}
                <div>
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            width={80}
                            height={80}
                            alt={'No Data'}
                        />
                    ) : (
                        <Lottie
                            animationData={Animations.Common.ShakeEmptyBox}
                            loop={true}
                            autoplay={true}
                            style={{ height: 250, width: 250 }}
                        />
                    )}
                </div>

                <p className="text-gray-500 text-md font-bold mt-4">
                    {title || 'It seems your data is empty'}
                </p>
                <p className="text-gray-400">
                    {description ||
                        'It may be due to you have not added any thing yet'}
                </p>
                {actionLink && (
                    <div className="text-sm mt-4">
                        <Link
                            legacyBehavior
                            href={actionLink}
                            className="text-blue-500"
                        >
                            Click Here
                        </Link>
                        {`to ${actionText || 'add now'}`}
                    </div>
                )}
            </div>
        </div>
    )
}

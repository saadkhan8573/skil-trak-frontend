import { Animations } from '@animations'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
})

export const TechnicalError = ({
    title,
    height,
    description = true,
    imageUrl,
}: {
    title?: string
    height?: string
    description?: boolean
    imageUrl?: string
}) => {
    return (
        <div
            className="flex flex-col items-center justify-center w-3/5 mx-auto py-8 rounded-lg my-8"
            style={{ height: height || '70vh' }}
        >
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
                        animationData={Animations.Common.NoConnection}
                        loop={true}
                        autoplay={true}
                        style={{ height: 250, width: 250 }}
                    />
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-500 mb-2">
                {title || 'Something is not right'}
            </h3>
            {description && (
                <>
                    <p className="text-center text-gray-400">
                        Please contact tech team so they can look into it. It
                        will be great if you provide them a screen shot and
                        error description as well.{' '}
                    </p>
                    <p className="text-center mt-3 text-gray-400">
                        Please spare some time and email on following address:
                    </p>
                    <p className="text-blue-500">tech@skiltrak.com.au</p>
                </>
            )}
        </div>
    )
}

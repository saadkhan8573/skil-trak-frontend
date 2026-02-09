import dynamic from 'next/dynamic'

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
})

interface LottieAnimationProps {
    loop?: boolean
    autoplay?: boolean
    animation: any
    height?: number | string
    width?: number | string
}

export const LottieAnimation = ({
    loop = true,
    autoplay = true,
    animation,
    height = 120,
    width = 120,
}: LottieAnimationProps) => {
    return (
        <div style={{ height, width }}>
            <Lottie
                animationData={animation}
                loop={loop}
                autoplay={autoplay}
            />
        </div>
    )
}

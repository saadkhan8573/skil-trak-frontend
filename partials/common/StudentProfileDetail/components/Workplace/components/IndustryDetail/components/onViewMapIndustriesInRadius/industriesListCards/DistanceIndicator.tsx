import { motion } from 'framer-motion'
import { FaUser, FaWalking, FaCar } from 'react-icons/fa'
import { Factory } from 'lucide-react' // Replace with your preferred industry icon
import { FaCarSide } from 'react-icons/fa'

export const DistanceIndicator = ({
    distance,
    mode = 'walking',
    exactDistance,
    duration,
}: {
    distance: number
    mode?: 'walking' | 'car'
    exactDistance?: string | null
    duration?: string | null
}) => {
    const MovingIcon = mode === 'car' ? FaCarSide : FaWalking

    return (
        <div className="flex items-center gap-3 mt-2">
            <FaUser className="text-teal-600" size={15} />

            <div className="relative w-24 h-6 overflow-hidden">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300"></div>

                <motion.div
                    className="absolute left-0 top-0 text-blue-500"
                    // animate={{ x: ["0%", "100%"] }}
                    animate={{ x: [0, 90] }}
                    transition={{
                        repeat: Infinity,
                        duration: mode === 'car' ? 10 : 20,
                        ease: 'linear',
                    }}
                >
                    <MovingIcon size={16} />
                </motion.div>
            </div>

            <Factory className="text-primary" size={20} />
            <div className="flex flex-col">
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                    {exactDistance ? exactDistance : `${distance} km`} away
                </span>
                {duration && (
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {duration} drive
                    </span>
                )}
            </div>
        </div>
    )
}

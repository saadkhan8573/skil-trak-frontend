import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'

interface StarRatingProps {
    value: number
    count?: number
    size?: number
    activeColor?: string
    inactiveColor?: string
    edit?: boolean
    allowHalf?: boolean
    showValue?: boolean
    showTooltip?: boolean
    onChange?: (value: number) => void
    className?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
    value = 0,
    count = 5,
    size = 20,
    activeColor = '#ffd700',
    inactiveColor = '#e4e5e9',
    edit = false,
    allowHalf = true,
    showValue = false,
    showTooltip = true,
    onChange,
    className = '',
}) => {
    const stars = Array.from({ length: count }, (_, i) => i + 1)

    const handleClick = (val: number) => {
        if (edit && onChange) {
            onChange(val)
        }
    }

    const renderStar = (starValue: number, isHalf: boolean) => {
        const starComponent = (
            <div className="relative flex items-center">
                {/* Star Icon Display */}
                <div className="flex items-center">
                    {starValue <= value ? (
                        <FaStar size={size} color={activeColor} />
                    ) : (starValue - 0.5 <= value) ? (
                        <FaStarHalfAlt size={size} color={activeColor} />
                    ) : (
                        <FaRegStar size={size} color={inactiveColor} />
                    )}
                </div>

                {/* Interaction Zones (Overlays) */}
                {edit && (
                    <div className="absolute inset-0 flex cursor-pointer">
                        {allowHalf ? (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="w-1/2 h-full"
                                            onClick={() => handleClick(starValue - 0.5)}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>{starValue - 0.5}</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="w-1/2 h-full"
                                            onClick={() => handleClick(starValue)}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>{starValue}</TooltipContent>
                                </Tooltip>
                            </>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="w-full h-full"
                                        onClick={() => handleClick(starValue)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>{starValue}</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        )

        if (!edit && showTooltip) {
            return (
                <Tooltip key={starValue}>
                    <TooltipTrigger asChild>{starComponent}</TooltipTrigger>
                    <TooltipContent>{starValue}</TooltipContent>
                </Tooltip>
            )
        }

        return <React.Fragment key={starValue}>{starComponent}</React.Fragment>
    }

    return (
        <TooltipProvider>
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="flex items-center gap-1">
                    {stars.map((star) => renderStar(star, false))}
                </div>
                {(showValue || edit) && (
                    <span className="text-sm font-semibold text-gray-600">
                        {value?.toFixed(1)}
                    </span>
                )}
            </div>
        </TooltipProvider>
    )
}

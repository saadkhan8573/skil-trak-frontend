import React from 'react'

export interface BlurOverlayProps {
    width?: number | string
    height?: number | string
    blurAmount?: number
    className?: string
    children?: React.ReactNode
}

export const BlurOverlay: React.FC<BlurOverlayProps> = ({
    width = '200px',
    height = '30px',
    className = '',
}) => {
    const widthValue = width
    const heightValue = height

    return (
        <div
            className={`blur-sm bg-gray-400/60 ${className}`}
            style={{
                width: widthValue,
                height: heightValue,
            }}
        ></div>
    )
}

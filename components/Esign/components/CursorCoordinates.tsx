import { useEffect, useState } from 'react'

export const CursorCoordinates = ({
    element,
    setTabDropCoordinates,
    viewport,
}: {
    viewport: any
    setTabDropCoordinates: (coordinates: {
        x: number
        y: number
        viewPortData: string[]
    }) => void
    element: any
}) => {
    const [viewPortData, setViewPortData] = useState<string[]>([])
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 })
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        if (viewport) {
            setViewPortData(viewport?.split(' '))
        }
    }, [viewport])

    const [a, b, width, height] = viewPortData

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        const handleWindowMouseMove = (event: any) => {
            const clientRect = element.getBoundingClientRect()

            const clientX = event.clientX - clientRect.x
            const clientY = event.clientY - clientRect.y

            // setCoords({
            //     x: clientX * (842.04 / clientRect.width),
            //     y: clientY * (596.96 / clientRect.height),
            // })

            setCoords({
                x: clientX * (Number(width) / clientRect.width),
                y: clientY * (Number(height) / clientRect.height),
            })

            if (width && height) {
                const tabX = clientX * (Number(width) / clientRect.width)
                const tabY = clientY * (Number(height) / clientRect.height)
                if (tabX >= 0 && tabY >= 0) {
                    setTabDropCoordinates({
                        x: tabX,
                        y: tabY,
                        viewPortData,
                    })
                }
            }

            setCursorCoords({
                x: clientX,
                y: clientY,
            })
        }
        window.addEventListener('mousemove', handleWindowMouseMove)
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [width, height])

    return (
        <div
            className={`absolute bg-gray-100 shadow rounded text-gray-800 text-[11px] z-999`}
            style={{
                top: `${cursorCoords.y + 10}px`,
                left: `${cursorCoords.x + 10}px`,
            }}
        >
            {/* [{coords.x.toFixed(2)}, {coords.y.toFixed(2)}] */}
        </div>
    )
}

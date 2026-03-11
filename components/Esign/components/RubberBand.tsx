import { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'

interface RubberBandProps {
    item: any
    onResize: Function
    onResized: Function
    checkBox: boolean
    radio?: boolean
}

export const RubberBand = ({
    item,
    onResize,
    onResized,
    checkBox,
    radio,
}: RubberBandProps) => {
    const isFixed = checkBox || radio
    const { width: w, height: h } = item.size

    const circleStyle = {
        stroke: 'blue',
        strokeWidth: '2',
        fill: 'white',
    }
    const circleRadius = 3

    const onMouseDown =
        useCallback((): React.MouseEventHandler<HTMLDivElement> => {
            let start = { x: 0, y: 0 }
            const onMouseMove = (e: MouseEvent) => {
                const newOffset = {
                    x: e.clientX - start.x,
                    y: e.clientY - start.y,
                }

                const newSize = {
                    width: w + newOffset.x,
                    height: h + newOffset.y,
                }

                onResize({
                    item,
                    x: e.clientX,
                    y: e.clientY,
                    corner: 'br',
                    newSize,
                })
            }

            const onMouseUp = () => {
                try {
                    onResized({
                        item,
                        corner: 'br',
                    })
                    document.removeEventListener('mousemove', onMouseMove)
                    document.removeEventListener('mouseup', onMouseUp)
                } catch (err) {
                    console.error(err)
                }
            }

            return (e) => {
                e.stopPropagation()
                start.x = e.pageX
                start.y = e.pageY
                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
            }
        }, [])

    return (
        <g>
            <rect
                width={isFixed ? '13' : w}
                height={isFixed ? '13' : h}
                style={{ stroke: 'blue', fillOpacity: '0' }}
            />
            {/* Bottom Right */}

            <circle
                cx={isFixed ? '13' : w}
                cy={isFixed ? '13' : h}
                r={circleRadius}
                style={circleStyle}
                cursor={'nwse-resize'}
                onMouseDown={onMouseDown() as any}
            />

            {/* Top Right */}
            {/* <circle
				cx={w}
				cy={0}
				r={circleRadius}
				style={circleStyle}
				cursor={"nesw-resize"}
			/> */}

            {/* Bottom Left */}
            {/* <circle
				cx={0}
				cy={h}
				r={circleRadius}
				style={circleStyle}
				cursor={"nesw-resize"}
			/> */}

            {/* Top Left */}
            {/* <circle
				cx={0}
				cy={0}
				r={circleRadius}
				style={circleStyle}
				cursor={"nwse-resize"}
			/> */}
        </g>
    )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { DraggableTab } from './DraggableTab'

import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import { Waypoint } from 'react-waypoint'
import { CursorCoordinates } from './CursorCoordinates'

const DynamicSvgLoader = ({
    items,
    tabsError,
    size,
    page,
    onItemSelected,
    onItemMove,
    onItemLocationChanged,
    onItemResize,
    onItemResized,
    onItemRemove,
    pageNumber,
    setTabDropCoordinates,
}: {
    tabsError: any
    size: any
    pageNumber: number
    setTabDropCoordinates: (coordinates: { x: number; y: number }) => void
    items: any
    // path: string
    page: number
    onItemSelected: any
    onItemMove: any
    onItemLocationChanged: any
    onItemResize: any
    onItemResized: any
    onItemRemove: any
}) => {
    const router = useRouter()

    const [svgContent, setSvgContent] = useState('')
    const [submitError, setSubmitError] = useState<any>(null)
    const [viewport, setViewport] = useState<string | null>('')
    const [width, setWidth] = useState<string | null>('')
    const [height, setHeight] = useState<string | null>('')
    const [timerId, setTimerId] = useState<any>(null)
    const [loadSvg, setLoadSvg] = useState(false)

    const template = CommonApi.ESign.useEsignTemplate(
        { id: Number(router.query?.id), pageNumber: pageNumber - 1 },
        {
            skip: !router.query?.id || !loadSvg,
            // refetchOnMountOrArgChange: true,
        }
    )

    const path = template?.data?.data?.[0]

    const pageItems = items.filter((item: any) => item.page === pageNumber - 1)

    useEffect(() => {
        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    }, [timerId])

    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await fetch(path) // Adjust the path based on your setup
                const svgText = await response.text()
                setSvgContent(svgText)
            } catch (error) {}
        }

        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(path, 'image/svg+xml')

        const root = xmlDoc.documentElement
        const svgViewport = root.getAttribute('viewBox')
        const svgWidth = root.getAttribute('width')
        const svgHeight = root.getAttribute('height')

        setViewport(svgViewport)
        setWidth(svgWidth)
        setHeight(svgHeight)

        if (!svgContent) {
            setSvgContent(
                path
                    ?.replace(/width="([\d.]+)pt"/, 'width="$1"')
                    .replace(/height="([\d.]+)pt"/, 'height="$1"')
            )
        }
    }, [path])

    const handleSvgClick = (event: any) => {
        const dataViewName = event.target.getAttribute('data-view-name')
        if (dataViewName !== 'tab') onItemSelected(null, false)
    }

    const id = `drop-target-${pageNumber}`
    const { setNodeRef } = useDroppable({
        id: pageNumber - 1,
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { delay: 5, tolerance: 5 },
        }),
        useSensor(KeyboardSensor, {})
    )

    const dimensionRef = useRef<any>(null)

    const handleEnter = () => {
        if (timerId) {
            clearTimeout(timerId)
        }

        // Set a timeout to make the API call after 1 second of inactivity
        const id = setTimeout(() => {
            setLoadSvg(true)
        }, 1000)

        setTimerId(id)
    }

    return (
        <>
            <Waypoint
                onEnter={handleEnter}
                onLeave={() => {
                    setLoadSvg(false)
                    if (timerId) {
                        clearTimeout(timerId)
                    }
                }}
            >
                <div>
                    {template?.data ? (
                        <div>
                            {submitError && (
                                <ShowErrorNotifications
                                    result={{
                                        isError: true,
                                        error: submitError,
                                    }}
                                />
                            )}

                            <div ref={dimensionRef} className="relative">
                                {dimensionRef.current && (
                                    <CursorCoordinates
                                        viewport={viewport}
                                        element={dimensionRef.current}
                                        setTabDropCoordinates={
                                            setTabDropCoordinates
                                        }
                                    />
                                )}
                                <DndContext
                                    sensors={sensors}
                                    onDragEnd={(data) => {
                                        onItemLocationChanged(data)
                                    }}
                                    onDragMove={(data) => {
                                        onItemMove(data)
                                    }}
                                >
                                    <div
                                        ref={setNodeRef}
                                        className="w-full mx-auto"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            // width="596"
                                            width="100%"
                                            // height="842"
                                            height="100%"
                                            viewBox={String(viewport)}
                                            // dangerouslySetInnerHTML={{ __html: svgContent }}
                                            onClick={handleSvgClick}
                                        >
                                            <g>
                                                {/* <g
                            dangerouslySetInnerHTML={{
                                __html: svgContent,
                            }}
                        /> */}

                                                <image
                                                    href={`data:image/svg+xml,${encodeURIComponent(
                                                        svgContent
                                                    )}`}
                                                />

                                                {pageItems &&
                                                    pageItems.map(
                                                        (
                                                            item: any,
                                                            i: number
                                                        ) => (
                                                            <DraggableTab
                                                                item={item}
                                                                key={i}
                                                                viewport={
                                                                    viewport
                                                                }
                                                                onResize={
                                                                    onItemResize
                                                                }
                                                                onResized={
                                                                    onItemResized
                                                                }
                                                                onItemSelected={
                                                                    onItemSelected
                                                                }
                                                                onRemove={
                                                                    onItemRemove
                                                                }
                                                                tabsError={
                                                                    tabsError
                                                                }
                                                            ></DraggableTab>
                                                        )
                                                    )}
                                            </g>
                                        </svg>
                                    </div>
                                </DndContext>
                            </div>
                        </div>
                    ) : (
                        <Skeleton
                            className="w-full rounded-lg z-10"
                            style={{
                                height: `${size?.height}px`,
                            }}
                        />
                    )}
                </div>
            </Waypoint>
        </>
    )
}

export default DynamicSvgLoader

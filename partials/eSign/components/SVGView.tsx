import { Button, TechnicalError } from '@components'
import { MediaQueries } from '@constants'
import { CommonApi } from '@queries'
import { isBrowser } from '@utils'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import { useMediaQuery } from 'react-responsive'
import { Waypoint } from 'react-waypoint'
import { FinishDocumentModal } from './FinishDocumentModal'
import { TabsView } from './TabsView/TabsView'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'

export const SVGView = ({
    scrollToPage,
    sortedPositions,
    index,
    documentData,
    customFieldsData,
    onSignatureClicked,
    isLastSelected,
    onAddCustomFieldsData,
    onDocumentScrollArrow,
    selectedFillDataField,
    customFieldsSelectedId,
    customFieldsAndSign,
    setIsDocumentLoaded,
    onFinishSignModal,
    onGoToSignFieldIfRemaining,
    onCancelFinishSign,
}: {
    onCancelFinishSign: () => void
    isLastSelected: boolean
    onGoToSignFieldIfRemaining: any
    scrollToPage: any
    sortedPositions: any
    onDocumentScrollArrow: () => void
    customFieldsAndSign: any
    customFieldsSelectedId: number
    index: number
    onFinishSignModal: any
    documentData: any
    customFieldsData: any
    setIsDocumentLoaded: any
    onSignatureClicked: any
    onAddCustomFieldsData: any
    selectedFillDataField?: any
}) => {
    const router = useRouter()
    const [viewport, setViewport] = useState<string | null>('')
    const [showEndDocument, setShowEndDocument] = useState(true)

    const isMobile = useMediaQuery(MediaQueries.Tablet)

    const ref = useRef<any>(null)

    const [loadSvg, setLoadSvg] = useState(false)

    const documentSvgData = CommonApi.ESign.useTemplateDocumentForSign(
        { id: Number(router.query?.id), pageNumber: index },
        {
            skip: !router?.query?.id,
        }
    )

    const doc = documentSvgData?.data?.data

    const handleFocus = () => {
        if (documentSvgData?.isSuccess && doc) {
            if (isBrowser()) {
                const inputElement = document?.getElementById(
                    `tabs-view-${sortedPositions?.[customFieldsSelectedId]?.id}`
                ) as HTMLInputElement | null

                if (inputElement && !isLastSelected) {
                    inputElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    })
                    setTimeout(() => {
                        inputElement.focus()
                    }, 400)
                }
            }
        }
    }

    useEffect(() => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(doc, 'image/svg+xml')

        const root = xmlDoc.documentElement
        const svgViewport = root.getAttribute('viewBox')

        setViewport(svgViewport)
    }, [doc])

    useEffect(() => {
        if (
            sortedPositions &&
            sortedPositions?.length > 0 &&
            sortedPositions?.[0]?.number === index + 1
        ) {
            if (setIsDocumentLoaded) {
                setIsDocumentLoaded(documentSvgData)
            }
        }
    }, [doc, index])

    const [timerId, setTimerId] = useState<any>(null)

    useEffect(() => {
        // Clear the timeout when the component unmounts or when currentPage changes
        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    }, [timerId])

    const handleEnter = () => {
        if (timerId) {
            clearTimeout(timerId)
        }

        // Set a timeout to make the API call after 1 second of inactivity
        const id = setTimeout(() => {
            setLoadSvg(true)
        }, 500)

        setTimerId(id)
    }

    const remainingFields = sortedPositions?.filter(
        (field: any) => !field?.fieldValue && field?.required
    )

    const onHandleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onDocumentScrollArrow()
        }
    }

    const position =
        sortedPositions?.[customFieldsSelectedId]?.position?.split(',')?.[0]

    return (
        <>
            {documentSvgData.isError && (
                <Button
                    text={'Refetch'}
                    variant={'action'}
                    onClick={() => {
                        documentSvgData?.refetch()
                    }}
                />
            )}
            <Waypoint
                onEnter={handleEnter}
                onLeave={() => {
                    setLoadSvg(false)
                    if (timerId) {
                        clearTimeout(timerId)
                    }
                }}
            >
                <div className="relative">
                    {documentSvgData?.isSuccess &&
                    index === documentData?.pageCount - 1 &&
                    (customFieldsSelectedId >= sortedPositions?.length - 1 ||
                        customFieldsSelectedId <= 0) &&
                    showEndDocument &&
                    isLastSelected ? (
                        <FinishDocumentModal
                            customFieldsData={customFieldsData}
                            onCancelFinishSign={onCancelFinishSign}
                            onFinishSignModal={onFinishSignModal}
                            onGoToSignFieldIfRemaining={
                                onGoToSignFieldIfRemaining
                            }
                            remainingFields={remainingFields}
                        />
                    ) : null}
                    {documentSvgData.isError && <TechnicalError />}
                    {documentSvgData?.data ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            // width="596"
                            width="100%"
                            // height="842"
                            height="100%"
                            viewBox={viewport || '0 0 596 842'}
                            // dangerouslySetInnerHTML={{ __html: svgContent }}
                            // onClick={handleSvgClick}
                        >
                            <g>
                                {/* <g
dangerouslySetInnerHTML={{
__html: svgContent,
}}
/> */}
                                <image
                                    className="w-full "
                                    href={`data:image/svg+xml,${encodeURIComponent(
                                        doc
                                            ?.replace(
                                                /width="([\d.]+)pt"/,
                                                'width="$1"'
                                            )
                                            .replace(
                                                /height="([\d.]+)pt"/,
                                                'height="$1"'
                                            )
                                    )}`}
                                />

                                {/* <foreignObject
                                    x={-1}
                                    y={
                                        customFieldsSelectedId >= 0
                                            ? Number(
                                                  customFieldsAndSign?.[
                                                      customFieldsSelectedId
                                                  ]?.position?.split(',')?.[1]
                                              )
                                            : 0
                                    }
                                    width={100}
                                    height={100}
                                ></foreignObject> */}

                                <TabsView
                                    index={index}
                                    customFieldsData={customFieldsData}
                                    onSignatureClicked={onSignatureClicked}
                                    onAddCustomFieldsData={
                                        onAddCustomFieldsData
                                    }
                                    selectedFillDataField={
                                        selectedFillDataField
                                    }
                                    onHandleKeyDown={onHandleKeyDown}
                                />
                            </g>
                        </svg>
                    ) : (
                        !documentSvgData.isError && (
                            <div className="relative w-full">
                                <Skeleton
                                    className="w-full rounded-lg"
                                    style={{
                                        height: 'auto',
                                        aspectRatio: `${documentData?.size?.width || 596} / ${documentData?.size?.height || 842}`,
                                    }}
                                />
                                <div className="absolute top-5 left-0 z-10 flex justify-center w-full">
                                    <p className="text-2xl md:text-4xl lg:text-7xl font-bold text-center text-gray-300">
                                        Loading...
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </Waypoint>
        </>
    )
}

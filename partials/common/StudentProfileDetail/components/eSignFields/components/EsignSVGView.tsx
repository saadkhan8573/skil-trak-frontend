import { Button, TechnicalError } from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { MediaQueries } from '@constants'
import { DocumentScrollArrow } from '@partials/eSign'
import { CommonApi } from '@queries'
import { isBrowser } from '@utils'
import { useRouter } from 'next/router'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useMediaQuery } from 'react-responsive'
import { Waypoint } from 'react-waypoint'
import { EsignTabsView } from './EsignTabsView'

export const EsignSVGView = ({
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
    documentId,
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
    documentId: number
}) => {
    const router = useRouter()
    const [viewport, setViewport] = useState<string | null>('')
    const [showEndDocument, setShowEndDocument] = useState(true)
    const [showStartDocument, setShowStartDocument] = useState<boolean>(true)

    const isMobile = useMediaQuery(MediaQueries.Tablet)

    const ref = useRef<any>(null)

    const [loadSvg, setLoadSvg] = useState(false)

    const [x, y, width, height] = viewport?.split(' ') || []

    const documentSvgData = CommonApi.ESign.useTemplateDocumentForSign(
        { id: Number(documentId), pageNumber: index },
        {
            skip: !documentId || !loadSvg,
        }
    )

    const doc = documentSvgData?.data?.data

    useEffect(() => {
        if (customFieldsSelectedId < sortedPositions?.length) {
            scrollToPage(
                Number(sortedPositions?.[customFieldsSelectedId]?.id),
                sortedPositions?.[customFieldsSelectedId]?.number - 1
            )
        }
    }, [
        customFieldsSelectedId,
        customFieldsSelectedId < sortedPositions?.length - 1 ? doc : null,
    ])

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
        handleFocus()
    }, [customFieldsSelectedId, documentSvgData])

    useEffect(() => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(doc, 'image/svg+xml')

        const root = xmlDoc.documentElement
        const svgViewport = root.getAttribute('viewBox')

        setViewport(svgViewport)
    }, [doc])

    useEffect(() => {
        const signData = customFieldsData?.filter(
            (a: any) =>
                a?.type === FieldsTypeEnum.Signature && !a?.responses?.length
        )

        if (
            sortedPositions &&
            sortedPositions?.length > 0 &&
            sortedPositions?.[0]?.number === index + 1
        ) {
            if (setIsDocumentLoaded) {
                setIsDocumentLoaded(documentSvgData)
            }
        }
    }, [doc, index, customFieldsData])

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
        }, 1000)

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
                    {((sortedPositions &&
                        sortedPositions?.[customFieldsSelectedId]?.number -
                        1 ===
                        index) ||
                        customFieldsSelectedId === -1) && (
                            <div
                                className={` absolute lg:-left-24 z-111 ${customFieldsSelectedId < 0 ? 'rotate-90' : ''
                                    } transition-all duration-500`}
                                style={{
                                    top:
                                        customFieldsSelectedId >= 0
                                            ? `${(Number(
                                                sortedPositions?.[
                                                    customFieldsSelectedId
                                                ]?.position?.split(',')?.[1]
                                            ) *
                                                100) /
                                            Number(height)
                                            }%`
                                            : 0,
                                    ...(isMobile
                                        ? {
                                            left:
                                                (Number(position) /
                                                    Number(width)) *
                                                100,
                                        }
                                        : {}),
                                }}
                                onClick={() => {
                                    onDocumentScrollArrow()
                                }}
                            >
                                <DocumentScrollArrow />
                            </div>
                        )}

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

                                <EsignTabsView
                                    index={index}
                                    customFieldsData={customFieldsData}
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
                                        height: `${documentData?.size?.height}px`,
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

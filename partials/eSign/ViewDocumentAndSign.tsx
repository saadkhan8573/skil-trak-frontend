import {
    EmptyData,
    GlobalModal,
    LoadingAnimation,
    TechnicalError,
} from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { CommonApi } from '@queries'
import { checkJsxVisibility, getUserCredentials } from '@utils'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { useRouter } from 'next/router'
import { Activity, ReactNode, useCallback, useEffect, useState } from 'react'
import { IoMdArrowDropleftCircle } from 'react-icons/io'
import { UserRoles } from '@constants'
import {
    DownloadEsignDocument,
    EsignHeader,
    EsignRightSidebar,
    FinishDocumentModal,
    SVGView,
} from './components'
import { EsignSignatureModal, FinishSignModal } from './modal'

export const ViewDocumentAndSign = () => {
    const router = useRouter()

    const [showSignersField, setShowSignersField] = useState<boolean>(true)

    const [modal, setModal] = useState<ReactNode | null>(null)
    const [selectedSign, setSelectedSign] = useState<ReactNode | null>(null)
    const [isSignature, setIsSignature] = useState<boolean>(false)
    const [customFieldsData, setCustomFieldsData] = useState<any>([])
    const [isDocumentLoaded, setIsDocumentLoaded] = useState<any>(null)
    const [isLastSelected, setIsLastSelected] = useState<boolean>(false)
    const [isFillRequiredFields, setIsFillRequiredFields] =
        useState<boolean>(false)
    const [customFieldsDataUpdated, setCustomFieldsDataUpdated] =
        useState<boolean>(false)
    const [customFieldsSelectedId, setCustomFieldsSelectedId] =
        useState<number>(-1)
    const [selectedFillDataField, setSelectedFillDataField] =
        useState<any>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [zoom, setZoom] = useState<number>(100)

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70))

    const role = getUserCredentials()?.role

    const documentsTotalPages = CommonApi.ESign.useGetDocumentTotalPages(
        Number(router.query?.id),
        {
            skip: !router.query?.id,
        }
    )

    const documentDetail = CommonApi.ESign.useGetEsignDocumentDetail(
        Number(router.query?.id),
        {
            skip: !router.query?.id,
        }
    )

    const tabs = CommonApi.ESign.useSignatureTabForTemplate(
        {
            template: documentsTotalPages?.data?.templateId,
            docId: Number(router.query?.id),
        },
        {
            skip: !documentsTotalPages?.data || !router.query?.id,
            refetchOnMountOrArgChange: true,
        }
    )

    // useEffect(() => {
    //     if (tabs?.data && tabs?.data?.length > 0) {
    //         if (!alerts?.length) {
    //             alert.warning({
    //                 title: 'Make a Sign first',
    //                 description:
    //                     'Please sign the document first, then fill in the required fields. Finally, complete the e-signature process by clicking button.',
    //                 autoDismiss: false,
    //             })
    //         }
    //     }
    //     return () => {
    //         setAlerts([])
    //     }
    // }, [tabs])

    const scrollToPage = (
        tabId: number,
        pageIndex: number,
        block?: ScrollLogicalPosition
    ) => {
        setCurrentPage(pageIndex + 1)
        if (tabId !== -1) {
            setTimeout(() => {
                const detailItem = document.getElementById(`tabs-view-${tabId}`)
                if (detailItem) {
                    detailItem.scrollIntoView({
                        behavior: 'smooth',
                        block: block || 'center',
                    })
                }
            }, 500)
        }
    }

    useEffect(() => {
        if (tabs.isLoading || tabs.isFetching || tabs.isError) {
            setCustomFieldsDataUpdated(false)
        } else if (tabs?.data && tabs.isSuccess && tabs?.data?.length > 0) {
            setCustomFieldsDataUpdated(true)
            setCustomFieldsData(
                tabs?.data?.map((tab: any) => {
                    const response = tab?.responses?.reduce(
                        (accumulator: any, current: any) => {
                            // Convert timestamps to Date objects for comparison
                            const accumulatorDate = new Date(
                                accumulator.updatedAt
                            )
                            const currentDate = new Date(current.updatedAt)

                            // Return the item with the later updatedAt timestamp
                            return currentDate > accumulatorDate
                                ? current
                                : accumulator
                        },
                        tab?.responses[0]
                    )

                    const fieldValue =
                        tab?.columnName === FieldsTypeEnum.Signature
                            ? response?.signature
                            : response?.data
                    return {
                        ...tab,
                        fieldValue,
                    }
                })
            )
        }
    }, [tabs])

    const onAddCustomFieldsData = (e: any) => {
        const updatedData = customFieldsData?.map((data: any) => {
            if (data?.id === e?.id) return e

            // If the incoming change is a radio selection, deselect all siblings in the same group
            if (
                e?.type === FieldsTypeEnum.Radio &&
                e?.fieldValue &&
                data?.type === FieldsTypeEnum.Radio &&
                data?.columnName === e?.columnName
            ) {
                return { ...data, fieldValue: false }
            }

            return data
        })
        setCustomFieldsData(updatedData)
    }

    const sign = customFieldsData?.find(
        (s: any) => s?.type === FieldsTypeEnum.Signature
    )
    // const sign = tabs?.data?.find(
    //     (s: any) => s?.type === FieldsTypeEnum.Signature
    // )

    const onCancelClicked = () => {
        setIsSignature(false)
        setModal(null)
        setSelectedSign(null)
    }
    const onSignatureCancelClicked = (cancel?: boolean, isSigned?: boolean) => {
        if (isSigned) {
            const fieldData = sortedPositions?.[customFieldsSelectedId + 1]
            const isSign = fieldData?.type === FieldsTypeEnum.Signature
            // if (isSign) {
            //     setTimeout(() => {
            //         setIsSignature(true)
            //         setSelectedSign(fieldData)
            //     }, 500)
            // }
        }
        if (cancel) {
            setIsSignature(false)
        } else {
            if (tabs?.data && tabs.isSuccess && tabs?.data?.length > 0) {
                // setTimeout(() => {
                //     setModal(
                //         <FinishShignInfoModal
                //             onCancel={onCancelClicked}
                //             customFieldsData={customFieldsData}
                //         />
                //     )
                // }, 1000)

                if (
                    !customFieldsData?.filter((c: any) => c?.isCustom)?.length
                ) {
                    setIsLastSelected(true)
                }
                setIsSignature(false)
                setIsDocumentLoaded(null)
                // onDocumentScrollArrow()
            }
        }
    }

    const onSelectAll = useCallback((e: any) => {
        setCustomFieldsData((customFields: any) =>
            customFields?.map((data: any) =>
                data?.type === FieldsTypeEnum.Checkbox
                    ? {
                          ...data,
                          fieldValue: e.target.checked,
                      }
                    : data
            )
        )
    }, [])

    const onFinishSignModal = () => {
        // For radio buttons, group them by columnName — if at least one in the
        // group is checked, the whole group is considered satisfied.
        const satisfiedRadioGroups = new Set(
            customFieldsData
                ?.filter(
                    (data: any) =>
                        data?.type === FieldsTypeEnum.Radio && data?.fieldValue
                )
                ?.map((data: any) => data?.columnName)
        )

        const customValues = customFieldsData?.filter((data: any) => {
            if (!data?.isCustom || !data?.required || data?.fieldValue)
                return false
            // For radio buttons, skip if the group has a selection
            if (
                data?.type === FieldsTypeEnum.Radio &&
                satisfiedRadioGroups.has(data?.columnName)
            )
                return false
            return true
        })

        const remainingFields = sortedPositions?.filter((field: any) => {
            if (!field?.fieldValue && field?.required) {
                // For radio groups, skip if any sibling in the group is selected
                if (field?.type === FieldsTypeEnum.Radio) {
                    return !sortedPositions?.some(
                        (other: any) =>
                            other?.type === FieldsTypeEnum.Radio &&
                            other?.columnName === field?.columnName &&
                            other?.fieldValue
                    )
                }
                return true
            }
            return false
        })

        if (
            customFieldsData
                ?.filter((s: any) => s?.type === FieldsTypeEnum.Signature)
                ?.filter((s: any) => !s?.fieldValue)?.length > 0 ||
            (customValues && customValues?.length > 0)
        ) {
            setModal(
                <GlobalModal>
                    <FinishDocumentModal
                        customFieldsData={customFieldsData}
                        onCancelFinishSign={() => {
                            setModal(null)
                            onCancelFinishSign()
                        }}
                        onFinishSignModal={onFinishSignModal}
                        onGoToSignFieldIfRemaining={(e: any) => {
                            onGoToSignFieldIfRemaining(e)
                            setModal(null)
                        }}
                        remainingFields={remainingFields}
                        asModal
                    />
                </GlobalModal>
            )
        } else {
            setModal(
                <FinishSignModal
                    onCancel={onCancelClicked}
                    customFieldsData={customFieldsData}
                />
            )
        }
    }

    const onSignatureClicked = (sign: any) => {
        setIsSignature(true)
        setSelectedSign(sign)
        // setModal(
        //     <EsignSignatureModal
        //         tab={sign}
        //         onCancel={() => {
        //             onSignatureCancelClicked()
        //         }}
        //         customFieldsData={customFieldsData}
        //     />
        // )
    }

    const customFieldsAndSign = customFieldsData?.filter(
        (s: any) => s?.type === FieldsTypeEnum.Signature || s?.isCustom
    )

    const extractAndConvert = (position: string) => {
        const [x, y] = position.split(',').map(parseFloat)
        return y
    }

    // Function to add the number with position
    const addNumberWithPosition = (item: any) => {
        const number = item.number
        const position = item.position
        const sum = extractAndConvert(position)
        return {
            ...item,
            number,
            position,
            sum,
        }
    }

    // Adding number with position and sorting in ascending order based on sum

    const processedItems = customFieldsAndSign
        .map(addNumberWithPosition)
        ?.filter((sign: any) => {
            // For radio groups: if ANY radio in the same group has a response, hide all of them
            if (sign?.type === FieldsTypeEnum.Radio) {
                const groupHasResponse = customFieldsAndSign?.some(
                    (other: any) =>
                        other?.type === FieldsTypeEnum.Radio &&
                        other?.columnName === sign?.columnName &&
                        other?.responses?.length > 0
                )
                if (groupHasResponse) return false
            }

            const latestResponse = sign?.responses?.reduce(
                (accumulator: any, current: any) => {
                    const accumulatorDate = new Date(accumulator.updatedAt)
                    const currentDate = new Date(current.updatedAt)
                    return currentDate > accumulatorDate ? current : accumulator
                },
                sign?.responses[0]
            )

            if (!sign?.responses?.length) {
                return sign
            } else if (latestResponse?.reSignRequested) {
                return sign
            }
        })

    const sortedPositions = processedItems.sort((a: any, b: any) => {
        // First, prioritize 'signature' type
        // if (
        //     a.type === FieldsTypeEnum.Signature &&
        //     b.type !== FieldsTypeEnum.Signature
        // ) {
        //     return -1
        // }
        // if (
        //     a.type !== FieldsTypeEnum.Signature &&
        //     b.type === FieldsTypeEnum.Signature
        // ) {
        //     return 1
        // }
        // Then, sort by number in ascending order
        if (a.number !== b.number) {
            return a.number - b.number
        }
        // If numbers are equal, sort by sum of position values
        return a.sum - b.sum
    })

    useEffect(() => {
        if (
            customFieldsSelectedId >= sortedPositions?.length ||
            customFieldsSelectedId < 0 ||
            isLastSelected
        ) {
            setSelectedFillDataField(sortedPositions?.[0]?.id)
            scrollToPage(
                -1,
                (documentsTotalPages?.data?.pageCount || 1) - 1,
                'end'
            )
        }
    }, [customFieldsSelectedId])

    const onDocumentScrollArrow = () => {
        if (customFieldsSelectedId < sortedPositions?.length - 1) {
            const fieldData = sortedPositions?.[customFieldsSelectedId + 1]

            const isFieldValue =
                sortedPositions?.[customFieldsSelectedId]?.fieldValue

            if (isFillRequiredFields) {
                const slicedData = sortedPositions?.slice(
                    customFieldsSelectedId
                )
                const requiredData = slicedData?.find((field: any) => {
                    if (!field?.fieldValue && field?.required) {
                        // Skip radio buttons whose group already has a selection
                        if (field?.type === FieldsTypeEnum.Radio) {
                            return !sortedPositions?.some(
                                (other: any) =>
                                    other?.type === FieldsTypeEnum.Radio &&
                                    other?.columnName === field?.columnName &&
                                    other?.fieldValue
                            )
                        }
                        return true
                    }
                    return false
                })

                if (!requiredData) {
                    setIsLastSelected(true)
                    scrollToPage(
                        -1,
                        (documentsTotalPages?.data?.pageCount || 1) - 1,
                        'end'
                    )
                    return
                }

                const findMyIndex = sortedPositions?.findIndex(
                    (f: any) => f?.id === requiredData?.id
                )
                const nextData = sortedPositions?.[findMyIndex + 1]
                if (isFieldValue) {
                    setCustomFieldsSelectedId(findMyIndex)
                    setSelectedFillDataField(requiredData?.id)
                    scrollToPage(requiredData?.id, requiredData?.number - 1)
                } else {
                    let updatedIndex = findMyIndex + 1

                    if (updatedIndex <= sortedPositions?.length) {
                        while (
                            sortedPositions?.[updatedIndex] &&
                            (!sortedPositions?.[updatedIndex]?.required ||
                                sortedPositions?.[updatedIndex]?.fieldValue)
                        ) {
                            updatedIndex++
                        }
                    } else {
                        scrollToPage(
                            -1,
                            (documentsTotalPages?.data?.pageCount || 1) - 1,
                            'end'
                        )
                        setIsLastSelected(true)
                    }

                    if (!sortedPositions?.[updatedIndex]) {
                        setIsLastSelected(true)
                    }

                    setCustomFieldsSelectedId(updatedIndex)
                    setSelectedFillDataField(nextData?.id)
                    if (nextData) {
                        scrollToPage(nextData?.id, nextData?.number - 1)
                    }
                }
            } else {
                setSelectedFillDataField(fieldData?.id)
                setCustomFieldsSelectedId(customFieldsSelectedId + 1)
                scrollToPage(fieldData?.id, fieldData?.number - 1)
            }
        } else {
            setIsLastSelected(
                sortedPositions?.[customFieldsSelectedId]?.id ===
                    sortedPositions?.[sortedPositions?.length - 1]?.id
            )
            setSelectedFillDataField(sortedPositions?.[0]?.id)
            scrollToPage(
                -1,
                (documentsTotalPages?.data?.pageCount || 1) - 1,
                'end'
            )
        }
    }

    const allSignAdded = customFieldsData
        ?.filter((c: any) => c?.type === FieldsTypeEnum.Signature)
        ?.every((a: any) => a?.responses?.length > 0)

    const onGoToSignFieldIfRemaining = (r: any) => {
        const findMyIndex = sortedPositions?.findIndex(
            (f: any) => f?.id === r?.id
        )
        setCustomFieldsSelectedId(findMyIndex)
        setSelectedFillDataField(r?.id)
        scrollToPage(Number(r?.id), r?.number - 1)
        setIsFillRequiredFields(true)
        setIsLastSelected(false)
    }

    const onCancelFinishSign = () => {
        setIsFillRequiredFields(false)
        setIsLastSelected(false)
        setCustomFieldsSelectedId(0)
    }

    return (
        <div className="space-y-3.5">
            {modal}

            <Activity
                mode={checkJsxVisibility(
                    role === UserRoles.RTO &&
                        documentDetail?.data?.signers?.length > 0 &&
                        !documentDetail?.data?.signers
                            ?.filter(
                                (s: any) => s?.user?.role !== UserRoles.RTO
                            )
                            ?.every((s: any) => s?.status === 'signed')
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border flex items-center gap-3 mb-2"
                    style={{
                        background: '#EFF6FF',
                        borderColor: '#BFDBFE',
                    }}
                >
                    <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: '#3B82F6' }}
                    />
                    <p
                        className="text-sm font-semibold"
                        style={{ color: '#1E40AF' }}
                    >
                        Waiting for other parties to sign before RTO can finish.
                    </p>
                </motion.div>
            </Activity>
            <EsignHeader documentDetail={documentDetail?.data} />

            {isSignature && isDocumentLoaded?.isSuccess ? (
                <EsignSignatureModal
                    tab={selectedSign}
                    onCancel={(cancel?: boolean, isSigned?: boolean) => {
                        onSignatureCancelClicked(cancel, isSigned)
                    }}
                    allSignAdded={allSignAdded}
                    customFieldsData={customFieldsData}
                    setCustomFieldsData={setCustomFieldsData}
                    success={
                        !tabs?.isLoading && !tabs?.isFetching && tabs?.isSuccess
                    }
                />
            ) : null}
            {!showSignersField && (
                <div
                    onClick={() => {
                        setShowSignersField(true)
                    }}
                    className="fixed top-[35%] right-0"
                >
                    <IoMdArrowDropleftCircle size={25} className="opacity-60" />
                </div>
            )}
            {/* {documentsTotalPages.isSuccess && (
                <div className="flex justify-end items-center">
                    <ActionButton
                        onClick={() => {
                            setShowSignersField(!showSignersField)
                        }}
                        Icon={GiHamburgerMenu}
                        simple
                        variant="info"
                    >
                        Show Sign or Text Fields
                    </ActionButton>
                </div>
            )} */}
            {documentsTotalPages.isError && <TechnicalError />}
            {documentsTotalPages.isLoading ? (
                <LoadingAnimation />
            ) : documentsTotalPages.isSuccess && documentsTotalPages?.data ? (
                <>
                    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 relative max-w-400 mx-auto p-0">
                        <div className="lg:col-span-3 flex flex-col gap-y-4 relative w-full">
                            <div className="flex justify-end items-center">
                                <DownloadEsignDocument />
                            </div>

                            <div
                                className="bg-white rounded-2xl shadow-lg border overflow-hidden w-full"
                                style={{ borderColor: '#E2E8F0' }}
                            >
                                {/* PDF Viewer Header */}
                                <div
                                    className="border-b px-6 py-4"
                                    style={{
                                        borderColor: '#E2E8F0',
                                        background:
                                            'linear-gradient(to right, #F8FAFC, white)',
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <h2
                                            className="text-base md:text-lg font-bold flex items-center gap-2"
                                            style={{ color: '#0F172A' }}
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    background: '#00A651',
                                                }}
                                            ></span>
                                            Document Preview
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            {/* Zoom Controls */}
                                            <div
                                                className="flex items-center gap-1 border-2 rounded-xl px-2 py-1.5 shadow-sm"
                                                style={{
                                                    borderColor: '#E2E8F0',
                                                }}
                                            >
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={handleZoomOut}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Zoom out"
                                                >
                                                    <ZoomOut
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: '#0066CC',
                                                        }}
                                                    />
                                                </motion.button>
                                                <span
                                                    className="text-sm font-semibold min-w-14 text-center"
                                                    style={{ color: '#0F172A' }}
                                                >
                                                    {zoom}%
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={handleZoomIn}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Zoom in"
                                                >
                                                    <ZoomIn
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: '#0066CC',
                                                        }}
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PDF Content */}
                                <div
                                    className="p-0 lg:p-3.5 pb-0! overflow-auto"
                                    style={{
                                        background: '#F8FAFC',
                                        maxHeight: '70vh',
                                    }}
                                >
                                    <motion.div
                                        key={currentPage}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white shadow-2xl mx-auto p-2 md:p-4 mb-6 rounded-lg relative sm:max-w-full"
                                        style={{
                                            width: `${zoom}%`,
                                            maxWidth:
                                                zoom < 100 ? '100%' : 'none',
                                            minHeight: '400px',
                                            transform: 'translateZ(0)',
                                            border: '1px solid #E2E8F0',
                                        }}
                                    >
                                        <SVGView
                                            index={currentPage - 1}
                                            scrollToPage={scrollToPage}
                                            sortedPositions={sortedPositions}
                                            onDocumentScrollArrow={() => {
                                                onDocumentScrollArrow()
                                            }}
                                            setIsDocumentLoaded={
                                                setIsDocumentLoaded
                                            }
                                            customFieldsData={customFieldsData}
                                            customFieldsAndSign={
                                                customFieldsAndSign
                                            }
                                            customFieldsSelectedId={
                                                customFieldsSelectedId
                                            }
                                            selectedFillDataField={
                                                selectedFillDataField
                                            }
                                            onSignatureClicked={
                                                onSignatureClicked
                                            }
                                            onAddCustomFieldsData={
                                                onAddCustomFieldsData
                                            }
                                            documentData={
                                                documentsTotalPages?.data
                                            }
                                            onFinishSignModal={
                                                onFinishSignModal
                                            }
                                            onGoToSignFieldIfRemaining={
                                                onGoToSignFieldIfRemaining
                                            }
                                            isLastSelected={isLastSelected}
                                            onCancelFinishSign={
                                                onCancelFinishSign
                                            }
                                        />
                                    </motion.div>
                                </div>

                                {/* PDF Navigation Footer */}
                                <div
                                    className="border-t px-4 md:px-6 py-4"
                                    style={{
                                        borderColor: '#E2E8F0',
                                        background:
                                            'linear-gradient(to right, white, #F8FAFC)',
                                    }}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05, x: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold bg-white border-2 rounded-xl hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            style={{
                                                borderColor: '#E2E8F0',
                                                color:
                                                    currentPage === 1
                                                        ? '#94A3B8'
                                                        : '#0066CC',
                                            }}
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            <span className="hidden sm:inline">
                                                Previous
                                            </span>
                                            <span className="sm:hidden">
                                                Prev
                                            </span>
                                        </motion.button>

                                        <div className="flex items-center gap-2 md:gap-4 order-last sm:order-0 w-full sm:w-auto justify-center">
                                            <span
                                                className="text-xs md:text-sm font-medium whitespace-nowrap"
                                                style={{ color: '#64748B' }}
                                            >
                                                Page{' '}
                                                <strong
                                                    style={{ color: '#0066CC' }}
                                                >
                                                    {currentPage}
                                                </strong>{' '}
                                                of{' '}
                                                <strong>
                                                    {
                                                        documentsTotalPages
                                                            ?.data?.pageCount
                                                    }
                                                </strong>
                                            </span>
                                            <select
                                                value={currentPage}
                                                onChange={(e) =>
                                                    setCurrentPage(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border-2 rounded-xl focus:outline-none bg-white font-medium shadow-sm"
                                                style={{
                                                    borderColor: '#E2E8F0',
                                                    color: '#0066CC',
                                                }}
                                            >
                                                {Array.from(
                                                    {
                                                        length: documentsTotalPages
                                                            ?.data?.pageCount,
                                                    },
                                                    (_, i) => i + 1
                                                ).map((page) => (
                                                    <option
                                                        key={page}
                                                        value={page}
                                                    >
                                                        Pg {page}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05, x: 2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        documentsTotalPages
                                                            ?.data?.pageCount,
                                                        prev + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                documentsTotalPages?.data
                                                    ?.pageCount
                                            }
                                            className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold bg-white border-2 rounded-xl hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            style={{
                                                borderColor: '#E2E8F0',
                                                color:
                                                    currentPage ===
                                                    documentsTotalPages?.data
                                                        ?.pageCount
                                                        ? '#94A3B8'
                                                        : '#0066CC',
                                            }}
                                        >
                                            <span className="hidden sm:inline">
                                                Next
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1 sticky top-6 self-start w-full">
                            <EsignRightSidebar
                                documentDetail={documentDetail?.data}
                                currentRole={role}
                                onFinishSign={onFinishSignModal}
                                onSignatureClicked={onSignatureClicked}
                                signatureFields={sortedPositions}
                            />
                        </div>
                    </div>{' '}
                    {/* {showSignersField && (
                            <div className="hidden lg:block sticky top-0 bg-white h-[85vh]">
                                <div className="p-3 flex justify-end">
                                    <FaRegTimesCircle
                                        size={23}
                                        onClick={() => {
                                            setShowSignersField(
                                                !showSignersField
                                            )
                                        }}
                                    />
                                </div>
                                <ScrollTabsView
                                    onClick={() => {}}
                                    scrollToPage={scrollToPage}
                                    setSelectedFillDataField={
                                        setSelectedFillDataField
                                    }
                                    customFieldsAndSign={customFieldsAndSign}
                                />
                            </div>
                        )} */}
                    {/* <div className="flex justify-center bg-white px-5 py-2 shadow-md w-full rounded my-2">
                        <button
                            className={`${
                                tabs?.isSuccess &&
                                customFieldsData &&
                                customFieldsData?.length > 0
                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                    : 'bg-secondary-dark text-gray-400'
                            }   border-transparent ring-primary-light text-[11px] 2xl:text-xs font-medium uppercase transition-all duration-300 border px-4 py-2 shadow focus:outline-none focus:ring-4 rounded-md w-full md:w-96 h-12 md:h-[60px]`}
                            onClick={() => {
                                if (
                                    tabs?.isSuccess &&
                                    customFieldsData &&
                                    customFieldsData?.length > 0
                                ) {
                                    onFinishSignModal()
                                }
                            }}
                            disabled={!tabs.isSuccess}
                        >
                            <div className="flex items-center justify-center gap-x-2 text-xl">
                                Finish Signing
                            </div>
                        </button>
                    </div> */}
                </>
            ) : (
                documentsTotalPages.isSuccess && <EmptyData />
            )}
        </div>
    )
}

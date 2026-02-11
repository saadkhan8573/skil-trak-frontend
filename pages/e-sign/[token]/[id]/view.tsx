import {
    Button,
    Card,
    EmptyData,
    GlobalModal,
    LoadingAnimation,
    ShowErrorNotifications,
    TechnicalError,
    Typography,
} from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { PageHeading } from '@components/headings'
import { useNotification } from '@hooks'
import { SiteLayout } from '@layouts'
import {
    EsignSignatureModal,
    FinishEmailSignModal,
} from '@partials/eSign/modal'
import { FinishDocumentModal, SVGView } from '@partials/eSign/components'
import { CommonApi } from '@queries'
import { jwtDecode as jwt } from 'jwt-decode'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const ESign = () => {
    const router = useRouter()

    const [modal, setModal] = useState<ReactNode | null>(null)
    const [customFieldsData, setCustomFieldsData] = useState<any>([])
    const [isSignature, setIsSignature] = useState<boolean>(false)
    const [selectedSign, setSelectedSign] = useState<ReactNode | null>(null)

    const [isFillRequiredFields, setIsFillRequiredFields] =
        useState<boolean>(false)
    const [customFieldsSelectedId, setCustomFieldsSelectedId] =
        useState<number>(-1)
    const [isLastSelected, setIsLastSelected] = useState<boolean>(false)

    const [isDocumentLoaded, setIsDocumentLoaded] = useState<any>([])

    const [decodeData, setDecodeData] = useState<any>(null)
    const [selectedFillDataField, setSelectedFillDataField] =
        useState<any>(null)
    const [showSignersField, setShowSignersField] = useState<boolean>(false)

    const scrollTargetRef = useRef<any>([])

    const { notification } = useNotification()

    useEffect(() => {
        const jwtDecode = async () => {
            if (router?.query?.token) {
                const data = await jwt(String(router?.query?.token))
                setDecodeData(data)
            }
        }
        jwtDecode()
    }, [router])

    const checkIfUserSigned = CommonApi.ESign.checkIfUserSigned(
        {
            documentId: Number(router.query?.id),
            id: Number(decodeData?.id),
        },
        {
            skip: !router.query?.id || !decodeData?.id,
        }
    )
    const documentsTotalPages: any = CommonApi.ESign.useGetDocumentTotalPages(
        Number(router.query?.id),
        {
            skip: !router.query?.id || !checkIfUserSigned.isSuccess,
        }
    )
    const tabs = CommonApi.ESign.useGetTabs(
        {
            docId: Number(router.query?.id),
            token: String(router.query?.token),
        },
        {
            skip: !router.query?.id || !router.query?.token,
        }
    )

    useEffect(() => {
        if (tabs.isSuccess && tabs?.data && tabs?.data?.length > 0) {
            setCustomFieldsData(
                tabs?.data
                    // ?.filter((t: any) => !t?.responses?.length)
                    ?.map((tab: any) => {
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

                        return {
                            ...tab,
                            fieldValue: response ? response?.data : '',
                        }
                    })
            )
        }
    }, [tabs])

    const onAddCustomFieldsData = (e: any) => {
        const updatedData = customFieldsData?.map((data: any) =>
            data?.id === e?.id ? e : data
        )
        setCustomFieldsData(updatedData)
    }

    const sign = customFieldsData?.find(
        (s: any) => s?.type === FieldsTypeEnum.Signature
    )

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
                setCustomFieldsSelectedId(customFieldsSelectedId + 1)
                setIsSignature(false)
                setIsDocumentLoaded(null)
                // onDocumentScrollArrow()
            }
        }
    }

    const customFieldsAndSign = customFieldsData?.filter(
        (s: any) => s?.type === FieldsTypeEnum.Signature || s?.isCustom
    )

    const extractAndConvert = (position: string) => {
        const [x, y] = position.split(',').map(parseFloat)
        return y
        // return x + y
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
        ?.filter((sign: any) => !sign?.responses?.length)

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
            customFieldsSelectedId < 0
        ) {
            setIsLastSelected(true)
            setSelectedFillDataField(sortedPositions?.[0]?.id)
            scrollToPage(-1, documentsTotalPages?.data?.pageCount - 1, 'end')
        } else {
            setIsLastSelected(false)
        }
    }, [customFieldsSelectedId])

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

    const scrollToPage = (
        tabId: number,
        currentPage: number,
        block?: ScrollLogicalPosition
    ) => {
        const targetElement = scrollTargetRef.current[currentPage]
        const detailItem = document.getElementById(`tabs-view-${tabId}`)

        if (detailItem) {
            detailItem.scrollIntoView({
                behavior: 'smooth',
                block: block || 'center',
            })
        } else if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: block || 'center',
            })
        }
    }

    // useEffect(() => {
    //     scrollToPage(
    //         Number(sortedPositions?.[customFieldsSelectedId]?.id),
    //         sortedPositions?.[customFieldsSelectedId]?.number - 1
    //     )
    // }, [customFieldsSelectedId])

    const onSaveCustomFieldsValue = async () => {
        const customValues = customFieldsData?.filter(
            (data: any) => data?.isCustom && !data?.fieldValue && data?.required
        )

        if (
            customFieldsData
                ?.filter((s: any) => s?.type === FieldsTypeEnum.Signature)
                ?.filter((s: any) => !s?.fieldValue)?.length > 0
            // ?.filter((s: any) => !s?.responses?.length)?.length > 0
        ) {
            notification.warning({
                title: 'Sign',
                description: 'Please sign before finish signing',
            })
        } else if (customValues && customValues?.length > 0) {
            notification.warning({
                title: 'Please fill all required fields',
                description: 'Please fill all required fields',
            })
        } else {
            setModal(
                <FinishEmailSignModal
                    // onCancel={onCancelClicked}
                    decodeDataId={decodeData?.id}
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
        //         action={CommonApi.ESign.useAddSign}
        //     />
        // )
    }

    const onDocumentScrollArrow = () => {
        if (customFieldsSelectedId < sortedPositions?.length - 1) {
            const fieldData = sortedPositions?.[customFieldsSelectedId + 1]
            const isSign = fieldData?.type === FieldsTypeEnum.Signature

            const isFieldValue =
                sortedPositions?.[customFieldsSelectedId]?.fieldValue

            // if (isSign) {
            //     setTimeout(() => {
            //         setIsSignature(true)
            //         setSelectedSign(fieldData)
            //     }, 500)
            // }

            if (isFillRequiredFields) {
                const slicedData = sortedPositions?.slice(
                    customFieldsSelectedId
                )
                const requiredData = slicedData?.find(
                    (field: any) => !field?.fieldValue && field?.required
                )

                if (!requiredData) {
                    setIsLastSelected(true)
                }

                const findMyIndex = sortedPositions?.findIndex(
                    (f: any) => f?.id === requiredData?.id
                )
                const nextData = sortedPositions?.[findMyIndex + 1]
                if (isFieldValue) {
                    setCustomFieldsSelectedId(findMyIndex)
                    setSelectedFillDataField(requiredData?.id)
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
                            documentsTotalPages?.data?.pageCount - 1,
                            'end'
                        )
                    }

                    if (!sortedPositions?.[updatedIndex]) {
                        setIsLastSelected(true)
                    }

                    setCustomFieldsSelectedId(updatedIndex)
                    setSelectedFillDataField(nextData?.id)
                }
            } else {
                setSelectedFillDataField(fieldData?.id)
                setCustomFieldsSelectedId(customFieldsSelectedId + 1)
            }
        } else {
            setIsLastSelected(
                sortedPositions?.[customFieldsSelectedId]?.id ===
                sortedPositions?.[sortedPositions?.length - 1]?.id
            )
            setSelectedFillDataField(sortedPositions?.[0]?.id)
            scrollToPage(-1, documentsTotalPages?.data?.pageCount - 1, 'end')
            // setCustomFieldsSelectedId(0)
            // finishSign
            // const detailItem = document.getElementById(`finishSign`)

            // if (detailItem) {
            //     detailItem.scrollIntoView({
            //         behavior: 'smooth',
            //         block: 'center',
            //     })
            // }
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
        <SiteLayout title={'E Sign'}>
            {modal}
            {isSignature && isDocumentLoaded?.isSuccess ? (
                <EsignSignatureModal
                    setCustomFieldsData={setCustomFieldsData}
                    tab={selectedSign}
                    onCancel={(cancel?: boolean, isSigned?: boolean) => {
                        onSignatureCancelClicked(cancel, isSigned)
                    }}
                    customFieldsData={customFieldsData}
                    action={CommonApi.ESign.useAddSign}
                    allSignAdded={allSignAdded}
                    success={
                        !tabs?.isLoading && !tabs?.isFetching && tabs?.isSuccess
                    }
                />
            ) : null}
            <ShowErrorNotifications result={checkIfUserSigned} />
            <div className="max-w-7xl mx-auto py-10">
                <PageHeading title="E-Sign" subtitle="E Sign" />

                {(documentsTotalPages.isError || checkIfUserSigned.isError) && (
                    <TechnicalError
                        title={documentsTotalPages?.error?.data?.message as any}
                    />
                )}
                {documentsTotalPages.isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : documentsTotalPages.data ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-x-2.5 relative">
                            {/* {sign && (
                            <div
                                onClick={() => {
                                    scrollToPage(Number(sign?.number - 1))
                                }}
                                className="w-fit mt-4 ml-auto z-10 px-7 py-2 h-full bg-red-600 flex justify-center items-center gap-x-2 text-white"
                            >
                                <FaSignature className="text-2xl" />
                                <button className="text-lg">
                                    {sign?.responses &&
                                    sign?.responses?.length > 0
                                        ? 'View Sign'
                                        : 'Sign Here'}
                                </button>
                            </div>
                        )} */}
                            {/* <div className="block lg:hidden">
                                <div className=" flex justify-end items-center ">
                                    <div
                                        onClick={() =>
                                            setShowSignersField(
                                                !showSignersField
                                            )
                                        }
                                    >
                                        <Typography variant="small" semibold>
                                            Show Fields
                                        </Typography>
                                    </div>
                                    {showSignersField && (
                                        <div className="absolute top-5 z-20 w-3/4">
                                            <ScrollTabsView
                                                onClick={() =>
                                                    setShowSignersField(false)
                                                }
                                                customFieldsAndSign={
                                                    customFieldsAndSign
                                                }
                                                scrollToPage={scrollToPage}
                                                setSelectedFillDataField={
                                                    setSelectedFillDataField
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div> */}
                            <div className="lg:col-span-6 flex flex-col gap-y-3 pl-0 lg:pl-0">
                                {/* <div className="flex justify-end items-center gap-x-2">
                                    <input
                                        type={'checkbox'}
                                        onChange={(e: any) => {
                                            onSelectAll(e)
                                        }}
                                        id={'selectAll'}
                                    />
                                    <label htmlFor="selectAll">
                                        Select All
                                    </label>
                                </div> */}
                                {[
                                    ...Array(
                                        Number(
                                            documentsTotalPages?.data?.pageCount
                                        )
                                    ),
                                ]?.map((doc: any, i: number) => (
                                    <div
                                        key={i}
                                        ref={(el: any) =>
                                        (scrollTargetRef.current[i] =
                                            el as any)
                                        }
                                        className="relative"
                                    >
                                        <Card noPadding>
                                            <div className="absolute top-1 left-1/2 flex justify-center">
                                                <Typography
                                                    variant="label"
                                                    semibold
                                                >
                                                    {i + 1}
                                                </Typography>
                                            </div>
                                            <SVGView
                                                customFieldsAndSign={
                                                    customFieldsAndSign
                                                }
                                                scrollToPage={scrollToPage}
                                                customFieldsSelectedId={
                                                    customFieldsSelectedId
                                                }
                                                onDocumentScrollArrow={() => {
                                                    onDocumentScrollArrow()
                                                }}
                                                setIsDocumentLoaded={
                                                    setIsDocumentLoaded
                                                }
                                                sortedPositions={
                                                    sortedPositions
                                                }
                                                index={i}
                                                customFieldsData={
                                                    customFieldsData
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
                                                    onSaveCustomFieldsValue
                                                }
                                                onGoToSignFieldIfRemaining={
                                                    onGoToSignFieldIfRemaining
                                                }
                                                isLastSelected={isLastSelected}
                                                onCancelFinishSign={
                                                    onCancelFinishSign
                                                }
                                            />
                                        </Card>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="hidden lg:block sticky top-0 h-[85vh]">
                                <ScrollTabsView
                                    onClick={() => setShowSignersField(false)}
                                    customFieldsAndSign={customFieldsAndSign}
                                    scrollToPage={scrollToPage}
                                    setSelectedFillDataField={
                                        setSelectedFillDataField
                                    }
                                />
                            </div> */}
                        </div>{' '}
                        <div className="flex justify-center mt-3 mx-auto w-80 h-14">
                            <Button
                                fullHeight
                                fullWidth
                                text={'Finish Esign'}
                                onClick={() => {
                                    setModal(
                                        <GlobalModal>
                                            <FinishDocumentModal
                                                customFieldsData={
                                                    customFieldsData
                                                }
                                                onCancelFinishSign={() => {
                                                    setModal(null)
                                                    onCancelFinishSign()
                                                }}
                                                onFinishSignModal={
                                                    onSaveCustomFieldsValue
                                                }
                                                onGoToSignFieldIfRemaining={(
                                                    e: any
                                                ) => {
                                                    onGoToSignFieldIfRemaining(
                                                        e
                                                    )
                                                    setModal(null)
                                                }}
                                                remainingFields={sortedPositions?.filter(
                                                    (field: any) =>
                                                        !field?.fieldValue &&
                                                        field?.required
                                                )}
                                                asModal
                                            />
                                        </GlobalModal>
                                    )
                                }}
                            />
                        </div>
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
                                        onSaveCustomFieldsValue()
                                        // router.back()
                                    }
                                }}
                            >
                                <div className="flex items-center justify-center gap-x-2 text-xl">
                                    Finish Signing
                                </div>
                            </button>
                        </div> */}
                    </>
                ) : (
                    (documentsTotalPages.isSuccess ||
                        checkIfUserSigned.isSuccess) && (
                        <EmptyData
                            title={'No E-Sign Found!'}
                            description={'You have not any Esign Document yet'}
                            height={'50vh'}
                        />
                    )
                )}
            </div>
        </SiteLayout>
    )
}

export default ESign

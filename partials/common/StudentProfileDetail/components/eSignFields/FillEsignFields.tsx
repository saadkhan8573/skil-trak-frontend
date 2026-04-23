import {
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    TechnicalError,
    Typography,
} from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { useNotification } from '@hooks'
import { SubmitDocModal } from '@partials/sub-admin/assessmentEvidence/modal'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { IoMdArrowDropleftCircle } from 'react-icons/io'
import { EsignSVGView } from './components'
// import { FinishSignModal } from './modal'

export const FillEsignFields = ({
    signerId,
    onCancel,
    documentId,
}: {
    onCancel: any
    signerId: number
    documentId: number
}) => {
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

    const { notification } = useNotification()

    const documentsTotalPages = CommonApi.ESign.useGetDocumentTotalPages(
        Number(documentId),
        {
            skip: !documentId,
        }
    )

    const tabs = CommonApi.ESign.useSignatureTabForTemplate(
        {
            signerId,
            template: documentsTotalPages?.data?.templateId,
            docId: Number(documentId),
        },
        {
            skip: !documentsTotalPages?.data || !documentId,
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

    const scrollTargetRef = useRef<any>([])

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

    useEffect(() => {
        if (tabs.isLoading || tabs.isFetching || tabs.isError) {
            setCustomFieldsDataUpdated(false)
        } else if (tabs?.data && tabs.isSuccess && tabs?.data?.length > 0) {
            setCustomFieldsDataUpdated(true)
            setCustomFieldsData(
                tabs?.data
                    ?.filter((s: any) => s?.type !== FieldsTypeEnum.Signature)
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
            if (isSign) {
                setTimeout(() => {
                    setIsSignature(true)
                    setSelectedSign(fieldData)
                }, 500)
            }
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
        // For radio buttons, group by columnName — if at least one in the group
        // is checked, the whole group is considered satisfied.
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
            if (
                data?.type === FieldsTypeEnum.Radio &&
                satisfiedRadioGroups.has(data?.columnName)
            )
                return false
            return true
        })

        if (customValues && customValues?.length > 0) {
            notification.warning({
                title: 'Please fill all required fields',
                description: 'Please fill all required fields',
            })
        } else {
            setModal(
                <SubmitDocModal
                    onCancel={() => {
                        onCancelClicked()
                        onCancel()
                    }}
                    customFieldsData={customFieldsData}
                    documentId={documentId}
                    signerUser={signerId}
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

    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

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

            return !sign?.responses?.length
        })

    const sortedPositions = processedItems.sort((a: any, b: any) => {
        // First, prioritize 'signature' type
        if (
            a.type === FieldsTypeEnum.Signature &&
            b.type !== FieldsTypeEnum.Signature
        ) {
            return -1
        }
        if (
            a.type !== FieldsTypeEnum.Signature &&
            b.type === FieldsTypeEnum.Signature
        ) {
            return 1
        }
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
            scrollToPage(-1, documentsTotalPages?.data?.pageCount - 1, 'end')
        }
    }, [customFieldsSelectedId])

    const onDocumentScrollArrow = () => {
        if (customFieldsSelectedId < sortedPositions?.length - 1) {
            const fieldData = sortedPositions?.[customFieldsSelectedId + 1]
            const isSign = fieldData?.type === FieldsTypeEnum.Signature

            // if (isDocumentLoaded) {
            //     if (isBrowser()) {
            //         const inputElement = document?.getElementById(
            //             `tabs-view-${fieldData?.id}`
            //         ) as HTMLInputElement | null
            //         if (inputElement) {
            //             inputElement.scrollIntoView({
            //                 behavior: 'smooth',
            //                 block: 'center',
            //             })
            //             setTimeout(() => {
            //                 inputElement.focus()
            //             }, 400)
            //         }
            //     }
            // }

            const isFieldValue =
                sortedPositions?.[customFieldsSelectedId]?.fieldValue

            if (isSign) {
                setTimeout(() => {
                    setIsSignature(true)
                    setSelectedSign(fieldData)
                }, 500)
            }

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
                        setIsLastSelected(true)
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

    return (
        <div>
            {modal}

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
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-x-2.5 relative">
                        <div className="block lg:hidden"></div>

                        <div
                            className={`${
                                showSignersField
                                    ? 'lg:col-span-6'
                                    : 'lg:col-span-6'
                            } max-w- lg:pl-20 mx-auto flex flex-col gap-y-3 relative w-full`}
                        >
                            {[
                                ...Array(
                                    Number(documentsTotalPages?.data?.pageCount)
                                ),
                            ]?.map((_, i: number) => (
                                <div
                                    key={i}
                                    ref={(el: any) =>
                                        (scrollTargetRef.current[i] = el)
                                    }
                                    onClick={() => {}}
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
                                        <EsignSVGView
                                            index={i}
                                            documentId={documentId}
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
                                    </Card>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center w-full col-span-6">
                            <div className="w-80 h-14 mt-5">
                                <Button
                                    variant={
                                        customFieldsData &&
                                        customFieldsData?.length > 0
                                            ? 'primary'
                                            : 'secondary'
                                    }
                                    disabled={remainingFields?.length > 0}
                                    fullHeight
                                    fullWidth
                                    onClick={() => {
                                        if (
                                            customFieldsData &&
                                            customFieldsData?.length > 0
                                        ) {
                                            onFinishSignModal()
                                        }
                                    }}
                                    text={'Finish Signing'}
                                />
                            </div>
                        </div>

                        {/* {showSignersField && (
                            <div className="hidden lg:block sticky top-0 bg-white h-[85vh]">
                                <div className="p-3 flex justify-end">
                                    <FaRegTimesCircle
                                         size={25}
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

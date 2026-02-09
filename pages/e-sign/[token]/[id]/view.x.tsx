import React, {
    useReducer,
    useRef,
    useEffect,
    useCallback,
    ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import { jwtDecode as jwt } from 'jwt-decode'
import {
    Card,
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    TechnicalError,
    Typography,
} from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { PageHeading } from '@components/headings'
import { useNotification } from '@hooks'
import { SiteLayout } from '@layouts'
import { EsignSignatureModal, FinishEmailSignModal, SVGView } from '@partials'
import { CommonApi } from '@queries'

// Define the state shape
interface State {
    modal: ReactNode | null
    customFieldsData: any[]
    isSignature: boolean
    selectedSign: ReactNode | null
    isFillRequiredFields: boolean
    customFieldsSelectedId: number
    isLastSelected: boolean
    isDocumentLoaded: any
    decodeData: any
    selectedFillDataField: any
    showSignersField: boolean
}

// Define action types
type Action =
    | { type: 'SET_MODAL'; payload: ReactNode | null }
    | { type: 'SET_CUSTOM_FIELDS_DATA'; payload: any[] }
    | { type: 'SET_IS_SIGNATURE'; payload: boolean }
    | { type: 'SET_SELECTED_SIGN'; payload: ReactNode | null }
    | { type: 'SET_IS_FILL_REQUIRED_FIELDS'; payload: boolean }
    | { type: 'SET_CUSTOM_FIELDS_SELECTED_ID'; payload: number }
    | { type: 'SET_IS_LAST_SELECTED'; payload: boolean }
    | { type: 'SET_IS_DOCUMENT_LOADED'; payload: any }
    | { type: 'SET_DECODE_DATA'; payload: any }
    | { type: 'SET_SELECTED_FILL_DATA_FIELD'; payload: any }
    | { type: 'SET_SHOW_SIGNERS_FIELD'; payload: boolean }

// Define the reducer function
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_MODAL':
            return { ...state, modal: action.payload }
        case 'SET_CUSTOM_FIELDS_DATA':
            return { ...state, customFieldsData: action.payload }
        case 'SET_IS_SIGNATURE':
            return { ...state, isSignature: action.payload }
        case 'SET_SELECTED_SIGN':
            return { ...state, selectedSign: action.payload }
        case 'SET_IS_FILL_REQUIRED_FIELDS':
            return { ...state, isFillRequiredFields: action.payload }
        case 'SET_CUSTOM_FIELDS_SELECTED_ID':
            return { ...state, customFieldsSelectedId: action.payload }
        case 'SET_IS_LAST_SELECTED':
            return { ...state, isLastSelected: action.payload }
        case 'SET_IS_DOCUMENT_LOADED':
            return { ...state, isDocumentLoaded: action.payload }
        case 'SET_DECODE_DATA':
            return { ...state, decodeData: action.payload }
        case 'SET_SELECTED_FILL_DATA_FIELD':
            return { ...state, selectedFillDataField: action.payload }
        case 'SET_SHOW_SIGNERS_FIELD':
            return { ...state, showSignersField: action.payload }
        default:
            return state
    }
}

const ESign = () => {
    const router = useRouter()
    const { notification } = useNotification()

    // Initial state
    const initialState: State = {
        modal: null,
        customFieldsData: [],
        isSignature: false,
        selectedSign: null,
        isFillRequiredFields: false,
        customFieldsSelectedId: -1,
        isLastSelected: false,
        isDocumentLoaded: null,
        decodeData: null,
        selectedFillDataField: null,
        showSignersField: false,
    }

    // Use the reducer
    const [state, dispatch] = useReducer(reducer, initialState)

    const scrollTargetRef = useRef<any>([])

    useEffect(() => {
        const jwtDecode = async () => {
            if (router?.query?.token) {
                const data = await jwt(String(router?.query?.token))
                dispatch({ type: 'SET_DECODE_DATA', payload: data })
            }
        }
        jwtDecode()
    }, [router])

    const checkIfUserSigned = CommonApi.ESign.checkIfUserSigned(
        {
            documentId: Number(router.query?.id),
            id: Number(state.decodeData?.id),
        },
        {
            skip: !router.query?.id || !state.decodeData?.id,
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
            const updatedCustomFieldsData = tabs?.data?.map((tab: any) => {
                const response = tab?.responses?.reduce(
                    (accumulator: any, current: any) => {
                        const accumulatorDate = new Date(accumulator.updatedAt)
                        const currentDate = new Date(current.updatedAt)
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
            dispatch({
                type: 'SET_CUSTOM_FIELDS_DATA',
                payload: updatedCustomFieldsData,
            })
        }
    }, [tabs])

    const onAddCustomFieldsData = (e: any) => {
        const updatedData = state.customFieldsData?.map((data: any) =>
            data?.id === e?.id ? e : data
        )
        dispatch({ type: 'SET_CUSTOM_FIELDS_DATA', payload: updatedData })
    }

    const sign = state.customFieldsData?.find(
        (s: any) => s?.type === FieldsTypeEnum.Signature
    )

    const onCancelClicked = () => {
        dispatch({ type: 'SET_IS_SIGNATURE', payload: false })
        dispatch({ type: 'SET_MODAL', payload: null })
        dispatch({ type: 'SET_SELECTED_SIGN', payload: null })
    }

    const onSignatureCancelClicked = (cancel?: boolean, isSigned?: boolean) => {
        if (isSigned) {
            const fieldData =
                sortedPositions?.[state.customFieldsSelectedId + 1]
            const isSign = fieldData?.type === FieldsTypeEnum.Signature
            if (isSign) {
                setTimeout(() => {
                    dispatch({ type: 'SET_IS_SIGNATURE', payload: true })
                    dispatch({ type: 'SET_SELECTED_SIGN', payload: fieldData })
                }, 500)
            }
        }
        if (cancel) {
            dispatch({ type: 'SET_IS_SIGNATURE', payload: false })
        } else {
            if (tabs?.data && tabs.isSuccess && tabs?.data?.length > 0) {
                dispatch({
                    type: 'SET_CUSTOM_FIELDS_SELECTED_ID',
                    payload: state.customFieldsSelectedId + 1,
                })
                dispatch({ type: 'SET_IS_SIGNATURE', payload: false })
                dispatch({ type: 'SET_IS_DOCUMENT_LOADED', payload: null })
            }
        }
    }

    const customFieldsAndSign = state.customFieldsData?.filter(
        (s: any) => s?.type === FieldsTypeEnum.Signature || s?.isCustom
    )

    const extractAndConvert = (position: string) => {
        const [x, y] = position.split(',').map(parseFloat)
        return y
    }

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

    const processedItems = customFieldsAndSign
        .map(addNumberWithPosition)
        ?.filter((sign: any) => !sign?.responses?.length)

    const sortedPositions = processedItems.sort((a: any, b: any) => {
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
        if (a.number !== b.number) {
            return a.number - b.number
        }
        return a.sum - b.sum
    })

    useEffect(() => {
        if (
            state.customFieldsSelectedId >= sortedPositions?.length ||
            state.customFieldsSelectedId < 0
        ) {
            dispatch({ type: 'SET_IS_LAST_SELECTED', payload: true })
            dispatch({
                type: 'SET_SELECTED_FILL_DATA_FIELD',
                payload: sortedPositions?.[0]?.id,
            })
            scrollToPage(-1, documentsTotalPages?.data?.pageCount - 1, 'end')
        } else {
            dispatch({ type: 'SET_IS_LAST_SELECTED', payload: false })
        }
    }, [state.customFieldsSelectedId])

    const onSelectAll = useCallback(
        (e: any) => {
            const updatedCustomFields = state.customFieldsData?.map(
                (data: any) =>
                    data?.type === FieldsTypeEnum.Checkbox
                        ? {
                            ...data,
                            fieldValue: e.target.checked,
                        }
                        : data
            )
            dispatch({
                type: 'SET_CUSTOM_FIELDS_DATA',
                payload: updatedCustomFields,
            })
        },
        [state.customFieldsData]
    )

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

    const onSaveCustomFieldsValue = async () => {
        const customValues = state.customFieldsData?.filter(
            (data: any) => data?.isCustom && !data?.fieldValue && data?.required
        )

        if (
            state.customFieldsData
                ?.filter((s: any) => s?.type === FieldsTypeEnum.Signature)
                ?.filter((s: any) => !s?.responses?.length)?.length > 0
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
            dispatch({
                type: 'SET_MODAL',
                payload: (
                    <FinishEmailSignModal
                        decodeDataId={state.decodeData?.id}
                        customFieldsData={state.customFieldsData}
                    />
                ),
            })
        }
    }

    const onSignatureClicked = (sign: any) => {
        dispatch({ type: 'SET_IS_SIGNATURE', payload: true })
        dispatch({ type: 'SET_SELECTED_SIGN', payload: sign })
    }

    const onDocumentScrollArrow = () => {
        if (state.customFieldsSelectedId < sortedPositions?.length - 1) {
            const fieldData =
                sortedPositions?.[state.customFieldsSelectedId + 1]
            const isSign = fieldData?.type === FieldsTypeEnum.Signature

            const isFieldValue =
                sortedPositions?.[state.customFieldsSelectedId]?.fieldValue

            if (isSign) {
                setTimeout(() => {
                    dispatch({ type: 'SET_IS_SIGNATURE', payload: true })
                    dispatch({ type: 'SET_SELECTED_SIGN', payload: fieldData })
                }, 500)
            }

            if (state.isFillRequiredFields) {
                const slicedData = sortedPositions?.slice(
                    state.customFieldsSelectedId
                )
                const requiredData = slicedData?.find(
                    (field: any) => !field?.fieldValue && field?.required
                )

                if (!requiredData) {
                    dispatch({ type: 'SET_IS_LAST_SELECTED', payload: true })
                }

                const findMyIndex = sortedPositions?.findIndex(
                    (f: any) => f?.id === requiredData?.id
                )
                const nextData = sortedPositions?.[findMyIndex + 1]
                if (isFieldValue) {
                    dispatch({
                        type: 'SET_CUSTOM_FIELDS_SELECTED_ID',
                        payload: findMyIndex,
                    })
                    dispatch({
                        type: 'SET_SELECTED_FILL_DATA_FIELD',
                        payload: requiredData?.id,
                    })
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
                        dispatch({
                            type: 'SET_IS_LAST_SELECTED',
                            payload: true,
                        })
                    }

                    dispatch({
                        type: 'SET_CUSTOM_FIELDS_SELECTED_ID',
                        payload: updatedIndex,
                    })
                    dispatch({
                        type: 'SET_SELECTED_FILL_DATA_FIELD',
                        payload: nextData?.id,
                    })
                }
            } else {
                dispatch({
                    type: 'SET_SELECTED_FILL_DATA_FIELD',
                    payload: fieldData?.id,
                })
                dispatch({
                    type: 'SET_CUSTOM_FIELDS_SELECTED_ID',
                    payload: state.customFieldsSelectedId + 1,
                })
            }
        } else {
            dispatch({
                type: 'SET_IS_LAST_SELECTED',
                payload:
                    sortedPositions?.[state.customFieldsSelectedId]?.id ===
                    sortedPositions?.[sortedPositions?.length - 1]?.id,
            })
            dispatch({
                type: 'SET_SELECTED_FILL_DATA_FIELD',
                payload: sortedPositions?.[0]?.id,
            })
            scrollToPage(-1, documentsTotalPages?.data?.pageCount - 1, 'end')
        }
    }

    const allSignAdded = state.customFieldsData
        ?.filter((c: any) => c?.type === FieldsTypeEnum.Signature)
        ?.every((a: any) => a?.responses?.length > 0)

    const onGoToSignFieldIfRemaining = (r: any) => {
        const findMyIndex = sortedPositions?.findIndex(
            (f: any) => f?.id === r?.id
        )
        dispatch({
            type: 'SET_CUSTOM_FIELDS_SELECTED_ID',
            payload: findMyIndex,
        })
        dispatch({ type: 'SET_SELECTED_FILL_DATA_FIELD', payload: r?.id })
        scrollToPage(Number(r?.id), r?.number - 1)
        dispatch({ type: 'SET_IS_FILL_REQUIRED_FIELDS', payload: true })
        dispatch({ type: 'SET_IS_LAST_SELECTED', payload: false })
    }

    const onCancelFinishSign = () => {
        dispatch({ type: 'SET_IS_FILL_REQUIRED_FIELDS', payload: false })
        dispatch({ type: 'SET_IS_LAST_SELECTED', payload: false })
        dispatch({ type: 'SET_CUSTOM_FIELDS_SELECTED_ID', payload: 0 })
    }

    return (
        <SiteLayout title={'E Sign'}>
            {state.modal}
            {state.isSignature && state.isDocumentLoaded?.isSuccess ? (
                <EsignSignatureModal
                    setCustomFieldsData={(e: any) => {
                        dispatch({
                            type: 'SET_CUSTOM_FIELDS_DATA',
                            payload: e,
                        })
                    }}
                    tab={state.selectedSign}
                    onCancel={(cancel?: boolean, isSigned?: boolean) => {
                        onSignatureCancelClicked(cancel, isSigned)
                    }}
                    customFieldsData={state.customFieldsData}
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
                            <div className="lg:col-span-6 flex flex-col gap-y-3 pl-0 lg:pl-0">
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
                                                    state.customFieldsSelectedId
                                                }
                                                onDocumentScrollArrow={
                                                    onDocumentScrollArrow
                                                }
                                                setIsDocumentLoaded={(
                                                    payload: any
                                                ) =>
                                                    dispatch({
                                                        type: 'SET_IS_DOCUMENT_LOADED',
                                                        payload,
                                                    })
                                                }
                                                sortedPositions={
                                                    sortedPositions
                                                }
                                                index={i}
                                                customFieldsData={
                                                    state.customFieldsData
                                                }
                                                selectedFillDataField={
                                                    state.selectedFillDataField
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
                                                isLastSelected={
                                                    state.isLastSelected
                                                }
                                                onCancelFinishSign={
                                                    onCancelFinishSign
                                                }
                                            />
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
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

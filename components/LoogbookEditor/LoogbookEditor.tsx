import { EmptyData } from '@components/ActionAnimations'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { LoadingAnimation } from '@components/LoadingAnimation'
import { ShowErrorNotifications } from '@components/ShowErrorNotifications'
import { Typography } from '@components/Typography'
import { Button } from '@components/buttons'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { uuid } from 'uuidv4'
import {
    LogbookSignature,
    LoogbookSidebar,
    LoogBookSVGLoader,
} from './components'

export const LoogbookEditor = ({
    file,
    onCancel,
    hideCancelButton = false,
}: {
    file: any
    onCancel?: () => void
    hideCancelButton?: boolean
}) => {
    const { notification } = useNotification()

    const [draggableData, setDraggableData] = useState<any>()
    const [tabDropCoordinates, setTabDropCoordinates] = useState<any>(null)
    const [modal, setModal] = useState<ReactNode | null>(null)
    const [currentPage, setCurrentPage] = useState<any>(0)
    const [isPageScrolled, setIsPageScrolled] = useState<boolean>(false)
    const [renderedPagesHeight, setRenderedPagesHeight] = useState<number[]>([])
    const [currentPageY, setCurrentPageY] = useState<number>(0)
    const [pageVisiblePercentages, setPageVisiblePercentages] = useState<{
        [key: number]: number
    }>({})
    const [pageTopOffsets, setPageTopOffsets] = useState<{
        [key: number]: number
    }>({})
    const [pastedTabsCount, setPastedTabsCount] = useState<number>(1)
    const ref = useRef<any>(null)

    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const [items, setItems] = useState<any>([])
    const [contextBar, setContextBar] = useState<any>()
    const [lastSelectedItem, setLastSelectedItem] = useState<any>()
    const [tabsError, setTabsError] = useState<any>(null)

    const pagesCount = SubAdminApi.LogBook.useLogbookPagesCount(file?.id, {
        skip: !file?.id,
    })
    const [saveLogbook, saveLogbookResult] =
        SubAdminApi.LogBook.useSaveLogbook()
    //     SubAdminApi
    // LogBook
    // useStudentLogbook

    useEffect(() => {
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [scrollContainerRef.current, renderedPagesHeight, pagesCount.data])

    const handleScroll = () => {
        const container = scrollContainerRef.current
        if (container && pagesCount.data) {
            setIsPageScrolled(true)
            const scrollTop = container.scrollTop
            let accumulatedHeight = 0
            let currentPageIndex = 0
            const updatedRedered = renderedPagesHeight?.map(
                (a: any, i: number) => (a ? a : pagesCount.data.size[i].height)
            )

            // Loop through each page to find the current page index
            for (let i = 0; i < pagesCount.data.size.length; i++) {
                // const pageHeight = (pagesCount.data.size[i].height * 96) / 100
                // const pageHeight = pagesCount.data.size[i].height
                const pageHeight = updatedRedered[i]

                // const pageHeight =
                //     (renderedPagesHeight[i] * 100) /
                //     pagesCount.data.size[i].height

                if (accumulatedHeight > 0) {
                    accumulatedHeight += pageHeight + 8
                } else {
                    accumulatedHeight += pageHeight
                }

                // Check if the scrollTop is within the current accumulated height range
                if (scrollTop < accumulatedHeight && updatedRedered[i]) {
                    currentPageIndex = i
                    break
                }

                // Ensure we capture the last page if we're at the end of the loop
                if (i === pagesCount.data.size.length - 1) {
                    currentPageIndex = i // Set to the last page index
                }
            }

            // Calculate the total height of all previous pages
            const previousPagesHeight =
                accumulatedHeight - updatedRedered[currentPageIndex]

            // Calculate the current Y position relative to the top of the current page
            const currentPageTop = scrollTop - previousPagesHeight

            // Set states
            setCurrentPage(currentPageIndex)
            setCurrentPageY(currentPageTop)

            // Debugging information
        }
    }

    const onChangeItemsData = (item: any) => {
        const existingItem = items.find((x: any) => x.id === item.id)
        if (existingItem) {
            const updatedItems = items?.map((i: any) =>
                i?.id === existingItem?.id
                    ? { ...i, fieldValue: item?.data }
                    : i
            )
            setItems(updatedItems)
        }
    }

    const getPageTopOffset = (pageNumber: number) =>
        pageTopOffsets[pageNumber] || 0

    const onItemResize = (data: any) => {
        const existingItem = items.find((x: any) => x.id === data.item.id)
        if (existingItem) {
            const updatedList = items.filter((x: any) => x.id !== data.item.id)
            existingItem.resizing = true
            existingItem.size.width = data.newSize.width
            existingItem.size.height = data.newSize.height
            updatedList.push(existingItem)

            setItems(updatedList)
        }
    }

    const onItemResized = (data: any) => {
        const existingItem = items.find((x: any) => x.id === data.item.id)
        if (
            existingItem?.size?.height > 42 &&
            existingItem?.data?.type === FieldsTypeEnum.Text &&
            existingItem?.data?.isCustom
        ) {
            existingItem.data.type = FieldsTypeEnum.TextArea
        } else {
            existingItem.data.type = FieldsTypeEnum.Text
        }
        if (existingItem) {
            const updatedList = items.filter((x: any) => x.id !== data.item.id)
            existingItem.resizing = false
            updatedList.push(existingItem)

            setItems(updatedList)
        }
    }

    const onItemMove = (eventData: any) => {
        const [a, b, width, height] = tabDropCoordinates?.viewPortData

        const item = eventData.active.data.current
        if (!item.moving && !item.resizing) {
            const existingItem = items.find((x: any) => x.id === contextBar?.id)
            if (existingItem) {
                const updatedList = items.filter(
                    (x: any) => x.id !== contextBar?.id
                )
                existingItem.moving = true
                updatedList.push({
                    ...existingItem,
                    location: {
                        ...existingItem?.location,
                        x:
                            existingItem?.location?.x < 0
                                ? 1
                                : existingItem?.location?.x > Number(width)
                                    ? Number(width) - existingItem?.size?.width
                                    : existingItem?.location?.x,
                        y:
                            existingItem?.location?.y < 0
                                ? 1
                                : existingItem?.location?.y > Number(height)
                                    ? Number(height) - existingItem?.size?.height
                                    : existingItem?.location?.y,
                    },
                })

                setItems(updatedList)
            }
        }
    }

    const onItemSelected = (item: any, selected: boolean) => {
        setContextBar(item)
        // Deselect Previous Item
        if (lastSelectedItem) {
            const oldItem = items.find((x: any) => x.id === lastSelectedItem.id)
            const updatedList = items.filter(
                (x: any) => x.id !== lastSelectedItem.id
            )
            if (oldItem) {
                oldItem.selected = false
            }
            updatedList.push(oldItem)
        }

        if (selected) {
            setLastSelectedItem(item)
        } else {
            setContextBar(null)
            setLastSelectedItem(null)
        }

        if (item) {
            const existingItem = items.find((x: any) => x.id === item.id)

            // Select Item
            if (existingItem) {
                const updatedList = items.filter((x: any) => x.id !== item.id)
                let abc = false

                existingItem.selected = selected
                updatedList.push(existingItem)
            }
        }
    }

    const onItemLocationChanged = (eventData: any) => {
        const item = eventData.active.data.current
        const delta = eventData.delta

        const [a, b, width, height] = tabDropCoordinates?.viewPortData

        const existingItem = items.find((x: any) => x.id === item.id)
        if (existingItem && !existingItem.resizing) {
            const updatedList = items.filter((x: any) => x.id !== item.id)
            existingItem.location.x = existingItem.location.x + delta.x
            existingItem.location.y = existingItem.location.y + delta.y
            existingItem.moving = false
            updatedList.push({
                ...existingItem,
                location: {
                    ...existingItem?.location,
                    x:
                        existingItem?.location?.x < 0
                            ? 1
                            : existingItem?.location?.x > Number(width)
                                ? Number(width) - existingItem?.size?.width
                                : existingItem?.location?.x,
                    y:
                        existingItem?.location?.y < 0
                            ? 1
                            : existingItem?.location?.y > Number(height)
                                ? Number(height) - existingItem?.size?.height
                                : existingItem?.location?.y,
                },
            })

            setItems(updatedList)
        }
    }

    const onChangedLocation = (item: any) => {
        const existingItem = items?.find((x: any) => x?.id === item?.id)
        const updatedList = items.filter((x: any) => x?.id !== item?.id)
        if (existingItem) {
            setItems([...updatedList, item])
        }
    }

    const onItemRemove = (item: any) => {
        setContextBar(null)
        const existingItem = items.find((x: any) => x.id === item?.id)

        if (existingItem) {
            const updatedList = items.filter(
                (x: any) => x.id !== existingItem?.id
            )
            setItems(updatedList)
        }
    }

    const yPosition =
        (currentPageY / renderedPagesHeight[currentPage]) *
        pagesCount?.data?.size?.[currentPage]?.height

    const checkPageIndexY =
        pagesCount?.isSuccess && pagesCount?.data
            ? (yPosition * 100) / pagesCount?.data?.size?.[0]?.height > 88
            : false

    const onPasteTab = (item: any) => {
        const newId = uuid()
        const updatedCopiedText = {
            ...item,
            saved: false,
            id: newId,
            selected: true,
            location: {
                ...item?.location,
                y: item?.location?.y + pastedTabsCount * 12,
            },
        }

        // Apply the copied data if available
        if (updatedCopiedText) {
            // You may need to adjust the logic based on your data structure
            // For example, you might want to update specific properties of the current item
            // or create a new item with the copied data

            setItems([
                ...items?.map((item: any) => ({
                    ...item,
                    selected: false,
                })),
                updatedCopiedText,
            ])

            setLastSelectedItem(updatedCopiedText)
            setContextBar(updatedCopiedText)
            setPastedTabsCount(pastedTabsCount + 1)

            // Update the state or perform any necessary actions with the updated item
            // For demonstration purposes, let's log the updated item
        }
    }

    const onSubmitSign = () => {
        var dataURL = ref?.current?.toDataURL('image/jpg+xml')
        if (!ref?.current?.isEmpty()) {
            const newId = uuid()
            setItems([
                ...items,
                {
                    id: newId,
                    isEditing: true,
                    page: checkPageIndexY ? currentPage + 1 : currentPage,
                    fieldValue: dataURL,
                    type: FieldsTypeEnum.Signature,
                    location: {
                        x: 0,
                        page: checkPageIndexY ? currentPage + 1 : currentPage,
                        y: checkPageIndexY ? 30 : yPosition || currentPageY,
                    },
                    size: {
                        width: 160,
                        height: 130,
                    },
                    saved: false,
                },
            ])
            setModal(null)
        }
    }

    const onCancelButtonClick = () => {
        onCancel && onCancel()
    }

    const onEditingClicked = (item: any) => {
        const existingItem = items.find((x: any) => x.id === item?.id)
        if (existingItem) {
            existingItem.isEditing = !existingItem.isEditing
            const updatedList = items.filter(
                (x: any) => x.id !== existingItem?.id
            )
            setItems([...updatedList, existingItem])
        }
    }

    const onSaveLogBookClicked = () => {
        const data = items
            ?.filter((item: any) => {
                if (
                    typeof item?.location?.x === 'number' &&
                    !isNaN(item?.location?.x) &&
                    typeof item?.location?.y === 'number' &&
                    !isNaN(item?.location?.y) &&
                    item?.fieldValue
                ) {
                    return item
                }
            })
            ?.map((item: any) => ({
                type: item?.type,
                value: item?.fieldValue,
                number: item?.page,
                position: `${item?.location?.x},${item?.location?.y + 47}`,
            }))
        saveLogbook({
            data,
            id: pagesCount?.data?.id,
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Logbook Updated',
                    description: 'Logbook Updated Successfully',
                })
                if (onCancel) {
                    onCancel()
                }
            }
        })
    }
    return (
        <>
            <ShowErrorNotifications result={saveLogbookResult} />
            <div className="!w-full bg-white flex justify-center items-center flex-col w-full min-w-full lg:min-w-[700px] xl:min-w-[1024px] max-w-7xl border rounded-md">
                <div className="w-full py-3.5 px-4 flex justify-between items-center">
                    <Typography variant="h4" capitalize>
                        {pagesCount?.data?.filename || null}
                    </Typography>
                    {onCancel && !hideCancelButton && (
                        <MdCancel
                            onClick={onCancelButtonClick}
                            className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                        />
                    )}
                </div>
                <div
                    className={
                        ' min-h-[380px] px-5 justify-center bg-[#F0F0F0] w-full py-4 grid grid-cols-10 gap-x-5'
                    }
                >
                    {pagesCount?.isLoading ? (
                        <div className="col-span-7">
                            <LoadingAnimation />
                        </div>
                    ) : pagesCount?.data ? (
                        <div className="relative col-span-7">
                            <div
                                ref={scrollContainerRef}
                                className="w-full h-[75vh] border-4 border-blue-400 rounded-lg overflow-auto custom-scrollbar flex flex-col gap-y-2"
                            >
                                <div className="absolute top-20 left-0 z-50  w-full flex justify-center">
                                    <div className="w-2/3">{modal}</div>
                                </div>
                                {pagesCount?.data?.size?.map(
                                    (item: any, i: number) => (
                                        <div key={i} className="bg-white">
                                            <LoogBookSVGLoader
                                                logbookId={pagesCount?.data?.id}
                                                pageTopOffset={getPageTopOffset(
                                                    i
                                                )}
                                                onChangeItemsData={
                                                    onChangeItemsData
                                                }
                                                onPageCoordinatesUpdate={(
                                                    page: number,
                                                    yPosition: number
                                                ) => {
                                                    // setCurrentPageY(yPosition)
                                                }}
                                                isPageScrolled={isPageScrolled}
                                                setCurrentPage={() => {
                                                    // setCurrentPage()
                                                }}
                                                setRenderedPagesHeight={
                                                    setRenderedPagesHeight
                                                }
                                                onItemLocationChanged={
                                                    onItemLocationChanged
                                                }
                                                onChangedLocation={
                                                    onChangedLocation
                                                }
                                                onItemMove={onItemMove}
                                                tabsError={tabsError}
                                                setTabDropCoordinates={(coordinates: {
                                                    x: number
                                                    y: number
                                                }) => {
                                                    setTabDropCoordinates(
                                                        coordinates
                                                    )
                                                }}
                                                size={item}
                                                items={items.filter(
                                                    (item: any) =>
                                                        item?.page === i
                                                )}
                                                pageNumber={i + 1}
                                                currentPageY={currentPageY}
                                                onItemRemove={onItemRemove}
                                                onItemResize={onItemResize}
                                                onItemResized={onItemResized}
                                                onItemSelected={onItemSelected}
                                                onPasteTab={onPasteTab}
                                                onEditingClicked={
                                                    onEditingClicked
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ) : pagesCount?.isSuccess ? (
                        <EmptyData />
                    ) : null}
                    <div className="col-span-3 bg-white rounded-md shadow h-full relative">
                        <div className="py-2.5 border-b border-secondary-dark">
                            <Typography variant="label" center block>
                                Logbook Editor
                            </Typography>
                        </div>
                        <LoogbookSidebar
                            setData={(item: any) => {
                                const newId = uuid()
                                setDraggableData(item)
                                if (item?.type === FieldsTypeEnum.Signature) {
                                    setModal(
                                        <LogbookSignature
                                            ref={ref}
                                            onSubmitSign={onSubmitSign}
                                        />
                                    )
                                } else {
                                    setItems([
                                        ...items,
                                        {
                                            id: newId,
                                            isEditing: true,
                                            page: checkPageIndexY
                                                ? currentPage + 1
                                                : currentPage,
                                            fieldValue: null,
                                            type: item?.type,
                                            location: {
                                                x: 0,
                                                page: checkPageIndexY
                                                    ? currentPage + 1
                                                    : currentPage,
                                                y: checkPageIndexY
                                                    ? 30
                                                    : yPosition || currentPageY,
                                                // y: checkPageIndexY
                                                //     ? 30
                                                //     : currentPageY,
                                            },
                                            size: {
                                                width: 200,
                                                height: 80,
                                            },
                                            saved: false,
                                        },
                                    ])
                                }
                            }}
                            setDraggableData={setDraggableData}
                        />
                        <div className="absolute bottom-0 w-full py-2.5 flex items-end justify-center  border-t border-secondary-dark">
                            <Button
                                text="FINISH & SAVE"
                                onClick={onSaveLogBookClicked}
                                loading={saveLogbookResult.isLoading}
                                disabled={saveLogbookResult.isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

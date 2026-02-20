'use client'
import {
    AdminNavbar,
    Button,
    DisplayAlerts,
    DisplayNotifications,
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    TechnicalError,
    Typography,
} from '@components'
import { Contextbar, Sidebar } from '@components/Esign'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import DynamicSvgLoader from '@components/Esign/components/SvgLoader'
import { UserRoles } from '@constants'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useAlert, useNavbar, useNotification } from '@hooks'
import { ShowNotificationModal, ShowWarningModal } from '@partials'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid';

export default function ESign() {
    const [mounted, setMounted] = useState(false)
    const [modal, setModal] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [activeItem, setActiveItem] = useState(true)
    const [contextBar, setContextBar] = useState<any>()
    const [copiedSelectedTab, setCopiedSelectedTab] = useState<any>()
    const [lastId, setLastId] = useState<any>('')
    const [items, setItems] = useState<any>([])
    const [newAddedItems, setNewAddedItems] = useState<any>([])
    const [lastSelectedItem, setLastSelectedItem] = useState<any>()
    const [draggableData, setDraggableData] = useState<any>()
    const [tabDropCoordinates, setTabDropCoordinates] = useState<any>(null)
    const [isTabSelected, setIsTabSelected] = useState<boolean>(false)
    const [tabsError, setTabsError] = useState<any>(null)
    const [pastedTabsCount, setPastedTabsCount] = useState<number>(1)
    const [showWarning, setShowWarning] = useState<boolean>(false)

    const navBar = useNavbar()

    const scrollTargetRef = useRef<any>([])

    const router = useRouter()

    const { notification } = useNotification()
    const { alert } = useAlert()

    useEffect(() => {
        if (contextBar) {
            setIsTabSelected(true)
        } else {
            setIsTabSelected(false)
        }
    }, [contextBar])

    const [saveEsignTemplate, saveEsignTemplateResult] =
        CommonApi.ESign.useSaveTemplate()
    const template = CommonApi.ESign.useEsignTemplate(
        { id: Number(router.query?.id), pageNumber: currentPage },
        {
            skip: !router.query?.id,
            // refetchOnMountOrArgChange: true,
        }
    )

    const pagesCount = CommonApi.ESign.useTamplatePagesCount(
        Number(router.query?.id),
        {
            skip: !router.query?.id,
            // refetchOnMountOrArgChange: true,
        }
    )

    const [removeTabs, removeTabsResult] = CommonApi.ESign.useRemoveTabs()

    const tabs = CommonApi.ESign.useGetEsignTemplateTabs(
        Number(router.query?.id),
        {
            skip:
                !router.query?.id ||
                !template?.data ||
                template?.isLoading ||
                template?.isFetching ||
                !template?.isSuccess,
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        navBar.setTitle('E-Sign')

        if (!mounted) {
            setMounted(true)
        }
    }, [])

    const onUpdateTabs = (tabsData: any, fileUploadedTabs?: boolean) => {
        const updatedItems = tabsData?.map((tab: any) => {
            const location = tab?.position?.split(',')
            const size = tab?.size?.split(',')
            return {
                id: tab?.id,
                page: Number(tab?.number) - 1,
                location: {
                    x: Number(location?.[0]),
                    y: Number(location?.[1]),
                    page: Number(tab?.number) - 1,
                },
                size: {
                    width: Number(size?.[0]),
                    height: Number(size?.[1]),
                },
                data: {
                    role: tab?.role,
                    type: tab?.type,
                    color: tab?.colour,
                    dataLabel: tab?.label,
                    column: tab?.columnName,
                    isCustom: tab?.isCustom,
                    placeholder: tab?.placeholder,
                    option: tab?.option,
                    isRequired: tab?.required,
                },
                saved: !fileUploadedTabs ? true : false,
            }
        })

        return updatedItems
    }

    useEffect(() => {
        if (tabs?.data && tabs?.data?.length > 0 && tabs?.isSuccess) {
            const updatedItems = onUpdateTabs(tabs?.data)
            setItems(updatedItems)
        }
    }, [tabs])

    const onUploadTabsData = (tabsData: any) => {
        const updatedItems = onUpdateTabs(tabsData, true)

        setItems((prev: any) => [
            ...prev,
            ...updatedItems?.map((u: any) => {
                const newId = uuid()
                return {
                    ...u,
                    id: newId,
                }
            }),
        ])
    }

    const onItemMove = (eventData: any) => {
        const [a, b, width, height] = tabDropCoordinates?.viewPortData

        setActiveItem(true)

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
        }
        // else {
        //     existingItem.data.type = FieldsTypeEnum.Text
        // }
        if (existingItem) {
            const updatedList = items.filter((x: any) => x.id !== data.item.id)
            existingItem.resizing = false
            updatedList.push(existingItem)

            setItems(updatedList)
        }
    }

    // const onItemSelected = (item: any) => {
    // 	setContextBar(item);
    // };

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

    const handleDragEnd = (data: any) => {
        setActiveItem(false)

        // const newLocX = Math.abs(
        //     data?.delta?.x * (842.04 / data?.over?.rect?.width) -
        //         data?.over?.rect?.left
        // )
        // const newLocY = Math.abs(
        //     Math.abs(data?.delta?.y * (594.96 / data?.over?.rect?.height))
        // )

        const newLocX = tabDropCoordinates?.x
        const newLocY = tabDropCoordinates?.y

        // const newLocY = Math.abs(
        //     data.delta.y - data.active.data.current.clientY / 2
        // )

        if (data) {
            // const delta_x = (() => {
            //     if (data.delta.x <= data.over.rect.left) {
            //         return 0
            //     } else if (data.delta.x > data.over.rect.left) {
            //         return data.delta.x - data.over.rect.left
            //     }
            //     return data.over.rect.left - data.delta.x
            // })()

            // const delta_y = (() => {
            //     const calDeltaY = data.delta.y % data.over.rect.height
            //     if (data.delta.y > data.over.rect.bottom) {
            //         const percent =
            //             (data.delta.y - data.over.rect.height) /
            //             data.over.rect.height
            //         return percent * 842
            //     }
            //     return data.delta.y
            // })()

            const isCheckBox =
                data.active.data.current?.type === FieldsTypeEnum.Checkbox

            const [a, b, width, height] = tabDropCoordinates?.viewPortData

            const newId = uuid()

            const yValue = isCheckBox
                ? newLocY > 0
                    ? newLocY - 3
                    : 0
                : newLocY - 12 < 0
                    ? 0
                    : newLocY - 12

            const xValue = isCheckBox
                ? newLocX > 0
                    ? newLocX - 3
                    : 0
                : newLocX - 60 < 0
                    ? 1
                    : newLocX - 60
            const tab = {
                id: newId,
                page: data?.over?.id,
                selected: true,
                location: {
                    x: width
                        ? newLocX > Number(width)
                            ? Number(width) - 50
                            : xValue
                        : xValue,
                    y: height
                        ? newLocY > Number(height)
                            ? Number(height) - 25
                            : yValue
                        : yValue,
                    page: data?.over?.id,
                },
                size: { width: 120, height: 24 },
                data: {
                    ...data.active.data.current,
                    dataLabel: data.active.id,
                    ...(data.active.data.current?.isCustom && !isCheckBox
                        ? { isRequired: true }
                        : {}),
                },
                parent: {
                    width: data?.over?.rect.width,
                    height: data?.over?.rect.height,
                    left: data?.over?.rect.left,
                    right: data?.over?.rect.right,
                    top: data?.over?.rect.top,
                    bottom: data?.over?.rect.bottom,
                },
                moving: false,
                resizing: false,
            }

            // return null

            if (tab?.page || tab?.page === 0) {
                setLastId(newId)
                setItems((prevState: any) => [
                    ...prevState?.map((item: any) => ({
                        ...item,
                        selected: false,
                    })),
                    tab,
                ])
                setContextBar(tab)
                setLastSelectedItem(tab)
                setNewAddedItems((prevState: any) => [...prevState, tab.id])
                if (data.active.data.current?.isCustom) {
                    if (
                        data.active.data.current?.type ===
                        FieldsTypeEnum.Dropdown
                    ) {
                        notification.warning({
                            title: 'Add Role and Values for Dropdown',
                            description: 'Add Role and Values for Dropdown',
                            dissmissTimer: 5555,
                        })
                    } else {
                        notification.warning({
                            title: `Add Role for ${data.active.data.current?.type.toUpperCase()} fields`,
                            description: `Add Role for ${data.active.data.current?.type.toUpperCase()} fields`,
                            dissmissTimer: 5555,
                        })
                    }
                }
            }
        }
    }

    const onItemRemove = (item: any) => {
        if (contextBar?.saved) {
            removeTabs(contextBar?.id)
        }

        setContextBar(null)
        const existingItem = items.find((x: any) => x.id === contextBar?.id)
        if (existingItem) {
            const updatedList = items.filter(
                (x: any) => x.id !== contextBar?.id
            )
            setItems(updatedList)
        }
        setLastSelectedItem(null)
    }

    // const onSetContextBar = ({ content, e }: any) => {
    //     if (content) {
    //         const updatedContent = {
    //             ...content,
    //             data: { ...content?.data, dataLabel: e.target?.value },
    //         }
    //         setItems((items: any) =>
    //             items?.map((item: any) =>
    //                 item.id === content?.id ? updatedContent : item
    //             )
    //         )
    //         setContextBar(updatedContent)
    //     }
    // }
    const onSetContextBar = ({ content, e }: any, key: string) => {
        if (content) {
            const updatedContent = {
                ...content,
                data: {
                    ...content?.data,
                    [key]:
                        key === 'isRequired'
                            ? e.target.checked
                            : e.target?.value,
                },
            }
            setItems((items: any) =>
                items?.map((item: any) =>
                    item.id === content?.id ? updatedContent : item
                )
            )
            setContextBar(updatedContent)
        }
    }

    const onSetCoordinates = (content: any, e: any, key: string) => {
        // setContextBar({
        //     ...content,
        //     location: { ...content?.location, [key]: e.target?.value },
        // })
    }

    // useEffect(() => {
    // 	const handleWindowMouseMove = (event: any) => {
    // 		const tempCoords = {
    // 			x: event.clientX,
    // 			y: event.clientY,
    // 		};
    // 		setCoords(tempCoords);
    // 	};
    // 	window.addEventListener("mousemove", handleWindowMouseMove);

    // 	return () => {
    // 		window.removeEventListener("mousemove", handleWindowMouseMove);
    // 	};
    // }, []);

    // const onHandleScroll = (id: number) => {
    //     const detailItem = document.getElementById(`document-template-${id}`)
    //     if (detailItem) {
    //         detailItem.scrollIntoView({ behavior: 'smooth' })
    //     }
    // }

    const onHandleScroll = (
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

    const onSaveTemplate = () => {
        const notRoles = items.filter((item: any) => !item?.data?.role)
        if (notRoles && notRoles?.length > 0) {
            const detailItem = document.getElementById(`${notRoles?.[0]?.id}`)
            if (detailItem) {
                detailItem.scrollIntoView({ behavior: 'smooth' })
            }
            setTabsError(notRoles)
        }
        if (notRoles && notRoles?.length > 0) {
            // notRoles?.forEach((item: any) => {
            //     notification.error({
            //         title: 'Add Role',
            //         description: `${item?.data?.type} Field role should not be empty`,
            //         dissmissTimer: 5500,
            //     })
            // })
        } else {
            const updatedItems = items.map((item: any) => ({
                label: item?.data?.dataLabel,
                position: item?.location?.x + ',' + item?.location?.y,
                isCustom: item?.data?.isCustom,
                number: item?.page + 1,
                size: item?.size?.width + ',' + item?.size?.height,
                colour: item?.data?.color,
                placeholder: item?.data?.placeholder,
                option: item?.data?.option,
                type: item?.data?.type,
                columnName: item?.data?.column,
                role: item?.data?.role,
                required: item?.data?.isRequired,
                ...(item?.saved ? { id: item?.id } : {}),
            }))

            // return null

            saveEsignTemplate({ tabs: updatedItems, id: router?.query?.id })
                .unwrap()
                .then((res: any) => {
                    if (res) {
                        notification.success({
                            title: `Tabs Saved`,
                            description: `Templates Tabs Saved Successfully`,
                            dissmissTimer: 5500,
                        })
                        setShowWarning(false)
                        setModal(
                            <ShowNotificationModal
                                onCancel={() => setModal(null)}
                            />
                        )
                    }
                })
                .catch((error: any) => {
                    if (error) {
                        const errorTitle = error?.data?.error
                        if (errorTitle && Array.isArray(error?.data?.message)) {
                            error?.data?.message?.forEach((err: any) => {
                                const tab = err?.split(' ')
                                const itemIndex = tab?.[0]?.split('.')
                                const tabField = updatedItems[itemIndex?.[1]]
                                notification.error({
                                    title: `${itemIndex?.[2]} Error`,
                                    description: `${tabField?.columnName} ${tabField?.type
                                        } ${itemIndex?.[2]} ${tab
                                            ?.slice(1)
                                            ?.join(' ')}`,
                                    dissmissTimer: 5500,
                                })
                            })
                        } else {
                            notification.error({
                                title: errorTitle || 'Some thing is not right',
                                description:
                                    error?.data?.message ||
                                    'Please check your network connection',
                                autoDismiss: true,
                            })
                        }
                    }
                })
        }
    }

    const signers = items
        ?.filter((a: any) => a?.data?.type === FieldsTypeEnum.Signature)
        ?.map((a: any) => a?.data?.role)

    const isIcluded = pagesCount?.data?.recipients?.every((a: any) =>
        signers?.includes(a)
    )

    const remainingRecipents: UserRoles[] =
        pagesCount?.data?.recipients?.filter(
            (resipent: any) => !signers?.includes(resipent)
        )

    const onSaveClick = () => {
        if (isIcluded) {
            onSaveTemplate()
        } else {
            setShowWarning(true)
        }
    }

    const onCancelTabs = () => {
        setItems(items.filter((i: any) => !newAddedItems.includes(i?.id)))
        setNewAddedItems([])
        setContextBar(null)
    }

    const onCopyTab = (e: any) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault()

            // Copy the SVG <rect> markup to the clipboard
            const svgRect = contextBar

            navigator.clipboard.writeText(svgRect).then(() => {
                setCopiedSelectedTab(svgRect)
                setPastedTabsCount(1)
            })
        }
    }

    const onPasteTab = (e: any) => {
        const newId = uuid()
        const updatedCopiedText = {
            ...copiedSelectedTab,
            saved: false,
            id: newId,
            selected: true,
            location: {
                ...copiedSelectedTab?.location,
                // x: copiedSelectedTab?.location?.x + pastedTabsCount * 10,
                y: copiedSelectedTab?.location?.y + pastedTabsCount * 12,
            },
            parent: {
                ...copiedSelectedTab?.parent,
                left: copiedSelectedTab?.over?.rect.left + pastedTabsCount * 10,
                top: copiedSelectedTab?.over?.rect.top + pastedTabsCount * 10,
            },
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault()

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
                setNewAddedItems((prevState: any) => [
                    ...prevState,
                    updatedCopiedText?.id,
                ])
                setLastSelectedItem(updatedCopiedText)
                setContextBar(updatedCopiedText)
                setPastedTabsCount(pastedTabsCount + 1)

                // Update the state or perform any necessary actions with the updated item
                // For demonstration purposes, let's log the updated item
            }
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            {modal}
            <DisplayNotifications />
            <ShowErrorNotifications result={removeTabsResult} />

            {showWarning ? (
                <ShowWarningModal
                    onConfirmClick={onSaveTemplate}
                    onCancel={() => {
                        setModal(null)
                        setShowWarning(false)
                    }}
                    loading={saveEsignTemplateResult.isLoading}
                    remainingRecipents={remainingRecipents}
                />
            ) : (
                ''
            )}

            <div className="border-b bg-white">
                <AdminNavbar />
            </div>
            <DndContext
                modifiers={[restrictToWindowEdges]}
                onDragEnd={handleDragEnd}
            // collisionDetection={pointerWithin}
            >
                <div className="bg-gray-200">
                    <div className="z-20 fixed w-full left-0 bottom-0 p-4 bg-white flex justify-end gap-x-2">
                        <Button
                            variant="primary"
                            text={'Remove Newly Added Tabs'}
                            outline
                            disabled={saveEsignTemplateResult.isLoading}
                            onClick={onCancelTabs}
                        />
                        <Button
                            variant="info"
                            text={'Save Template Tabs'}
                            loading={saveEsignTemplateResult.isLoading}
                            disabled={saveEsignTemplateResult.isLoading}
                            onClick={onSaveClick}
                        />
                    </div>
                    <div className="flex">
                        <Sidebar
                            setDraggableData={setDraggableData}
                            recipients={pagesCount?.data?.recipients}
                        />
                        <div className="w-full h-screen overflow-y-scroll pb-24">
                            <DisplayAlerts />

                            <DragOverlay>
                                {draggableData ? (
                                    <div>
                                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full rounded-md">
                                            <span
                                                className="text-xs p-2 rounded-md border"
                                                style={{
                                                    backgroundColor: `${draggableData?.color}26`,
                                                    borderColor:
                                                        draggableData?.color,
                                                    color: draggableData?.color,
                                                }}
                                            >
                                                <draggableData.Icon />
                                            </span>
                                            <p className="text-sm">
                                                {draggableData?.text}
                                            </p>
                                        </button>
                                    </div>
                                ) : null}
                            </DragOverlay>

                            {pagesCount.isError && (
                                <TechnicalError height="bg-white" />
                            )}

                            {pagesCount.isLoading ? (
                                <LoadingAnimation height="h-[70vh]" />
                            ) : mounted && pagesCount?.data ? (
                                <div className="p-5">
                                    <div className="flex gap-x-2 items-center w-full rounded-md bg-white p-3 mb-3">
                                        <div>
                                            <Typography variant={'label'}>
                                                Drag and Drop the fields
                                            </Typography>
                                            <Typography variant={'small'}>
                                                Drag and Drop the fields From
                                                Left Sidebar to create a
                                                template
                                            </Typography>
                                        </div>
                                    </div>

                                    {pagesCount?.data?.size?.map(
                                        (item: any, i: number) => (
                                            <div
                                                id={`document-template-${i}`}
                                                key={i}
                                                ref={(el: any) =>
                                                (scrollTargetRef.current[
                                                    i
                                                ] = el as any)
                                                }
                                            >
                                                <div
                                                    onKeyDown={(e: any) => {
                                                        onCopyTab(e)
                                                        onPasteTab(e)
                                                    }}
                                                    className="relative bg-white w-full rounded-lg overflow-hidden"
                                                >
                                                    <div className="w-6 h-6 flex justify-center absolute top-0 left-1/2 -translate-x-1/2 bg-white p-0.5 shadow-2xl rounded-full">
                                                        <Typography variant="label">
                                                            {i + 1}
                                                        </Typography>
                                                    </div>
                                                    <DynamicSvgLoader
                                                        setTabDropCoordinates={(coordinates: {
                                                            x: number
                                                            y: number
                                                        }) => {
                                                            setTabDropCoordinates(
                                                                coordinates
                                                            )
                                                        }}
                                                        size={item}
                                                        items={items}
                                                        pageNumber={i + 1}
                                                        // path={item}
                                                        page={currentPage + 1}
                                                        onItemSelected={
                                                            onItemSelected
                                                        }
                                                        onItemMove={onItemMove}
                                                        onItemLocationChanged={
                                                            onItemLocationChanged
                                                        }
                                                        onItemResize={
                                                            onItemResize
                                                        }
                                                        onItemResized={
                                                            onItemResized
                                                        }
                                                        onItemRemove={
                                                            onItemRemove
                                                        }
                                                        tabsError={tabsError}
                                                    />
                                                </div>
                                                <div className="my-8" />
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                template.isSuccess && <EmptyData />
                            )}
                        </div>
                        <Contextbar
                            onUploadTabsData={onUploadTabsData}
                            onHandleScroll={onHandleScroll}
                            content={contextBar}
                            onSetContextBar={(e: any, key: string) => {
                                onSetContextBar(e, key)
                            }}
                            tabsLength={tabs?.data?.length}
                            onSetCoordinates={(
                                content: any,
                                e: any,
                                key: string
                            ) => {
                                onSetCoordinates(content, e, key)
                            }}
                            setCurrentPage={(currentPage: number) => {
                                setCurrentPage(currentPage)
                            }}
                            items={items}
                            totalPages={pagesCount?.data?.pageCount}
                            isTabSelected={isTabSelected}
                            recipients={pagesCount?.data?.recipients}
                            signTabs={items?.filter(
                                (item: any) =>
                                    item?.data?.type ===
                                    FieldsTypeEnum.Signature
                            )}
                        />
                    </div>
                </div>
            </DndContext>
        </div>
    )
}

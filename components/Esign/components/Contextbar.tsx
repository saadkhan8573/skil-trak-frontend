'use client'

import { Typography } from '@components/Typography'
import { Checkbox } from '@components/inputs'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { DownloadTabs } from './DownloadTabs'
import { FieldsTypeEnum } from './SidebarData'
import { UploadTabs } from './UploadTabs'

export const Contextbar = ({
    items,
    content,
    totalPages,
    isTabSelected,
    onHandleScroll,
    setCurrentPage,
    onUploadTabsData,
    onSetContextBar,
    onSetCoordinates,
    recipients,
    tabsLength,
    signTabs,
}: {
    signTabs: any
    onUploadTabsData: any
    items: any
    content: any
    totalPages: number
    onHandleScroll: any
    isTabSelected: boolean
    recipients: string[]
    setCurrentPage: (pageNumber: number) => void
    onSetContextBar: (e: any, key: string) => void
    tabsLength: number
    onSetCoordinates: (content: any, cordinate: any, key: string) => void
}) => {
    const [inputs, setInputs] = useState([''])
    const [currentTabId, setCurrentTabId] = useState('')

    const router = useRouter()
    const { notification } = useNotification()

    const currentTabContent = items?.find(
        (item: any) => item?.id === content?.id
    )

    useEffect(() => {
        if (content) {
            setCurrentTabId(content?.id)
        }
    }, [content])

    useEffect(() => {
        if (inputs && inputs?.length > 0) {
            onSetContextBar(
                {
                    content,
                    e: {
                        target: {
                            value: inputs.join(','),
                        },
                    },
                },
                'option'
            )
        }
    }, [inputs])

    useEffect(() => {
        if (
            isTabSelected &&
            currentTabId === content?.id &&
            content?.data?.option
        ) {
            const inputsData = content?.data?.option?.split(',')
            if (inputsData && inputsData?.length > 0) {
                setInputs(inputsData)
            }
        } else {
            setInputs([''])
        }
    }, [isTabSelected, currentTabId])

    const handleAddInput = () => {
        setInputs([...inputs, ''])
    }

    const handleChange = (event: any, index: any) => {
        let { name, value } = event.target
        let onChangeValue: any = [...inputs]
        onChangeValue[index] = value
        setInputs(onChangeValue)
    }

    const handleDeleteInput = (index: number) => {
        const newArray = [...inputs]
        newArray.splice(index, 1)
        setInputs(newArray)
    }

    const isExist = (key: string) =>
        items?.find(
            (item: any) =>
                item?.data?.[key]?.toLowerCase() ===
                    content?.data?.[key]?.toLowerCase() &&
                item?.id != content?.id
        )

    return (
        <>
            {/* <ShowErrorNotifications result={downloadTabsResult} /> */}
            <div className="min-w-[250px] h-screen overflow-auto custom-scrollbar bg-white px-4 py-2">
                <div className="h-[81%] overflow-auto custom-scrollbar">
                    <div className="text-sm font-medium">
                        {content?.type || 'Select Input'}
                    </div>
                    <hr />
                    <div>
                        <p className="text-sm font-medium">Location</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                                <Typography
                                    variant="small"
                                    semibold
                                    color={'text-gray-600'}
                                >
                                    X:
                                </Typography>
                                <input
                                    type="number"
                                    onChange={(e: any) => {
                                        onSetCoordinates(content, e, 'x')
                                    }}
                                    value={content?.location?.x || ''}
                                    className="border p-0 w-full h-8 shadow rounded-md px-1"
                                />
                            </div>
                            <div className="flex flex-col ">
                                <Typography
                                    variant="small"
                                    semibold
                                    color={'text-gray-600'}
                                >
                                    Y:
                                </Typography>
                                <input
                                    type="number"
                                    onChange={(e: any) => {
                                        onSetCoordinates(content, e, 'y')
                                    }}
                                    value={content?.location?.y || ''}
                                    className="border p-0 w-full h-8 shadow rounded-md px-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <Typography
                            variant="small"
                            semibold
                            color={'text-gray-600'}
                        >
                            Data Label
                        </Typography>
                        <input
                            type="text"
                            onChange={(e: any) => {
                                onSetContextBar({ content, e }, 'dataLabel')
                            }}
                            disabled={content?.data?.preDefined}
                            value={content?.data?.dataLabel || ''}
                            className={`order p-0 w-full border h-8 shadow rounded-md px-1 ${
                                content?.data?.preDefined
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : ''
                            }`}
                        />
                        {/* {isExist('dataLabel') && content?.data?.dataLabel && (
                    <p className="text-xs text-error">
                        {content?.data?.dataLabel} Data Label Already exist
                    </p>
                )} */}
                    </div>
                    {/* <div className="mt-2">
                <p className="text-sm font-medium">Data Type</p>
                <select
                    className={`border w-full rounded ${
                        content?.data?.preDefined
                            ? 'bg-gray-200 cursor-not-allowed'
                            : ''
                    }`}
                    name=""
                    id=""
                    disabled={content?.data?.preDefined}
                    value={content?.data?.type || ''}
                    onChange={(e: any) => {
                        onSetContextBar({ content, e }, 'type')
                    }}
                >
                    <option value="">Select</option>
                    <option value={FieldsTypeEnum.Text}>Text</option>
                    <option value={FieldsTypeEnum.Email}>Email</option>
                    <option value={FieldsTypeEnum.Date}>Date</option>
                </select>
            </div> */}

                    {content?.data?.isCustom && (
                        <>
                            <div className="mt-3">
                                <Typography
                                    variant="small"
                                    semibold
                                    color={'text-gray-600'}
                                >
                                    {content?.data?.type ===
                                    FieldsTypeEnum.Radio
                                        ? 'Group Name'
                                        : 'Name'}
                                </Typography>{' '}
                                <input
                                    type="text"
                                    onChange={(e: any) => {
                                        onSetContextBar(
                                            { content, e },
                                            'column'
                                        )
                                    }}
                                    disabled={content?.data?.preDefined}
                                    value={content?.data?.column || ''}
                                    className={`order p-0 w-full border h-8 shadow rounded-md px-1 ${
                                        content?.data?.preDefined
                                            ? 'bg-gray-200 cursor-not-allowed'
                                            : ''
                                    }`}
                                />
                                {content?.data?.type ===
                                    FieldsTypeEnum.Radio && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        Radio buttons with the same group name
                                        allow only one selection.
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Typography
                                    variant="small"
                                    semibold
                                    color={'text-gray-600'}
                                >
                                    {content?.data?.type ===
                                    FieldsTypeEnum.Radio
                                        ? 'Label (option text)'
                                        : 'Placeholder'}
                                </Typography>{' '}
                                <input
                                    type="text"
                                    onChange={(e: any) => {
                                        onSetContextBar(
                                            { content, e },
                                            'placeholder'
                                        )
                                    }}
                                    disabled={content?.data?.preDefined}
                                    value={content?.data?.placeholder || ''}
                                    className={`order p-0 w-full border h-8 text-sm shadow rounded-md px-1 ${
                                        content?.data?.preDefined
                                            ? 'bg-gray-200 cursor-not-allowed'
                                            : ''
                                    }`}
                                />
                                {content?.data?.type ===
                                    FieldsTypeEnum.Radio && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        This text will appear next to the radio
                                        button when signing.
                                    </p>
                                )}
                            </div>

                            {content?.data?.type ===
                                FieldsTypeEnum.Dropdown && (
                                <div className="mt-3">
                                    <Typography
                                        variant="small"
                                        semibold
                                        color={'text-gray-600'}
                                    >
                                        DropDown Values
                                    </Typography>

                                    <div className="mb-3 flex flex-col gap-y-2">
                                        {inputs.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`order p-0 w-full border h-7 shadow rounded-md input_container flex items-center gap-x-1 overflow-hidden pr-1 ${
                                                    content?.data?.preDefined
                                                        ? 'bg-gray-200 cursor-not-allowed'
                                                        : ''
                                                }`}
                                            >
                                                {/* {index === inputs.length - 1 && (
                                               
                                            )} */}

                                                <div
                                                    onClick={() => {
                                                        if (inputs.length > 1) {
                                                            handleDeleteInput(
                                                                index
                                                            )
                                                        }
                                                    }}
                                                    className={` flex items-center justify-center w-7 h-full ${
                                                        inputs.length > 1
                                                            ? 'cursor-pointer bg-gray-200'
                                                            : 'cursor-not-allowed bg-gray-100'
                                                    } `}
                                                >
                                                    <MdDelete
                                                        className={`${
                                                            inputs.length > 1
                                                                ? 'text-gray-500'
                                                                : 'text-gray-300'
                                                        } `}
                                                    />
                                                </div>

                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    value={item}
                                                    placeholder="Add Dropdown Option"
                                                    onChange={(event) =>
                                                        handleChange(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                    className="w-full outline-none px-2 placeholder:text-xs text-[11px]"
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="bg-[#F7910F90] rounded-sm w-full h-7 flex items-center justify-center cursor-pointer"
                                            onClick={() => handleAddInput()}
                                        >
                                            <FiPlus className="text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-3">
                                <Typography
                                    variant="small"
                                    semibold
                                    color={'text-gray-600'}
                                >
                                    Please Select the authorizrd user for the
                                    tab
                                </Typography>
                                <select
                                    className={`border border-gray-300 text-sm font-semibold h-8 outline-none w-full shadow-md rounded-md px-1 ${
                                        content?.data?.preDefined
                                            ? 'bg-gray-200 cursor-not-allowed'
                                            : ''
                                    }`}
                                    name=""
                                    id=""
                                    value={content?.data?.role || ''}
                                    onChange={(e: any) => {
                                        onSetContextBar({ content, e }, 'role')
                                    }}
                                >
                                    <option value="">Select</option>
                                    {Object.entries(
                                        Object.fromEntries(
                                            Object.entries({
                                                Admin: UserRoles.ADMIN,
                                                Rto: UserRoles.RTO,
                                                Student: UserRoles.STUDENT,
                                                Industry: UserRoles.INDUSTRY,
                                                Coordinator: UserRoles.SUBADMIN,
                                            }).filter(([key, value]) =>
                                                recipients.includes(value)
                                            )
                                        )
                                    ).map(([key, value]) => (
                                        <option
                                            key={key}
                                            value={value}
                                            className="capitalize"
                                        >
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2 flex items-center gap-x-2">
                                <Checkbox
                                    name={'isRequired'}
                                    onChange={(e: any) => {
                                        onSetContextBar(
                                            { content, e },
                                            'isRequired'
                                        )
                                    }}
                                    defaultChecked={
                                        content?.data?.isRequired || false
                                    }
                                    value={content?.data?.isRequired}
                                    id="isRequired"
                                    label={'IsRequired'}
                                />
                                {/* <label htmlFor="isRequired">IsRequired</label> */}
                            </div>
                        </>
                    )}

                    {tabsLength && tabsLength > 0 ? <DownloadTabs /> : null}

                    <UploadTabs
                        onFileChange={(rows: any) => {
                            onUploadTabsData(rows)
                        }}
                    />

                    <div>
                        <Typography variant="label">Signers Tab</Typography>

                        <div className="flex flex-col gap-y-2">
                            {signTabs?.map((sign: any) => (
                                <div
                                    key={sign?.id}
                                    className="w-40 py-1 px-2 rounded"
                                    style={{
                                        backgroundColor: sign?.data?.color,
                                    }}
                                    onClick={() => {
                                        onHandleScroll(sign?.id, sign?.page)
                                    }}
                                >
                                    <Typography variant="label">
                                        {sign?.data?.placeholder}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>

                    {totalPages && (
                        <div className="mt-4">
                            <Typography
                                variant="label"
                                color="text-gray-600"
                                semibold
                            >
                                Page Numbers
                            </Typography>
                            <div className="grid grid-cols-4 gap-3 mt-2">
                                {[...Array(Number(totalPages))]?.map((_, i) => (
                                    <span
                                        key={i}
                                        onClick={() => {
                                            // setCurrentPage(i)
                                            onHandleScroll(_, i)
                                        }}
                                        className="w-8 h-8 rounded-full bg-success text-white text-xs font-bold flex justify-center items-center cursor-pointer"
                                    >
                                        {i + 1}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="mt-2">
                <p className="text-sm font-medium">Data Type</p>
                <select
                    className={`border w-full rounded ${
                        content?.data?.preDefined
                            ? 'bg-gray-200 cursor-not-allowed'
                            : ''
                    }`}
                    name=""
                    id=""
                    disabled={content?.data?.preDefined}
                    value={content?.data?.type || ''}
                    onChange={(e: any) => {
                        onSetContextBar({ content, e }, 'type')
                    }}
                >
                    <option value="">Select</option>
                    <option value={FieldsTypeEnum.Text}>Text</option>
                    <option value={FieldsTypeEnum.Email}>Email</option>
                    <option value={FieldsTypeEnum.Date}>Date</option>
                </select>
            </div> */}
            </div>
        </>
    )
}

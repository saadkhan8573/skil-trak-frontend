import { AuthorizedUserComponent, ShowErrorNotifications } from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { LoadingSpinner } from '@components/inputs/components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { debounce } from 'lodash'
import Image from 'next/image'
import moment from 'moment'
import React, { KeyboardEvent, useCallback } from 'react'
import { FaSignature } from 'react-icons/fa'

export const TabsField = ({
    fieldData,
    outerIndex,
    onHandleKeyDown,
    onAddCustomFieldsData,
    onSignatureClicked,
    selectedFillDataField,
    allFields,
}: {
    outerIndex: number
    fieldData: any
    onHandleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
    onAddCustomFieldsData: any
    onSignatureClicked: any
    selectedFillDataField?: any
    allFields?: any[]
}) => {
    const [x, y] = fieldData ? fieldData?.position?.split(',') : []
    const [width, height] = fieldData ? fieldData?.size?.split(',') : []

    const { notification } = useNotification()

    // For radio buttons: check if ANY field in the same group (same columnName) has a response.
    // If so, hide ALL radios in that group (including those without their own response).
    const radioGroupHasResponse =
        fieldData?.type === FieldsTypeEnum.Radio &&
        fieldData?.columnName &&
        (allFields ?? []).some(
            (f: any) =>
                f?.columnName === fieldData?.columnName &&
                f?.type === FieldsTypeEnum.Radio &&
                f?.responses?.length > 0
        )

    const latestResponse = fieldData?.responses?.reduce(
        (accumulator: any, current: any) => {
            return moment(current.updatedAt).isAfter(accumulator.updatedAt)
                ? current
                : accumulator
        },
        fieldData?.responses[0]
    )

    const [updateSignDate, updateSignDateResult] =
        CommonApi.ESign.useUpdateSignDate()

    const onUpdateSignDate = useCallback(
        debounce(
            (event: any, tab: any) =>
                updateSignDate({
                    date: event?.target?.value,
                    id: tab?.responses?.[0]?.id,
                }).then((res: any) => {
                    if (res?.data) {
                        notification.success({
                            title: 'Date Updated',
                            description: 'Date Updated Successfully',
                        })
                    }
                }),
            1600
        ),
        []
    )

    return (
        <>
            <ShowErrorNotifications result={updateSignDateResult} />
            {fieldData?.number === outerIndex + 1 ? (
                <foreignObject
                    x={x}
                    y={y}
                    width={
                        fieldData?.type === FieldsTypeEnum.Checkbox
                            ? 13
                            : fieldData?.type === FieldsTypeEnum.Date
                              ? String(Number(width) + 10)
                              : width
                    }
                    height={
                        fieldData?.type === FieldsTypeEnum.Checkbox
                            ? 13
                            : fieldData?.type === FieldsTypeEnum.Date
                              ? String(Number(height) + 10)
                              : height
                    }
                >
                    {fieldData?.type === FieldsTypeEnum.Signature ? (
                        fieldData?.responses &&
                        fieldData?.responses?.length > 0 &&
                        !latestResponse?.reSignRequested ? (
                            ''
                        ) : fieldData?.fieldValue &&
                          !latestResponse?.reSignRequested ? (
                            <Image
                                src={fieldData?.fieldValue}
                                alt={''}
                                width={0}
                                height={0}
                                sizes={'100vw 100vh'}
                                className="w-full h-full"
                            />
                        ) : (
                            <div
                                id={`tabs-view-${fieldData?.id}`}
                                onClick={() => onSignatureClicked(fieldData)}
                                className={`z-10 w-full h-full bg-red-600 flex justify-center items-center gap-x-2 text-white ${
                                    selectedFillDataField === fieldData?.id
                                        ? 'border-2 border-primary-light'
                                        : ''
                                }  rounded`}
                            >
                                <FaSignature className="text-xs" />
                                <button className="text-[7px]">
                                    Click here to Sign
                                </button>
                            </div>
                        )
                    ) : null}
                    {(!fieldData?.responses?.length ||
                        latestResponse?.reSignRequested) &&
                    !radioGroupHasResponse ? (
                        fieldData?.type === FieldsTypeEnum.Text &&
                        fieldData?.isCustom ? (
                            <input
                                onKeyDown={onHandleKeyDown}
                                type="text"
                                name=""
                                id={`tabs-view-${fieldData?.id}`}
                                value={fieldData?.fieldValue}
                                className={`w-full h-full border-3 rounded-md placeholder:text-xs ${
                                    !fieldData?.fieldValue
                                        ? 'border-red-500'
                                        : selectedFillDataField ===
                                            fieldData?.id
                                          ? 'border-primary'
                                          : 'border-gray-500'
                                } text-sm p-1 outline-none`}
                                placeholder={fieldData?.placeholder}
                                onChange={(e: any) => {
                                    onAddCustomFieldsData({
                                        ...fieldData,
                                        fieldValue: e?.target?.value,
                                    })
                                }}
                            />
                        ) : fieldData?.type === FieldsTypeEnum.TextArea &&
                          fieldData?.isCustom ? (
                            <textarea
                                onKeyDown={(e: any) => {
                                    onHandleKeyDown(e)
                                }}
                                name=""
                                id={`tabs-view-${fieldData?.id}`}
                                value={fieldData?.fieldValue}
                                className={`w-full h-full border-2 rounded-md placeholder:text-xs ${
                                    !fieldData?.fieldValue
                                        ? 'border-red-500'
                                        : selectedFillDataField ===
                                            fieldData?.id
                                          ? 'border-primary'
                                          : 'border-gray-500'
                                } text-sm p-1 outline-none`}
                                placeholder={fieldData?.placeholder}
                                onChange={(e: any) => {
                                    onAddCustomFieldsData({
                                        ...fieldData,
                                        fieldValue: e?.target?.value,
                                    })
                                }}
                            ></textarea>
                        ) : fieldData?.type === FieldsTypeEnum.Checkbox ? (
                            <div className="flex items-center gap-x-2 w-full h-full">
                                <input
                                    onKeyDown={onHandleKeyDown}
                                    type={FieldsTypeEnum.Checkbox}
                                    name={fieldData?.columnName}
                                    id={`tabs-view-${fieldData?.id}`}
                                    // defaultChecked={fieldData?.fieldValue}
                                    checked={fieldData?.fieldValue}
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        width: '20px',
                                        height: '20px',
                                        position: 'relative',
                                        outline: 'none',
                                    }}
                                    value={fieldData?.fieldValue}
                                    className={`noDefault z-10  ${
                                        selectedFillDataField === fieldData?.id
                                            ? 'border-primary border-2'
                                            : 'border-gray-500 border'
                                    } !w-full !h-full rounded-sm text-sm p-1 outline-none`}
                                    placeholder={fieldData?.label}
                                    onChange={(e: any) => {
                                        onAddCustomFieldsData({
                                            ...fieldData,
                                            fieldValue: e?.target?.checked,
                                        })
                                    }}
                                />
                                {fieldData?.fieldValue && (
                                    <span className="z-0 w-full h-full bg-info-dark flex justify-center items-center rounded-sm text-white absolute top-1/2 left-1/2 text-[8px] font-semibold -translate-x-1/2 -translate-y-1/2">
                                        &#10003;
                                    </span>
                                )}
                            </div>
                        ) : fieldData?.type === FieldsTypeEnum.Radio ? (
                            <div className="flex items-center gap-x-2">
                                <input
                                    onKeyDown={onHandleKeyDown}
                                    type={FieldsTypeEnum.Radio}
                                    name={fieldData?.columnName}
                                    id={`tabs-view-${fieldData?.id}`}
                                    value={fieldData?.fieldValue}
                                    className="border rounded-md border-gray-500 text-sm p-1 outline-none"
                                    placeholder={fieldData?.label}
                                    onChange={(e: any) => {
                                        onAddCustomFieldsData({
                                            ...fieldData,
                                            fieldValue: e?.target?.checked,
                                        })
                                    }}
                                />
                            </div>
                        ) : fieldData?.type === FieldsTypeEnum.Dropdown ? (
                            <select
                                onKeyDown={(e: any) => {
                                    onHandleKeyDown(e)
                                }}
                                value={fieldData?.fieldValue}
                                onChange={(e: any) => {
                                    onAddCustomFieldsData({
                                        ...fieldData,
                                        fieldValue: e?.target?.value,
                                    })
                                }}
                                id={`tabs-view-${fieldData?.id}`}
                                className={`w-full h-4 border rounded text-xs ${
                                    !fieldData?.fieldValue ||
                                    fieldData?.fieldValue === 'Select'
                                        ? 'border-red-500'
                                        : 'border-gray-600'
                                }`}
                            >
                                <option>Select</option>
                                {fieldData?.option &&
                                    fieldData?.option
                                        ?.split(',')
                                        ?.map((data: string) => (
                                            <option key={data} value={data}>
                                                {data}
                                            </option>
                                        ))}
                            </select>
                        ) : (
                            ''
                        )
                    ) : null}
                    {fieldData?.type === FieldsTypeEnum.Date &&
                    fieldData?.responses &&
                    fieldData?.responses?.length > 0 &&
                    !latestResponse?.reSignRequested ? (
                        <AuthorizedUserComponent roles={[UserRoles.SUBADMIN]}>
                            <div className="bg-white relative flex flex-col ">
                                <label htmlFor="" className="text-[8px]">
                                    {fieldData?.placeholder}
                                </label>

                                <input
                                    onKeyDown={onHandleKeyDown}
                                    type="date"
                                    name=""
                                    id={`tabs-view-${fieldData?.id}`}
                                    value={moment(fieldData?.fieldValue).format(
                                        'YYYY-MM-DD'
                                    )}
                                    className={`w-full h-5 border rounded-md text-sm p-1 outline-none ${
                                        !fieldData?.fieldValue
                                            ? 'border-red-500'
                                            : 'border-gray-500'
                                    }`}
                                    placeholder={fieldData?.label}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        // Handle changes only if the input field has focus (i.e., not when the month or year are changed)

                                        onAddCustomFieldsData({
                                            ...fieldData,
                                            fieldValue: e.target.value,
                                        })
                                        onUpdateSignDate(e, fieldData)
                                    }}
                                />
                                {updateSignDateResult?.isLoading && (
                                    <LoadingSpinner
                                        loading={
                                            updateSignDateResult?.isLoading
                                        }
                                    />
                                )}
                            </div>
                        </AuthorizedUserComponent>
                    ) : (
                        ''
                    )}
                </foreignObject>
            ) : null}
        </>
    )
}

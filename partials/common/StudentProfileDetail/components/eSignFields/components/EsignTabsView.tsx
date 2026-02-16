import { AuthorizedUserComponent, ShowErrorNotifications } from '@components'
import { FieldsTypeEnum } from '@components/Esign/components/SidebarData'
import { LoadingSpinner } from '@components/inputs/components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import debounce from 'lodash/debounce'
import React, { KeyboardEvent, useCallback } from 'react'

export const EsignTabsView = ({
    onHandleKeyDown,
    customFieldsData,
    index,
    onAddCustomFieldsData,
    selectedFillDataField,
}: {
    onHandleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
    index: number
    customFieldsData: any
    onAddCustomFieldsData: any
    selectedFillDataField?: any
}) => {
    const { notification } = useNotification()

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
            {customFieldsData &&
                customFieldsData?.length > 0 &&
                customFieldsData?.map((s: any, i: any) => {
                    const [x, y] = s ? s?.position?.split(',') : []
                    const [width, height] = s ? s?.size?.split(',') : []

                    const latestResponse = s?.responses?.reduce(
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
                        s?.responses[0]
                    )

                    return s?.number === index + 1 ? (
                        <foreignObject
                            x={x}
                            y={y}
                            width={
                                s?.type === FieldsTypeEnum.Checkbox
                                    ? 13
                                    : s?.type === FieldsTypeEnum.Date
                                        ? String(Number(width) + 10)
                                        : width
                            }
                            height={
                                s?.type === FieldsTypeEnum.Checkbox
                                    ? 13
                                    : s?.type === FieldsTypeEnum.Date
                                        ? String(Number(height) + 10)
                                        : height
                            }
                        >
                            {true ? (
                                s?.type === FieldsTypeEnum.Text &&
                                    s?.isCustom ? (
                                    <input
                                        onKeyDown={onHandleKeyDown}
                                        type="text"
                                        name=""
                                        id={`tabs-view-${s?.id}`}
                                        value={s?.fieldValue}
                                        className={`w-full h-full border-2 rounded-md placeholder:text-xs ${selectedFillDataField === s?.id
                                            ? 'border-primary'
                                            : 'border-gray-500'
                                            } text-sm p-1 outline-none`}
                                        placeholder={s?.placeholder}
                                        onChange={(e: any) => {
                                            onAddCustomFieldsData({
                                                ...s,
                                                fieldValue: e?.target?.value,
                                            })
                                        }}
                                    />
                                ) : s?.type === FieldsTypeEnum.TextArea &&
                                    s?.isCustom ? (
                                    <textarea
                                        onKeyDown={(e: any) => {
                                            onHandleKeyDown(e)
                                        }}
                                        name=""
                                        id={`tabs-view-${s?.id}`}
                                        value={s?.fieldValue}
                                        className={`w-full h-full border-2 rounded-md placeholder:text-xs ${selectedFillDataField === s?.id
                                            ? 'border-primary'
                                            : 'border-gray-500'
                                            } text-sm p-1 outline-none`}
                                        placeholder={s?.placeholder}
                                        onChange={(e: any) => {
                                            onAddCustomFieldsData({
                                                ...s,
                                                fieldValue: e?.target?.value,
                                            })
                                        }}
                                    ></textarea>
                                ) : s?.type === FieldsTypeEnum.Checkbox ? (
                                    <div className="flex items-center gap-x-2 w-full h-full">
                                        <input
                                            onKeyDown={onHandleKeyDown}
                                            type={FieldsTypeEnum.Checkbox}
                                            name={s?.columnName}
                                            id={`tabs-view-${s?.id}`}
                                            // defaultChecked={s?.fieldValue}
                                            checked={s?.fieldValue}
                                            style={{
                                                appearance: 'none',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                width: '20px',
                                                height: '20px',
                                                position: 'relative',
                                                outline: 'none',
                                            }}
                                            value={s?.fieldValue}
                                            className={`noDefault z-10  ${selectedFillDataField === s?.id
                                                ? 'border-primary border-2'
                                                : 'border-gray-500 border'
                                                } w-full! h-full! rounded-sm text-sm p-1 outline-none`}
                                            placeholder={s?.label}
                                            onChange={(e: any) => {
                                                onAddCustomFieldsData({
                                                    ...s,
                                                    fieldValue:
                                                        e?.target?.checked,
                                                })
                                            }}
                                        />
                                        {s?.fieldValue && (
                                            <span className="z-0 w-full h-full bg-info-dark flex justify-center items-center rounded-sm text-white absolute top-1/2 left-1/2 text-[8px] font-semibold -translate-x-1/2 -translate-y-1/2">
                                                &#10003;
                                            </span>
                                        )}
                                    </div>
                                ) : s?.type === FieldsTypeEnum.Radio ? (
                                    <div className="flex items-center gap-x-2">
                                        <input
                                            onKeyDown={onHandleKeyDown}
                                            type={FieldsTypeEnum.Radio}
                                            name={s?.columnName}
                                            id={`tabs-view-${s?.id}`}
                                            value={s?.fieldValue}
                                            className="border rounded-md border-gray-500 text-sm p-1 outline-none"
                                            placeholder={s?.label}
                                            onChange={(e: any) => {
                                                onAddCustomFieldsData({
                                                    ...s,
                                                    fieldValue:
                                                        e?.target?.checked,
                                                })
                                            }}
                                        />
                                        {/* <label className="text-xs capitalize">
                                {s?.label}
                            </label> */}
                                    </div>
                                ) : s?.type === FieldsTypeEnum.Dropdown ? (
                                    <select
                                        onKeyDown={(e: any) => {
                                            onHandleKeyDown(e)
                                        }}
                                        value={s?.fieldValue}
                                        onChange={(e: any) => {
                                            onAddCustomFieldsData({
                                                ...s,
                                                fieldValue: e?.target?.value,
                                            })
                                        }}
                                        id={`tabs-view-${s?.id}`}
                                        className="w-full h-4 border border-gray-600 rounded text-xs"
                                    >
                                        <option>Select</option>
                                        {s?.option &&
                                            s?.option
                                                ?.split(',')
                                                ?.map((data: string) => (
                                                    <option
                                                        key={data}
                                                        value={data}
                                                    >
                                                        {data}
                                                    </option>
                                                ))}
                                    </select>
                                ) : (
                                    ''
                                )
                            ) : null}
                            {s?.type === FieldsTypeEnum.Date &&
                                s?.responses &&
                                s?.responses?.length > 0 ? (
                                <AuthorizedUserComponent
                                    roles={[UserRoles.SUBADMIN]}
                                >
                                    <div className="bg-white relative flex flex-col ">
                                        <label
                                            htmlFor=""
                                            className="text-[8px]"
                                        >
                                            {s?.placeholder}
                                        </label>

                                        <input
                                            onKeyDown={onHandleKeyDown}
                                            type="date"
                                            name=""
                                            id={`tabs-view-${s?.id}`}
                                            value={s?.fieldValue?.slice(0, 10)}
                                            className="w-full h-5 border rounded-md border-gray-500 text-sm p-1 outline-none"
                                            placeholder={s?.label}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                                // Handle changes only if the input field has focus (i.e., not when the month or year are changed)

                                                onAddCustomFieldsData({
                                                    ...s,
                                                    fieldValue: e.target.value,
                                                })
                                                onUpdateSignDate(e, s)
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
                    ) : null
                })}
        </>
    )
}

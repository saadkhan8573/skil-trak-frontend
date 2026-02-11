import {
    Button,
    Checkbox,
    GlobalModal,
    RadioGroup,
    ShowErrorNotifications,
    Switch,
    TextInput,
    Typography,
} from '@components'
import { InputErrorMessage } from '@components/inputs/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { InvoiceTypeEnum } from '@partials/admin/invoices'
import { AdminApi } from '@queries'
import { OptionType, Rto } from '@types'
import { removeEmptyValues } from '@utils'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { TbReportSearch } from 'react-icons/tb'
import * as Yup from 'yup'

export const AllowInvoicingModal = ({
    rto,
    onCancel,
}: {
    rto: Rto
    onCancel: () => void
}) => {
    const [invoiceSettingData, setInvoiceSettingData] = useState<number[]>(
        rto?.invoiceSettings?.map((invSetting) => invSetting?.invoiceAction?.id)
    )

    // useEffect(() => {
    //     setInvoiceSettingData(
    //         rto?.invoiceSettings?.map(
    //             (invSetting) => invSetting?.invoiceAction?.id
    //         )
    //     )
    // }, [])

    const { notification } = useNotification()

    const [allowPermissions, allowPermissionsResult] =
        AdminApi.Rtos.allowInvoicingPermission()
    const [invoiceSetting, invoiceSettingResult] =
        AdminApi.Invoice.addRtoInvoiceSetting()
    const categoriesList = AdminApi.Invoice.invoiceCategorisList()

    const validationSchema = Yup.object({
        invoicingType: Yup.string()
            // .oneOf(Object.values(InvoiceTypeEnum))
            .required('Invoice type is required')
            .defined(),
        invoiceAction: Yup.array()
            .of(Yup.number().defined())
            .min(1, 'At least one invoice category must be selected')
            .required('Please select at least one invoice category')
            .defined(),
        startDate: Yup.mixed()
            .transform((value, originalValue) => {
                // Return null if value is an empty string or invalid date
                if (
                    originalValue === '' ||
                    (originalValue instanceof Date &&
                        isNaN(originalValue.getTime()))
                ) {
                    return null
                }
                // Try to parse string date
                if (typeof originalValue === 'string') {
                    const date = new Date(originalValue)
                    return isNaN(date.getTime()) ? null : date
                }
                return value
            })
            .when('invoicingType', {
                is: (type: InvoiceTypeEnum) => type !== InvoiceTypeEnum.Monthly,
                then: (schema) =>
                    schema
                        .nullable()
                        .test(
                            'is-date',
                            'Start date is required for this invoice type',
                            (value) =>
                                value instanceof Date && !isNaN(value.getTime())
                        )
                        .required(
                            'Start date is required for this invoice type'
                        ),
                otherwise: (schema) => schema.nullable(),
            }),
        allowInvoicing: Yup.boolean(),
    })

    interface AllowInvoicingFormData {
        invoicingType: string
        invoiceAction: number[]
        startDate?: Date | null
        allowInvoicing?: boolean
    }

    const methods = useForm<AllowInvoicingFormData>({
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            allowInvoicing: rto?.allowInvoicing,
            invoicingType: rto?.invoiceSettings?.[0]?.type,
            startDate: rto?.invoiceSettings?.[0]?.startDate,
            invoiceAction: rto?.invoiceSettings?.map(
                (invSetting) => invSetting?.invoiceAction?.id
            ),
        },
        mode: 'all',
    })

    const onChangeIvoicingStatus = async () => {
        await allowPermissions(rto?.id).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Auto Complete Accessed Changed',
                    description: 'Auto Complete Accessed Changed',
                })
                // onCancel()
            }
        })
    }

    const permissionsOptions = Object.entries(InvoiceTypeEnum).map(
        ([label, value]) => ({
            label,
            value,
        })
    )
    const categoriesOptions = categoriesList?.data?.map((cate: any) => ({
        label: cate?.name,
        value: cate?.id,
    }))

    const onSetInvoiceSettingData = (value: string) => {
        setInvoiceSettingData(
            invoiceSettingData?.includes(Number(value))
                ? [
                    ...invoiceSettingData?.filter(
                        (invSetting) => invSetting !== Number(value)
                    ),
                ]
                : [...invoiceSettingData, Number(value)]
        )
    }

    const onSubmit = async (values: any) => {
        if (
            !values?.startDate &&
            methods?.watch()?.invoicingType !== InvoiceTypeEnum.Monthly &&
            rto?.invoiceSettings?.[0]?.type !== InvoiceTypeEnum.Monthly
        ) {
            notification.warning({
                title: 'Start Date is required',
                description: '',
            })
            return
        }
        const res: any = await invoiceSetting(
            removeEmptyValues({
                id: rto?.id,
                invoiceAction: values?.invoiceAction?.map(Number),
                type: values?.invoicingType,
                startDate: values?.startDate,
            })
        )
        if (res?.data) {
            notification.success({
                title: 'Invoice Type Added',
                description: 'Invoice Type Added Successfully',
            })
            onCancel()
        }
    }

    return (
        <>
            <ShowErrorNotifications result={allowPermissionsResult} />
            <ShowErrorNotifications result={invoiceSettingResult} />
            <GlobalModal>
                <div className="max-h-[85vh] overflow-auto">
                    <FormProvider {...methods}>
                        <form
                            className="mt-2 w-full p-4"
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            <div className="flex flex-col items-center gap-y-4 py-4">
                                <div className={`text-green-500`}>
                                    <TbReportSearch size={48} />
                                </div>

                                <div className="flex flex-col items-center gap-y-2">
                                    <p className="text-lg font-semibold">
                                        {rto?.user?.name}
                                    </p>
                                </div>
                                <div className="flex gap-x-2">
                                    <div className="">
                                        <Typography variant="label">
                                            Allow Invoicing
                                        </Typography>
                                    </div>

                                    <div>
                                        <div className="pt-1.5">
                                            <Switch
                                                name="allowInvoicing"
                                                customStyleClass="profileSwitch"
                                                onChange={() => {
                                                    onChangeIvoicingStatus()
                                                }}
                                                loading={
                                                    allowPermissionsResult?.isLoading
                                                }
                                                disabled={
                                                    allowPermissionsResult?.isLoading
                                                }
                                            // defaultChecked={rto?.allowInvoicing}
                                            // value={rto?.allowInvoicing}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <RadioGroup
                                        name="invoicingType"
                                        options={permissionsOptions}
                                        disabled={
                                            !methods?.watch()?.allowInvoicing
                                        }
                                    // showError={false}
                                    />
                                </div>

                                {methods?.watch()?.invoicingType !==
                                    InvoiceTypeEnum.Monthly && (
                                        <div className="w-60 mx-auto">
                                            <TextInput
                                                name={'startDate'}
                                                label={`Start ${methods?.watch()?.invoicingType
                                                    } Date`}
                                                type={'date'}
                                            // showError={false}
                                            />
                                        </div>
                                    )}

                                {categoriesOptions &&
                                    categoriesOptions?.length > 0 && (
                                        <>
                                            <Typography>
                                                Select Category
                                            </Typography>
                                            <div className="grid grid-cols-3 gap-2 flex-wrap">
                                                {categoriesOptions?.map(
                                                    (cate: OptionType) => (
                                                        <Checkbox
                                                            name={
                                                                'invoiceAction'
                                                            }
                                                            label={cate?.label}
                                                            value={Number(
                                                                cate?.value
                                                            )}
                                                            disabled={
                                                                !methods?.watch()
                                                                    ?.invoicingType ||
                                                                !methods?.watch()
                                                                    ?.allowInvoicing
                                                            }
                                                            defaultChecked={invoiceSettingData?.includes(
                                                                Number(
                                                                    cate?.value
                                                                )
                                                            )}
                                                            onChange={(
                                                                e: any
                                                            ) =>
                                                                onSetInvoiceSettingData(
                                                                    e?.target
                                                                        ?.value
                                                                )
                                                            }
                                                            showError={false}
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <InputErrorMessage
                                                name={'invoiceAction'}
                                            />
                                        </>
                                    )}

                                <div className="flex gap-x-4 items-center">
                                    <Button
                                        text="Cancel"
                                        variant="secondary"
                                        onClick={() => {
                                            onCancel && onCancel()
                                        }}
                                    />
                                    <Button
                                        text={'Confirm'}
                                        variant={'success'}
                                        submit
                                        loading={invoiceSettingResult.isLoading}
                                        disabled={
                                            invoiceSettingResult.isLoading
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </GlobalModal>
        </>
    )
}

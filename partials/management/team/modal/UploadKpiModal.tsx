import {
    Button,
    ShowErrorNotifications,
    TextInput,
    Typography,
} from '@components'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { LoadingAnimation } from '@components'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ManagementApi } from '@queries'
import { ExcelFileBinaryUpload } from '@partials/management/form'
import moment from 'moment'
import { useNotification } from '@hooks'
import { InputErrorMessage } from '@components/inputs/components'
// Tabs

type UploadKpiModalProps = {
    onCancel: any
    member: any
}
export const UploadKpiModal = ({ onCancel, member }: UploadKpiModalProps) => {
    const [kpi, setKpi] = useState<any>([])
    const { notification } = useNotification()
    const router = useRouter()
    // const member = router?.query?.id
    // APi
    const [upload, uploadResults] = ManagementApi.Documents.useUploadKpiReport()
    // --------- File ----------- //
    const removeSpacesFromKeys = (row: any) => {
        const newRow: any = {}
        for (const key in row) {
            if (row.hasOwnProperty(key)) {
                const newKey = key.replace(/\s+/g, '')
                newRow[newKey?.toLocaleLowerCase()] = row[key]
            }
        }
        return newRow
    }

    const onFileChange = async (e: any) => {
        const { read, utils } = await import('xlsx')
        const wb = read(e.target.result, { type: 'binary' })
        const sheets = wb.SheetNames

        if (sheets.length) {
            let rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
            rows = rows?.map(removeSpacesFromKeys)
            setKpi(rows)
        }
    }

    const validationSchema = yup.object().shape({
        list: yup.mixed().required('File is required'),
        from: yup.date(),
        to: yup
            .date()
            .min(yup.ref('from'), "end date can't be before start date"),
    })
    const methods = useForm({
        resolver: yupResolver(validationSchema),
        // defaultValues: initialValues,
        mode: 'all',
    })
    useEffect(() => {
        if (uploadResults.isSuccess) {
            notification.success({
                title: 'KPI Report Uploaded',
                description: 'KPI Report Uploaded Successfully',
            })
            onCancel()
        }
    }, [uploadResults])
    // --------- File ----------- //

    const onSubmit = async (values: any) => {
        const { from, to } = values
        const kpiReportData = kpi
        if (!kpiReportData && kpiReportData?.length === 0) {
            methods.setError('list', {
                type: 'mix',
                message: 'File must be selected',
            })
            return
        }
        const restructuredData = {
            member,
            from,
            to,
            kpiReportData,
        }
        upload(restructuredData)
    }
    return (
        <>
            <ShowErrorNotifications result={uploadResults} />
            <div className="flex justify-center w-full overflow-auto remove-scrollbar">
                <div
                    className={`w-[545px] bg-white/80 px-6 py-4 border rounded-lg overflow-hidden relative`}
                >
                    <div>
                        {uploadResults.isLoading ? (
                            <LoadingAnimation />
                        ) : (
                            <>
                                <FormProvider {...methods}>
                                    <form
                                        className="w-full"
                                        onSubmit={methods.handleSubmit(
                                            onSubmit
                                        )}
                                    >
                                        <ExcelFileBinaryUpload
                                            name="list"
                                            onChange={onFileChange}
                                            label={'Upload KPI'}
                                        />
                                        <InputErrorMessage name={'list'} />
                                        <TextInput
                                            shadow="shadow-lg"
                                            name="from"
                                            type="date"
                                            label={'From'}
                                        />
                                        <TextInput
                                            shadow="shadow-lg"
                                            name="to"
                                            type="date"
                                            label={'To'}
                                        />
                                        {/* <button
                                        className="bg-[#03c9d7] !px-4 !pb-2 pt-1 !rounded-md text-center  !text-white !font-semibold hover:!bg-[#4cbec6e6]"
                                        type="submit"
                                    >
                                        Import
                                    </button> */}
                                        <div className="flex justify-center items-center gap-x-2">
                                            <Button
                                                text="Upload"
                                                variant="primaryNew"
                                                submit
                                            />
                                            <Button
                                                text="Cancel"
                                                variant="error"
                                                onClick={onCancel}
                                            />
                                        </div>
                                    </form>
                                </FormProvider>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

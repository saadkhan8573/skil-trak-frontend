import { Button, TextInput, Typography } from '@components'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { LoadingAnimation } from '@components'
import { ExcelFileBinaryUpload } from './ExcelFileBinaryUpload'

import { ManagementApi } from '@queries'
// Tabs
import { SubAdminKpiForm } from './SubAdminKpiForm'
import { SourcingKpiForm } from './SourcingKpiForm'
import { TeamSelectionTab } from '../TeamSelectionTab'
type UploadReportKpiFormProps = {
    activeTab?: any
    handleTabChange?: any
}
export const UploadReportKpiForm = ({
    activeTab,
    handleTabChange,
}: UploadReportKpiFormProps) => {
    const [kpi, setKpi] = useState<any>([])

    const [fieldValues, setFieldValues] = useState({
        // kpiType: '',
        member: '',
        // result: '',
        from: '',
        to: '',
    })
    const [sourcingFieldValues, setSourcingFieldValues] = useState({
        // kpiType: '',
        sourcing: '',
        result: '',
        from: '',
        to: '',
    })

    // APi
    const [upload, uploadResults] = ManagementApi.Documents.useUploadKpiReport()

    const router = useRouter()

    // --------- File ----------- //
    const onFileChange = async (e: any) => {
        const { read, utils } = await import('xlsx')
        const wb = read(e.target.result, { type: 'binary' })
        const sheets = wb.SheetNames

        if (sheets.length) {
            const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
            setKpi(rows)
        }
    }
    const methods = useForm({
        // resolver: yupResolver(validationSchema),
        // defaultValues: initialValues,
        mode: 'all',
    })
    useEffect(() => {
        if (uploadResults.isSuccess) {
            router.push('/portals/management/check-kpi?tab=first-time-student')
        }
    }, [uploadResults.isSuccess])
    // --------- File ----------- //

    const updateFieldValues = (valuesToUpdate: any) => {
        setFieldValues((prevFieldValues) => ({
            ...prevFieldValues,
            ...valuesToUpdate,
        }))
    }
    const updateSourcingFieldValues = (valuesToUpdate: any) => {
        setSourcingFieldValues((prevFieldValues) => ({
            ...prevFieldValues,
            ...valuesToUpdate,
        }))
    }

    const onSubmit = async (values: any) => {
        const { member, from, to } = fieldValues
        const kpiReportData = kpi
        const restructuredData = {
            member,
            from,
            to,
            kpiReportData,
        }
        upload(restructuredData)

        // from, to, kpiReportData, status
    }
    return (
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
                                    onSubmit={methods.handleSubmit(onSubmit)}
                                >
                                    <ExcelFileBinaryUpload
                                        name="list"
                                        onChange={onFileChange}
                                        label={'Upload Kpi'}
                                    />
                                    {/* <button
                                        className="bg-[#03c9d7] !px-4 !pb-2 pt-1 !rounded-md text-center  !text-white !font-semibold hover:!bg-[#4cbec6e6]"
                                        type="submit"
                                    >
                                        Import
                                    </button> */}
                                </form>
                            </FormProvider>
                        </>
                    )}
                </div>
                <div className="mt-5 mb-4">
                    <div className="mb-1">
                        <Typography
                            variant={'small'}
                            medium
                            color={'text-primaryNew'}
                        >
                            Upload Document Of
                        </Typography>
                    </div>
                    <TeamSelectionTab
                        activeTab={activeTab}
                        handleTabChange={handleTabChange}
                    />
                </div>
                {activeTab === 'subadmin' && (
                    <SubAdminKpiForm
                        setFieldValues={updateFieldValues}
                        fieldValues={fieldValues}
                    />
                )}
                {activeTab === 'sourcing' && (
                    <SourcingKpiForm
                        setFieldValues={updateSourcingFieldValues}
                        fieldValues={sourcingFieldValues}
                    />
                )}
                <div className="flex justify-center mt-4">
                    <Button
                        text="Upload"
                        variant="primaryNew"
                        onClick={onSubmit}
                    />
                </div>
            </div>
        </div>
    )
}

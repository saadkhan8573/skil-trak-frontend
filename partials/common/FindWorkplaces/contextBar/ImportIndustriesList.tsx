import { Button, Select, ShowErrorNotifications, Typography } from '@components'
import { BinaryFileUpload } from '@components/inputs/BinaryFileUpload'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IndustryListingDepartment } from '../enum'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    department: Yup.string().required('Department is required!'),
    type: Yup.string().required('Type is required!'),
})

export const ImportIndustriesList = () => {
    const [industries, setIndustries] = useState<any>(null)
    const { notification } = useNotification()

    const [importList, importListResult] =
        CommonApi.FindWorkplace.importIndustriesList()

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onFileChange = async (e: any, fileData: any) => {
        try {
            const { read, utils } = await import('xlsx')
            const wb = read(e.target.result, { type: 'binary' })
            const sheets = wb.SheetNames

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
                // onStudentFound && onStudentFound(rows, fileData)
                setIndustries(rows)
            }
        } catch (err) {
            notification.error({
                title: 'Invalid File',
                description: 'File should be .csv or .xlsx',
            })
        }
    }

    const onSubmit = () => {
        importList({
            industries: industries?.map((ind: any) => ({
                ...ind,
                email: ind?.email ? ind?.email?.replace(/\r\n\r\n/g, '') : '',
                region: ind?.states,
                sector: ind?.sector
                    ? String(ind?.sector)
                        ?.split(',')
                        ?.map((s: any) => Number(s))
                    : null,
            })),
        }).then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: 'Success',
                    description: 'Industries imported successfully',
                })
            }
        })
    }

    const duplicatedIndustries = (source: string) =>
        importListResult?.data?.errorMails?.filter(
            (ind: { source: string }) => ind?.source === source
        )
    return (
        <div>
            <ShowErrorNotifications result={importListResult} />
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <Select
                        name={'department'}
                        label={'Select Department'}
                        options={[
                            {
                                label: 'Employment',
                                value: IndustryListingDepartment.EMPLOYMENT,
                            },
                            {
                                label: 'SOURCING',
                                value: IndustryListingDepartment.SOURCING,
                            },
                        ]}
                        onlyValue
                    />
                    <Select
                        name={'type'}
                        label={'Select Type'}
                        options={[
                            {
                                label: 'Listing With Email',
                                value: 'withEmail',
                            },
                            {
                                label: 'Listing Without Email',
                                value: 'withoutEmail',
                            },
                        ]}
                        onlyValue
                    />
                    <BinaryFileUpload
                        name="list"
                        onChange={onFileChange}
                        fileAsObject={false}
                        result={importListResult}
                    // acceptTypes={['.xlsx, .csv']}
                    />
                    <div className="flex items-center justify-end mt-2">
                        <Button
                            text={'Upload'}
                            submit
                            loading={importListResult.isLoading}
                            disabled={importListResult.isLoading}
                        />
                    </div>
                </form>
            </FormProvider>

            <div className="mt-5">
                {importListResult?.data?.errorMails &&
                    importListResult?.data?.errorMails?.length > 0 ? (
                    <div className="flex flex-col gap-y-1">
                        {duplicatedIndustries('listing') &&
                            duplicatedIndustries('listing')?.length > 0 && (
                                <div>
                                    <Typography
                                        variant={'label'}
                                        semibold
                                        color={'text-gray-800'}
                                    >
                                        Emails Already Being Used in Industries
                                        Listing
                                    </Typography>
                                    {duplicatedIndustries('listing')?.map(
                                        (ind: { email: string }) => (
                                            <div className="bg-gray-100 rounded-md px-3 py-1">
                                                <Typography
                                                    variant={'small'}
                                                    color={'text-red-500'}
                                                >
                                                    {ind?.email}
                                                </Typography>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                        {duplicatedIndustries('signed-up') &&
                            duplicatedIndustries('signed-up')?.length > 0 && (
                                <div>
                                    <Typography
                                        variant={'label'}
                                        semibold
                                        color={'text-gray-800'}
                                    >
                                        Emails Already Being Used in Industries
                                    </Typography>
                                    {duplicatedIndustries('signed-up')?.map(
                                        (ind: { email: string }) => (
                                            <div className="bg-gray-100 rounded-md px-3 py-1">
                                                <Typography
                                                    variant={'small'}
                                                    color={'text-red-500'}
                                                >
                                                    {ind?.email}
                                                </Typography>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

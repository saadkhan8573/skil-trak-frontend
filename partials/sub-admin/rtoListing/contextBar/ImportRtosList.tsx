import React, { useState } from 'react'
import { useNotification } from '@hooks'
import { BinaryFileUpload } from '@components/inputs/BinaryFileUpload'
import { Button, ShowErrorNotifications, Typography } from '@components'
import { SubAdminApi } from '@queries'

export const ImportRtosList = () => {
    const [rtos, setRtos] = useState<any>(null)
    const { notification } = useNotification()

    const [importList, importListResult] =
        SubAdminApi.SubAdmin.useImportRtosList()

    const onFileChange = async (e: any, fileData: any) => {
        try {
            const { read, utils } = await import('xlsx')
            const wb = read(e.target.result, { type: 'binary' })
            const sheets = wb.SheetNames

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
                // onStudentFound && onStudentFound(rows, fileData)
                setRtos(rows)
            }
        } catch (err) {
            notification.error({
                title: 'Invalid File',
                description: 'File should be .csv or .xlsx',
            })
        }
    }

    const onSubmit = () => {
        // importList({
        //     rtos: rtos?.map((rto: any) => ({
        //         ...rto,
        //         email: rto?.email ? rto?.email?.replace(/\r\n\r\n/g, '') : '',
        //         businessName: rto?.businessName,
        //         phone: rto?.phone,
        //         address: rto?.address,
        //         sector: rto?.sector
        //             ? String(rto?.sector)
        //                   ?.split(',')
        //                   ?.map((s: any) => Number(s))
        //             : null,
        //     })),
        // }).then((res: any) => {
        //     if (res?.data) {
        //         notification.success({
        //             title: 'Success',
        //             description: 'Industries imported successfully',
        //         })
        //     }
        // })
    }

    const duplicatedIndustries = (source: string) =>
        importListResult?.data?.errorMails?.filter(
            (ind: { source: string }) => ind?.source === source
        )
    return (
        <div>
            <ShowErrorNotifications result={importListResult} />
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
                    onClick={onSubmit}
                    loading={importListResult.isLoading}
                    disabled={importListResult.isLoading}
                />
            </div>

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

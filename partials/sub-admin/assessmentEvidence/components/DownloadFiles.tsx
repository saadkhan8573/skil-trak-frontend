import { Button, ShowErrorNotifications } from '@components'
import { SubAdminApi } from '@queries'
import { ThemeColors } from '@utils'
import axios from 'axios'
import React, { useEffect } from 'react'
import { FaDownload } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'
import JSZip from 'jszip'
import { useDownloadAssessment, useNotification } from '@hooks'
import download from 'downloadjs'

export const DownloadFiles = ({
    studentProfile,
    studentId,
    selectedCourse,
}: {
    studentProfile: any
    selectedCourse: any
    studentId: number
}) => {
    const { notification } = useNotification()

    const { isAssessmentDownloading, setIsAssessmentDownloading } =
        useDownloadAssessment()

    const [downloadFiles, downloadFilesResult] =
        SubAdminApi.AssessmentEvidence.downloadFiles()

    useEffect(() => {
        if (downloadFilesResult.isSuccess) {
            async function createZip(urls: string[]) {
                setIsAssessmentDownloading(true)
                const zip = new JSZip()

                for (let i = 0; i < urls.length; i++) {
                    try {
                        const response = await axios.get(urls[i], {
                            responseType: 'arraybuffer',
                        })
                        const fileName = urls[i]?.split('/')?.reverse()?.[0]
                        zip.file(`${fileName}`, response.data) // You might want to adjust the filename and extension
                    } catch (error) {
                        console.error(
                            `Error fetching or adding file ${i}:`,
                            error
                        )
                        // Optionally, you can log or handle the error here
                    }
                }
                try {
                    const zipContent = await zip.generateAsync({
                        type: 'blob',
                    })
                    const zipUrl = URL.createObjectURL(zipContent)
                    const link = document.createElement('a')
                    link.href = zipUrl
                    link.download = `${studentProfile?.data?.user?.name} Assessment Files`
                    link.click()
                    URL.revokeObjectURL(zipUrl) // Revoke immediately after click
                } catch (err) {
                } finally {
                    setIsAssessmentDownloading(false)
                    notification.success({
                        title: 'Successfully Downloaded Shuunr',
                        description: 'Documents Downloading Successfully',
                    })
                }
            }

            createZip(downloadFilesResult?.data)
            // router.push(downloadFilesResult?.data?.url)
            const downloadAssessmentAllFiles = async () => {
                setIsAssessmentDownloading(true)

                const files = [...downloadFilesResult?.data]
                files?.splice(5, 4)

                const zip = new JSZip()
                // const img = new Image()

                // Fetch the images and add them to the zip
                const fetchPromises =
                    downloadFilesResult?.data &&
                    downloadFilesResult?.data?.length > 0 &&
                    downloadFilesResult?.data
                        ?.filter((url: string) => {
                            const img = new Image()
                            img.src = url
                            let isFileWorking = true

                            img.onerror = () => {
                                isFileWorking = false
                                // The image is available, you can perform any action here.
                            }

                            if (isFileWorking && url) {
                                return url
                            }
                        })
                        ?.map(async (url: string, index: number) => {
                            const response = await fetch(url)
                            const fileName = url?.split('/')?.reverse()?.[0]
                            if (response) {
                                const arrayBuffer = await response.arrayBuffer()
                                zip.file(`${fileName}`, arrayBuffer)
                            }
                        })

                await Promise.all(fetchPromises)

                // Generate the zip file
                try {
                    const content = await zip.generateAsync({ type: 'blob' })

                    const strMimeType = 'application/zip'
                    const blob = new Blob([content], { type: strMimeType })
                    // Download the zip file
                    download(
                        blob,
                        `${studentProfile?.data?.user?.name} Assessment Files`
                    )
                } catch (err) {
                } finally {
                    setIsAssessmentDownloading(false)
                    notification.success({
                        title: 'Successfully Downloaded',
                        description: 'Documents Downloading Successfully',
                    })
                }
            }
            // downloadAssessmentAllFiles()
        }
    }, [downloadFilesResult])

    const onDownloadFiles = () => {
        downloadFiles({
            studentId: Number(studentId),
            courseId: selectedCourse?.id,
        })
    }
    return (
        <div>
            <ShowErrorNotifications result={downloadFilesResult} />

            <Button
                text={''}
                variant={'action'}
                disabled={
                    downloadFilesResult.isLoading || isAssessmentDownloading
                }
                {...(!downloadFilesResult.isLoading && !isAssessmentDownloading
                    ? { Icon: FaDownload }
                    : {})}
                onClick={onDownloadFiles}
            >
                {downloadFilesResult.isLoading || isAssessmentDownloading ? (
                    <div className=" flex items-center justify-center">
                        <BeatLoader
                            size={13}
                            color={ThemeColors.primary.DEFAULT}
                        />
                    </div>
                ) : (
                    'Download Files '
                )}
            </Button>
        </div>
    )
}

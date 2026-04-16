import { Button, GlobalModal, Select } from '@components'
import { useNotification } from '@hooks'
import { RtoApi } from '@redux'
import { buildDownloadUrl, getUserCredentials } from '@utils'
import { Download, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

export const DownloadListModal = ({ downloadReport, onClose }: any) => {
    const [isDownloading, setIsDownloading] = useState(false)
    const batchRef = useRef<HTMLInputElement | null>(null)
    const selectedCourseRef = useRef<any>(null)

    const { notification } = useNotification()

    const { data: courses, isLoading } = RtoApi.Courses.useRtoCourses()
    const rtoName = getUserCredentials()?.name

    const coursesOptions =
        courses?.length > 0
            ? courses.map((course: any) => ({
                  value: course?.id,
                  label: `${course?.code} - ${course?.title}`,
              }))
            : []

    const handleCourseChange = (option: any) => {
        selectedCourseRef.current = option
    }

    const handleDownload = async () => {
        const batch = batchRef.current?.value
        const courseId = selectedCourseRef.current?.value

        const params = Object.fromEntries(
            Object.entries({ batch, courseId }).filter(([_, v]) => v)
        )

        try {
            setIsDownloading(true)
            const blob = await downloadReport(params).unwrap()
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = `${rtoName}.xls`
            a.click()

            window.URL.revokeObjectURL(url)
            notification.success({
                title: 'File downloaded',
                description: 'File downloaded successfully',
            })
            onClose()
        } catch (err: any) {
            const message =
                err?.data?.message ||
                err?.error ||
                'Something went wrong while downloading the file.'

            notification.error({
                title: 'Download Failed',
                description: message,
            })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <GlobalModal>
            <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="group hover:bg-red-50 p-1 rounded-md"
                    >
                        <X className="text-gray-500 group-hover:text-red-400" />
                    </button>
                </div>
                <div className="bg-gray-50 border border-gray-200 flex justify-center items-center flex-col rounded-md px-3 py-3 space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                        Download Information
                    </p>

                    <p className="text-xs text-gray-600">
                        Filters are optional. If no batch or course is selected,
                        the system will download the complete report by default.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <label className="text-sm mb-1">Enter Batch</label>
                        <input
                            ref={batchRef}
                            type="text"
                            placeholder="Enter batch here..."
                            className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>
                    <Select
                        name="course"
                        options={coursesOptions}
                        label="Select any course"
                        placeholder="Select any course"
                        loading={isLoading}
                        onChange={handleCourseChange}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        text="Download Report"
                        Icon={Download}
                        variant="secondary"
                        onClick={handleDownload}
                        loading={isDownloading}
                        disabled={isDownloading}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}

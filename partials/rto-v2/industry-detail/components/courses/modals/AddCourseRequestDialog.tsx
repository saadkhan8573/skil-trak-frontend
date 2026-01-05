import {
    Button,
    Select,
    ShowErrorNotifications,
    Typography,
    UploadFile,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { FileUpload } from '@hoc'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AuthApi, CommonApi, SubAdminApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { getSectors, getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { BookPlus, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface AddCourseRequestDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    existingCourses?: any[]
}

export function AddCourseRequestDialog({
    open,
    onOpenChange,
    existingCourses = [],
}: AddCourseRequestDialogProps) {
    const [selectedSector, setSelectedSector] = useState<string | null>(null)
    const { notification } = useNotification()
    const router = useRouter()

    const userCredentials = useMemo(() => getUserCredentials(), [])
    const isAdminRole = userCredentials?.role === UserRoles.ADMIN

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const [addCourse, addCourseResult] =
        SubAdminApi.Industry.useRequestToAddCoursesToIndustry()

    const validationSchema = yup.object().shape({
        sector: yup.number().required('Sector is required'),
        course: yup.number().required('Course is required'),
        file: yup.mixed().required('Template file is required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const subadminCourses = CommonApi.Courses.subadminCoursesList(undefined, {
        skip: isAdminRole,
    })

    const allSectors = AuthApi.useSectors(
        {},
        {
            skip: !isAdminRole,
        }
    )

    const sectorsOptions = useMemo(() => {
        if (isAdminRole) {
            if (!allSectors?.data) return []
            return allSectors.data.map((sector: any) => ({
                value: sector.id,
                label: sector.name,
            }))
        } else {
            if (!subadminCourses?.data) return []
            const uniqueSectors: any[] = []
            const seen = new Set()
            subadminCourses.data.forEach((item: any) => {
                const sector = item?.sector
                if (sector && !seen.has(sector.id)) {
                    seen.add(sector.id)
                    uniqueSectors.push({
                        value: sector.id,
                        label: sector.name,
                    })
                }
            })
            return uniqueSectors
        }
    }, [isAdminRole, allSectors?.data, subadminCourses?.data])

    const courseOptions = useMemo(() => {
        if (!selectedSector) return []

        let coursesList: any[] = []
        if (isAdminRole) {
            const sector = allSectors?.data?.find(
                (s: any) => s.id === Number(selectedSector)
            )
            coursesList = sector?.courses || []
        } else {
            coursesList =
                subadminCourses?.data?.filter(
                    (course: any) =>
                        course?.sector?.id === Number(selectedSector)
                ) || []
        }

        return coursesList
            .filter(
                (course: any) =>
                    !existingCourses?.some((c: any) => c.id === course.id)
            )
            .map((course: any) => ({
                value: course?.id,
                label: course?.title,
            }))
    }, [
        isAdminRole,
        allSectors?.data,
        subadminCourses?.data,
        selectedSector,
        existingCourses,
    ])

    const onSubmit = async (values: any) => {
        const formData = new FormData()

        const data = {
            course: values.course,
            file: values?.file?.[0],
            industry: industryDetail?.id || router.query.id,
            // description and reference omitted as per the commented out section in reference
        }

        Object.entries(data).forEach(([key, value]: any) => {
            if (value !== undefined) {
                formData.append(key, value)
            }
        })

        const res: any = await addCourse(formData)

        if (res?.data) {
            notification.success({
                title: 'Request Submitted',
                description:
                    'Your course addition request has been sent for approval.',
            })
            onOpenChange(false)
            methods.reset()
            setSelectedSector(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <ShowErrorNotifications result={addCourseResult} />
            <DialogContent className="!max-w-3xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
                <div className="px-6 py-2 border-b shrink-0">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-xl flex items-center justify-center relative shadow-lg">
                                <BookPlus className="w-6 h-6 text-white" />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F7A619] rounded-full flex items-center justify-center border-2 border-white">
                                    <Sparkles className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-[#1A2332]">
                                    Add New Course
                                </DialogTitle>
                                <DialogDescription className="text-sm text-[#64748B]">
                                    Request to add a new course to this
                                    industry's profile
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto px-6 space-y-2">
                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                        <GraduationCap className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        To add a course, please select the
                                        target sector and course. Note that
                                        you'll need to upload the{' '}
                                        <span className="font-bold">
                                            Facility Checklist
                                        </span>{' '}
                                        for approval.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Select
                                        name="sector"
                                        options={sectorsOptions}
                                        label={'Target Sector'}
                                        onlyValue
                                        onChange={(e: any) => {
                                            setSelectedSector(e)
                                            methods.setValue(
                                                'course',
                                                undefined
                                            )
                                        }}
                                        required
                                        loading={
                                            isAdminRole
                                                ? allSectors?.isLoading
                                                : subadminCourses?.isLoading
                                        }
                                        disabled={
                                            isAdminRole
                                                ? allSectors?.isLoading
                                                : subadminCourses?.isLoading
                                        }
                                        className="h-11"
                                        showError={false}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Select
                                        name="course"
                                        options={courseOptions}
                                        label={'Course Selection'}
                                        onlyValue
                                        disabled={!selectedSector}
                                        required
                                        className="h-11"
                                        showError={false}
                                    />
                                </div>
                            </div>

                            <div className="bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-5 py-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-[#1A2332]">
                                        Required Checklist
                                    </h4>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-md border border-amber-100">
                                        <Sparkles className="w-3 h-3 text-amber-600" />
                                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                                            Mandatory
                                        </span>
                                    </div>
                                </div>

                                <FileUpload
                                    component={UploadFile}
                                    name={'file'}
                                />

                                <p className="text-[11px] text-[#64748B] text-center italic">
                                    Support for PDF, DOCX or Images up to 10MB
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50/30 flex items-center gap-3 shrink-0">
                            <Button
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-11"
                            >
                                Cancel
                            </Button>
                            <Button
                                submit
                                variant="primaryNew"
                                loading={addCourseResult.isLoading}
                                disabled={addCourseResult.isLoading}
                                className="flex-1 h-11"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}

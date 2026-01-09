import {
    Button,
    LoadingAnimation,
    NoData,
    Select,
    ShowErrorNotifications,
    Typography,
    UploadFile,
    useShowErrorNotification,
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
import { getSectors, getUserCredentials, removeEmptyValues } from '@utils'
import { UserRoles } from '@constants'
import {
    BookPlus,
    CheckCircle2,
    GraduationCap,
    Sparkles,
    FileText,
    Download,
    FileCheck2,
} from 'lucide-react'
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

    const showErrorNotifications = useShowErrorNotification()

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
        // selectedDocumentUrl: yup.string().required('Template selection is required'),
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
        const data = {
            course: values.course,
            file: values.selectedDocumentUrl,
            industry: industryDetail?.id || router.query.id,
            // description and reference omitted as per the commented out section in reference
        }

        const res: any = await addCourse(data)

        if (res?.error) {
            showErrorNotifications({ isError: true, ...res })
            return
        }

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

    const getPendingEsign = CommonApi.ESign.getIndustryEsignDocs(
        {
            userId: industryDetail?.user?.id!,
            search: `${JSON.stringify(
                removeEmptyValues({
                    sectorId: selectedSector, // Directly filter by this sector
                })
            )
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
        },
        {
            skip: !industryDetail?.user?.id || !selectedSector,
            refetchOnMountOrArgChange: true,
        }
    )

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

                            <div className="bg-[#F8FAFB] border border-[#E2E8F0] rounded-xl px-5 py-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-bold text-[#1A2332]">
                                            Facility Checklist
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                            Select an approved checklist for
                                            this course request
                                        </p>
                                    </div>
                                </div>

                                {!selectedSector ? (
                                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-dashed border-slate-200 rounded-xl gap-2">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-700">
                                                Select a Sector
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                Choose a target sector above to
                                                view its available checklists
                                            </p>
                                        </div>
                                    </div>
                                ) : getPendingEsign?.isLoading ||
                                  getPendingEsign?.isFetching ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="bg-white border border-slate-200 rounded-xl p-3 animate-pulse"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                                                        <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : getPendingEsign?.data?.data?.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                            {getPendingEsign?.data?.data?.map(
                                                (document: any) => {
                                                    const fileUrl =
                                                        document?.file
                                                            ?.replaceAll(
                                                                '{"',
                                                                ''
                                                            )
                                                            .replaceAll(
                                                                '"}',
                                                                ''
                                                            )

                                                    const isSelected =
                                                        methods.watch(
                                                            'selectedDocumentUrl'
                                                        ) === fileUrl

                                                    return (
                                                        <div
                                                            key={document?.id}
                                                            className={`relative group bg-white border rounded-xl p-3 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
                                                                isSelected
                                                                    ? 'border-blue-600 ring-1 ring-blue-600/20 bg-blue-50/30'
                                                                    : 'border-slate-200 hover:border-blue-300'
                                                            }`}
                                                            onClick={() => {
                                                                methods.setValue(
                                                                    'selectedDocumentUrl',
                                                                    isSelected
                                                                        ? ''
                                                                        : fileUrl,
                                                                    {
                                                                        shouldValidate:
                                                                            true,
                                                                    }
                                                                )
                                                            }}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div
                                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                                                        isSelected
                                                                            ? 'bg-blue-600 text-white'
                                                                            : 'bg-blue-50 text-blue-600'
                                                                    }`}
                                                                >
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0 pr-4">
                                                                    <p
                                                                        className={`text-[10px] font-bold truncate ${
                                                                            isSelected
                                                                                ? 'text-blue-700'
                                                                                : 'text-slate-700'
                                                                        }`}
                                                                        title={
                                                                            document?.file
                                                                        }
                                                                    >
                                                                        {document?.file
                                                                            ?.split(
                                                                                '/'
                                                                            )
                                                                            ?.pop()
                                                                            ?.split(
                                                                                '\\'
                                                                            )
                                                                            ?.pop()
                                                                            ?.replaceAll(
                                                                                '{"',
                                                                                ''
                                                                            )
                                                                            ?.replaceAll(
                                                                                '"}',
                                                                                ''
                                                                            ) ||
                                                                            'Document'}
                                                                    </p>
                                                                    <p className="text-[9px] text-slate-500 mt-0.5">
                                                                        Existing
                                                                        Template
                                                                    </p>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="absolute top-2 right-2">
                                                                        <FileCheck2 className="w-3 h-3 text-blue-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-dashed border-slate-200 rounded-xl gap-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-700">
                                                No Checklists Found
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                There are no approved checklists
                                                available for this sector.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <p className="text-[11px] text-[#64748B] text-center italic mt-2">
                                    Approved checklists are required for course
                                    requests
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

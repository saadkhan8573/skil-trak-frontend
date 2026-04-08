import {
    Button,
    EmptyData,
    ShowErrorNotifications,
    TextInput,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Skeleton } from '@components/ui/skeleton'
import { AdminApi, SubAdminApi } from '@queries'
import { Check, Search, UserPlus } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNotification } from '@hooks'
import { UserStatus } from '@types'

interface ReassignStudentCoordinatorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: any
}

export function ReassignStudentCoordinatorModal({
    open,
    onOpenChange,
    student,
}: ReassignStudentCoordinatorModalProps) {
    const { notification } = useNotification()
    const [search, setSearch] = useState('')
    const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<
        number | null
    >(student?.subadmin?.id || null)

    // Fetch coordinators
    const { data: coordinatorsData, isLoading } =
        AdminApi.SubAdmins.useListQuery(
            {
                search: `status:${
                    UserStatus.Approved
                },isAssociatedWithRto:${false}`,
                limit: 150,
                skip: 0,
            },
            {
                skip: !open,
            }
        )

    const [assignCoordinator, assignResult] =
        SubAdminApi.SubAdmin.useAssignCoordinatorToStudent()

    // Filter logic based on reference implementation
    const filteredCoordinators = useMemo(() => {
        if (!coordinatorsData?.data) return []

        const searchLower = search.toLowerCase()
        const studentCoursesIds = student?.courses?.map((c: any) => c?.id) || []

        return coordinatorsData.data.filter((item: any) => {
            // Search filter
            const matchesSearch =
                item?.user?.name?.toLowerCase().includes(searchLower) ||
                item?.user?.email?.toLowerCase().includes(searchLower)

            // If user is searching, prioritize the search keyword match
            if (search) return matchesSearch

            // If no search keyword, filter by student courses (Smart Matching)
            if (studentCoursesIds.length === 0) return true

            const subadminCourses =
                item?.courses?.map((course: any) => course?.id) || []

            const matchesCourse = studentCoursesIds.some((courseId: number) =>
                subadminCourses.includes(courseId)
            )

            return matchesCourse
        })
    }, [coordinatorsData, student, search])

    const handleConfirm = async () => {
        if (!selectedCoordinatorId) return

        try {
            await assignCoordinator({
                studentId: student?.id,
                coordinatorId: selectedCoordinatorId,
            }).unwrap()

            notification.success({
                title: 'Coordinator Assigned',
                description: 'The coordinator has been successfully updated.',
            })
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to assign coordinator:', error)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={assignResult} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="gap-0! max-w-2xl! bg-white rounded-2xl shadow-2xl overflow-hidden p-0 [&>button]:text-white max-h-[95vh] flex flex-col">
                    <DialogHeader className="bg-linear-to-r from-[#044866] to-[#0D5468] px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-white font-bold text-lg">
                                    Assign Coordinator
                                </DialogTitle>
                                <DialogDescription className="text-white/80 text-sm">
                                    Select a coordinator to manage this
                                    student's placement
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-6 py-4">
                        {/* Search Bar */}
                        <TextInput
                            name="search"
                            placeholder="Search coordinator..."
                            label="Search coordinator"
                            value={search}
                            onChange={(e: any) => setSearch(e.target.value)}
                            shadow="shadow-none"
                            className="bg-gray-50! border-gray-700!"
                        />

                        {/* Coordinators List */}
                        <div className="overflow-y-auto pr-1 space-y-2 max-h-[40vh] min-h-[200px] custom-scrollbar">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-16 w-full rounded-xl"
                                        />
                                    ))}
                                </div>
                            ) : filteredCoordinators.length > 0 ? (
                                filteredCoordinators.map((coordinator: any) => {
                                    const isSelected =
                                        selectedCoordinatorId ===
                                        coordinator?.id

                                    return (
                                        <div
                                            key={coordinator?.id}
                                            onClick={() =>
                                                setSelectedCoordinatorId(
                                                    coordinator?.id
                                                )
                                            }
                                            className={`
                                            group flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all cursor-pointer
                                            ${
                                                isSelected
                                                    ? 'border-[#044866] bg-[#044866]/5 shadow-sm'
                                                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                                            }
                                        `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`
                                                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                ${
                                                    isSelected
                                                        ? 'bg-linear-to-br from-[#044866] to-[#0D5468] text-white'
                                                        : 'bg-white text-gray-600 border border-gray-200'
                                                }
                                            `}
                                                >
                                                    {coordinator?.user
                                                        ?.avatar ? (
                                                        <img
                                                            src={
                                                                coordinator.user
                                                                    .avatar
                                                            }
                                                            alt={
                                                                coordinator.user
                                                                    .name
                                                            }
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        coordinator?.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h4
                                                        className={`text-sm font-bold ${
                                                            isSelected
                                                                ? 'text-[#044866]'
                                                                : 'text-gray-800'
                                                        }`}
                                                    >
                                                        {
                                                            coordinator?.user
                                                                ?.name
                                                        }
                                                    </h4>
                                                    <p className="text-[11px] text-gray-500">
                                                        {
                                                            coordinator?.user
                                                                ?.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className={`
                                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${
                                                isSelected
                                                    ? 'border-[#044866] bg-[#044866]'
                                                    : 'border-gray-300 bg-white'
                                            }
                                        `}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="py-10">
                                    <EmptyData
                                        title="No matched coordinators"
                                        description="Try adjusting your search or checking student courses"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="dark"
                            outline
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            loading={assignResult.isLoading}
                            disabled={
                                !selectedCoordinatorId ||
                                selectedCoordinatorId ===
                                    student?.subadmin?.id ||
                                assignResult.isLoading
                            }
                            variant="primaryNew"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Confirm Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

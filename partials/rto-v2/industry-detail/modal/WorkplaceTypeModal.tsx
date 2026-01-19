import { Button } from '@components/buttons'
import { Select } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { OptionType } from '@types'
import { Trash2 } from 'lucide-react'
import { Skeleton } from '@components/ui/skeleton'
import { useEffect, useState } from 'react'
import { ShowErrorNotifications } from '@components'

interface WorkplaceTypeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryUserId: number
}

export const WorkplaceTypeModal = ({
    open,
    onOpenChange,
    industryUserId,
}: WorkplaceTypeModalProps) => {
    const { notification } = useNotification()
    const [selectedType, setSelectedType] = useState<number | null>(null)
    // APIs
    const currentType = CommonApi.Industries.getIndustryWPType(industryUserId, {
        refetchOnMountOrArgChange: true,
    })
    const { data: wpTypes, isLoading: isLoadingList } =
        CommonApi.Industries.getIndustriesWPTypeList(industryUserId)
    const [addWpType, { isLoading: isSaving, isError, error }] =
        CommonApi.Industries.addIndustryWpType()
    const [removeWpType, { isLoading: isDeleting }] =
        CommonApi.Industries.removeIndustryWPType()

    // Initialize selected type when currentType loads
    useEffect(() => {
        if (currentType?.data && currentType?.isSuccess) {
            setSelectedType(currentType.data?.id)
        }
        return () => {
            setSelectedType(null)
        }
    }, [currentType])

    const wpTypesOptions = wpTypes?.map((wpType: any) => ({
        value: wpType?.id,
        label: wpType?.name,
    }))

    const handleSave = async () => {
        if (!selectedType) return

        const res: any = await addWpType({
            userId: industryUserId,
            wpTypeId: selectedType,
        })

        if (res?.data) {
            notification.success({
                title: 'Success',
                description: 'Workplace type updated successfully',
            })
            onOpenChange(false)
        }
    }

    const handleDelete = async () => {
        const res: any = await removeWpType(industryUserId)

        if (res?.data) {
            notification.success({
                title: 'Success',
                description: 'Workplace type removed successfully',
            })
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] !max-w-lg w-full p-0 bg-white border border-border shadow-premium-lg">
                {currentType?.isLoading || currentType?.isFetching ? (
                    <div className="w-full">
                        <div className="px-6 py-4 bg-primaryNew/10 border-b border-border/50 rounded-t-lg">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                        <div className="px-6 py-6 space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-100 border-t border-border/50 flex flex-col sm:flex-row gap-2 rounded-b-lg justify-end">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="px-6 py-2 bg-primaryNew border-b border-border/50 rounded-t-lg">
                            <DialogTitle className="text-xl font-bold text-white">
                                Workplace Type
                            </DialogTitle>
                            <DialogDescription className="text-white text-sm">
                                Select the workplace type for this industry.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="px-6 space-y-4 ">
                            <ShowErrorNotifications
                                result={{ isError, error } as any}
                            />

                            <div className="space-y-2">
                                <Select
                                    onlyValue
                                    name="wpType"
                                    value={selectedType}
                                    label="Select Workplace Type"
                                    options={wpTypesOptions || []}
                                    onChange={(val: any) =>
                                        setSelectedType(val)
                                    }
                                    loading={
                                        isLoadingList || currentType?.isLoading
                                    }
                                    disabled={
                                        isLoadingList || currentType?.isLoading
                                    }
                                    className="w-full"
                                    placeholder="Select Type..."
                                    showError={false}
                                />
                                {currentType?.data &&
                                    currentType?.isSuccess && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-[0.8rem] text-muted-foreground">
                                                Current Type:{' '}
                                                <span className="font-medium text-slate-700">
                                                    {currentType.data.name}
                                                </span>
                                            </p>
                                            <Button
                                                variant="error"
                                                mini
                                                onClick={handleDelete}
                                                disabled={
                                                    isDeleting || isSaving
                                                }
                                                loading={isDeleting}
                                                Icon={Trash2}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-4 !bg-slate-100 border-t border-border/50 flex-col sm:flex-row gap-2 rounded-b-lg justify-between">
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    variant="secondary"
                                    onClick={() => onOpenChange(false)}
                                    className="w-full sm:w-auto text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
                                    text="Cancel"
                                />
                                <Button
                                    variant="primaryNew"
                                    onClick={handleSave}
                                    disabled={
                                        isSaving || isLoadingList || isDeleting
                                    }
                                    loading={isSaving}
                                    text="Save Changes"
                                    className="w-full sm:w-auto"
                                />
                            </div>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

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
import { AdminApi } from '@queries'
import { MealTypes } from '@types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { ShowErrorNotifications } from '@components'

interface ServicesOfferedModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    industryId: number
    serviceOffered: MealTypes[]
}

export const ServicesOfferedModal = ({
    open,
    onOpenChange,
    industryId,
    serviceOffered,
}: ServicesOfferedModalProps) => {
    const [selectedServices, setSelectedServices] = useState<MealTypes[]>(
        serviceOffered || []
    )
    const { notification } = useNotification()

    const [addServiceOffered, { isLoading, isError, error }] =
        AdminApi.Industries.addIndustryServiceOffered()

    const mealTypeOptions = Object.entries(MealTypes).map(([label, value]) => ({
        label,
        value,
    }))

    const handleSave = async () => {
        const res: any = await addServiceOffered({
            id: industryId,
            serviceOffered: selectedServices,
        })

        if (res?.data) {
            notification.success({
                title: 'Success',
                description: 'Services offered updated successfully',
            })
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-w-lg! w-full p-0 bg-white border border-border shadow-premium-lg [&>button[data-slot=dialog-close]]:text-white">
                <DialogHeader className="px-6 py-2 bg-primaryNew border-b border-border/50 rounded-t-lg">
                    <DialogTitle className="text-xl font-bold text-white">
                        Services Offered
                    </DialogTitle>
                    <DialogDescription className="text-white text-sm">
                        Select the services that this industry offers to
                        students.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 space-y-4">
                    <ShowErrorNotifications
                        result={{ isError, error } as any}
                    />

                    <div className="space-y-2">
                        <Select
                            multi
                            onlyValue
                            name="services"
                            value={selectedServices}
                            label="Select Services..."
                            options={mealTypeOptions}
                            onChange={(val: any) => setSelectedServices(val)}
                            className="w-full"
                            placeholder="Select Services..."
                            showError={false}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            You can select multiple services from the list.
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-100! border-t border-border/50 flex-col sm:flex-row gap-2 rounded-b-lg">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
                        text="Cancel"
                    />
                    <Button
                        variant='primaryNew'
                        onClick={handleSave}
                        disabled={isLoading}
                        loading={isLoading}
                        text={'Save Changes'}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

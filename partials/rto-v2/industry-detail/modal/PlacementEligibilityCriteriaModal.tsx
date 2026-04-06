import { Button } from '@components/buttons'
import {
    LoadingAnimation,
    NoData,
    Select,
    ShowErrorNotifications,
    Switch,
} from '@components'
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
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum Transport {
    OWN_TRANSPORT = 'own_transport',
    PUBLIC_TRANSPORT = 'public_transport',
}

interface PlacementEligibilityCriteriaModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const PlacementEligibilityCriteriaModal = ({
    open,
    onOpenChange,
}: PlacementEligibilityCriteriaModalProps) => {
    const router = useRouter()
    const indId = router?.query?.id as string
    const { notification } = useNotification()

    const { data, isLoading, isError } =
        CommonApi.Industries.useIndustryEligibilityCriteria(indId, {
            skip: !indId || !open,
        })

    const [updateEligibilityCriteria, resultUpdateEligibilityCriteria] =
        CommonApi.Industries.useUpdateIndustryEligibilityCriteria()

    const methods = useForm({
        mode: 'all',
        defaultValues: {
            gender: null,
            transport: null,
            NDIS: false,
        },
    })

    useEffect(() => {
        if (data) {
            methods.reset({
                gender: data.gender || null,
                transport: data.transport || null,
                NDIS: data.NDIS || false,
            })
        }
    }, [data, methods])

    useEffect(() => {
        if (resultUpdateEligibilityCriteria.isSuccess) {
            notification.success({
                title: 'Eligibility Criteria',
                description: 'Updated Successfully',
            })
            onOpenChange(false)
        }
    }, [resultUpdateEligibilityCriteria.isSuccess, notification, onOpenChange])

    const genderOptions = [
        { label: 'Any', value: null },
        { label: 'Male', value: Gender.MALE },
        { label: 'Female', value: Gender.FEMALE },
        { label: 'Other', value: Gender.OTHER },
    ]

    const transportOptions = [
        { label: 'Any', value: null },
        {
            label: 'Own',
            value: Transport.OWN_TRANSPORT,
        },
        {
            label: 'Public Transport',
            value: Transport.PUBLIC_TRANSPORT,
        },
    ]

    const findOptionByValue = (options: any[], value: any) => {
        return options.find((option) => option.value === value) || null
    }

    const onSubmit = async (values: any) => {
        updateEligibilityCriteria({ id: data?.id, body: values })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl! max-w-lg! w-full p-0 bg-white border border-border shadow-premium-lg [&>button[data-slot=dialog-close]]:text-white">
                <DialogHeader className="px-6 py-2 gap-0! bg-primaryNew border-b border-border/50 rounded-t-lg">
                    <DialogTitle className="text-xl font-bold text-white">
                        Placement Preferences
                    </DialogTitle>
                    <DialogDescription className="text-white text-sm">
                        Manage gender, transport, and NDIS preferences for
                        students in this industry.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 space-y-4">
                    <ShowErrorNotifications
                        result={resultUpdateEligibilityCriteria}
                    />

                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <LoadingAnimation />
                        </div>
                    ) : isError ? (
                        <NoData
                            isError
                            text="Error while loading placement criteria data"
                        />
                    ) : (
                        <FormProvider {...methods}>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select
                                        options={genderOptions}
                                        label="Gender"
                                        name="gender"
                                        onlyValue
                                        defaultValue={findOptionByValue(
                                            genderOptions,
                                            data?.gender || null
                                        )}
                                        showError={false}
                                        className="w-full"
                                    />
                                    <Select
                                        options={transportOptions}
                                        label="Transport"
                                        name="transport"
                                        onlyValue
                                        showError={false}
                                        defaultValue={findOptionByValue(
                                            transportOptions,
                                            data?.transport || null
                                        )}
                                        className="w-full"
                                    />
                                </div>
                                <div className="pt-2 border-t border-gray-300">
                                    <Switch
                                        name="NDIS"
                                        label="NDIS check required"
                                        customStyleClass="profileSwitch"
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Enable this if students must have a
                                        valid NDIS check for this placement.
                                    </p>
                                </div>
                            </form>
                        </FormProvider>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-100! border-t border-border/50 flex-col sm:flex-row gap-2 rounded-b-lg">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
                        text="Cancel"
                    />
                    <Button
                        variant="primaryNew"
                        onClick={methods.handleSubmit(onSubmit)}
                        disabled={
                            resultUpdateEligibilityCriteria.isLoading ||
                            isLoading
                        }
                        loading={resultUpdateEligibilityCriteria.isLoading}
                        text={'Save Changes'}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

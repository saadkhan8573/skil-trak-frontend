import { useState, useEffect } from 'react'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@redux'
import { Industry } from '@types'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export interface PlacementFormValues {
    url: string
}

const validationSchema = yup.object().shape({
    url: yup
        .string()
        .required('URL is required')
        .url('Please enter a valid URL')
        .matches(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            'Please enter a valid URL format'
        ),
})

export const usePlacementFormUrl = (industryDetail: Industry | null) => {
    const { notification } = useNotification()
    const [isEditing, setIsEditing] = useState(false)

    const methods = useForm<PlacementFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            url: industryDetail?.placementUrl || '',
        },
    })

    const { reset, handleSubmit } = methods

    const [updateUrl, { isLoading }] =
        RtoV2Api.Industries.updateIndustryPlacementUrl()

    useEffect(() => {
        if (industryDetail) {
            reset({
                url: industryDetail.placementUrl || '',
            })
        }
    }, [industryDetail, reset])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async (data: PlacementFormValues) => {
        try {
            // react-hook-form will handle validation before this
            await updateUrl({
                id: industryDetail?.id!,
                url: data.url,
            }).unwrap()

            setIsEditing(false)
            notification.success({
                title: 'Success',
                description: 'Placement form URL updated successfully',
            })
        } catch (err: any) {
            notification.error({
                title: 'Error',
                description: err?.data?.message || 'Failed to update URL',
            })
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        reset()
    }

    const handleRemove = async () => {
        try {
            await updateUrl({
                id: industryDetail?.id!,
                url: '',
            }).unwrap()

            notification.info({
                title: 'URL Removed',
                description: 'Placement form URL removed',
            })
        } catch (err: any) {
            notification.error({
                title: 'Error',
                description: 'Failed to remove URL',
            })
        }
    }

    return {
        isEditing,
        methods,
        isLoading,
        handleEdit,
        handleSave,
        handleCancel,
        handleRemove,
    }
}

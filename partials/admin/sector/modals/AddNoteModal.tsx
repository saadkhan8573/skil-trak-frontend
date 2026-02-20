import { Modal, ShowErrorNotifications, TagsInput } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { Sector } from '@types'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react'

export interface SectorNoteType {
    keywords: { id: string; text: string }[]
}

export const AddNoteModal = ({
    sector,
    onCancel,
}: {
    sector: Sector
    onCancel: () => void
}) => {
    const { notification } = useNotification()

    const [addTags, addTagsResult] = AdminApi.Sectors.useUpdateMutation()

    const generateId = `tag-${uuid()}`

    const keywords = sector?.keywords?.map((keyword) => ({
        id: generateId,
        text: keyword,
    }))

    const validationSchema = Yup.object({
        keywords: Yup.array()
            .of(
                Yup.object().shape({
                    id: Yup.string(),
                    text: Yup.string(),
                })
            )
            .min(1, 'At least one note tag is required')
            .required('Note is required'),
    })

    const methods = useForm<SectorNoteType>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    useEffect(() => {
        if (keywords && keywords?.length > 0) {
            methods.setValue('keywords', keywords)
        }
    }, [keywords])

    const onSubmit = async (values: SectorNoteType) => {
        const res: any = await addTags({
            ...sector,
            keywords: values?.keywords?.map((keyword) => keyword?.text),
        })

        if (res?.data) {
            notification.success({
                title: 'Keywords Added',
                description: 'Keywords Added Successfully',
            })
            onCancel()
        }
    }

    return (
        <div>
            <ShowErrorNotifications result={addTagsResult} />
            <Modal
                title={'Add Non Eligible workplace keywords'}
                subtitle={''}
                onConfirmClick={methods.handleSubmit(onSubmit)}
                onCancelClick={onCancel}
                loading={addTagsResult.isLoading}
            >
                <FormProvider {...methods}>
                    <div className="w-full lg:w-[600px] max-h-full lg:max-h-[70vh] overflow-auto">
                        <TagsInput
                            name="keywords"
                            inputWordsLength={4}
                            onChange={(e: { id: string; text: string }[]) => {
                                methods.setValue('keywords', e)
                            }}
                            defaultTags={keywords}
                            placeholder={
                                'Add Add Non Eligible workplace keywords (Press Enter to add tags)'
                            }
                        />
                    </div>
                </FormProvider>
            </Modal>
        </div>
    )
}

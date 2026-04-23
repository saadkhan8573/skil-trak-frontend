import { Button, Select, TextArea, TextInput } from '@components'
import { BinaryFileUpload } from '@components/inputs/BinaryFileUpload'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { RtoApi } from '@queries'
import { Course, ImportStudentFormType } from '@types'
import {
    CourseSelectOption,
    formatOptionLabel,
    genderOptions,
    getDate,
} from '@utils'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { PlacementTypeEnum } from '../enum'
import { getMinExpiryDate, importStudentValidationSchema } from '../functions'
import { PlacementType } from './PlacementType'

interface FormProps {
    onSubmit: SubmitHandler<ImportStudentFormType>
    onStudentFound?: Function
    onCancel?: () => void
}

export const ImportStudentFormV2 = ({
    onSubmit,
    onStudentFound,
    onCancel,
}: FormProps) => {
    const { notification } = useNotification()
    const [studentsCount, setStudentsCount] = useState<number>(0)

    const rto = RtoApi.Rto.useProfile()

    const rtoCoursesOptions =
        rto.isSuccess && rto?.data?.courses && rto?.data?.courses?.length > 0
            ? rto?.data?.courses?.map((course: Course) => ({
                  label: course?.title,
                  value: course?.id,
                  item: course,
              }))
            : []

    const methods = useForm<any>({
        resolver: yupResolver(importStudentValidationSchema),
        defaultValues: { placementType: PlacementTypeEnum.FLEXIBLE },
        mode: 'all',
    })

    const placementType = methods.watch('placementType')

    const onFileChange = async (e: any, fileData: any) => {
        try {
            const { read, utils } = await import('xlsx')
            const wb = read(e.target.result, { type: 'binary' })
            const sheets = wb.SheetNames

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
                setStudentsCount(rows?.length)
                if (rows?.length <= 50) {
                    methods.setValue('students', rows)
                    onStudentFound && onStudentFound(rows, fileData)
                } else {
                    notification.error({
                        title: 'Student Length!',
                        description:
                            'Student Length must be less than or equal to 50!',
                        dissmissTimer: 5000,
                    })
                }
            }
        } catch (err) {
            notification.error({
                title: 'Invalid File',
                description: 'File should be .csv or .xlsx',
            })
        }
    }

    return (
        <FormProvider {...methods}>
            <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    {/* Placement Type */}
                    <PlacementType />

                    {/* Form Inputs */}
                    <div className="grid grid-cols-1 gap-2">
                        <TextInput
                            name="batch"
                            label="Batch/Class"
                            placeholder="Batch/Class"
                        />
                    </div>
                    <div>
                        <Select
                            name="courses"
                            label="Courses"
                            options={rtoCoursesOptions}
                            multi
                            onlyValue
                            components={{ Option: CourseSelectOption }}
                            formatOptionLabel={formatOptionLabel}
                        />
                    </div>
                    <div className="flex items-center gap-x-2 justify-between">
                        {placementType === PlacementTypeEnum.BLOCK ? (
                            <>
                                <TextInput
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    min={getDate()}
                                />
                                <TextInput
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    min={getDate()}
                                />
                            </>
                        ) : (
                            <TextInput
                                label="Expiry Date"
                                name="expiryDate"
                                type="date"
                                min={getMinExpiryDate()}
                            />
                        )}
                    </div>

                    <BinaryFileUpload
                        name="list"
                        onChange={onFileChange}
                        fileAsObject={false}
                    />

                    <TextArea
                        label={'Notes (Optional)'}
                        name={'notes'}
                        placeholder={'Add Notes here...'}
                        rows={4}
                    />

                    {/* Expected Columns Preview */}
                    <div className="p-4 bg-gray-300/30 rounded-lg border my-4">
                        <p className="text-sm font-semibold mb-2">
                            Expected columns in your file:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'id',
                                'name',
                                'email',
                                'contact',
                                'address',
                                'gender',
                            ].map((col) => (
                                <div
                                    key={col}
                                    className="text-xs px-2 py-0.5 rounded-full bg-[#0D5468] text-white border border-[#0D5468]/20"
                                >
                                    {col}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-x-2 items-center">
                        <Button
                            text="Cancel"
                            variant="secondary"
                            onClick={onCancel}
                        />
                        <Button
                            text="Import Students"
                            Icon={Upload}
                            variant="primaryNew"
                            submit
                            loading={methods?.formState?.isSubmitting}
                            disabled={
                                methods?.formState?.isSubmitting ||
                                studentsCount > 50
                            }
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

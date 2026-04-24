import { Select, TextInput } from '@components/inputs'

// query
import { Result } from '@constants'
import { CommonApi, SubAdminApi } from '@queries'
import { SetQueryFilters } from './SetQueryFilters'
import { SelectOption } from './types'
import { Course, OptionType, Rto, SubAdminAssessmentsFiltersType } from '@types'
import { CourseSelectOption, formatOptionLabel } from '@utils'
interface ItemFilterProps {
    onFilterChange: (values: SubAdminAssessmentsFiltersType) => void
    filter: SubAdminAssessmentsFiltersType
}
export const SubAdminAssessmentsFilters = ({
    onFilterChange,
    filter,
}: ItemFilterProps) => {
    // query
    const getRtos = SubAdminApi.Rto.useRtosFilterList()
    const getCourses = CommonApi.Filter.useCourses()

    const rtoOptions = getRtos?.data?.map((rto: Rto) => ({
        value: rto?.id,
        label: rto?.user?.name,
    }))

    const coursesOptions = getCourses?.data?.map((course: Course) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    const resultOptions = [
        {
            label: 'Pending',
            value: Result.Pending,
        },
        {
            label: 'Not Competent',
            value: Result.NotCompetent,
        },
        {
            label: 'Competent',
            value: Result.Competent,
        },
        {
            label: 'Re-Opened',
            value: Result.ReOpened,
        },
    ]

    return (
        <>
            <SetQueryFilters<SubAdminAssessmentsFiltersType> filter={filter} />
            <div className="grid grid-cols-4 gap-x-3">
                <TextInput
                    name="name"
                    label={'Name'}
                    placeholder={'Search by Student Name ...'}
                    value={filter?.name}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, name: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="email"
                    label={'Email'}
                    placeholder={'Search by Student Email ...'}
                    type={'email'}
                    value={filter?.email}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, email: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="phone"
                    label={'Phone'}
                    placeholder={'Search by Student Phone ...'}
                    value={filter?.phone}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, phone: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="studentId"
                    label={'Student Id'}
                    placeholder={'Search by Student Id Email ...'}
                    value={filter?.studentId}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, studentId: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="studentMaskedId"
                    label={'Job Id'}
                    placeholder={'Search by Job Id ...'}
                    value={filter?.studentMaskedId}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            studentMaskedId: e.target.value,
                        })
                    }}
                    showError={false}
                />
                <Select
                    label={'Result'}
                    name={'result'}
                    options={resultOptions}
                    placeholder={'Select Sectors...'}
                    value={resultOptions?.find(
                        (result: SelectOption) =>
                            result.value === filter?.result
                    )}
                    showError={false}
                    onChange={(e: SelectOption) => {
                        onFilterChange({
                            ...filter,
                            result: e?.value as Result,
                        })
                    }}
                />
                <Select
                    label={'Search By Rto'}
                    name={'rtoId'}
                    options={rtoOptions}
                    placeholder={'Select Search By Rto...'}
                    value={rtoOptions?.find(
                        (rto: OptionType) => rto.value === Number(filter?.rtoId)
                    )}
                    showError={false}
                    onChange={(e: OptionType) => {
                        onFilterChange({ ...filter, rtoId: Number(e?.value) })
                    }}
                    loading={getRtos.isLoading}
                    disabled={getRtos.isLoading}
                />
                <Select
                    label={'Search by Courses'}
                    name={'courseId'}
                    options={coursesOptions}
                    placeholder={'Select Courses...'}
                    value={coursesOptions?.find(
                        (course: OptionType) =>
                            course.value === Number(filter?.courseId)
                    )}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            courseId: Number(e?.value),
                        })
                    }}
                    components={{
                        Option: CourseSelectOption,
                    }}
                    formatOptionLabel={formatOptionLabel}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                />
            </div>
        </>
    )
}

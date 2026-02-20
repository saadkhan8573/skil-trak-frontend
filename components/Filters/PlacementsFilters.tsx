import { Select, TextInput } from '@components/inputs'
import { CommonApi } from '@queries'
import { Course, OptionType } from '@types'
import { CourseSelectOption, formatOptionLabel } from '@utils'
import { RTOWorkplaceFormFilter } from '@types'
import { SetQueryFilters } from './SetQueryFilters'

interface PlacementsFiltersProps {
    onFilterChange: (values: RTOWorkplaceFormFilter) => void
    filter: RTOWorkplaceFormFilter
}

export const PlacementsFilters = ({
    onFilterChange,
    filter,
}: PlacementsFiltersProps) => {
    const getCourses = CommonApi.Filter.useCourses()

    const coursesOptions = getCourses?.data?.map((course: Course) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    return (
        <>
            <SetQueryFilters<RTOWorkplaceFormFilter> filter={filter} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextInput
                    name="name"
                    label={'Student Name'}
                    placeholder={'Search by Student Name ...'}
                    value={filter?.name}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, name: e.target.value })
                    }}
                    showError={false}
                />
                <Select
                    label={'Course'}
                    name={'courseId'}
                    options={coursesOptions}
                    placeholder={'Filter by Course...'}
                    value={coursesOptions?.find(
                        (course: any) =>
                            course.value === Number(filter?.courseId)
                    )}
                    onlyValue
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            courseId: Number(e),
                        })
                    }}
                    showError={false}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                    components={{
                        Option: CourseSelectOption,
                    }}
                    formatOptionLabel={formatOptionLabel}
                />
            </div>
        </>
    )
}

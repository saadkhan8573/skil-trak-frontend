import { Select, TextInput } from '@components/inputs'
import { ChangeEvent } from 'react'

// query
import { AdminApi, CommonApi, useGetSubAdminRtosQuery } from '@queries'
import { workplaceProgressOptions } from './StudentFilters'
import {
    Course,
    Industry,
    OptionType,
    Rto,
    SubadminWorkplaceFiltersType,
    UserStatus,
} from '@types'
import { SetQueryFilters } from './SetQueryFilters'
import { StatusOptions } from './StatusOptions'
import { SelectOption } from './types'

interface ItemFilterProps {
    onFilterChange: (values: SubadminWorkplaceFiltersType) => void
    filter: SubadminWorkplaceFiltersType
}
export const WorkplaceFilters = ({
    onFilterChange,
    filter,
}: ItemFilterProps) => {
    // query
    const getIndustries = CommonApi.Filter.useIndustries()
    const getCourses = CommonApi.Filter.useCourses()
    const getRtos = useGetSubAdminRtosQuery({})

    const industryOptions = getIndustries?.data?.map((industry: Industry) => ({
        value: industry?.id,
        label: industry?.user?.name,
    }))

    const coursesOptions = getCourses?.data?.map((course: Course) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    const rtoOptions =
        getRtos?.data?.data && getRtos?.data?.data?.length > 0
            ? getRtos?.data?.data?.map((rto: Rto) => ({
                  value: rto?.id,
                  label: rto?.user?.name,
              }))
            : []
    const coordinators = AdminApi.SubAdmins.useSubAdminsFilterList()
    const coordinatorsOptions = coordinators.data?.map((coordinator: any) => ({
        value: coordinator?.id,
        label: coordinator?.user?.name,
    }))

    const noWorkplaceOption = [
        {
            label: 'No Workplace',
            value: 'Na',
        },
    ]

    return (
        <>
            <SetQueryFilters<SubadminWorkplaceFiltersType> filter={filter} />
            <div className="grid grid-cols-4 gap-x-3">
                <TextInput
                    name="studentId"
                    label={'Student Id'}
                    value={filter?.studentId}
                    placeholder={'Search by Student Id Email ...'}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onFilterChange({ ...filter, studentId: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="name"
                    value={filter?.name}
                    label={'Student Name'}
                    placeholder={'Search by Student Name ...'}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, name: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="email"
                    value={filter?.email}
                    label={'Student Email'}
                    placeholder={'Search by Student Email ...'}
                    type={'email'}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, email: e.target.value })
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
                    label={'User Status'}
                    name={'status'}
                    options={StatusOptions}
                    value={StatusOptions?.find(
                        (status) => status.value === filter?.status
                    )}
                    showError={false}
                    placeholder={'Select Sectors...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            status: e?.value as UserStatus,
                        })
                    }}
                />
                <Select
                    label={'Search by Rto'}
                    name={'rtoId'}
                    options={rtoOptions}
                    value={rtoOptions?.find(
                        (rto: OptionType) => rto.value === Number(filter?.rtoId)
                    )}
                    showError={false}
                    placeholder={'Select Rto...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({ ...filter, rtoId: Number(e?.value) })
                    }}
                    loading={getRtos.isLoading}
                    disabled={getRtos.isLoading}
                />
                <Select
                    label={'Search by Industry'}
                    name={'industryId'}
                    options={industryOptions}
                    value={industryOptions?.find(
                        (industry: OptionType) =>
                            industry.value === Number(filter?.industryId)
                    )}
                    showError={false}
                    placeholder={'Select Industry...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            industryId: Number(e?.value),
                        })
                    }}
                    loading={getIndustries.isLoading}
                    disabled={getIndustries.isLoading}
                />

                <Select
                    label={'Search by Courses'}
                    name={'courseId'}
                    options={coursesOptions}
                    value={coursesOptions?.find(
                        (course: OptionType) =>
                            course.value === Number(filter?.courseId)
                    )}
                    showError={false}
                    placeholder={'Select Courses...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            courseId: Number(e?.value),
                        })
                    }}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                />

                {/* {checkIsHod && ( */}
                <Select
                    label={'Filter by Coordinator'}
                    name={'coordinator'}
                    options={coordinatorsOptions}
                    placeholder={'Filter by Coordinator...'}
                    value={coordinatorsOptions?.find(
                        (c: OptionType) =>
                            c?.value === Number(filter?.subAdminId)
                    )}
                    // onlyValue
                    onChange={(e: any) =>
                        onFilterChange({ ...filter, subAdminId: e?.value })
                    }
                />
                {/* )} */}

                <Select
                    label={'Search by Progress'}
                    name={'currentStatus'}
                    options={workplaceProgressOptions}
                    placeholder={'Select Progress...'}
                    value={workplaceProgressOptions?.find(
                        (currentStatus: SelectOption) =>
                            currentStatus.value === filter?.currentStatus
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, currentStatus: e?.value })
                    }}
                    showError={false}
                />
                <Select
                    label={'Student with no workplace'}
                    name={'nowp'}
                    options={noWorkplaceOption}
                    placeholder={'Student with no workplace...'}
                    value={noWorkplaceOption?.find(
                        (noWp: SelectOption) => noWp.value === filter?.nowp
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, nowp: e?.value })
                    }}
                    showError={false}
                />
            </div>
        </>
    )
}

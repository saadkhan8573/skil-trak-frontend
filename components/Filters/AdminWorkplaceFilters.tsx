import { Select, TextInput } from '@components/inputs'

// query
import { CommonApi, AdminApi } from '@queries'

import {
    AdminWorkplaceFiltersType,
    Course,
    Industry,
    OptionType,
    Rto,
    SubAdmin,
    UserStatus,
} from '@types'
import { SetQueryFilters } from './SetQueryFilters'
import { StatusOptions } from './StatusOptions'
import { SelectOption } from './types'
import { ChangeEvent } from 'react'
import { CourseSelectOption, formatOptionLabel } from '@utils'

interface ItemFilterProps {
    onFilterChange: (values: AdminWorkplaceFiltersType) => void
    filter: AdminWorkplaceFiltersType
}
export const AdminWorkplaceFilters = ({
    onFilterChange,
    filter,
}: ItemFilterProps) => {
    const getRtos = CommonApi.Filter.useRtos()
    const getCourses = CommonApi.Filter.useCourses()
    const getIndustries = CommonApi.Filter.useIndustries()
    const getCoordinators = CommonApi.Appointments.allCoordinators()
    const departments = AdminApi.Department.getDepartmentFilterList()

    const industryOptions = getIndustries?.data?.map((industry: Industry) => ({
        value: industry?.id,
        label: industry?.user?.name,
    }))

    const coursesOptions = getCourses?.data?.map((course: Course) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    const coordinatorOptions = getCoordinators?.data?.map(
        (coordinator: SubAdmin) => ({
            value: coordinator?.id,
            label: coordinator?.user?.name,
        })
    )
    const departmentsOptions = departments?.data?.map((department: any) => ({
        value: department?.id,
        label: department?.name,
    }))

    const rtoOptions =
        getRtos?.data && getRtos?.data?.length > 0
            ? getRtos?.data?.map((rto: Rto) => ({
                  value: rto?.id,
                  label: rto?.user?.name,
              }))
            : []

    const noWorkplaceOption = [
        {
            label: 'No Workplace',
            value: 'Na',
        },
    ]

    return (
        <>
            <SetQueryFilters<AdminWorkplaceFiltersType> filter={filter} />
            <div className="grid grid-cols-4 gap-x-3">
                <TextInput
                    name="studentId"
                    label={'Student Id'}
                    placeholder={'Search by Student Id Email ...'}
                    value={filter?.studentId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onFilterChange({ ...filter, studentId: e.target.value })
                    }}
                    showError={false}
                />
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
                <TextInput
                    name="email"
                    label={'Student Email'}
                    placeholder={'Search by Student Email ...'}
                    type={'email'}
                    value={filter?.email}
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

                <TextInput
                    name="location"
                    label={'Location'}
                    placeholder={'Search by Location ...'}
                    value={filter?.location}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, location: e.target.value })
                    }}
                    showError={false}
                />

                <Select
                    label={'Status'}
                    name={'status'}
                    options={StatusOptions}
                    value={StatusOptions?.find(
                        (status) => status.value === filter.status
                    )}
                    placeholder={'Select Sectors...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            status: e?.value as UserStatus,
                        })
                    }}
                    showError={false}
                />

                <Select
                    label={'Coordinator'}
                    name={'coordinator'}
                    options={coordinatorOptions}
                    value={coordinatorOptions?.find(
                        (coordinators: SelectOption) =>
                            coordinators.value === Number(filter.subAdminId)
                    )}
                    placeholder={'Search by Coordinator...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            subAdminId: Number(e?.value),
                        })
                    }}
                    loading={getCoordinators.isLoading}
                    disabled={getCoordinators.isLoading}
                    showError={false}
                />

                <Select
                    label={'Search by Rto'}
                    name={'rtoId'}
                    options={rtoOptions}
                    value={rtoOptions?.find(
                        (rto: OptionType) => rto.value === Number(filter.rtoId)
                    )}
                    placeholder={'Select Rto...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({ ...filter, rtoId: Number(e?.value) })
                    }}
                    loading={getRtos.isLoading}
                    disabled={getRtos.isLoading}
                    showError={false}
                />

                <Select
                    label={'Search by Industry'}
                    name={'industryId'}
                    options={industryOptions}
                    value={industryOptions?.find(
                        (industry: OptionType) =>
                            industry.value === Number(filter.industryId)
                    )}
                    placeholder={'Select Industry...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            industryId: Number(e?.value),
                        })
                    }}
                    loading={getIndustries.isLoading}
                    disabled={getIndustries.isLoading}
                    showError={false}
                />

                <Select
                    label={'Search by Courses'}
                    name={'courseId'}
                    options={coursesOptions}
                    value={coursesOptions?.find(
                        (course: OptionType) =>
                            course.value === Number(filter.courseId)
                    )}
                    placeholder={'Select Courses...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            courseId: Number(e?.value),
                        })
                    }}
                    loading={getCourses.isLoading}
                    components={{
                        Option: CourseSelectOption,
                    }}
                    disabled={getCourses.isLoading}
                    formatOptionLabel={formatOptionLabel}
                    showError={false}
                />

                <Select
                    label={'Search by Department'}
                    name={'depId'}
                    options={departmentsOptions}
                    placeholder={'Select Department...'}
                    value={departmentsOptions?.find(
                        (subadmin: SelectOption) =>
                            subadmin.value === Number(filter?.depId)
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, depId: e?.value })
                    }}
                    showError={false}
                    loading={departments.isLoading}
                    disabled={departments.isLoading}
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

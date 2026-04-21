import { Select, TextInput } from '@components/inputs'

// query
import { AdminApi, CommonApi, SubAdminApi } from '@queries'

import {
    OptionType,
    SubAdmin,
    SubAdminStudentsFilterType,
    UserStatus,
} from '@types'
import { SetQueryFilters } from './SetQueryFilters'
import { StatusOptions } from './StatusOptions'
import { workplaceProgressOptions } from './StudentFilters'
import { SelectOption } from './types'
import { useSubadminProfile } from '@hooks'

interface ItemFilterProps {
    onFilterChange: (values: SubAdminStudentsFilterType) => void
    filter: SubAdminStudentsFilterType
}
export const SubAdminStudentFilters = ({
    onFilterChange,
    filter,
}: ItemFilterProps) => {
    const subadmin = useSubadminProfile()

    // query
    const getIndustries = CommonApi.Filter.useIndustries()
    const getRtos = CommonApi.Filter.useSubAdminRtos()
    const getCourses = CommonApi.Filter.useCourses()
    const coordinators = AdminApi.SubAdmins.useSubAdminsFilterList()

    const { data: departmentCoordinators } =
        SubAdminApi.SubAdmin.useCoordinatorsDropDown()

    const coordinatorsOptions = departmentCoordinators?.map(
        (coordinator: any) => ({
            label: coordinator?.user?.name,
            value: coordinator?.id,
        })
    )
    const checkIsHod = subadmin?.departmentMember?.isHod

    const industryOptions = getIndustries?.data?.map((industry: any) => ({
        value: industry?.id,
        label: industry?.user?.name,
    }))

    const rtoOptions = getRtos?.data?.map((rto: any) => ({
        value: rto?.id,
        label: rto?.user?.name,
    }))

    const coursesOptions = getCourses?.data?.map((course: any) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    const coordinatorOptions = coordinators?.data?.map(
        (subadmin: SubAdmin) => ({
            value: subadmin?.id,
            label: subadmin?.user?.name,
        })
    )

    const noWorkplaceOption = [
        {
            label: 'No Workplace',
            value: 'Na',
        },
    ]

    return (
        <>
            <SetQueryFilters<SubAdminStudentsFilterType> filter={filter} />
            <div className="grid grid-cols-4 gap-x-3">
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
                    label={'Status'}
                    name={'status'}
                    value={StatusOptions.find(
                        (status) => status.value === filter?.status
                    )}
                    options={StatusOptions}
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
                    label={'Search By Rto'}
                    name={'rtoId'}
                    options={rtoOptions}
                    placeholder={'Select Search By Rto...'}
                    value={rtoOptions?.find(
                        (rto: SelectOption) =>
                            rto.value === Number(filter?.rtoId)
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, rtoId: e?.value })
                    }}
                    showError={false}
                    loading={getRtos.isLoading}
                    disabled={getRtos.isLoading}
                />
                <Select
                    label={'Search by Industry'}
                    name={'industryId'}
                    options={industryOptions}
                    placeholder={'Select Industry...'}
                    value={industryOptions?.find(
                        (industry: SelectOption) =>
                            industry.value === Number(filter?.industryId)
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, industryId: e?.value })
                    }}
                    showError={false}
                    loading={getIndustries.isLoading}
                    disabled={getIndustries.isLoading}
                />

                <Select
                    label={'Search by Courses'}
                    name={'courseId'}
                    options={coursesOptions}
                    placeholder={'Select Courses...'}
                    defaultValue={coursesOptions?.find(
                        (course: SelectOption) =>
                            course.value === filter?.courseId
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, courseId: e?.value })
                    }}
                    showError={false}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                />
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
                {checkIsHod && (
                    <Select
                        label={'Filter by Coordinator'}
                        name={'coordinator'}
                        options={coordinatorsOptions}
                        placeholder={'Filter by Coordinator...'}
                        value={coordinatorsOptions?.find(
                            (c: OptionType) =>
                                c?.value === Number(filter.coordinator)
                        )}
                        // onlyValue
                        onChange={(e: any) =>
                            onFilterChange({ ...filter, coordinator: e?.value })
                        }
                    />
                )}

                {(subadmin?.isManager ||
                    subadmin?.id === 3 ||
                    subadmin?.id === 76) && (
                    <Select
                        label={'Search by Coordinator'}
                        name={'subadminId'}
                        options={coordinatorOptions}
                        placeholder={'Select Coordinator...'}
                        value={coordinatorOptions?.find(
                            (subadmin: SelectOption) =>
                                subadmin.value === Number(filter?.subadminId)
                        )}
                        onChange={(e: any) => {
                            onFilterChange({ ...filter, subadminId: e?.value })
                        }}
                        showError={false}
                        loading={coordinators.isLoading}
                        disabled={coordinators.isLoading}
                    />
                )}
            </div>
            {/* <div className="flex items-center gap-2 mt-4">
                <Checkbox
                    label={'Flagged'}
                    name={'flagged'}
                    value={filter?.flagged}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            flagged: e?.target.checked,
                        })
                    }}
                    showError={false}
                />
                <Checkbox
                    label={'Snoozed'}
                    name={'snoozed'}
                    value={filter?.snoozed}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            snoozed: e?.target.checked,
                        })
                    }}
                    showError={false}
                />
                <Checkbox
                    label={'Non Contactable'}
                    name={'nonContactable'}
                    value={filter?.nonContactable}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            nonContactable: e?.target.checked,
                        })
                    }}
                    showError={false}
                />
            </div> */}
        </>
    )
}

import { Checkbox, Select, TextInput } from '@components/inputs'

import { StatusOptions } from './StatusOptions'

// queries
import { CommonApi, AuthApi, AdminApi } from '@queries'
import {
    AdminIndustryFormFilter,
    Course,
    OptionType,
    SubAdmin,
    UserStatus,
} from '@types'
import { SetQueryFilters } from './SetQueryFilters'
import { CourseSelectOption, formatOptionLabel } from '@utils'
import { State } from 'country-state-city'

interface ItemFilterProps {
    onFilterChange: (values: AdminIndustryFormFilter) => void
    filter: AdminIndustryFormFilter
    removeFilterKeysToUrl?: string[] | undefined
}
export const IndustryFilters = ({
    onFilterChange,
    filter,
    removeFilterKeysToUrl,
}: ItemFilterProps) => {
    // query
    const getCourses = CommonApi.Filter.useCourses()
    const getSectors = AuthApi.useSectors({})
    const getPremiumFeaturesList = CommonApi.Industries.usePremiumFeaturesList()
    const getWpTypes = AdminApi.WpTypes.wpTypes({
        search: '',
        skip: 0,
        limit: 1000,
    })

    const coursesOptions = getCourses?.data?.map((course: Course) => ({
        item: course,
        value: course?.id,
        label: course?.title,
    }))

    const { isLoading, isFetching, data } = AdminApi.SubAdmins.useListQuery({
        search: `status:${UserStatus.Approved},isAssociatedWithRto:${false}`,
        skip: 0,
        limit: 100,
    })

    const updatedFilter = {
        ...filter,
    }

    removeFilterKeysToUrl?.forEach((key) => {
        delete updatedFilter[key as keyof typeof updatedFilter]
    })

    const sectorOptions = getSectors.data?.map((sector: any) => ({
        label: sector.name,
        value: sector.id,
    }))

    const isPremiumOptions = getPremiumFeaturesList?.data?.map(
        (premium: any) => ({
            label: premium?.title,
            value: premium?.id,
        })
    )

    const stateCodes = State.getStatesOfCountry('AU')?.map((state) => ({
        value: state?.name,
        label: state?.name,
    }))

    const readinessOptions = [
        { value: 'ready', label: 'Ready' },
        { value: 'notReady', label: 'Not Ready' },
    ]

    const coordinatorsOptions = data?.data?.map((coordinator: SubAdmin) => ({
        value: coordinator?.id,
        label: coordinator?.user?.name,
    }))

    const wpTypesOptions = getWpTypes?.data?.data?.map((wpType: any) => ({
        value: wpType?.id,
        label: wpType?.name,
    }))

    return (
        <>
            <SetQueryFilters<AdminIndustryFormFilter> filter={updatedFilter} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3">
                <TextInput
                    name="name"
                    label={'Name'}
                    placeholder={'Search by Industry Name ...'}
                    value={filter?.name}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, name: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="email"
                    label={'Email'}
                    placeholder={'Search by Industry Email ...'}
                    type={'email'}
                    value={filter?.email}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, email: e.target.value })
                    }}
                    showError={false}
                />

                <TextInput
                    name="phone"
                    label={'Phone No'}
                    placeholder={'Search by Industry Email ...'}
                    value={filter?.phone}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, phone: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="abn"
                    label={'Abn'}
                    placeholder={'Search by Industry ABN ...'}
                    value={filter?.abn}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, abn: e.target.value })
                    }}
                    showError={false}
                />

                <Select
                    label={'Premium Features'}
                    name={'feature'}
                    options={isPremiumOptions}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            feature: e?.value,
                        })
                    }}
                    showError={false}
                />

                <Select
                    label={'Status'}
                    name={'status'}
                    options={StatusOptions}
                    defaultValue={StatusOptions?.find(
                        (status) => status.value === filter?.status
                    )}
                    placeholder={'Select Status...'}
                    onChange={(e: OptionType) => {
                        onFilterChange({
                            ...filter,
                            status: e?.value as UserStatus,
                        })
                    }}
                    showError={false}
                />

                <TextInput
                    label={'Industry Address'}
                    name={'address'}
                    value={filter?.address}
                    placeholder={'Select Industry Address...'}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            address: e.target.value,
                        })
                    }}
                    showError={false}
                />

                <TextInput
                    label={'Suburb'}
                    name={'suburb'}
                    value={filter?.suburb}
                    placeholder={'Select Industry Suburb...'}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            suburb: e.target.value,
                        })
                    }}
                    showError={false}
                />

                <Select
                    label={'State'}
                    name={'state'}
                    options={stateCodes}
                    onlyValue
                    value={filter?.state}
                    placeholder={'Select State...'}
                    onChange={(e: string) => {
                        onFilterChange({
                            ...filter,
                            state: e,
                        })
                    }}
                    showError={false}
                />

                <Select
                    label={'Filter by Coordinator'}
                    name={'favoriteBy'}
                    options={coordinatorsOptions}
                    onlyValue
                    value={Number(filter?.favoriteBy)}
                    placeholder={'Select Coordinator...'}
                    onChange={(e: number) => {
                        onFilterChange({
                            ...filter,
                            favoriteBy: e,
                        })
                    }}
                    loading={isLoading || isFetching}
                    disabled={isLoading || isFetching}
                    showError={false}
                />

                <Select
                    label={'Search by Sectors'}
                    name={'sectorId'}
                    options={sectorOptions}
                    placeholder={'Select Sectors...'}
                    value={sectorOptions?.find(
                        (sector: OptionType) =>
                            sector?.value === Number(filter?.sectorId)
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, sectorId: e })
                    }}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                    onlyValue
                    showError={false}
                />
                <Select
                    label={'Search by Courses'}
                    name={'courseId'}
                    options={coursesOptions}
                    placeholder={'Select Courses...'}
                    defaultValue={coursesOptions?.find(
                        (course: OptionType) =>
                            course.value === Number(filter?.courseId)
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, courseId: e?.value })
                    }}
                    loading={getCourses.isLoading}
                    disabled={getCourses.isLoading}
                    components={{
                        Option: CourseSelectOption,
                    }}
                    formatOptionLabel={formatOptionLabel}
                    showError={false}
                />

                <Select
                    name="placementReady"
                    label="Placement Readiness"
                    options={readinessOptions}
                    value={readinessOptions.find(
                        (opt) => opt.value === filter?.placementReady
                    )}
                    onChange={(option: any) =>
                        onFilterChange({
                            ...filter,
                            placementReady: option?.value,
                        })
                    }
                    placeholder="Readiness"
                    showError={false}
                />

                <Select
                    label={'Search by Workplace Type'}
                    name={'wpType'}
                    options={wpTypesOptions}
                    placeholder={'Select Workplace Type...'}
                    value={wpTypesOptions?.find(
                        (wpType: OptionType) =>
                            wpType?.value === Number(filter?.wpType)
                    )}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, wpType: e })
                    }}
                    loading={getWpTypes.isLoading}
                    disabled={getWpTypes.isLoading}
                    onlyValue
                    showError={false}
                />

                <div className="flex items-center gap-x-2">
                    <div className={'mt-7'}>
                        <Checkbox
                            label={'Hiring'}
                            name={'isHiring'}
                            onChange={(e: any) => {
                                onFilterChange({
                                    ...filter,
                                    isHiring: e?.target?.checked
                                        ? true
                                        : undefined,
                                })
                            }}
                            showError={false}
                        />
                    </div>
                    <div className={'mt-7'}>
                        <Checkbox
                            label={'Snoozed'}
                            name={'isSnoozed'}
                            onChange={(e: any) => {
                                onFilterChange({
                                    ...filter,
                                    isSnoozed: e?.target?.checked
                                        ? true
                                        : undefined,
                                })
                            }}
                            showError={false}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

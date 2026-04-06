import { Checkbox, Select, TextInput } from '@components/inputs'
import { AdminApi, AuthApi, CommonApi } from '@queries'
import { SetQueryFilters } from './SetQueryFilters'
import { StatusOptions } from './StatusOptions'
import { SelectOption } from './types'
import { FindWorkplaceFilter, IndustryStatus } from '@types'
import { useEffect, useState } from 'react'
import { IndustryListingDepartment } from '@partials/common/FindWorkplaces/enum'

interface ItemFilterProps {
    onFilterChange: (values: any) => void
    filter: any
}

export const FindWorkplaceFilters = ({
    onFilterChange,
    filter,
}: ItemFilterProps) => {
    const sectorResponse = AuthApi.useSectors({})
    const [sectorOptions, setSectorOptions] = useState<any>([])
    const getWpTypes = AdminApi.WpTypes.wpTypes({
        search: '',
        skip: 0,
        limit: 1000,
    })

    const wpTypesOptions = getWpTypes?.data?.data?.map((wpType: any) => ({
        value: wpType?.id,
        label: wpType?.name,
    }))

    const onSectorChanged = (sectors: any) => {
        const sectorExisting = sectorResponse?.data?.find((sector: any) => {
            sector.name === sectors?.value
        })
        const newCourseOptions: any = []
        sectorExisting?.courses?.map((course: any) =>
            newCourseOptions.push({
                label: course.title,
                value: course.id,
            })
        )
    }

    useEffect(() => {
        if (sectorResponse.data?.length) {
            const options = sectorResponse.data?.map((sector: any) => ({
                label: sector.name,
                value: sector.name,
            }))
            setSectorOptions(options)
        }
    }, [sectorResponse?.data])

    const departmentOptions = [
        {
            label: 'Employment',
            value: IndustryListingDepartment.EMPLOYMENT,
        },
        {
            label: 'Sourcing',
            value: IndustryListingDepartment.SOURCING,
        },
    ]

    const statusOptions = [
        {
            label: 'Default',
            value: IndustryStatus.DEFAULT,
        },
        {
            label: 'FAVOURITE',
            value: IndustryStatus.FAVOURITE,
        },
        {
            label: 'DO NOT DISTURB',
            value: IndustryStatus.DO_NOT_DISTURB,
        },
    ]

    return (
        <>
            <SetQueryFilters<FindWorkplaceFilter> filter={filter} />
            <div className="grid grid-cols-4 gap-x-3">
                <TextInput
                    name="businessName"
                    label={'Business Name'}
                    placeholder={'Search by Industry Name ...'}
                    value={filter?.businessName}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            businessName: e.target.value,
                        })
                    }}
                    showError={false}
                />
                <TextInput
                    name="email"
                    label={'Email'}
                    placeholder={'Search by Email ...'}
                    type={'text'}
                    value={filter?.email}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, email: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="phone"
                    label={'Phone'}
                    placeholder={'Search by Phone ...'}
                    type={'text'}
                    value={filter?.phone}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, phone: e.target.value })
                    }}
                    showError={false}
                />
                <TextInput
                    name="address"
                    label={'Address'}
                    placeholder={'Search by Address ...'}
                    type={'text'}
                    value={filter?.address}
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, address: e.target.value })
                    }}
                    showError={false}
                />

                <Select
                    label={'Sector'}
                    value={sectorOptions?.find((p: any) => {
                        p.value === filter?.sector
                    })}
                    name={'sector'}
                    options={sectorOptions}
                    placeholder={'Select Sectors...'}
                    loading={sectorResponse.isLoading}
                    onChange={(e: any) => {
                        onSectorChanged(e)
                        onFilterChange({ ...filter, sector: e })
                    }}
                    showError={false}
                    validationIcons
                    onlyValue
                />
                <Select
                    name={'department'}
                    label={'Select Department'}
                    options={departmentOptions}
                    value={departmentOptions?.find((d: any) => {
                        d?.value == filter?.department
                    })}
                    onChange={(e: SelectOption) => {
                        onFilterChange({ ...filter, department: e?.value })
                    }}
                    showError={false}
                />
                <Select
                    label={'Status'}
                    name={'status'}
                    options={statusOptions}
                    placeholder={'Select Status...'}
                    value={statusOptions?.find(
                        (sector: any) => sector?.value === filter?.status
                    )}
                    validationIcons
                    onChange={(e: any) => {
                        onFilterChange({ ...filter, status: e })
                    }}
                    onlyValue
                />

                <Select
                    label={'Search by Workplace Type'}
                    name={'wpType'}
                    options={wpTypesOptions}
                    placeholder={'Select Workplace Type...'}
                    value={wpTypesOptions?.find(
                        (wpType: any) =>
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
                <Checkbox
                    name="myListing"
                    label={'My Listing'}
                    value={Boolean(filter?.myListing)}
                    defaultChecked={filter?.myListing}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            myListing: e?.target?.checked,
                        })
                    }}
                />
            </div>
        </>
    )
}

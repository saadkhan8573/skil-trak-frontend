import { Select, TextInput } from '@components/inputs'
import { EsignDocumentStatus } from '@utils'
import { RtoEsignFilterType } from '@types'
import { SetQueryFilters } from './SetQueryFilters'

interface ItemFilterProps {
    onFilterChange: (values: RtoEsignFilterType) => void
    filter: RtoEsignFilterType
}

export const RtoEsignFilter = ({ onFilterChange, filter }: ItemFilterProps) => {
    const statusOptions = [
        { label: 'Pending', value: EsignDocumentStatus.PENDING },
        { label: 'Signed', value: EsignDocumentStatus.SIGNED },
        { label: 'Rejected', value: EsignDocumentStatus.REJECTED },
        { label: 'Cancelled', value: EsignDocumentStatus.CANCELLED },
        { label: 'Re-Sign', value: EsignDocumentStatus.ReSign },
    ]

    return (
        <>
            <SetQueryFilters<RtoEsignFilterType> filter={filter} />
            <div className="grid grid-cols-4 gap-x-3">
                <TextInput
                    name="studentName"
                    label={'Student Name'}
                    placeholder={'Search by Student Name ...'}
                    value={filter?.studentName}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            studentName: e.target.value,
                        })
                    }}
                    showError={false}
                />
                <TextInput
                    name="date"
                    label={'Date'}
                    type="date"
                    value={filter?.date}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            date: e.target.value,
                        })
                    }}
                    showError={false}
                />
                <Select
                    label={'Status'}
                    name={'status'}
                    value={statusOptions.find((o) => o.value === filter?.status)}
                    options={statusOptions}
                    placeholder={'Select Status...'}
                    onChange={(e: any) => {
                        onFilterChange({
                            ...filter,
                            status: e?.value as EsignDocumentStatus,
                        })
                    }}
                    showError={false}
                />
            </div>
        </>
    )
}

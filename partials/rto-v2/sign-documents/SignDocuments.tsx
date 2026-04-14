import {
    TextInput
} from '@components'
import { ConfigTabs } from '@components/ConfigTabs/ConfigTabs'
import { CommonApi } from '@queries'
import { checkFilteredDataLength, removeEmptyValues } from '@utils'
import debounce from 'lodash/debounce'
import { CheckCircle, Clock, FileSignature } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ActionRequiredHeader } from '../components'
import { FilteredEsignDocuments, PendingEsignDocuments, ReadyToSignEsignDocuments, SignedEsignDocuments } from './components'

export const SignDocuments = () => {
    const [studentNameValue, setStudentNameValue] = useState('')
    const [debouncedName, setDebouncedName] = useState('')

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)

    const delayedSearch = useCallback(
        debounce((value) => {
            setDebouncedName(value)
        }, 700),
        []
    )

    const combinedFilters = removeEmptyValues({
        name: debouncedName,
    })

    const filteredDataLength = checkFilteredDataLength(combinedFilters)

    const filteredDocuments = CommonApi.ESign.useListByStatusForRto(
        {
            search: `${JSON.stringify(combinedFilters)
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            skip: !filteredDataLength,
            refetchOnMountOrArgChange: true,
        }
    )

    const esignCounts = CommonApi.ESign.useGetRtoEsignDocumentsCount()
    const counts = esignCounts?.data

    const tabsConfig = [
        {
            value: 'readyToSign',
            label: 'Ready to Sign',
            icon: FileSignature,
            count: counts?.readyToSign,
            component: ReadyToSignEsignDocuments,
        },
        {
            value: 'pending',
            label: 'Pending From Student/Industry',
            icon: Clock,
            count: counts?.pendingDocuments,
            component: PendingEsignDocuments,
        },
        {
            value: 'signed',
            label: 'Signed',
            icon: CheckCircle,
            count: counts?.signedDocuments,
            component: SignedEsignDocuments,
        },
    ]

    return (
        <div className="space-y-4">

            <ActionRequiredHeader
                icon={FileSignature}
                title="E-Sign Documents Required"
                description="Sign urgent documents before Monday to proceed with student placements"
                urgentCount={counts?.readyToSign}
                pendingLabel="Pending"
                warningMessage="<strong>Important:</strong> All documents must be electronically signed before placements can commence. Documents use secure e-signature technology compliant with Australian regulations."
                gradientFrom="primary"
                gradientTo="primary-light"
                iconGradient="from-red-400 to-red-600"
            />

            <div className="flex justify-end items-end gap-x-3 mb-2">
                <div className="w-64">
                    <TextInput
                        name="name"
                        label="Search by student"
                        placeholder="Search by student name..."
                        value={studentNameValue}
                        onChange={(e: any) => {
                            setStudentNameValue(e.target.value)
                            delayedSearch(e.target.value)
                        }}
                        showError={false}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-4">
                {filteredDataLength ? (
                    <FilteredEsignDocuments
                        documents={filteredDocuments}
                        setPage={setPage}
                        itemPerPage={itemPerPage}
                        setItemPerPage={setItemPerPage}
                    />
                ) : (
                    <ConfigTabs
                        tabs={tabsConfig}
                        tabsClasses="border-b border-slate-100 p-1 gap-2 rounded-t-xl rounded-b-none"
                    />
                )}
            </div>
        </div>
    )
}

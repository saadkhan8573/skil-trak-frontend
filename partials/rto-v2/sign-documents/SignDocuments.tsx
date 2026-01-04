import React from 'react'
import { ActionRequiredHeader } from '../components'
import {
    AlertCircle,
    CheckCircle,
    CheckCircle2,
    Clock,
    FileSignature,
} from 'lucide-react'
import { CountCard } from '../cards/CountCard'
import { PendingEsignDocuments, SignedEsignDocuments } from './components'
import { ConfigTabs } from '@components/ConfigTabs/ConfigTabs'

export const SignDocuments = () => {
    const tabsConfig = [
        {
            value: 'pending',
            label: 'Pending',
            icon: Clock,
            component: PendingEsignDocuments,
        },
        {
            value: 'signed',
            label: 'Signed',
            icon: CheckCircle,
            component: SignedEsignDocuments,
        },
    ]
    return (
        <div className="space-y-2">
            <ActionRequiredHeader
                icon={FileSignature}
                title="E-Sign Documents Required"
                description="Sign urgent documents before Monday to proceed with student placements"
                urgentCount={1}
                // urgentLabel={`Urgent (Due in 2 days)`}
                // pendingCount={22}
                pendingLabel="Pending"
                // actionButton={{
                //     label: 'Sign All Documents',
                //     icon: CheckCircle2,
                // }}
                warningMessage="<strong>Important:</strong> All documents must be electronically signed before placements can commence. Documents use secure e-signature technology compliant with Australian regulations."
                gradientFrom="primary"
                gradientTo="primary-light"
                iconGradient="from-red-400 to-red-600"
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <ConfigTabs
                    tabs={tabsConfig}
                    defaultValue="pending"
                    tabsClasses="bg-slate-50/50 border-b border-slate-100 p-1 gap-2 rounded-t-xl rounded-b-none"
                />
            </div>
        </div>
    )
}

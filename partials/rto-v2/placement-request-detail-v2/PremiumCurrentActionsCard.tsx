import { Card, NoData } from '@components'
import { motion } from 'framer-motion'
import { ReactElement, useState } from 'react'
import { Target } from 'lucide-react'
import { CardHeader } from './components/CardHeader'
import { IStatusActionsProps } from './types/statusActions.types'
import { StatusActionsRenderer } from './components/StatusActionsRenderer'

export const PremiumCurrentActionsCard = (props: IStatusActionsProps) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const onCancelModal = () => setModal(null)

    const renderStatusActions = () => {
        return (
            <StatusActionsRenderer
                {...props}
                modal={modal}
                setModal={setModal}
                onCancelModal={onCancelModal}
            />
        )
    }

    return (
        <>
            {modal && modal}
            <Card
                noPadding
                className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden hover:shadow-3xl transition-shadow duration-500"
            >
                <CardHeader />

                <div className="p-7">
                    {renderStatusActions() ?? (
                        <NoData text="No progress has been recorded for this placement." />
                    )}
                </div>
            </Card>
        </>
    )
}

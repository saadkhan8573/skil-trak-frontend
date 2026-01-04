import React, { useState } from 'react'
import { BulkIndustryImportForm } from '../forms'
import { RtoV2Api } from '@redux'
import {
    ShowErrorNotifications,
    Card,
    Typography,
    Button,
    Badge,
} from '@components'
import { useNotification } from '@hooks'
import {
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Mail,
    Building2,
    Hash,
} from 'lucide-react'

type CreatedIndustry = {
    user: {
        email: string
        name: string
    }
    abn?: string
    phone?: string
    addressLine1?: string
}

type BulkImportResponse = {
    created: CreatedIndustry[]
    ignored: string[]
}

export const AddBulkIndustries = ({ onClose }: { onClose: () => void }) => {
    const [addBulkRtoIndustries, resultAddBulkRtoIndustries] =
        RtoV2Api.Industries.addBulkRtoIndustries()

    const { notification } = useNotification()
    const [showResults, setShowResults] = useState(false)
    const [importResults, setImportResults] =
        useState<BulkImportResponse | null>(null)

    const onSubmit = async (values: any) => {
        const response: any = await addBulkRtoIndustries(values)
        if (response?.data) {
            setImportResults(response.data)
            setShowResults(true)
            notification.success({
                title: 'Bulk import completed',
                description: `${
                    response.data.created?.length || 0
                } industries created, ${
                    response.data.ignored?.length || 0
                } ignored`,
            })
        }
        return
    }

    const handleBack = () => {
        setShowResults(false)
        setImportResults(null)
    }

    if (showResults && importResults) {
        return (
            <div className="space-y-4 mt-4 animate-fadeIn">
                <ShowErrorNotifications result={resultAddBulkRtoIndustries} />

                {/* Header Card */}
                <Card className="p-4 border border-primaryNew/15 bg-gradient-to-r from-primaryNew/5 via-background to-primaryNew/10 rounded-xl">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-success to-emerald-500 shadow-md">
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <Typography variant="subtitle" semibold>
                                    Bulk Import Completed
                                </Typography>
                                <Typography variant="xs" color="text-muted">
                                    Review the results of your bulk industry
                                    import
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Summary Card */}
                <Card className="p-5 border border-primaryNew/20 bg-gradient-to-br from-primaryNew/5 to-transparent rounded-xl">
                    <Typography variant="label" semibold className="mb-4">
                        Import Summary
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                                <Typography
                                    variant="label"
                                    semibold
                                    color="text-success"
                                >
                                    Successfully Created
                                </Typography>
                            </div>
                            <Typography variant="h3" semibold>
                                {importResults.created?.length || 0}
                            </Typography>
                            <Typography variant="xs" color="text-muted">
                                industries added
                            </Typography>
                        </div>
                        <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-warning" />
                                <Typography
                                    variant="label"
                                    semibold
                                    color="text-warning"
                                >
                                    Ignored
                                </Typography>
                            </div>
                            <Typography variant="h3" semibold>
                                {importResults.ignored?.length || 0}
                            </Typography>
                            <Typography variant="xs" color="text-muted">
                                already exist
                            </Typography>
                        </div>
                    </div>
                </Card>

                {/* Created Industries */}
                {importResults.created && importResults.created.length > 0 && (
                    <Card className="p-5 border border-success/20 bg-gradient-to-br from-success/5 to-transparent rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                            <Typography variant="subtitle" semibold>
                                Created Industries (
                                {importResults.created.length})
                            </Typography>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {importResults.created.map((industry, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-lg bg-success/5 border border-success/10 hover:bg-success/10 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2 flex-1">
                                            <Building2 className="h-5 w-5 text-success flex-shrink-0" />
                                            <div>
                                                <Typography
                                                    variant="label"
                                                    semibold
                                                >
                                                    {industry.user.name}
                                                </Typography>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Mail className="h-3 w-3 text-muted" />
                                                    <Typography
                                                        variant="xs"
                                                        color="text-muted"
                                                    >
                                                        {industry.user.email}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="success"
                                            text="Created"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pl-7">
                                        {industry.abn && (
                                            <div className="flex items-center gap-1">
                                                <Hash className="h-3 w-3 text-muted" />
                                                <Typography
                                                    variant="xs"
                                                    color="text-muted"
                                                >
                                                    ABN: {industry.abn}
                                                </Typography>
                                            </div>
                                        )}
                                        {industry.phone && (
                                            <div className="flex items-center gap-1">
                                                <Typography
                                                    variant="xs"
                                                    color="text-muted"
                                                >
                                                    📞 {industry.phone}
                                                </Typography>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Ignored Industries */}
                {importResults.ignored && importResults.ignored.length > 0 && (
                    <Card className="p-5 border border-warning/20 bg-gradient-to-br from-warning/5 to-transparent rounded-xl">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-warning" />
                            <Typography variant="subtitle" semibold>
                                Ignored Industries (
                                {importResults.ignored.length})
                            </Typography>
                        </div>
                        <Typography
                            variant="label"
                            color="text-muted"
                            className="mb-3"
                        >
                            Thanks for adding your industry partner(s). These
                            organisation(s) are already registered with
                            SkilTrak. One of our team members will verify the
                            details and get back to you shortly.
                        </Typography>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {importResults.ignored.map((email, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 hover:bg-warning/10 transition-colors"
                                >
                                    <Mail className="h-4 w-4 text-warning" />
                                    <Typography variant="label">
                                        {email}
                                    </Typography>
                                    <Badge
                                        variant="warning"
                                        text="Already Exists"
                                        className="ml-auto"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Back Button */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                        text="Import More Industries"
                        outline
                        variant="primaryNew"
                        Icon={ArrowLeft}
                        onClick={handleBack}
                    />
                    <Button
                        text="Close"
                        variant="primaryNew"
                        onClick={onClose}
                    />
                </div>
            </div>
        )
    }

    return (
        <div>
            <ShowErrorNotifications result={resultAddBulkRtoIndustries} />
            <BulkIndustryImportForm
                result={resultAddBulkRtoIndustries}
                onSubmit={onSubmit}
            />
        </div>
    )
}

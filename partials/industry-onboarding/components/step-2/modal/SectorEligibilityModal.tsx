import { Badge, Button } from '@components'
import { AlertCircle, CheckCircle, Plus, Sparkles } from 'lucide-react'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { AdminApi } from '@queries'

export const SectorEligibilityModal = ({
    data,
    eligibilityDialogOpen,
    setEligibilityDialogOpen,
    confirmedSectorId,
    onAddClusterSector,
}: any) => {
    const { data: clusterSectors, isLoading } =
        AdminApi.SectorClusters.useClusterSectors(Number(confirmedSectorId), {
            skip: !confirmedSectorId || !eligibilityDialogOpen,
        })

    return (
        <Dialog
            open={eligibilityDialogOpen}
            onOpenChange={setEligibilityDialogOpen}
        >
            <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[85vh] bg-white">
                <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-accent/5 shrink-0">
                    <DialogTitle className="flex items-center gap-3 text-xl text-primary">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        Expand Your Student Placement Opportunities
                    </DialogTitle>
                    <DialogDescription className="text-sm pt-1 pl-13">
                        Based on your confirmed sector, here are related sectors
                        your workplace may also qualify for
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <div className="space-y-5">
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-900 text-sm mb-1">
                                        Suggested Related Sectors
                                    </h4>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Adding related sectors increases your
                                        visibility to students and maximizes
                                        placement opportunities. These are
                                        optional.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                Loading suggested sectors...
                            </div>
                        )}

                        {!isLoading &&
                            (!clusterSectors || clusterSectors.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No additional related sectors available.
                                </div>
                            )}

                        {!isLoading &&
                            clusterSectors &&
                            clusterSectors.length > 0 && (
                                <div className="space-y-4">
                                    {clusterSectors.map((cs: any) => {
                                        const alreadyAdded =
                                            data.sectors?.some(
                                                (s: any) =>
                                                    String(s.id) ===
                                                    String(cs.id)
                                            )
                                        return (
                                            <div
                                                key={cs.id}
                                                className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition-all bg-white"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
                                                            <span className="text-white font-bold text-sm">
                                                                {cs.code
                                                                    ? cs.code.slice(
                                                                          0,
                                                                          2
                                                                      )
                                                                    : cs.name?.charAt(
                                                                          0
                                                                      )}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-bold mb-1 text-gray-900">
                                                                {cs.name}
                                                            </h5>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {cs.code && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        {cs.code}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {alreadyAdded ? (
                                                        <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold shrink-0">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Added
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                onAddClusterSector(
                                                                    cs
                                                                )
                                                            }
                                                            className="shrink-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            Add Sector
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-yellow-900 text-sm mb-1">
                                        Note
                                    </h4>
                                    <p className="text-xs text-yellow-800 leading-relaxed">
                                        You can skip adding related sectors if
                                        you're unsure. Click Done to continue.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                                {data.sectors.length}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-gray-700">
                            {data.sectors.length} sector
                            {data.sectors.length !== 1 ? 's' : ''} configured
                        </p>
                    </div>
                    <Button
                        onClick={() => setEligibilityDialogOpen(false)}
                        className="px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md"
                    >
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

import {
    Badge,
    Button,
    Card,
    LoadingAnimation,
    Select,
    ShowErrorNotifications,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Label,
} from '@components/ui'
import { AdminApi } from '@queries'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'

import { useNotification } from '@hooks'
import { useEffect, useState } from 'react'

interface Sector {
    id: string
    name: string
    isUnlocked: boolean
    isOriginal?: boolean
}

export function SectorSelector({ data }: any) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedSectorOpt, setSelectedSectorOpt] = useState('')
    const router = useRouter()
    const id = Number(router.query?.id)
    const { notification } = useNotification()

    // ========================== APIs START ============================== //

    const getAllsectors = AdminApi.SectorClusters.useAvailableLinkedSectors(
        id,
        {
            skip: !id,
        }
    )
    const [addSectorToCluster, addSectorToClusterResult] =
        AdminApi.SectorClusters.useAddSectorToCluster()
    const getClusterSectors = AdminApi.SectorClusters.useClusterSectors(id, {
        skip: !id,
    })

    // ========================== APIs END ============================== //

    // SIDE EFFECT
    useEffect(() => {
        if (addSectorToClusterResult.isSuccess) {
            notification.success({
                title: 'Sector Added',
                description: 'Successfully added sector to cluster',
            })
        }
    }, [addSectorToClusterResult.isSuccess])

    const sectorOptions = getAllsectors?.data?.map((sector: any) => ({
        label: `${sector?.name} - ${sector?.code}`,
        value: sector?.id,
    }))
    const handleAddSector = () => {
        addSectorToCluster({ sectorId: id, linkedSectorId: selectedSectorOpt })
        console.log('api call here')
    }

    return (
        <>
            <ShowErrorNotifications result={addSectorToClusterResult} />

            <div className="space-y-4">
                <Card>
                    <div className="pt-6">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">
                                Selected Sector
                            </Label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                {data && (
                                    <span className="text-lg font-semibold text-gray-900">
                                        {`${data?.name} — ${data?.code}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Cluster Section */}
                <Card>
                    <div className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <Label className="text-sm font-medium block">
                                    Added Sectors in Cluster
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Add additional sectors to your cluster
                                </p>
                            </div>
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        outline
                                        Icon={Plus}
                                        text="Add Sector"
                                    />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add New Sector
                                        </DialogTitle>
                                        <DialogDescription>
                                            Select a sector from the available
                                            options to add to your cluster
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label
                                                htmlFor="new-sector"
                                                className="text-sm font-medium mb-2 block"
                                            >
                                                Available Sectors
                                            </Label>
                                            {sectorOptions?.length > 0 ? (
                                                <Select
                                                    name="sector"
                                                    options={sectorOptions}
                                                    onChange={(e: any) => {
                                                        setSelectedSectorOpt(e)
                                                    }}
                                                    loading={
                                                        getAllsectors.isLoading
                                                    }
                                                    onlyValue
                                                    placeholder="Select a sector"
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    All available sectors have
                                                    been added
                                                </p>
                                            )}
                                        </div>
                                        {/* <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            <strong>Suggested sectors:</strong>
                                        </p>
                                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                            <li>• Disability Support</li>
                                            <li>• Individual Support</li>
                                            <li>• Community Services</li>
                                            <li>
                                                • Health Services Assistance
                                            </li>
                                        </ul>
                                    </div> */}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="error"
                                            onClick={() =>
                                                setIsDialogOpen(false)
                                            }
                                            outline
                                            text="Cancel"
                                        />

                                        <Button
                                            onClick={handleAddSector}
                                            text="Add Sector"
                                            loading={
                                                addSectorToClusterResult.isLoading
                                            }
                                            disabled={
                                                !selectedSectorOpt ||
                                                addSectorToClusterResult.isLoading
                                            }
                                        />
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Cluster Sectors List */}
                        {getClusterSectors?.data?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {getClusterSectors?.data?.map((sector: any) => (
                                    <Badge
                                        key={sector.id}
                                        variant={
                                            sector?.name === data?.name
                                                ? 'info'
                                                : 'secondary'
                                        }
                                        className="px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-100"
                                        text={sector?.name}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No sectors added to cluster yet. Click "Add
                                Sector" to get started.
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </>
    )
}

import { Card, Typography, NoData } from '@components' // Assuming NoData is in components
import React from 'react'
import { SectorSupervisorRequirementsModal } from '../modals/SectorSupervisorRequirementsModal'
import { AdminApi } from '@queries'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'

export const SupervisorRequirements = () => {
    const router = useRouter()
    const sectorId = router.query.id as string

    const {
        data: response,
        isLoading,
        isError,
    } = AdminApi.SectorClusters.useSupervisorRequirements(sectorId, {
        skip: !sectorId,
    })

    // Access the inner data object where the arrays actually live
    const actualData = response?.data

    const hasNoData =
        !isLoading &&
        !isError &&
        (!actualData ||
            ((actualData.supervisorRequirements?.length ?? 0) === 0 &&
                (actualData.acceptableJobTitles?.length ?? 0) === 0))

    return (
        <Card>
            <div className="mb-4">
                <Typography variant="label">Supervisor Requirements</Typography>
                <Typography variant="small">
                    Minimum qualifications and acceptable job titles for this
                    sector
                </Typography>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <PulseLoader color="#2563eb" size={10} margin={4} />
                </div>
            ) : isError ? (
                <NoData text="An error occurred while fetching requirements." />
            ) : hasNoData ? (
                <NoData text="No requirements or job titles found for this sector." />
            ) : (
                <div className="space-y-6">
                    <SectorSupervisorRequirementsModal
                        requirements={actualData?.supervisorRequirements}
                        jobTitles={actualData?.acceptableJobTitles}
                    />

                    <div className="space-y-4 mt-4">
                        {/* Requirements Section */}
                        {actualData?.supervisorRequirements &&
                            actualData.supervisorRequirements.length > 0 && (
                                <div>
                                    <Typography variant="label">
                                        Minimum Supervisor Requirements:
                                    </Typography>
                                    <ul className="mt-2 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        {actualData.supervisorRequirements.map(
                                            (req: string, index: number) => (
                                                <li
                                                    key={`req-${index}`}
                                                    className="text-sm text-gray-700 flex items-start gap-2"
                                                >
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-600 shrink-0"></span>
                                                    {req}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                        {/* Job Titles Section */}
                        {actualData?.acceptableJobTitles &&
                            actualData.acceptableJobTitles.length > 0 && (
                                <div>
                                    <Typography variant="label">
                                        Acceptable Job Titles:
                                    </Typography>
                                    <ul className="mt-2 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        {actualData.acceptableJobTitles.map(
                                            (title: string, index: number) => (
                                                <li
                                                    key={`title-${index}`}
                                                    className="text-sm text-gray-700 flex items-center gap-2"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                                                    {title}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>
            )}
        </Card>
    )
}

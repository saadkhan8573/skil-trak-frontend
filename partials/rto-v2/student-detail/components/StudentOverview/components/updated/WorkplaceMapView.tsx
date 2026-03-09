import { Button, Badge } from '@components'
import { WorkplaceMapBoxView } from '@partials/student'
import { Industry, RtoApprovalWorkplaceRequest, Student } from '@types'
import { MapPin, Navigation, TrendingUp, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useRouteInfo } from '../../hooks'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import { getLatLng } from '@utils'

interface WorkplaceMapViewProps {
    industry: Industry
    student: Student
    distance: number
    industryData: RtoApprovalWorkplaceRequest | WorkplaceWorkIndustriesType
    preferableLocation?: string
}

export const WorkplaceMapView = ({
    industry,
    student,
    distance = 0,
    industryData,
    preferableLocation,
}: WorkplaceMapViewProps) => {
    const [showMap, setShowMap] = useState(false)
    const [preferableLatLng, setPreferableLatLng] = useState<{
        lat: number
        lng: number
    } | null>(null)

    useEffect(() => {
        const fetchLatLng = async () => {
            if (preferableLocation) {
                try {
                    const coords = await getLatLng(preferableLocation)
                    setPreferableLatLng(coords)
                } catch (error) {
                    console.error('Error fetching latlng:', error)
                }
            }
        }
        fetchLatLng()
    }, [preferableLocation])

    const studentLoc = preferableLatLng
        ? [String(preferableLatLng?.lat), String(preferableLatLng?.lng)]
        : student?.location?.split(',') || []

    // location
    const { travelInfo } = useRouteInfo({
        studentLocation: studentLoc,
        industryLocation:
            industryData?.location?.location?.split(',') ||
            industry?.location?.split(',') ||
            [],
        modes: ['driving'],
    })

    const drivingInfo = travelInfo.find((info) => info.mode === 'driving')
    const calculatedDistanceValue = drivingInfo?.distance
        ? parseFloat(drivingInfo.distance.replace(' km', ''))
        : distance

    const displayDistance = calculatedDistanceValue || 0
    const drivingDuration =
        drivingInfo?.duration || `${Math.round(displayDistance * 2.5)} min`

    return (
        <div className="relative group/distance overflow-hidden rounded-lg bg-linear-to-br from-blue-50 via-white to-blue-50 border border-blue-200 p-3 shadow-md hover:shadow-lg transition-all duration-500 shrink-0">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover/distance:translate-x-[200%] transition-transform duration-1000"></div>

            <div className="relative">
                <div className="flex items-start gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#F7A619] to-amber-500 flex items-center justify-center shadow-lg shadow-[#F7A619]/40 group-hover/distance:scale-110 transition-transform">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 mb-0.5">
                                Distance from you
                            </p>
                            {/* Small View Map Button */}
                            <Button
                                onClick={() => setShowMap(!showMap)}
                                variant={showMap ? 'error' : 'primary'}
                            >
                                {showMap ? (
                                    <X className="w-2.5 h-2.5 mr-0.5" />
                                ) : (
                                    <Navigation className="w-2.5 h-2.5 mr-0.5 group-hover/map:rotate-45 transition-transform duration-300" />
                                )}
                                {showMap ? 'Close map' : 'View map'}
                            </Button>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#044866] to-[#0D5468]">
                                {displayDistance}
                            </span>
                            <span className="text-sm font-semibold text-slate-600">
                                km
                            </span>
                        </div>
                    </div>
                </div>

                {showMap && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-blue-100 shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                        <WorkplaceMapBoxView
                            industryLocation={
                                industryData?.location?.location?.split(',') ||
                                industry?.location?.split(',')
                            }
                            studentLocation={studentLoc}
                            workplaceName={industry?.user?.name}
                            showMap={
                                !!industry?.location && !!student?.location
                            }
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Badge
                        Icon={TrendingUp}
                        className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5"
                    >
                        {displayDistance < 5 && displayDistance > 0
                            ? 'Very Close'
                            : displayDistance < 15 && displayDistance > 0
                              ? 'Moderate'
                              : !displayDistance
                                ? 'Very Close'
                                : 'Far'}
                    </Badge>
                    <span className="text-xs text-slate-500">
                        ≈ {drivingDuration} drive
                    </span>
                </div>
            </div>
        </div>
    )
}

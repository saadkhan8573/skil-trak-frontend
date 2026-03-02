import { useCallback, useEffect, useMemo, useState } from 'react'

interface TravelInfo {
    mode: 'driving' | 'walking' | 'transit'
    duration: string | null
    distance: string | null
}

interface Coordinates {
    latitude: number
    longitude: number
}

interface UseTravelInfoProps {
    studentLocation: string[]
    industryLocation: string[]
    modes?: ('driving' | 'walking' | 'transit')[]
}

export const useRouteInfo = ({
    studentLocation,
    industryLocation,
    modes = ['driving', 'walking', 'transit'],
}: UseTravelInfoProps) => {
    const [travelInfo, setTravelInfo] = useState<TravelInfo[]>([])
    const [directions, setDirections] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const MAPBOX_TOKEN = process.env.mapBoxApi

    const industryLocationCoordinates = useMemo(
        () => ({
            latitude: +industryLocation?.[0],
            longitude: +industryLocation?.[1],
        }),
        [JSON.stringify(industryLocation)]
    )

    const studentLocationCoordinates = useMemo(
        () => ({
            latitude: +studentLocation?.[0],
            longitude: +studentLocation?.[1],
        }),
        [JSON.stringify(studentLocation)]
    )

    const fetchDirections = useCallback(
        async (mode: 'driving' | 'walking' | 'transit') => {
            if (
                isNaN(studentLocationCoordinates.latitude) ||
                isNaN(studentLocationCoordinates.longitude) ||
                isNaN(industryLocationCoordinates.latitude) ||
                isNaN(industryLocationCoordinates.longitude)
            ) {
                return
            }
            setIsLoading(true)
            setError(null)
            try {
                const profile = mode === 'transit' ? 'driving' : mode // Mapbox doesn't support transit routing
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
                        `${studentLocationCoordinates.longitude},${studentLocationCoordinates.latitude};` +
                        `${industryLocationCoordinates.longitude},${industryLocationCoordinates.latitude}` +
                        `?geometries=geojson&access_token=${MAPBOX_TOKEN}`
                )

                const data = await response.json()

                if (data.routes && data.routes[0]) {
                    if (mode === 'driving') {
                        setDirections({
                            type: 'Feature',
                            properties: {},
                            geometry: data.routes[0].geometry,
                        })
                    }

                    // Convert duration from seconds to readable format
                    const duration = Math.round(data.routes[0].duration / 60)
                    const durationText =
                        duration > 60
                            ? `${Math.floor(duration / 60)} hr ${
                                  duration % 60
                              } min`
                            : `${duration} min`

                    // Convert distance from meters to kilometers
                    const distance =
                        Math.round(data.routes[0].distance / 100) / 10
                    const distanceText = `${distance} km`

                    setTravelInfo((prevInfo) => [
                        ...prevInfo.filter((info) => info.mode !== mode),
                        {
                            mode,
                            duration: durationText,
                            distance: distanceText,
                        },
                    ])
                }
            } catch (error) {
                console.error('Error fetching directions:', error)
                setError('Failed to fetch directions')
            } finally {
                setIsLoading(false)
            }
        },
        [industryLocationCoordinates, studentLocationCoordinates]
    )

    useEffect(() => {
        modes.forEach((mode) => fetchDirections(mode))
    }, [fetchDirections, JSON.stringify(modes)])

    return {
        travelInfo,
        directions,
        isLoading,
        error,
    }
}

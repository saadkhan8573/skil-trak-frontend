import { Checkbox, NoData } from '@components'
import { CommonApi, SubAdminApi } from '@queries'
import {
    Circle,
    GoogleMap,
    InfoBox,
    Marker,
    MarkerClusterer,
    Polyline,
    useJsApiLoader,
} from '@react-google-maps/api'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import {
    FutureIndustryInfoBoxCard,
    IndustryInfoBoxCard,
    StudentInfoBoxCard,
} from './components'
import { IndustryPlacementStatus } from '@partials/common'
import { useGoogleMaps } from '@hooks'

const containerStyle = {
    width: '780px',
    height: '500px',
}

const center = {
    lat: -37.81374,
    lng: 144.963033,
}

const customMapStyles = [
    {
        featureType: 'water',

        elementType: 'geometry.fill',

        stylers: [{ color: '#cde2e8' }],
    },

    {
        featureType: 'landscape',

        elementType: 'geometry.fill',

        stylers: [{ color: '#f6f6f6' }],
    },
]

const studentClusterStyles = [
    {
        textColor: 'white',
        url: '/images/icons/student-clusters.svg',
        height: 50,
        width: 50,
    },
]

const industryClusterStyles = [
    {
        textColor: 'white',
        url: '/images/icons/industry-clusters.svg',
        height: 50,
        width: 50,
    },
]
const partnerIndustryClusterStyles = [
    {
        textColor: 'white',
        url: '/images/icons/partnered-industry-cluster.svg',
        height: 50,
        width: 50,
    },
]

const futureIndustryClusterStyles = [
    {
        textColor: 'white',
        url: '/images/icons/industry-cluster.svg',
        height: 50,
        width: 50,
    },
]

type ViewMoreIndustriesModalProps = {
    suggestedIndustries: any
    onCancel?: any
    workplace: any
    appliedIndustry?: any
    courseId: any
}
export const ViewOnMapIndustriesModal = ({
    suggestedIndustries,
    onCancel,
    workplace,
    appliedIndustry,
    courseId,
}: ViewMoreIndustriesModalProps) => {
    const { isLoaded } = useGoogleMaps()
    const [visibleMarkers, setVisibleMarkers] = useState<any>([])
    const [visibleIndustries, setVisibleIndustries] = useState<any>([])
    const [selectedMarker, setSelectedMarker] = useState<null | {
        lat: number
        lng: number
        name: string
    }>(null)
    const [futureIndustryId, setFutureIndustryId] = useState<any>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)

    const [selectedBox, setSelectedBox] = useState<any>(null)

    const [industryId, setIndustryId] = useState('')
    const [showInfoBox, setShowInfoBox] = useState<any>(false)
    const [showFutureIndustries, setShowFutureIndustries] = useState(false)
    const onMarkerHover = useCallback((marker: any) => {
        setSelectedMarker(marker)
    }, [])
    const router = useRouter()
    const industryDetails =
        SubAdminApi.Workplace.useSubAdminMapSuggestedIndustryDetail(
            { industryId: Number(industryId), workplaceId: workplace?.id },
            {
                skip: !industryId,
            }
        )
    const futureIndustries = CommonApi.FindWorkplace.mapFutureIndustries(
        {
            search: `courseId:${courseId}`,
        },
        {
            skip: !courseId || !showFutureIndustries,
        }
    )
    const workplaceCourseId = workplace?.courses?.[0]?.id
    const workplaceCourseIndustries =
        SubAdminApi.Workplace.useWorkplaceCourseIndustries(workplaceCourseId, {
            skip: !workplaceCourseId,
        })
    const studentDetails = SubAdminApi.SubAdmin.useSubAdminMapStudentDetail(
        router?.query?.id,
        { skip: !router?.query?.id }
    )

    useEffect(() => {
        if (
            workplaceCourseIndustries?.data?.length > 0 ||
            workplace?.student?.location ||
            futureIndustries?.data
        ) {
            const markers = []

            if (workplaceCourseIndustries?.data) {
                const filteredIndustries =
                    workplaceCourseIndustries?.data?.filter(
                        (industry: any) =>
                            industry?.location && industry?.location !== 'NA'
                    )
                const transformedIndustries = filteredIndustries?.map(
                    (industry: any) => {
                        const [lat, lng] = industry?.location
                            .split(',')
                            .map(Number)
                        return { ...industry, location: { lat, lng } }
                    }
                )
                markers.push(...transformedIndustries)
            }

            if (workplace?.student?.location) {
                const [lat, lng] = workplace.student.location
                    .split(',')
                    .map(Number)
                const studentMarker = {
                    ...workplace.student,
                    location: { lat, lng },
                }
                markers.push(studentMarker)
            }
            if (futureIndustries?.data && futureIndustries?.data?.length) {
                const filteredIndustries = futureIndustries?.data?.filter(
                    (industry: any) =>
                        industry.location && industry.location !== 'NA'
                )
                const transformedFutureIndustries = filteredIndustries?.map(
                    (industry: any) => {
                        const [lat, lng] = industry?.location
                            .split(',')
                            .map(Number)
                        return { ...industry, location: { lat, lng } }
                    }
                )
                markers.push(...transformedFutureIndustries)
            }

            setVisibleMarkers(markers)
        }
    }, [workplaceCourseIndustries, futureIndustries?.data])

    const onBoundChange = useCallback(() => {
        setFutureIndustryId(null)
        if (!map) return

        const bounds = map.getBounds()
        if (!bounds) return

        const updatedVisibleMarkers = visibleMarkers.filter((marker: any) => {
            const latLng = new google.maps.LatLng(
                marker.location.lat,
                marker.location.lng
            )
            return bounds.contains(latLng)
        })

        setVisibleIndustries(updatedVisibleMarkers)
    }, [map, visibleMarkers])
    const onMapLoad = useCallback(
        (map: any) => {
            setMap(map)
            map.addListener('bounds_changed', onBoundChange)
        },
        [onBoundChange]
    )

    const onMapUnmount = useCallback(() => {
        setMap(null)
    }, [])

    const options = {
        imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        grid: 20,
        maxZoom: 15,
    }

    const [selectedMarkers, setSelectedMarkers] = useState<any>([])
    const [directions, setDirections] = useState<any>(null)

    const handleMarkerClick = (marker: any) => {
        if (selectedMarkers.length < 2) {
            setSelectedMarkers((prevMarkers: any) => [...prevMarkers, marker])
        } else {
            setSelectedMarkers([marker])
        }
    }

    const renderDirections = () => {
        if (selectedMarkers.length === 2) {
            const origin = new google.maps.LatLng(
                selectedMarkers[0].lat,
                selectedMarkers[0].lng
            )
            const destination = new google.maps.LatLng(
                selectedMarkers[1].lat,
                selectedMarkers[1].lng
            )

            const directionsService = new google.maps.DirectionsService()

            directionsService.route(
                {
                    origin,
                    destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        setDirections(result)
                    }
                }
            )

            return null // Don't render the DirectionsService component itself
        }
        return null
    }
    const renderPolyline = () => {
        if (directions) {
            const path = directions.routes[0].overview_path.map((p: any) => ({
                lat: p.lat(),
                lng: p.lng(),
            }))

            return (
                <Polyline
                    path={path}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 1,
                        strokeWeight: 3,
                    }}
                />
            )
        }
        return null
    }

    const studentClusterOptions = {
        styles: studentClusterStyles,
        grid: 20,
        maxZoom: 15,
    }
    const industryClusterOptions = {
        styles: industryClusterStyles,
        grid: 20,
        maxZoom: 15,
    }
    const partnerIndustryClusterOptions = {
        styles: partnerIndustryClusterStyles,
        grid: 20,
        maxZoom: 15,
    }
    const futureIndustryClusterOptions = {
        styles: futureIndustryClusterStyles,
        grid: 20,
        maxZoom: 15,
    }

    const studentCenter: any = visibleMarkers.find(
        (student: any) => student?.user && student?.user?.role === 'student'
    )
    return (
        <div className="w-full h-[80vh] lg:h-full overflow-hidden">
            <div className="flex justify-between cursor-pointer border-b py-0.5 px-2 mb-2">
                <Checkbox
                    name={'futureIndustry'}
                    onChange={() =>
                        setShowFutureIndustries(!showFutureIndustries)
                    }
                    defaultChecked={showFutureIndustries}
                    label={'Show Industry Listing'}
                />
                <MdCancel
                    onClick={onCancel}
                    className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                />
            </div>

            {visibleMarkers.length > 0 ? (
                <div className="flex gap-x-3 w-full">
                    {isLoaded && (
                        <div className="w-3/4">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={
                                    studentCenter &&
                                    studentCenter?.location &&
                                    isFinite(studentCenter?.location?.lat) &&
                                    isFinite(studentCenter?.location?.lng)
                                        ? studentCenter?.location
                                        : center
                                }
                                zoom={9}
                                onLoad={onMapLoad}
                                onUnmount={onMapUnmount}
                                options={{ styles: customMapStyles }}
                                // onBoundsChanged={onBoundChange}
                            >
                                <MarkerClusterer
                                    options={studentClusterOptions}
                                >
                                    {(clusterer) => (
                                        <>
                                            {visibleMarkers
                                                ?.filter(
                                                    (marker: any) =>
                                                        marker?.user &&
                                                        marker?.user?.role ===
                                                            'student' &&
                                                        !marker?.department
                                                )
                                                .map((marker: any) => (
                                                    <>
                                                        <Marker
                                                            icon={{
                                                                url:
                                                                    marker?.user
                                                                        ?.role &&
                                                                    marker?.user
                                                                        ?.role ===
                                                                        'student'
                                                                        ? '/images/icons/student-red-map-pin.png'
                                                                        : marker?.placementStatus ===
                                                                            IndustryPlacementStatus.ACCEPTING_STUDENTS
                                                                          ? '/images/icons/industry-pin-map-pin-check.png'
                                                                          : marker?.placementStatus ===
                                                                              IndustryPlacementStatus.NOT_ACCEPTING_STUDENTS
                                                                            ? '/images/icons/industry-pin-map-pin-uncheck.png'
                                                                            : '/images/icons/industry-pin-map-pin.png',
                                                                scaledSize:
                                                                    new google.maps.Size(
                                                                        29,
                                                                        38
                                                                    ),
                                                            }}
                                                            key={marker.id}
                                                            position={
                                                                marker.location
                                                            }
                                                            clusterer={
                                                                clusterer
                                                            }
                                                            onMouseOver={(
                                                                e: any
                                                            ) => {
                                                                // handleMarkerClick(
                                                                //     marker
                                                                // )
                                                                setIndustryId(
                                                                    marker?.id
                                                                )
                                                                setSelectedBox({
                                                                    ...marker,
                                                                    position: {
                                                                        lat: e.latLng.lat(),
                                                                        lng: e.latLng.lng(),
                                                                    },
                                                                })
                                                                setShowInfoBox(
                                                                    true
                                                                )
                                                            }}
                                                            onMouseOut={() =>
                                                                setSelectedMarker(
                                                                    null
                                                                )
                                                            }
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                // handleMarkerClick(
                                                                //     marker
                                                                // )
                                                                setIndustryId(
                                                                    marker?.id
                                                                )
                                                                setSelectedBox({
                                                                    ...marker,
                                                                    position: {
                                                                        lat: e.latLng.lat(),
                                                                        lng: e.latLng.lng(),
                                                                    },
                                                                })
                                                                setShowInfoBox(
                                                                    true
                                                                )
                                                            }}
                                                        />
                                                        <Circle
                                                            center={
                                                                marker.location
                                                            }
                                                            radius={20000}
                                                            options={{
                                                                fillColor:
                                                                    '#AA0000',
                                                                fillOpacity: 0.2,
                                                                strokeColor:
                                                                    '#AA0000',
                                                                strokeOpacity: 0.7,
                                                                strokeWeight: 1,
                                                                clickable: false,
                                                                draggable: false,
                                                                editable: false,
                                                                visible: true,
                                                                zIndex: 1,
                                                            }}
                                                        />
                                                        {selectedBox &&
                                                            showInfoBox &&
                                                            selectedBox.id ===
                                                                marker.id &&
                                                            !marker?.department && (
                                                                <InfoBox
                                                                    position={
                                                                        selectedBox?.position
                                                                    }
                                                                    onCloseClick={() => {
                                                                        setSelectedBox(
                                                                            null
                                                                        )
                                                                        setShowInfoBox(
                                                                            false
                                                                        )
                                                                        setIndustryId(
                                                                            ''
                                                                        )
                                                                    }}
                                                                    options={{
                                                                        closeBoxURL: ``,
                                                                        enableEventPropagation: true,
                                                                    }}
                                                                >
                                                                    {marker
                                                                        ?.user
                                                                        ?.role &&
                                                                    marker?.user
                                                                        ?.role ===
                                                                        'student' ? (
                                                                        <StudentInfoBoxCard
                                                                            item={
                                                                                studentDetails
                                                                            }
                                                                            selectedBox={
                                                                                selectedBox
                                                                            }
                                                                            studentId={
                                                                                router
                                                                                    ?.query
                                                                                    ?.id
                                                                            }
                                                                            setSelectedBox={
                                                                                setSelectedBox
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <IndustryInfoBoxCard
                                                                            item={
                                                                                industryDetails
                                                                            }
                                                                            selectedBox={
                                                                                selectedBox
                                                                            }
                                                                            industryId={
                                                                                industryId
                                                                            }
                                                                            setSelectedBox={
                                                                                setSelectedBox
                                                                            }
                                                                            workplace={
                                                                                workplace
                                                                            }
                                                                            appliedIndustry={
                                                                                appliedIndustry
                                                                            }
                                                                            workplaceMapCard={
                                                                                true
                                                                            }
                                                                            onCancel={
                                                                                onCancel
                                                                            }
                                                                        />
                                                                    )}
                                                                </InfoBox>
                                                            )}
                                                    </>
                                                ))}
                                        </>
                                    )}
                                </MarkerClusterer>

                                {/* Industries */}
                                <MarkerClusterer
                                    options={industryClusterOptions}
                                >
                                    {(clusterer) => (
                                        <>
                                            {visibleMarkers
                                                ?.filter(
                                                    (marker: any) =>
                                                        !marker?.isPartner &&
                                                        marker?.user &&
                                                        marker?.user?.role !==
                                                            'student' &&
                                                        !marker?.department
                                                )
                                                .map((marker: any) => (
                                                    <>
                                                        <Marker
                                                            icon={{
                                                                url:
                                                                    marker?.user
                                                                        ?.role &&
                                                                    marker?.user
                                                                        ?.role ===
                                                                        'student'
                                                                        ? '/images/icons/student-red-map-pin.png'
                                                                        : marker?.placementStatus ===
                                                                            IndustryPlacementStatus.ACCEPTING_STUDENTS
                                                                          ? '/images/icons/industry-pin-map-pin-check.png'
                                                                          : marker?.placementStatus ===
                                                                              IndustryPlacementStatus.NOT_ACCEPTING_STUDENTS
                                                                            ? '/images/icons/industry-pin-map-pin-uncheck.png'
                                                                            : '/images/icons/industry-pin-map-pin.png',
                                                                scaledSize:
                                                                    new google.maps.Size(
                                                                        29,
                                                                        38
                                                                    ),
                                                            }}
                                                            key={marker.id}
                                                            position={
                                                                marker.location
                                                            }
                                                            clusterer={
                                                                clusterer
                                                            }
                                                            onMouseOver={(
                                                                e: any
                                                            ) => {
                                                                // handleMarkerClick(
                                                                //     marker
                                                                // )
                                                                setIndustryId(
                                                                    marker?.id
                                                                )
                                                                setSelectedBox({
                                                                    ...marker,
                                                                    position: {
                                                                        lat: e.latLng.lat(),
                                                                        lng: e.latLng.lng(),
                                                                    },
                                                                })
                                                                setShowInfoBox(
                                                                    true
                                                                )
                                                            }}
                                                            onMouseOut={() =>
                                                                setSelectedMarker(
                                                                    null
                                                                )
                                                            }
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                // handleMarkerClick(
                                                                //     marker
                                                                // )
                                                                setIndustryId(
                                                                    marker?.id
                                                                )
                                                                setSelectedBox({
                                                                    ...marker,
                                                                    position: {
                                                                        lat: e.latLng.lat(),
                                                                        lng: e.latLng.lng(),
                                                                    },
                                                                })
                                                                setShowInfoBox(
                                                                    true
                                                                )
                                                            }}
                                                        />

                                                        {selectedBox &&
                                                            showInfoBox &&
                                                            selectedBox.id ===
                                                                marker.id &&
                                                            !marker?.department && (
                                                                <InfoBox
                                                                    position={
                                                                        selectedBox?.position
                                                                    }
                                                                    onCloseClick={() => {
                                                                        setSelectedBox(
                                                                            null
                                                                        )
                                                                        setShowInfoBox(
                                                                            false
                                                                        )
                                                                        setIndustryId(
                                                                            ''
                                                                        )
                                                                    }}
                                                                    options={{
                                                                        closeBoxURL: ``,
                                                                        enableEventPropagation: true,
                                                                    }}
                                                                >
                                                                    {marker
                                                                        ?.user
                                                                        ?.role &&
                                                                    marker?.user
                                                                        ?.role ===
                                                                        'student' &&
                                                                    !marker?.department ? (
                                                                        <StudentInfoBoxCard
                                                                            item={
                                                                                studentDetails
                                                                            }
                                                                            selectedBox={
                                                                                selectedBox
                                                                            }
                                                                            studentId={
                                                                                router
                                                                                    ?.query
                                                                                    ?.id
                                                                            }
                                                                            setSelectedBox={
                                                                                setSelectedBox
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <IndustryInfoBoxCard
                                                                            item={
                                                                                industryDetails
                                                                            }
                                                                            selectedBox={
                                                                                selectedBox
                                                                            }
                                                                            industryId={
                                                                                industryId
                                                                            }
                                                                            setSelectedBox={
                                                                                setSelectedBox
                                                                            }
                                                                            courseId={
                                                                                courseId
                                                                            }
                                                                            workplace={
                                                                                workplace
                                                                            }
                                                                            appliedIndustry={
                                                                                appliedIndustry
                                                                            }
                                                                            workplaceMapCard={
                                                                                true
                                                                            }
                                                                            onCancel={
                                                                                onCancel
                                                                            }
                                                                        />
                                                                    )}
                                                                </InfoBox>
                                                            )}
                                                    </>
                                                ))}
                                        </>
                                    )}
                                </MarkerClusterer>

                                {/* isPartner Industries */}
                                <MarkerClusterer
                                    options={partnerIndustryClusterOptions}
                                >
                                    {(clusterer) => (
                                        <>
                                            {visibleMarkers
                                                ?.filter(
                                                    (marker: any) =>
                                                        marker?.isPartner &&
                                                        marker?.user &&
                                                        marker?.user?.role !==
                                                            'student' &&
                                                        !marker?.department
                                                )
                                                .map((marker: any) => (
                                                    <>
                                                        <Marker
                                                            icon={{
                                                                url:
                                                                    marker?.user
                                                                        ?.role &&
                                                                    marker?.user
                                                                        ?.role ===
                                                                        'student'
                                                                        ? '/images/icons/student-red-map-pin.png'
                                                                        : marker?.placementStatus ===
                                                                            IndustryPlacementStatus.ACCEPTING_STUDENTS
                                                                          ? '/images/icons/partnered-industry-marker-check.png'
                                                                          : marker?.placementStatus ===
                                                                              IndustryPlacementStatus.NOT_ACCEPTING_STUDENTS
                                                                            ? '/images/icons/partnered-industry-marker-uncheck.png'
                                                                            : '/images/icons/partnered-industry-marker.png',
                                                                scaledSize:
                                                                    new google.maps.Size(
                                                                        29,
                                                                        38
                                                                    ),
                                                            }}
                                                            key={marker.id}
                                                            position={
                                                                marker.location
                                                            }
                                                            clusterer={
                                                                clusterer
                                                            }
                                                            onMouseOver={(
                                                                e: any
                                                            ) => {
                                                                // handleMarkerClick(
                                                                //     marker
                                                                // )
                                                                setIndustryId(
                                                                    marker?.id
                                                                )
                                                                setSelectedBox({
                                                                    ...marker,
                                                                    position: {
                                                                        lat: e.latLng.lat(),
                                                                        lng: e.latLng.lng(),
                                                                    },
                                                                })
                                                                setShowInfoBox(
                                                                    true
                                                                )
                                                            }}
                                                            onMouseOut={() =>
                                                                setSelectedMarker(
                                                                    null
                                                                )
                                                            }
                                                            onClick={(
                                                                e: any
                                                            ) => {
                                                                // handleMarkerClick(
                                                                //     marker
                                                                // )
                                                                setIndustryId(
                                                                    marker?.id
                                                                )
                                                                setSelectedBox({
                                                                    ...marker,
                                                                    position: {
                                                                        lat: e.latLng.lat(),
                                                                        lng: e.latLng.lng(),
                                                                    },
                                                                })
                                                                setShowInfoBox(
                                                                    true
                                                                )
                                                            }}
                                                        />
                                                        {selectedBox &&
                                                            showInfoBox &&
                                                            selectedBox.id ===
                                                                marker.id &&
                                                            !marker?.department && (
                                                                <InfoBox
                                                                    position={
                                                                        selectedBox?.position
                                                                    }
                                                                    onCloseClick={() => {
                                                                        setSelectedBox(
                                                                            null
                                                                        )
                                                                        setShowInfoBox(
                                                                            false
                                                                        )
                                                                        setIndustryId(
                                                                            ''
                                                                        )
                                                                    }}
                                                                    options={{
                                                                        closeBoxURL: ``,
                                                                        enableEventPropagation: true,
                                                                    }}
                                                                >
                                                                    {marker
                                                                        ?.user
                                                                        ?.role &&
                                                                    marker?.user
                                                                        ?.role ===
                                                                        'student' &&
                                                                    !marker?.department ? (
                                                                        <StudentInfoBoxCard
                                                                            item={
                                                                                studentDetails
                                                                            }
                                                                            selectedBox={
                                                                                selectedBox
                                                                            }
                                                                            studentId={
                                                                                router
                                                                                    ?.query
                                                                                    ?.id
                                                                            }
                                                                            setSelectedBox={
                                                                                setSelectedBox
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <IndustryInfoBoxCard
                                                                            item={
                                                                                industryDetails
                                                                            }
                                                                            selectedBox={
                                                                                selectedBox
                                                                            }
                                                                            industryId={
                                                                                industryId
                                                                            }
                                                                            setSelectedBox={
                                                                                setSelectedBox
                                                                            }
                                                                            workplace={
                                                                                workplace
                                                                            }
                                                                            appliedIndustry={
                                                                                appliedIndustry
                                                                            }
                                                                            workplaceMapCard={
                                                                                true
                                                                            }
                                                                            onCancel={
                                                                                onCancel
                                                                            }
                                                                        />
                                                                    )}
                                                                </InfoBox>
                                                            )}
                                                    </>
                                                ))}
                                        </>
                                    )}
                                </MarkerClusterer>

                                {/* Future Industries */}
                                {showFutureIndustries && (
                                    <MarkerClusterer
                                        options={futureIndustryClusterOptions}
                                    >
                                        {(clusterer) => (
                                            <>
                                                {visibleMarkers
                                                    ?.filter(
                                                        (marker: any) =>
                                                            marker?.department &&
                                                            !marker?.user
                                                    )
                                                    .map((marker: any) => (
                                                        <div key={marker?.id}>
                                                            <Marker
                                                                icon={{
                                                                    url:
                                                                        marker?.department &&
                                                                        '/images/icons/future-industry-pin.png',

                                                                    scaledSize:
                                                                        new google.maps.Size(
                                                                            29,
                                                                            38
                                                                        ),
                                                                }}
                                                                position={
                                                                    marker.location
                                                                }
                                                                // label={marker.name}
                                                                clusterer={
                                                                    clusterer
                                                                }
                                                                onMouseOver={(
                                                                    e: any
                                                                ) => {
                                                                    // handleMarkerClick(marker)
                                                                    // setStudentId(marker?.id)
                                                                    // setIndustryId(
                                                                    //     marker?.id
                                                                    // )
                                                                    setFutureIndustryId(
                                                                        marker?.id
                                                                    )

                                                                    setSelectedBox(
                                                                        {
                                                                            ...marker,
                                                                            type: 'futureIndustry',
                                                                            position:
                                                                                {
                                                                                    lat: e.latLng.lat(),
                                                                                    lng: e.latLng.lng(),
                                                                                },
                                                                        }
                                                                    )
                                                                    setShowInfoBox(
                                                                        true
                                                                    )
                                                                }}
                                                                onMouseOut={() =>
                                                                    setSelectedMarker(
                                                                        null
                                                                    )
                                                                }
                                                                onClick={(
                                                                    e: any
                                                                ) => {
                                                                    // handleMarkerClick(marker)
                                                                    // setStudentId(marker?.id)
                                                                    // setIndustryId(
                                                                    //     marker?.id
                                                                    // )
                                                                    setFutureIndustryId(
                                                                        marker?.id
                                                                    )

                                                                    setSelectedBox(
                                                                        {
                                                                            ...marker,
                                                                            type: 'futureIndustry',
                                                                            position:
                                                                                {
                                                                                    lat: e.latLng.lat(),
                                                                                    lng: e.latLng.lng(),
                                                                                },
                                                                        }
                                                                    )
                                                                    setShowInfoBox(
                                                                        true
                                                                    )
                                                                }}
                                                            />
                                                            {selectedBox &&
                                                                selectedBox?.type ===
                                                                    'futureIndustry' &&
                                                                showInfoBox &&
                                                                selectedBox?.id ===
                                                                    marker?.id &&
                                                                marker?.department &&
                                                                !marker?.user && (
                                                                    <InfoBox
                                                                        position={
                                                                            selectedBox?.position
                                                                        }
                                                                        onCloseClick={() => {
                                                                            setSelectedBox(
                                                                                null
                                                                            )
                                                                            setShowInfoBox(
                                                                                false
                                                                            )
                                                                            // setStudentId('')
                                                                            setIndustryId(
                                                                                ''
                                                                            )
                                                                            setFutureIndustryId(
                                                                                null
                                                                            )
                                                                        }}
                                                                        options={{
                                                                            closeBoxURL: ``,
                                                                            enableEventPropagation: true,
                                                                        }}
                                                                    >
                                                                        {marker?.department &&
                                                                            !marker?.user && (
                                                                                <FutureIndustryInfoBoxCard
                                                                                    item={
                                                                                        industryDetails
                                                                                    }
                                                                                    selectedBox={
                                                                                        selectedBox
                                                                                    }
                                                                                    industryId={
                                                                                        futureIndustryId
                                                                                    }
                                                                                    setSelectedBox={
                                                                                        setSelectedBox
                                                                                    }
                                                                                />
                                                                            )}
                                                                    </InfoBox>
                                                                )}
                                                        </div>
                                                    ))}
                                            </>
                                        )}
                                    </MarkerClusterer>
                                )}

                                {/* {directions && renderPolyline()}
        {renderDirections()} */}
                            </GoogleMap>
                        </div>
                    )}
                </div>
            ) : (
                <NoData text="No Data found" />
            )}
            <div className="flex justify-end cursor-pointer border-t p-4 mt-2"></div>
        </div>
    )
}

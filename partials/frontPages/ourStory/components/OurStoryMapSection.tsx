import { Select, TextInput, Typography } from '@components'
import React, { useState } from 'react'
import { fromAddress, geocode, GeocodeOptions, setKey } from 'react-geocode'
import { MapView } from './MapView'
import { AuthApi } from '@queries'

setKey(process.env.NEXT_PUBLIC_MAP_KEY as string)

export const OurStoryMapSection = () => {
    const [suburbLocation, setSuburbLocation] = useState<any>(null)
    const [searchInitiated, setSearchInitiated] = useState(false)
    const [searchedLocationCoordinates, setSearchedLocationCoordinates] =
        useState<any>(null)
    const [sector, setSector] = useState('')

    const getSectors = AuthApi.useSectors({})
    const sectorsOptions = getSectors?.data?.map((sector: any) => ({
        label: sector?.name,
        value: sector?.id,
    }))

    return (
        <div className="md:mt-20 mt-12 max-w-7xl mx-auto mb-12 md:mb-14 px-4">
            <div className="flex flex-col items-center justify-center gap-y-2">
                <Typography variant="h2" medium center>
                    See our wide range of industry partners
                </Typography>
                <div className="md:px-32 px-4 py-2 md:py-4">
                    <Typography variant="body" center>
                        Our customised map features enables to locate all
                        nearest industries within the given 20km radius of the
                        provided student location. Select a specific region and
                        see how this works.
                    </Typography>
                </div>
            </div>
            <div className="flex items-center flex-col md:flex-row gap-x-2.5 mt-4 w-full">
                <div className="md:w-1/2 w-full">
                    <TextInput
                        label={'Location'}
                        name={'location'}
                        placeholder={'Location...'}
                        validationIcons
                        placesSuggetions
                        onChange={(e: any) => {
                            if (e?.target?.value?.length > 4) {
                                fromAddress(e?.target?.value)
                                    .then(({ results }: any) => {
                                        const { lat, lng } =
                                            results[0].geometry.location
                                        setSearchedLocationCoordinates({
                                            lat,
                                            lng,
                                        })

                                        geocode('latlng', `${lat},${lng}`, {
                                            key: process.env
                                                .NEXT_PUBLIC_MAP_KEY,
                                        } as GeocodeOptions)

                                        setSuburbLocation({ lat, lng })
                                    })
                                    .catch(console.error)
                            }
                        }}
                    />
                </div>
                <div className="md:w-1/2 w-full">
                    <Select
                        name="sector"
                        options={sectorsOptions}
                        label={'Sector'}
                        onChange={(e: any) => {
                            if (e?.value) {
                                setSector(e.value)
                                setSearchInitiated(true)
                            } else {
                                setSector('')
                                setSearchInitiated(false)
                            }
                        }}
                        placeholder="Select Sector"
                    />
                </div>
            </div>
            <MapView
                sector={sector}
                searchInitiated={searchInitiated}
                setSearchInitiated={setSearchInitiated}
                suburbLocation={suburbLocation}
            />
        </div>
    )
}

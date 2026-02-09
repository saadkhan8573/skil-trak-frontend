import {
    fromAddress,
    geocode,
    GeocodeOptions,
    RequestType,
    setKey,
} from 'react-geocode'

setKey(process.env.NEXT_PUBLIC_MAP_KEY as string)

export const getLatLng = async (value: string) => {
    const { results } = await fromAddress(value)
    const { lat, lng } = results[0].geometry.location
    return { lat, lng }
}

export const getAddressData = async (value: string) => {
    const { results } = await fromAddress(value)
    const addressComponents = results[0].address_components
    const stateComponent = addressComponents.find((component: any) =>
        component.types.includes('administrative_area_level_1')
    )
    return {
        state: stateComponent?.long_name,
        stateCode: stateComponent?.short_name,
    }
}

export const getPostalCode = async ({
    lat,
    lng,
}: {
    lat: number
    lng: number
}) => {
    const response = await geocode(RequestType.LATLNG, `${lat},${lng}`)
    const addressComponents = response.results[0].address_components

    for (let component of addressComponents) {
        if (component.types.includes('postal_code')) {
            return component?.long_name
        }
    }
}

export const getSuburb = async (address: string) => {
    try {
        // Get latitude & longitude from address
        const response = await fromAddress(address)

        // Extract address components from the response
        const { results } = response

        if (results && results.length > 0) {
            // Find the suburb/locality in the address components
            let foundSuburb = ''

            results[0].address_components.forEach((component: any) => {
                // In Australia, suburbs are typically categorized as "locality" or "sublocality"
                if (
                    component.types.includes('locality') ||
                    component.types.includes('sublocality') ||
                    component.types.includes('sublocality_level_1')
                ) {
                    foundSuburb = component.long_name
                }
            })

            return foundSuburb
        } else {
            return ''
        }
    } catch (error) {
        return ''
    }
}

// Function to calculate distance between two coordinates (in kilometers)
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371 // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in kilometers
}

// fromAddress(e?.target?.value)
//     .then(({ results }: any) => {
//         const { lat, lng } = results[0].geometry.location
//         geocode('latlng', `${lat},${lng}`, {
//             key: process.env.NEXT_PUBLIC_MAP_KEY,
//         } as GeocodeOptions)
//             .then((response) => {
//                 const addressComponents = response.results[0].address_components

//                 for (let component of addressComponents) {
//                     if (component.types.includes('postal_code')) {
//                         formMethods.setValue('zip', component.long_name)

//                         break
//                     }
//                 }
//             })
//             .catch((error) => {
//                 console.error({
//                     error,
//                 })
//             })
//     })
//     .catch(console.error)

// https://claude.ai/chat/046dd388-c19c-482f-becf-f49b332acf30
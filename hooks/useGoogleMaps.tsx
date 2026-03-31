// GoogleMapsContext.tsx
import React, { createContext, useContext, ReactNode } from 'react'
import { useJsApiLoader, Libraries } from '@react-google-maps/api'

interface GoogleMapsContextType {
    isLoaded: boolean
    loadError: Error | undefined
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(
    undefined
)

export const useGoogleMaps = () => {
    const context = useContext(GoogleMapsContext)
    if (context === undefined) {
        throw new Error(
            'useGoogleMaps must be used within a GoogleMapsProvider'
        )
    }
    return context
}

interface GoogleMapsProviderProps {
    children: ReactNode
}

const LIBRARIES: Libraries = ['places']

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
    children,
}) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY as string,
        libraries: LIBRARIES,
    })

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
            {children}
        </GoogleMapsContext.Provider>
    )
}

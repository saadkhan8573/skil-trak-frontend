import { getAddressData, getLatLng, getPostalCode, getSuburb } from '@utils'
import React, { useEffect, useState } from 'react'

export const useAddressInfo = (address: string) => {
    const [addressInfo, setAddressInfo] = useState({
        state: '',
        suburb: '',
        postcode: '',
        country: '',
    })

    const getSuburbFromAddress = async () => {
        const suburb = await getSuburb(address)
        setAddressInfo((prev) => ({ ...prev, suburb }))
    }

    const getPostCodeFromAddress = async () => {
        const latlng = await getLatLng(address)
        const postCode = await getPostalCode(latlng)
        setAddressInfo((prev) => ({ ...prev, postCode }))
    }

    const getStateFromAddress = async () => {
        const { state } = await getAddressData(address)
        setAddressInfo((prev) => ({ ...prev, state }))
    }

    const getCountryFromAddress = async () => {
        const { country } = await getAddressData(address)
        setAddressInfo((prev) => ({ ...prev, country }))
    }

    useEffect(() => {
        if (!address) return
        getSuburbFromAddress()
        getPostCodeFromAddress()
        getStateFromAddress()
        getCountryFromAddress()
    }, [address])
    return {
        addressInfo,
    }
}

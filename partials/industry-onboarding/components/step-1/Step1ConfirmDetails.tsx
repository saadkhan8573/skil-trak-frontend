import { motion } from 'framer-motion'
import { Building, FileText, MapPin, Shield, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AddressInformationCard } from './cards/AddressInformationCard'
import { ConsentCard } from './cards/ConsentCard'
import { OrganisationDetails } from './cards/OrganisationDetails'

export interface Step1Data {
    entityName: string
    abn: string
    website?: string
    industryBio?: string
    workplaceType: any // Now mandatory
    logo?: File
    primaryContactName: string
    primaryContactRole: string
    primaryContactEmail: string
    primaryContactPhone: string
    // Address Information
    streetAddress: string
    suburb: string
    state: any
    postcode: string
    country: string
    // Consent
    termsAccepted: boolean
    privacyAccepted: boolean
    marketingConsent: boolean
}

export interface Step1Props {
    data: Step1Data
    onChange: (data: Step1Data) => void
    onValidationChange: (isValid: boolean) => void
}

export const Step1ConfirmDetails = ({
    data,
    onChange,
    onValidationChange,
}: Step1Props) => {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const helpTips = [
        {
            icon: <Building className="w-4 h-4" />,
            title: 'Entity Name',
            description:
                'Use your official business name as registered with ASIC',
        },
        {
            icon: <FileText className="w-4 h-4" />,
            title: 'ABN Format',
            description: 'Enter your 11-digit ABN without spaces (12345678901)',
        },
        {
            icon: <MapPin className="w-4 h-4" />,
            title: 'Address Details',
            description:
                'This will be your primary business address for correspondence',
        },
        {
            icon: <Shield className="w-4 h-4" />,
            title: 'Consent Required',
            description:
                'Terms and Privacy Policy acceptance is required to proceed',
        },
    ]

    const validateABN = (abn: string) => {
        const abnRegex = /^\d{11}$/
        return abnRegex.test(abn.replace(/\s/g, ''))
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePostcode = (postcode: string) => {
        const postcodeRegex = /^\d{4}$/
        return postcodeRegex.test(postcode)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!data.entityName.trim()) {
            newErrors.entityName = 'Entity name is required'
        }

        if (!data.abn.trim()) {
            newErrors.abn = 'ABN is required'
        } else if (!validateABN(data.abn)) {
            newErrors.abn = 'Enter a valid ABN (11 digits)'
        }

        if (!data?.workplaceType?.name?.trim()) {
            newErrors.workplaceType = 'Workplace type is required'
        }

        if (!data.primaryContactName.trim()) {
            newErrors.primaryContactName = 'Primary contact name is required'
        }

        if (
            data.primaryContactEmail &&
            data.primaryContactEmail.trim() &&
            !validateEmail(data.primaryContactEmail)
        ) {
            newErrors.primaryContactEmail = 'Enter a valid email address'
        }

        if (!data.primaryContactPhone.trim()) {
            newErrors.primaryContactPhone = 'Primary contact phone is required'
        }

        // Address validation
        if (!data.streetAddress.trim()) {
            newErrors.streetAddress = 'Street address is required'
        }

        if (!data.suburb.trim()) {
            newErrors.suburb = 'Suburb is required'
        }

        // if (!data.state.trim()) {
        //     newErrors.state = 'State is required'
        // }
        const stateValue =
            typeof data.state === 'object' ? data.state?.value : data.state

        if (!stateValue || !stateValue.toString().trim()) {
            newErrors.state = 'State is required'
        }

        // if (!data.postcode.trim()) {
        //     newErrors.postcode = 'Postcode is required'
        // } else if (!validatePostcode(data.postcode)) {
        //     newErrors.postcode = 'Enter a valid 4-digit postcode'
        // }
        const postcode = data.postcode?.toString().trim()

        if (!postcode) {
            newErrors.postcode = 'Postcode is required'
        } else if (!validatePostcode(postcode)) {
            newErrors.postcode = 'Enter a valid 4-digit postcode'
        }

        // Consent validation
        if (!data.termsAccepted) {
            newErrors.termsAccepted =
                'You must accept the Terms of Service to continue'
        }

        if (!data.privacyAccepted) {
            newErrors.privacyAccepted =
                'You must accept the Privacy Policy to continue'
        }

        setErrors(newErrors)
        const isValid = Object.keys(newErrors).length === 0
        onValidationChange(isValid)
        return isValid
    }

    useEffect(() => {
        validateForm()
    }, [data])

    const handleInputChange = (
        field: keyof Step1Data,
        value: string | boolean
    ) => {
        onChange({ ...data, [field]: value })
    }

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            onChange({ ...data, logo: file })
        }
    }

    return (
        <div className="max-w-260 mx-auto px-6 py-8 space-y-8">
            {/* Welcome Message */}
            <motion.div
                className="text-center py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-[#F7A619] fill-current" />
                    <h2 className="text-2xl font-bold gradient-text">
                        Welcome to SkilTrak!
                    </h2>
                    <Star className="w-5 h-5 text-[#F7A619] fill-current" />
                </div>
                <p className="text-[#475569] text-sm max-w-2xl mx-auto">
                    Let's confirm your details to create the perfect
                    partnership. Most information has been pre-filled from your
                    signup - just review and edit as needed.
                </p>
            </motion.div>

            {/* Organisation Details Card */}
            <OrganisationDetails
                onChange={onChange}
                data={data}
                errors={errors}
            />

            {/* Address Information Card */}
            <AddressInformationCard
                data={data}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            {/* ConsentCard */}
            <ConsentCard
                data={data}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            {/* <HelpPanel tips={helpTips} /> */}
        </div>
    )
}

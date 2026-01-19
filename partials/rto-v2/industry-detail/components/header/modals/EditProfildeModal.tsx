import {
    AddressFieldInput,
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
    Typography,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { useUpdateIndustryProfileMutation, CommonApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { OptionType } from '@types'
import {
    Building2,
    Calendar,
    Edit2,
    Globe,
    MapPin,
    Save,
    X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

const validationSchema = yup.object({
    name: yup.string().required('Company Name is required'),
    abn: yup.string().required('ABN is required'),
    yearEstablished: yup.string().nullable(),
    description: yup.string().nullable(),
    addressLine1: yup.string().required('Street Address is required'),
    suburb: yup.string().required('Suburb is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Postcode is required'),
    website: yup.string().nullable(),
    phoneNumber: yup.string().required('Phone is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    // country: yup.number().required('Country is required'),
})

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [onSuburbClicked, setOnSuburbClicked] = useState<boolean>(true)

    // Get industry detail from Redux instead of API
    const industryDetail = useAppSelector(
        (state: any) => state.industry.industryDetail
    )

    const [updateProfile, updateProfileResult] =
        useUpdateIndustryProfileMutation()

    const { notification } = useNotification()

    const [countryId, setCountryId] = useState<number | null>(null)
    const [onStateSelect, setOnStateSelect] = useState<number | null>(null)

    const country = CommonApi.Countries.useCountriesList()

    const { data: states, isLoading: statesLoading } =
        CommonApi.Countries.useCountryStatesList(countryId, {
            skip: !countryId,
        })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const { handleSubmit, reset, watch } = methods
    const formValues = watch()

    useEffect(() => {
        if (industryDetail) {
            reset({
                name: industryDetail?.user?.name || '',
                abn: industryDetail?.abn || '',
                yearEstablished: industryDetail?.yearEstablished || '',
                description: industryDetail?.description || '',
                addressLine1: industryDetail?.addressLine1 || '',
                suburb: industryDetail?.suburb || '',
                state: industryDetail?.state || '',
                zipCode: industryDetail?.zipCode || '',
                website: industryDetail?.website || '',
                phoneNumber: industryDetail?.phoneNumber || '',
                email: industryDetail?.user?.email || '',
                region: industryDetail?.region?.id || null,
                country: industryDetail?.region?.country?.id || null,
                bio: industryDetail?.bio || null,
            })

            if (industryDetail?.region?.country) {
                setCountryId(industryDetail.region.country.id)
            }
        }
    }, [industryDetail, reset])

    useEffect(() => {
        if (isOpen && updateProfileResult.isSuccess) {
            setIsEditing(false)
            onClose()
            updateProfileResult.reset()
        }
    }, [updateProfileResult.isSuccess, onClose, updateProfileResult, isOpen])

    // Reset mutation state and editing mode when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false)
            updateProfileResult.reset()
        }
    }, [isOpen, updateProfileResult])

    const handleSave = (data: any) => {
        if (!industryDetail?.user?.id) return

        if (!onSuburbClicked) {
            notification.error({
                title: 'Address Required',
                description:
                    'Please select an address from the dropdown suggestions.',
            })
            return
        }

        updateProfile({
            id: Number(industryDetail.user.id),
            body: {
                ...data,
                // Preserving other required fields if necessary or handled by backend
                courses: industryDetail?.courses?.map((c: any) => ({
                    id: c.id,
                })),
            },
        })
    }

    const handleCancel = () => {
        reset() // Reset to initial values from API
        setIsEditing(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                onInteractOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (target?.closest('.pac-container')) {
                        e.preventDefault()
                    }
                }}
                className="!max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
            >
                <ShowErrorNotifications result={updateProfileResult} />
                <DialogHeader className="bg-gradient-to-r from-[#044866] to-[#0D5468] px-6 py-5 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                    </div>
                    <div className="relative flex items-start justify-between">
                        <div className="flex-1 text-left">
                            <DialogTitle className="text-white text-xl font-bold mb-1">
                                Edit Industry Profile
                            </DialogTitle>
                            <DialogDescription className="text-white/80 text-sm">
                                Manage your company information and details
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-5">
                        {/* Edit Mode Toggle */}
                        <div className="flex items-center justify-between p-4 bg-[#F8FAFB] rounded-xl border border-[#E2E8F0]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
                                    <Edit2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1A2332]">
                                        {isEditing
                                            ? 'Editing Mode Active'
                                            : 'View Mode'}
                                    </p>
                                    <p className="text-xs text-[#64748B]">
                                        {isEditing
                                            ? 'Make changes to your profile'
                                            : 'Click edit to modify profile information'}
                                    </p>
                                </div>
                            </div>
                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white rounded-lg text-sm font-medium transition-all h-auto"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(handleSave)}>
                                {/* Company Information */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden mb-5">
                                    <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-4 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-[#044866]" />
                                        <h3 className="text-[#1A2332] font-bold">
                                            Company Information
                                        </h3>
                                    </div>

                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Company Name */}
                                        <div className="md:col-span-2">
                                            {isEditing ? (
                                                <TextInput
                                                    name="name"
                                                    label="Company Name"
                                                    placeholder="Company Name"
                                                    required
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Company Name"
                                                    value={formValues.name}
                                                />
                                            )}
                                        </div>

                                        {/* ABN */}
                                        <div>
                                            {isEditing ? (
                                                <TextInput
                                                    name="abn"
                                                    label="ABN"
                                                    placeholder="ABN"
                                                    required
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="ABN"
                                                    value={formValues.abn}
                                                />
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            {isEditing ? (
                                                <TextArea
                                                    name="bio"
                                                    label="Company Bio"
                                                    placeholder="Brief description of your company..."
                                                    rows={3}
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Company Bio"
                                                    value={formValues.bio}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden mb-5">
                                    <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-[#044866]" />
                                        <h3 className="text-[#1A2332] font-bold">
                                            Address Information
                                        </h3>
                                    </div>

                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Street Address */}
                                        <div className="md:col-span-2">
                                            {isEditing ? (
                                                <AddressFieldInput
                                                    helpText="For accurate verification, please select an address from the dropdown suggestions using either a mouse click or the Tab key."
                                                    placesSuggetions={{
                                                        placesSuggetions:
                                                            onSuburbClicked,
                                                        setIsPlaceSelected:
                                                            setOnSuburbClicked,
                                                    }}
                                                    onChange={() => {
                                                        setOnSuburbClicked(
                                                            false
                                                        )
                                                    }}
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Street Address"
                                                    value={
                                                        formValues.addressLine1
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* Suburb */}
                                        <div>
                                            {isEditing ? (
                                                <TextInput
                                                    name="suburb"
                                                    label="Suburb"
                                                    placeholder="Suburb"
                                                    required
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Suburb"
                                                    value={formValues.suburb}
                                                />
                                            )}
                                        </div>

                                        {/* Postcode */}
                                        <div>
                                            {isEditing ? (
                                                <TextInput
                                                    name="zipCode"
                                                    label="Postcode"
                                                    placeholder="Postcode"
                                                    required
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Postcode"
                                                    value={formValues.zipCode}
                                                />
                                            )}
                                        </div>

                                        {/* Country */}
                                        <div>
                                            {isEditing ? (
                                                <Select
                                                    name="country"
                                                    label="Country"
                                                    options={
                                                        country?.data?.map(
                                                            (country: any) => ({
                                                                label: country.name,
                                                                value: country.id,
                                                            })
                                                        ) || []
                                                    }
                                                    loading={country.isLoading}
                                                    onChange={(e: any) => {
                                                        setCountryId(e?.value)
                                                        methods.setValue(
                                                            'country',
                                                            e?.value
                                                        )
                                                    }}
                                                    value={country?.data
                                                        ?.map(
                                                            (country: any) => ({
                                                                label: country.name,
                                                                value: country.id,
                                                            })
                                                        )
                                                        ?.find(
                                                            (c: OptionType) =>
                                                                c?.value ===
                                                                countryId
                                                        )}
                                                    validationIcons
                                                    menuPlacement="top"
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Country"
                                                    value={
                                                        industryDetail?.region
                                                            ?.country?.name ||
                                                        '-'
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* State */}
                                        <div>
                                            {isEditing ? (
                                                <Select
                                                    name="region"
                                                    onlyValue
                                                    label="State"
                                                    options={states?.map(
                                                        (state: any) => ({
                                                            label: state.name,
                                                            value: state.id,
                                                        })
                                                    )}
                                                    placeholder="Select State"
                                                    required
                                                    validationIcons
                                                    disabled={!countryId}
                                                    loading={statesLoading}
                                                    value={states
                                                        ?.map((s: any) => ({
                                                            label: s.name,
                                                            value: s.id,
                                                        }))
                                                        ?.find(
                                                            (s: OptionType) =>
                                                                s?.label ===
                                                                formValues.region
                                                        )}
                                                    menuPlacement="top"
                                                />
                                            ) : (
                                                <ViewField
                                                    label="State"
                                                    value={
                                                        industryDetail?.region
                                                            ?.name || '-'
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden mb-5">
                                    <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-[#044866]" />
                                        <h3 className="text-[#1A2332] font-bold">
                                            Contact Information
                                        </h3>
                                    </div>

                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Website */}
                                        <div>
                                            {isEditing ? (
                                                <TextInput
                                                    name="website"
                                                    label="Website"
                                                    placeholder="Website Url"
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Website"
                                                    value={formValues.website}
                                                    icon={
                                                        <Globe className="w-3.5 h-3.5 inline mr-1" />
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            {isEditing ? (
                                                <TextInput
                                                    name="phoneNumber"
                                                    label="Phone"
                                                    placeholder="Phone Number"
                                                    required
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Phone"
                                                    value={
                                                        formValues.phoneNumber
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="md:col-span-2">
                                            {isEditing ? (
                                                <TextInput
                                                    name="email"
                                                    type="email"
                                                    label="Email Address"
                                                    placeholder="Email Address"
                                                    required
                                                    validationIcons
                                                />
                                            ) : (
                                                <ViewField
                                                    label="Email Address"
                                                    value={formValues.email}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Show only in edit mode */}
                                {isEditing && (
                                    <div className="flex gap-3">
                                        <Button
                                            submit
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#10B981] text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl h-auto"
                                            loading={
                                                updateProfileResult.isLoading
                                            }
                                            disabled={
                                                updateProfileResult.isLoading
                                            }
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="action"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#F8FAFB] text-[#64748B] border-2 border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl font-medium transition-all h-auto"
                                            disabled={
                                                updateProfileResult.isLoading
                                            }
                                        >
                                            <X className="w-5 h-5" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </FormProvider>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#F8FAFB] border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
                    <p className="text-xs text-[#64748B]">* Required fields</p>
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 bg-gradient-to-br from-[#044866] to-[#0D5468] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all h-auto"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Helper component for View Mode fields
const ViewField = ({
    label,
    value,
    icon,
}: {
    label: string
    value: string
    icon?: React.ReactNode
}) => (
    <div>
        <Typography
            // htmlFor={label}
            className="text-sm font-medium text-[#64748B] mb-2 block"
        >
            {icon}
            {label}
        </Typography>
        <div className="p-3 rounded-lg bg-[#F8FAFB] border border-[#E2E8F0]">
            <p className="text-sm font-medium text-[#1A2332]">{value || '-'}</p>
        </div>
    </div>
)

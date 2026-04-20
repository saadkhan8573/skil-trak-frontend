import { Card, Select, TextArea, TextInput, Typography } from '@components'
import { Label } from '@components/ui/label'
import { motion } from 'framer-motion'
import {
    Briefcase,
    Building,
    FileText,
    Globe,
    Mail,
    Phone,
    User,
} from 'lucide-react'
import { Step1Data } from '../Step1ConfirmDetails'
import { AbnLookUpCard } from './AbnLookUpCard'
import { IndustryApi } from '@queries'

export const OrganisationDetails = ({ onChange, data, errors }: any) => {
    const workplaceTypes =
        IndustryApi.Profile.useSectorsWorkplaceTypeOnboarding(
            data?.sectorsIds,
            { skip: !data?.sectorsIds?.length }
        )
    const workplaceTypesOptions =
        workplaceTypes?.data?.map((type: any) => ({
            value: type?.id,
            label: type?.name,
        })) ?? []
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
    console.log('data?.workplaceType::', data)
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card
                    className="border-0 shadow-xl bg-linear-to-br from-white to-gray-50/30 hover-lift"
                    noPadding
                >
                    <div className="bg-linear-to-r from-primaryNew/5 to-primaryNew/5 rounded-t-xl">
                        <div className="flex items-center gap-3 pb-2 pt-5 px-6">
                            <div className="w-10 h-10 bg-linear-to-br from-primaryNew to-primaryNew rounded-xl flex items-center justify-center">
                                <Building className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <Typography
                                    variant="subtitle"
                                    color="text-primaryNew"
                                >
                                    Organisation Details
                                </Typography>
                                <p className="text-sm text-muted">
                                    Your company information and primary contact
                                    details
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <Label
                                    htmlFor="entityName"
                                    className="flex items-center gap-2"
                                >
                                    <Building className="w-4 h-4 text-primary" />
                                    Entity name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <TextInput
                                        name="entityName"
                                        value={data.entityName}
                                        onChange={(e: any) =>
                                            handleInputChange(
                                                'entityName',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Your organisation name"
                                    />
                                    {/* {data.entityName && !errors.entityName && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                            )} */}
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <Label
                                    htmlFor="abn"
                                    className="flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4 text-primary" />
                                    ABN{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <TextInput
                                        name="abn"
                                        value={data.abn}
                                        onChange={(e: any) =>
                                            handleInputChange(
                                                'abn',
                                                e.target.value
                                            )
                                        }
                                        placeholder="12345678901"
                                    />
                                    {/* {data.abn && !errors.abn && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                            )} */}
                                </div>
                                {/* {errors.abn && (
                                            <motion.p
                                                className="text-sm text-destructive flex items-center gap-1"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <span>⚠️</span> {errors.abn}
                                            </motion.p>
                                        )} */}
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span>💡</span> Enter your 11-digit ABN
                                    without spaces
                                </p>
                            </motion.div>
                        </div>

                        <AbnLookUpCard abn={data?.abn} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.35 }}
                            >
                                <Label
                                    htmlFor="website"
                                    className="flex items-center gap-2"
                                >
                                    <Globe className="w-4 h-4 text-primary" />
                                    Website (optional)
                                </Label>
                                <div className="relative">
                                    <TextInput
                                        name="website"
                                        type="url"
                                        value={data.website || ''}
                                        onChange={(e: any) =>
                                            handleInputChange(
                                                'website',
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://www.yourcompany.com.au"
                                        // className="bg-white/80 backdrop-blur-sm border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300"
                                    />
                                    {/* {data.website && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                            )} */}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span>🌐</span> Your organisation's website
                                    URL
                                </p>
                            </motion.div>

                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.36 }}
                            >
                                <Label
                                    htmlFor="workplaceType"
                                    className="flex items-center gap-2"
                                >
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    Workplace Type
                                </Label>
                                <Select
                                    name="workplaceType"
                                    options={workplaceTypesOptions}
                                    value={
                                        workplaceTypesOptions?.find(
                                            (opt: any) =>
                                                Number(opt.value) ===
                                                Number(data?.workplaceType?.id)
                                        ) || null
                                    }
                                    onChange={(selected: any) =>
                                        handleInputChange(
                                            'workplaceType',
                                            selected?.value
                                        )
                                    }
                                />

                                {/* <TextInput
                                    name="workplaceType"
                                    value={
                                        typeof data?.workplaceType === 'object'
                                            ? (data?.workplaceType?.name ?? '')
                                            : (data?.workplaceType ?? '')
                                    }
                                    onChange={(e: any) => {
                                        const prev = data?.workplaceType
                                        const name = e.target.value
                                        // Preserve the API id if it was an object, otherwise store as string
                                        onChange({
                                            ...data,
                                            workplaceType:
                                                typeof prev === 'object' &&
                                                prev?.id
                                                    ? { ...prev, name }
                                                    : name,
                                        })
                                    }}
                                    placeholder="e.g., Residential Aged Care"
                                /> */}

                                {errors.workplaceType && (
                                    <motion.p
                                        className="text-sm text-destructive flex items-center gap-1"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <span>⚠️</span> {errors.workplaceType}
                                    </motion.p>
                                )}
                                {/* <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span>🏢</span> Select your workplace type
                                    or choose "To be confirmed" to update later
                                </p> */}
                            </motion.div>
                        </div>

                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.37 }}
                        >
                            <Label
                                htmlFor="industryBio"
                                className="flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4 text-primary" />
                                Industry Bio (optional)
                            </Label>
                            <TextArea
                                name="industryBio"
                                value={data.industryBio || ''}
                                onChange={(e: any) =>
                                    handleInputChange(
                                        'industryBio',
                                        e.target.value
                                    )
                                }
                                placeholder="Tell us about your organisation, services, and what makes your placement opportunities unique..."
                                rows={4}
                                className="bg-white/80 backdrop-blur-sm border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 resize-none"
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span>✍️</span> Brief description of your
                                organisation and services (displayed to students
                                when browsing placements)
                            </p>
                        </motion.div>

                        {/* <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <Label
                                htmlFor="logo"
                                className="flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-[#F7A619]" />
                                Company Logo (optional)
                            </Label>
                            <div className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="secondary"
                                        outline
                                        className="bg-white shadow-sm hover-lift"
                                        // Icon={Upload}
                                        // text="Upload"
                                    >
                                        <label
                                            htmlFor="logo"
                                            className="cursor-pointer flex"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Logo
                                        </label>
                                    </Button>
                                </motion.div>
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                {data.logo && (
                                    <motion.div
                                        className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30,
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">
                                            {data.logo.name}
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span>📸</span> PNG, JPG, or SVG. Max file size
                                2MB. This will appear on student placement
                                documentation.
                            </p>
                        </motion.div> */}

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Primary Contact Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                    <Label
                                        htmlFor="primaryContactName"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4 text-primary" />
                                        Contact name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <TextInput
                                            name="primaryContactName"
                                            value={data.primaryContactName}
                                            onChange={(e: any) =>
                                                handleInputChange(
                                                    'primaryContactName',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Full name"
                                        />
                                        {/* {data.primaryContactName &&
                                                    !errors.primaryContactName && (
                                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                                    )} */}
                                    </div>
                                    {errors.primaryContactName && (
                                        <motion.p
                                            className="text-sm text-destructive flex items-center gap-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <span>⚠️</span>{' '}
                                            {errors.primaryContactName}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 }}
                                >
                                    <Label
                                        htmlFor="primaryContactRole"
                                        className="flex items-center gap-2"
                                    >
                                        <Building className="w-4 h-4 text-primary" />
                                        Job title{' '}
                                        {/* <span className="text-destructive">
                                            *
                                        </span> */}
                                    </Label>
                                    <div className="relative">
                                        <TextInput
                                            name="primaryContactRole"
                                            value={data.primaryContactRole}
                                            onChange={(e: any) =>
                                                handleInputChange(
                                                    'primaryContactRole',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Job title"
                                        />
                                        {/* {data.primaryContactRole &&
                                                    !errors.primaryContactRole && (
                                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                                    )} */}
                                    </div>
                                    {errors.primaryContactRole && (
                                        <motion.p
                                            className="text-sm text-destructive flex items-center gap-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <span>⚠️</span>{' '}
                                            {errors.primaryContactRole}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.7 }}
                                >
                                    <Label
                                        htmlFor="primaryContactEmail"
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4 text-primary" />
                                        Email address{' '}
                                        {/* <span className="text-destructive">
                                            *
                                        </span> */}
                                    </Label>
                                    <div className="relative">
                                        <TextInput
                                            name="primaryContactEmail"
                                            type="email"
                                            value={data.primaryContactEmail}
                                            onChange={(e: any) =>
                                                handleInputChange(
                                                    'primaryContactEmail',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="contact@company.com"
                                        />
                                        {/* {data.primaryContactEmail &&
                                                    !errors.primaryContactEmail && (
                                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                                    )} */}
                                    </div>
                                    {errors.primaryContactEmail && (
                                        <motion.p
                                            className="text-sm text-destructive flex items-center gap-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <span>⚠️</span>{' '}
                                            {errors.primaryContactEmail}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.8 }}
                                >
                                    <Label
                                        htmlFor="primaryContactPhone"
                                        className="flex items-center gap-2"
                                    >
                                        <Phone className="w-4 h-4 text-primary" />
                                        Phone number{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <TextInput
                                            name="primaryContactPhone"
                                            type="tel"
                                            value={data.primaryContactPhone}
                                            onChange={(e: any) =>
                                                handleInputChange(
                                                    'primaryContactPhone',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0412 345 678"
                                        />
                                        {/* {data.primaryContactPhone &&
                                                    !errors.primaryContactPhone && (
                                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                                    )} */}
                                    </div>
                                    {errors.primaryContactPhone && (
                                        <motion.p
                                            className="text-sm text-destructive flex items-center gap-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <span>⚠️</span>{' '}
                                            {errors.primaryContactPhone}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-2xl p-6 relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
                            <div className="relative flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-800 mb-2">
                                        📧 Communication Preferences
                                    </h4>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        We'll email status updates to your
                                        primary contact. Most accounts are
                                        created by coordinators (79.8%), some by
                                        students (10%), and few by industry
                                        directly (0.2%). We'll send the right
                                        email based on who initiated the
                                        sign-up.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </>
    )
}

import { Badge, Button, Card, Typography } from '@components'
import { useContextBar } from '@hooks'
import { IndustryProfileAvatar } from '@partials/common/IndustryProfileDetail'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2,
    Calendar,
    ChevronRight,
    ClipboardList,
    Globe,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    ShieldCheck,
    Stethoscope,
    User,
    UserPlus,
    Edit3,
    Send,
} from 'lucide-react'
import React, { useCallback, useState } from 'react'
import {
    ComposeListingIndustryMail,
    IndustryListingNotes,
} from './CBListingProfile'
import {
    CBListingIndustryDetail,
    CBSectorInfoBox,
} from './CBListingProfile/components'
import {
    ListingIndustryAllCommunications,
    ListingProfileDetailsSkeleton,
} from './components'
import { AddIndustry } from '../tabs'
import { cn } from '@utils'

export const ListingProfileDetails = ({
    industry,
    onSetIndustryData,
    isLoading = false,
}: {
    industry: any
    onSetIndustryData?: (val: any) => void
    isLoading?: boolean
}) => {
    const [isComposeMail, setIsComposeMail] = useState<boolean>(false)
    const contextBar = useContextBar()

    const onCancelComposeMail = useCallback(() => {
        setIsComposeMail(false)
    }, [])

    if (isLoading) return <ListingProfileDetailsSkeleton />

    const onEditIndustry = () => {
        contextBar.setContent(
            <AddIndustry
                industryData={industry}
                onSetIndustryData={() => {
                    if (onSetIndustryData) {
                        onSetIndustryData(null)
                    }
                }}
            />
        )
        contextBar.show(false)
        contextBar.setTitle('Edit Future Industry')
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    }

    const DetailItem = ({
        icon: Icon,
        label,
        value,
        colorClass = 'text-primaryNew',
    }: any) => (
        <div className="flex items-start gap-3 group">
            <div
                className={cn(
                    'p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100',
                    colorClass
                )}
            >
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <Typography
                    variant="xxs"
                    color="text-gray-400"
                    className="uppercase tracking-wider font-bold mb-0.5"
                >
                    {label}
                </Typography>
                <Typography
                    variant="small"
                    semibold
                    color="text-gray-700"
                    className="break-all"
                >
                    {value || '---'}
                </Typography>
            </div>
        </div>
    )

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 pb-20"
        >
            {/* Premium Hero Identity Section */}
            <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50/50 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-50/30 to-transparent rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-2">
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-6 max-w-2xl">
                        <div className="relative">
                            <div className="p-1.5 rounded-2xl bg-primaryNew! shadow-xl">
                                <div className="bg-white rounded-xl p-1 overflow-hidden">
                                    <IndustryProfileAvatar />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-gray-100">
                                <Building2 className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                <Badge
                                    variant="info"
                                    text="Active Listing"
                                    className="py-0 px-2 text-[10px]"
                                />
                            </div>
                            <Typography
                                variant="title"
                                semibold
                                className="text-gray-900 mb-1 leading-tight"
                            >
                                {industry?.businessName}
                            </Typography>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <Mail className="w-3.5 h-3.5" />
                                    {industry?.email || 'No email provided'}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <Phone className="w-3.5 h-3.5" />
                                    {industry?.phone || 'No phone'}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <Globe className="w-3.5 h-3.5" />
                                    {industry?.website || 'No website'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="info"
                            text="Edit Profile"
                            className="flex-shrink-0"
                            Icon={Edit3}
                            onClick={onEditIndustry}
                        />
                        <Button
                            variant="info"
                            className="flex-shrink-0"
                            text="Compose Mail"
                            Icon={Send}
                            onClick={() => setIsComposeMail(true)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Row 1: Identity & Primary Contact */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Identity Overview */}
                    <Card className="lg:col-span-8 p-6 border-none shadow-sm overflow-hidden flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <Typography
                                variant="label"
                                semibold
                                className="mb-6 block flex items-center gap-2 text-blue-600"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Industry Identity
                            </Typography>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <DetailItem
                                    icon={ClipboardList}
                                    label="ABN"
                                    value={industry?.abn}
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Registered On"
                                    value={
                                        industry?.createdAt &&
                                        new Date(
                                            industry.createdAt
                                        ).toLocaleDateString()
                                    }
                                />
                                <DetailItem
                                    icon={Phone}
                                    label="Industry Phone"
                                    value={industry?.phone}
                                    colorClass="text-green-500"
                                />
                                <DetailItem
                                    icon={Stethoscope}
                                    label="Workplace Type"
                                    value={industry?.workplaceType?.name}
                                />
                                <DetailItem
                                    icon={MapPin}
                                    label="Primary Address"
                                    value={industry?.address}
                                    colorClass="text-red-500"
                                />
                            </div>
                        </div>

                        {/* Sectors Sub-Section */}
                        <div className="md:w-1/3 lg:w-1/4 pt-6 md:pt-0 md:pl-8 md:border-l border-gray-50 flex flex-col">
                            <Typography
                                variant="xxs"
                                color="text-gray-400"
                                className="uppercase tracking-wider font-bold mb-4 block"
                            >
                                Eligible Sectors
                            </Typography>
                            <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
                                {industry?.sector?.length ? (
                                    industry.sector.map((sector: any) => (
                                        <motion.div
                                            key={sector?.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-xl bg-blue-50/30 border border-blue-100 flex items-center justify-between group"
                                        >
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="xxs"
                                                    bold
                                                    className="text-blue-700 leading-none mb-1 uppercase"
                                                >
                                                    {sector?.code}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    semibold
                                                    color="text-gray-700"
                                                >
                                                    {sector?.name}
                                                </Typography>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-blue-200 group-hover:text-blue-500 transition-colors" />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-4 rounded-xl border border-dashed text-center">
                                        <Typography
                                            variant="small"
                                            color="text-gray-400 italic"
                                        >
                                            None
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Primary Contact Card */}
                    <Card className="lg:col-span-4 p-6 border-none shadow-sm relative overflow-hidden bg-primaryNew! flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <Typography
                            variant="label"
                            semibold
                            className="text-white mb-8 block relative z-10 flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Primary Contact
                        </Typography>

                        <div className="space-y-5 relative z-10">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                                <div className="p-2.5 rounded-xl bg-white/20">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <Typography
                                        variant="xxs"
                                        className="text-blue-100/70 font-bold uppercase tracking-tight"
                                    >
                                        Full Name
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="text-white font-semibold"
                                    >
                                        {industry?.contactPerson || '---'}
                                    </Typography>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                                <div className="p-2.5 rounded-xl bg-white/20">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <Typography
                                        variant="xxs"
                                        className="text-blue-100/70 font-bold uppercase tracking-tight"
                                    >
                                        Contact Phone
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="text-white font-semibold"
                                    >
                                        {industry?.contactPersonPhone || '---'}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Row 2: Feed & Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Feed Column */}
                    <div className="lg:col-span-8">
                        <Card
                            noPadding
                            className="border-none shadow-sm overflow-hidden flex flex-col min-h-[650px]"
                        >
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Typography variant="label" semibold>
                                            Interaction Feed
                                        </Typography>
                                        <Typography
                                            variant="xxs"
                                            color="text-gray-400"
                                        >
                                            Chronological communication history
                                        </Typography>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <Typography
                                        variant="xxs"
                                        semibold
                                        className="text-green-600 font-bold"
                                    >
                                        READY
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-[#fafafa] p-6 custom-scrollbar">
                                <ListingIndustryAllCommunications />
                            </div>
                        </Card>
                    </div>

                    {/* Notes Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-6 border-none shadow-sm bg-gray-900 min-h-[400px]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                                        <ClipboardList className="w-4 h-4" />
                                    </div>
                                    <Typography
                                        variant="label"
                                        semibold
                                        className="text-white"
                                    >
                                        Internal Notes
                                    </Typography>
                                </div>
                                <Badge
                                    variant="warning"
                                    text="SECURE"
                                    className="text-[9px] bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                                />
                            </div>
                            <div className="rounded-xl overflow-hidden">
                                <IndustryListingNotes />
                            </div>
                        </Card>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white shadow-sm text-blue-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    bold
                                    color="text-gray-900"
                                >
                                    System Verified
                                </Typography>
                                <Typography variant="xxs" color="text-gray-500">
                                    Industry profile and communications are up
                                    to date.
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Compose Mail Tray */}
            <AnimatePresence>
                {isComposeMail && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: '20%', opacity: 0, scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed bottom-4 right-4 z-[333] w-full max-w-lg"
                    >
                        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 overflow-hidden">
                            <ComposeListingIndustryMail
                                industry={industry}
                                onCancelComposeMail={onCancelComposeMail}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

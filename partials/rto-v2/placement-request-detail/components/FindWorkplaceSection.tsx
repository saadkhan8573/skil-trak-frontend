import { Badge, Button, Card, Typography } from '@components'
import { Select } from '@components/inputs/Select'
import { TextInput } from '@components/inputs/TextInput'
import { GlobalModal } from '@components/Modal/GlobalModal'
import { ScrollArea } from '@components/ui/scroll-area'
import { OnViewMapTabs } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail'
import { AnimatePresence, motion } from 'framer-motion'
import moment from 'moment'
import {
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    History,
    Lock,
    MapPin,
    Users,
    XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface IndustryItem {
    id: string
    name: string
    address: string
    distance: string
    avatar: string
    signedUp: boolean
    contacted: boolean
    noResponse: boolean
    emailSent: boolean
}

interface ContactHistory {
    id: string
    industryId: string
    industryName: string
    type: 'contacted' | 'no-response'
    contactPerson: string
    timestamp: string
}

interface FindWorkplaceSectionProps {
    isExpanded: boolean
    onToggle: () => void
    workplace: any
}

// Generate 25 industries for each list
const generateIndustries = (
    startId: number,
    signedUp: boolean
): IndustryItem[] => {
    const names = [
        'Apollo Care Services',
        'MercyCare Community',
        'Focused Care',
        "St Vincent's Hospital",
        'Community Care Plus',
        'HealthFirst Medical',
        'CareLink Services',
        'Sunrise Aged Care',
        'BlueSky Healthcare',
        'Unity Health Group',
        'Comfort Care Home',
        'Premier Medical',
        'Vitality Health Services',
        'Guardian Care',
        'Wholesome Living Care',
        'Harmony Health',
        'Bright Future Care',
        'Essential Health Partners',
        'Wellness Medical Center',
        'TrueNorth Care',
        'Compassion First',
        'LifeCare Medical',
        'Horizon Health Services',
        'Peaceful Days Care',
        'Hope & Healing Center',
    ]

    const addresses = [
        'Shop 5/75 Honeywell Boulevard',
        '4 Brewer Pl, Mirrabooka',
        '7B/2 Mulgul Rd, Malaga',
        '41 Victoria Parade, Fitzroy',
        '123 Main Street, Carlton',
        '89 Collins St, Melbourne',
        '56 Chapel St, Windsor',
        '234 Burke Rd, Glen Iris',
        '67 High St, Northcote',
        '45 Station St, Fairfield',
        '78 Bridge Rd, Richmond',
        '90 Sydney Rd, Brunswick',
        '123 Lygon St, Carlton',
        '56 Smith St, Collingwood',
        '34 Glenferrie Rd, Hawthorn',
        '78 Toorak Rd, South Yarra',
        '23 Acland St, St Kilda',
        '67 Carlisle St, Balaclava',
        '89 Greville St, Prahran',
        '12 Brunswick St, Fitzroy',
        '45 Johnston St, Abbotsford',
        '67 Victoria St, Richmond',
        '23 Nicholson St, Carlton',
        '89 Errol St, North Melbourne',
        '34 Hardware St, Melbourne',
    ]

    const distances = [
        '555m',
        '2.2km',
        '3.06km',
        '8.5km',
        '5.2km',
        '1.8km',
        '4.3km',
        '6.7km',
        '3.5km',
        '7.1km',
        '2.9km',
        '5.8km',
        '4.6km',
        '3.2km',
        '6.3km',
        '7.9km',
        '2.5km',
        '5.1km',
        '8.2km',
        '4.8km',
        '6.5km',
        '3.8km',
        '7.4km',
        '5.6km',
        '9.1km',
    ]

    return Array.from({ length: 25 }, (_, i) => ({
        id: `${startId + i}`,
        name: names[i],
        address: addresses[i],
        distance: distances[i] + ' away',
        avatar: names[i][0],
        signedUp,
        contacted: false,
        noResponse: false,
        emailSent: false,
    }))
}

const signedUpIndustriesData = generateIndustries(1, true)
const futureIndustriesData = generateIndustries(100, false)

export function FindWorkplaceSection({
    isExpanded,
    onToggle,
    workplace,
}: FindWorkplaceSectionProps) {
    const [selectedBox, setSelectedBox] = useState(null)
    const [mainTab, setMainTab] = useState('industries')
    const [industriesSubTab, setIndustriesSubTab] = useState('future')
    const [recordsPerPage, setRecordsPerPage] = useState('5')
    const [currentPage, setCurrentPage] = useState(1)

    // Track contacted/no response status for each list
    const [signedUpIndustries, setSignedUpIndustries] = useState(
        signedUpIndustriesData
    )
    const [futureIndustries, setFutureIndustries] =
        useState(futureIndustriesData)

    // Contact history tracking
    const [contactHistory, setContactHistory] = useState<ContactHistory[]>([])
    const [showContactDialog, setShowContactDialog] = useState(false)
    const [currentContactAction, setCurrentContactAction] = useState<
        'contacted' | 'no-response' | null
    >(null)
    const [currentIndustryForContact, setCurrentIndustryForContact] =
        useState<IndustryItem | null>(null)
    const [contactPersonName, setContactPersonName] = useState('')

    const currentIndustries =
        industriesSubTab === 'future' ? futureIndustries : signedUpIndustries
    const setCurrentIndustries =
        industriesSubTab === 'future'
            ? setFutureIndustries
            : setSignedUpIndustries

    // Calculate how many industries should be unlocked (visible without blur)
    const unlockedCount = useMemo(() => {
        const processedCount = currentIndustries.filter(
            (ind) => ind.contacted || ind.noResponse
        ).length

        // Start with 5 unlocked, then unlock 5 more for every 5 processed
        const baseUnlocked = 5
        const additionalBatches = Math.floor(processedCount / 5)
        return Math.min(baseUnlocked + additionalBatches * 5, 25)
    }, [currentIndustries])

    const openContactDialog = (
        industry: IndustryItem,
        action: 'contacted' | 'no-response'
    ) => {
        setCurrentIndustryForContact(industry)
        setCurrentContactAction(action)
        setContactPersonName('')
        setShowContactDialog(true)
    }

    const handleContactSubmit = () => {
        if (!contactPersonName.trim()) {
            // Please enter a contact person name
            return
        }

        if (!currentIndustryForContact || !currentContactAction) return

        const now = moment()
        const timestamp = now.format('ddd, D MMM YYYY, h:mm a')

        // Add to contact history
        const newHistoryEntry: ContactHistory = {
            id: `contact-${Date.now()}`,
            industryId: currentIndustryForContact.id,
            industryName: currentIndustryForContact.name,
            type: currentContactAction,
            contactPerson: contactPersonName,
            timestamp,
        }

        setContactHistory((prev) => [newHistoryEntry, ...prev])

        // Update industry status
        setCurrentIndustries((prev) =>
            prev.map((ind) => {
                if (ind.id === currentIndustryForContact.id) {
                    if (currentContactAction === 'contacted') {
                        return { ...ind, contacted: true, emailSent: true }
                    } else {
                        return { ...ind, noResponse: true }
                    }
                }
                return ind
            })
        )

        // Successfully logged contact

        setShowContactDialog(false)
        setContactPersonName('')
    }

    const handleContactToggle = (id: string) => {
        const industry = currentIndustries.find((ind) => ind.id === id)
        if (!industry) return

        if (industry.contacted) {
            // Toggle off
            setCurrentIndustries((prev) =>
                prev.map((ind) =>
                    ind.id === id
                        ? { ...ind, contacted: false, emailSent: false }
                        : ind
                )
            )
        } else {
            // Open dialog to log contact
            openContactDialog(industry, 'contacted')
        }
    }

    const handleNoResponseToggle = (id: string) => {
        const industry = currentIndustries.find((ind) => ind.id === id)
        if (!industry) return

        if (industry.noResponse) {
            // Toggle off
            setCurrentIndustries((prev) =>
                prev.map((ind) =>
                    ind.id === id ? { ...ind, noResponse: false } : ind
                )
            )
        } else {
            // Open dialog to log no response
            openContactDialog(industry, 'no-response')
        }
    }

    const totalRecords = currentIndustries.length
    const startIndex = (currentPage - 1) * parseInt(recordsPerPage)
    const endIndex = startIndex + parseInt(recordsPerPage)
    const paginatedIndustries = currentIndustries.slice(startIndex, endIndex)

    return (
        <div className="space-y-4">
            {/* Toggle Button */}
            <button
                className="w-full border-2 border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5 hover:border-[#044866]/40 h-11 justify-between rounded-md flex items-center px-4"
                onClick={onToggle}
            >
                <span className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find Workplace Manually
                </span>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <Card
                            noPadding
                            className="border-2 border-[#044866]/20 shadow-lg overflow-hidden"
                        >
                            <OnViewMapTabs
                                workplaceId={workplace?.id}
                                selectedBox={selectedBox}
                                workplace={workplace}
                                setSelectedBox={setSelectedBox}
                            />
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact Dialog */}
            {showContactDialog && (
                <GlobalModal
                    onCancel={() => setShowContactDialog(false)}
                    className="max-w-[500px]"
                >
                    <div className="p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-[#044866] mb-2">
                                {currentContactAction === 'contacted' ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                <Typography variant="h3">
                                    Log Contact Attempt
                                </Typography>
                            </div>
                            <Typography
                                variant="small"
                                className="text-slate-600"
                            >
                                {currentContactAction === 'contacted'
                                    ? 'Record who you spoke with at this industry'
                                    : 'Record the attempted contact with no response'}
                            </Typography>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Typography
                                    variant="label"
                                    className="text-slate-700"
                                >
                                    Industry
                                </Typography>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <Typography
                                        variant="body"
                                        className="font-medium text-slate-900"
                                    >
                                        {currentIndustryForContact?.name}
                                    </Typography>
                                    <Typography
                                        variant="xs"
                                        className="text-slate-600 mt-0.5"
                                    >
                                        {currentIndustryForContact?.address}
                                    </Typography>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <TextInput
                                    name="contact-person"
                                    label="Contact Person Name"
                                    required
                                    value={contactPersonName}
                                    onChange={(e: any) =>
                                        setContactPersonName(e.target.value)
                                    }
                                    placeholder="e.g., John Smith, Sarah Johnson"
                                />
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <Typography
                                    variant="xs"
                                    className="text-blue-800"
                                >
                                    <strong>Note:</strong> You can log multiple
                                    contact attempts for the same industry. Each
                                    attempt will be recorded in the contact
                                    history.
                                </Typography>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-2 justify-end mt-6">
                            <Button
                                variant="secondary"
                                outline
                                text="Cancel"
                                onClick={() => setShowContactDialog(false)}
                            />
                            <Button
                                variant={
                                    currentContactAction === 'contacted'
                                        ? 'success'
                                        : 'error'
                                }
                                text={
                                    currentContactAction === 'contacted'
                                        ? 'Log Contact'
                                        : 'Log No Response'
                                }
                                Icon={
                                    currentContactAction === 'contacted'
                                        ? CheckCircle2
                                        : XCircle
                                }
                                onClick={handleContactSubmit}
                            />
                        </div>
                    </div>
                </GlobalModal>
            )}
        </div>
    )
}

function ProgressInfo({
    unlockedCount,
    totalCount,
    currentIndustries,
}: {
    unlockedCount: number
    totalCount: number
    currentIndustries: IndustryItem[]
}) {
    const processedCount = currentIndustries.filter(
        (ind) => ind.contacted || ind.noResponse
    ).length
    const contactedCount = currentIndustries.filter(
        (ind) => ind.contacted
    ).length
    const noResponseCount = currentIndustries.filter(
        (ind) => ind.noResponse
    ).length

    return (
        <div className="mb-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-[#044866]/20">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#044866]" />
                    <span className="text-sm font-semibold text-[#044866]">
                        {unlockedCount} of {totalCount} industries unlocked
                    </span>
                </div>
                <Badge
                    text={`${processedCount} processed`}
                    variant="primaryNew"
                />
            </div>

            <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span className="text-slate-700">
                        <span className="font-semibold text-emerald-700">
                            {contactedCount}
                        </span>{' '}
                        contacted
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span className="text-slate-700">
                        <span className="font-semibold text-red-700">
                            {noResponseCount}
                        </span>{' '}
                        no response
                    </span>
                </div>
            </div>

            <p className="text-xs text-[#0D5468] mt-2">
                Complete 5 industries to unlock the next batch
            </p>
        </div>
    )
}

function IndustryList({
    industries,
    unlockedCount,
    startIndex,
    onContactToggle,
    onNoResponseToggle,
    contactHistory,
}: {
    industries: IndustryItem[]
    unlockedCount: number
    startIndex: number
    onContactToggle: (id: string) => void
    onNoResponseToggle: (id: string) => void
    contactHistory: ContactHistory[]
}) {
    return (
        <ScrollArea className="h-[500px] pr-2 mb-4">
            <div className="grid gap-3">
                {industries.map((industry, index) => {
                    const absoluteIndex = startIndex + index
                    const isLocked = absoluteIndex >= unlockedCount
                    const isProcessed =
                        industry.contacted || industry.noResponse
                    const contactCount = contactHistory.filter(
                        (c) => c.industryId === industry.id
                    ).length

                    return (
                        <motion.div
                            key={industry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                        >
                            <div
                                className={`flex items-center gap-3 p-4 bg-white border-2 rounded-lg transition-all ${
                                    isLocked
                                        ? 'border-slate-200 opacity-40 blur-sm pointer-events-none'
                                        : isProcessed
                                          ? 'border-emerald-300 bg-emerald-50/50 shadow-sm'
                                          : 'border-slate-200 hover:shadow-md hover:border-[#044866]/40 cursor-pointer'
                                } group`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm ${
                                        isProcessed
                                            ? 'bg-linear-to-br from-emerald-600 to-emerald-700'
                                            : 'bg-linear-to-br from-[#044866] to-[#0D5468] group-hover:scale-105'
                                    } transition-transform`}
                                >
                                    <span className="text-lg font-bold">
                                        {industry.avatar}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <h4 className="font-semibold text-slate-900">
                                            {industry.name}
                                        </h4>
                                        {!industry.signedUp && (
                                            <Badge
                                                text="Not Signed Up"
                                                variant="info"
                                                size="xs"
                                            />
                                        )}
                                        {contactCount > 0 && (
                                            <Badge
                                                text={`${contactCount} ${
                                                    contactCount === 1
                                                        ? 'call'
                                                        : 'calls'
                                                }`}
                                                variant="warning"
                                                size="xs"
                                                Icon={History}
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                                        <span className="text-xs">
                                            {industry.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span className="w-4 h-2 bg-slate-200 rounded"></span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Building2 className="h-3 w-3" />
                                            <span className="w-4 h-2 bg-slate-200 rounded"></span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-amber-500" />
                                            <span className="font-semibold text-slate-700">
                                                {industry.distance}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {!isLocked && (
                                    <div className="flex flex-col gap-1.5">
                                        <Button
                                            variant="success"
                                            outline={!industry.contacted}
                                            className="h-7 text-xs min-w-[120px]"
                                            Icon={
                                                industry.contacted
                                                    ? CheckCircle2
                                                    : undefined
                                            }
                                            text={
                                                industry.contacted
                                                    ? 'Contacted'
                                                    : 'Mark Contacted'
                                            }
                                            onClick={() =>
                                                onContactToggle(industry.id)
                                            }
                                        />
                                        <Button
                                            variant="error"
                                            outline={!industry.noResponse}
                                            className="h-7 text-xs min-w-[120px]"
                                            Icon={
                                                industry.noResponse
                                                    ? XCircle
                                                    : undefined
                                            }
                                            text={
                                                industry.noResponse
                                                    ? 'No Response'
                                                    : 'No Response'
                                            }
                                            onClick={() =>
                                                onNoResponseToggle(industry.id)
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Lock Overlay */}
                            {isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-[#044866]/30 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-[#044866]" />
                                            <span className="text-xs font-semibold text-[#044866]">
                                                Locked
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}

function PaginationControls({
    currentPage,
    recordsPerPage,
    totalRecords,
    onPageChange,
    onRecordsPerPageChange,
}: {
    currentPage: number
    recordsPerPage: string
    totalRecords: number
    onPageChange: (page: number) => void
    onRecordsPerPageChange: (value: string) => void
}) {
    const totalPages = Math.ceil(totalRecords / parseInt(recordsPerPage))

    return (
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700">Show:</span>
                <div className="w-20">
                    <Select
                        name="recordsPerPage"
                        options={[
                            { label: '5', value: '5' },
                            { label: '10', value: '10' },
                            { label: '25', value: '25' },
                        ]}
                        value={recordsPerPage}
                        onChange={(value: string) =>
                            onRecordsPerPageChange(value)
                        }
                        onlyValue
                    />
                </div>
                <span className="text-xs text-slate-600">
                    Records:{' '}
                    <span className="font-semibold text-[#044866]">
                        {totalRecords}
                    </span>
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700">Page:</span>
                <Button
                    variant="secondary"
                    outline
                    mini
                    Icon={ChevronLeft}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                />
                <span className="text-xs font-semibold text-[#044866] min-w-[40px] text-center">
                    {currentPage} / {totalPages}
                </span>
                <Button
                    variant="secondary"
                    outline
                    mini
                    Icon={ChevronRight}
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                />
            </div>
        </div>
    )
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui'
import { Button } from '@components'
import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Separator } from '@components/ui/separator'
import { ScrollArea } from '@components/ui/scroll-area'
import { TextInput } from '@components/inputs'

interface AddOnService {
    conditionalMOU: string
    consultationOnline: string
    consultationFaceToFace: string
    simulationLabsHourly: string
    simulationLabsSession: string
    seminarPackage1: string
    seminarPackage2: string
    webinarPackage1: string
    webinarPackage2: string
    podcastRate: string
}

const initialAddOnServices: AddOnService = {
    conditionalMOU: '$90',
    consultationOnline: '$50–$80/hr',
    consultationFaceToFace: '$120–$150/hr',
    simulationLabsHourly: '$50–$80/hr',
    simulationLabsSession: 'Up to $500',
    seminarPackage1: '$100/hr',
    seminarPackage2: '$120–$150/hr',
    webinarPackage1: '$40–$50/hr',
    webinarPackage2: '$80–$100/hr',
    podcastRate: "Speaker's rate",
}

export const PremiumFeatureModal = () => {
    const [addOnDialogOpen, setAddOnDialogOpen] = useState(false)
    const [addOnServices, setAddOnServices] =
        useState<AddOnService>(initialAddOnServices)
    const [editingAddOnServices, setEditingAddOnServices] =
        useState<AddOnService>(initialAddOnServices)

    const updateAddOnService = (field: keyof AddOnService, value: string) => {
        setEditingAddOnServices((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSaveAddOnServices = () => {
        setAddOnServices(editingAddOnServices)
        setAddOnDialogOpen(false)
        // TODO: Implement API call to save pricing
        console.log('Saving add-on services:', editingAddOnServices)
    }

    return (
        <div className="mt-3 pt-3 border-t border-white/20">
            <Dialog open={addOnDialogOpen} onOpenChange={setAddOnDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        className="w-full py-1.5 bg-gradient-to-r from-[#F7A619] to-[#FFB84D] hover:from-[#FFB84D] hover:to-[#F7A619] text-white rounded-lg text-xs font-medium transition-all shadow-md h-auto"
                    >
                        Add-On Services Proposal
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] p-0">
                    <DialogHeader className="bg-gradient-to-r from-[#F7A619] to-[#FFB84D] p-6 rounded-t-lg">
                        <DialogTitle className="text-white text-xl">
                            Add-On Services for Industry Partnerships
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-sm mt-2">
                            Comprehensive service offerings to enhance RTO
                            partnerships and support student placements
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[calc(85vh-160px)] px-6">
                        <div className="space-y-6">
                            {/* Service 1: Conditional MOU */}
                            <div className="bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-xl p-5 border border-[#044866]/20">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-[#044866] font-semibold">
                                            1. Conditional Memorandum of
                                            Understanding (MOU) with RTOs
                                        </h3>
                                        <div className="mt-2 inline-flex items-center gap-2 bg-[#F7A619]/10 text-[#F7A619] px-3 py-1 rounded-full text-sm font-medium">
                                            Industry Contribution:{' '}
                                            {
                                                editingAddOnServices.conditionalMOU
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p>
                                        A Conditional MOU helps RTOs meet VET
                                        compliance by showing active industry
                                        partnerships.
                                    </p>
                                    <p>
                                        It confirms your workplace is suitable
                                        and open to hosting students in the
                                        future — with no obligation to take
                                        students immediately.
                                    </p>
                                    <p>
                                        SkilTrak coordinates this process on
                                        your behalf by collecting basic
                                        workplace details and photos, verifying
                                        eligibility, and preparing the MOU for
                                        signing.
                                    </p>
                                    <p>
                                        This supports RTO accreditation while
                                        recognising your business as an
                                        approved, placement-ready partner.
                                    </p>
                                    <div className="bg-white rounded-lg p-3 mt-3 border border-[#044866]/10">
                                        <p className="text-xs text-gray-600">
                                            ⏱️{' '}
                                            <span className="font-medium">
                                                Process Duration:
                                            </span>{' '}
                                            Approximately 30 minutes to complete
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Service 2: Industry Consultations */}
                            <div className="bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-xl p-5 border border-[#044866]/20">
                                <div className="mb-4">
                                    <h3 className="text-[#044866] font-semibold">
                                        2. Industry Consultations
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm text-gray-700 mb-4">
                                    <p>
                                        This helps RTOs meet government
                                        compliance requirements while
                                        recognising your workplace as part of
                                        their professional industry network.
                                    </p>
                                    <p>
                                        The process is simple and takes around
                                        30 minutes to complete.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-white rounded-lg p-4 border border-[#044866]/10">
                                        <div className="font-medium text-[#044866] mb-2">
                                            Online Consultation
                                        </div>
                                        <div className="text-[#F7A619] font-semibold text-lg">
                                            {
                                                editingAddOnServices.consultationOnline
                                            }
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-[#044866]/10">
                                        <div className="font-medium text-[#044866] mb-2">
                                            Face-to-Face Consultation
                                        </div>
                                        <div className="text-[#F7A619] font-semibold text-lg">
                                            {
                                                editingAddOnServices.consultationFaceToFace
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Service 3: Simulation Labs */}
                            <div className="bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-xl p-5 border border-[#044866]/20">
                                <div className="mb-4">
                                    <h3 className="text-[#044866] font-semibold">
                                        3. Simulation Labs
                                    </h3>
                                    <div className="mt-2 inline-flex items-center gap-2 bg-[#F7A619]/10 text-[#F7A619] px-3 py-1 rounded-full text-sm font-medium">
                                        {
                                            editingAddOnServices.simulationLabsHourly
                                        }{' '}
                                        •{' '}
                                        {
                                            editingAddOnServices.simulationLabsSession
                                        }
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p>
                                        Simulation labs allow online RTOs to
                                        give students hands-on practice in
                                        realistic industry environments.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 border border-[#044866]/10 mt-3">
                                        <h4 className="font-medium text-[#044866] mb-3">
                                            Requirements:
                                        </h4>
                                        <ul className="space-y-2 text-xs text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#F7A619] mt-0.5">
                                                    •
                                                </span>
                                                <span>
                                                    Industries must provide
                                                    photos of their simulation
                                                    lab and equipment in
                                                    advance.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#F7A619] mt-0.5">
                                                    •
                                                </span>
                                                <span>
                                                    The facility must reflect
                                                    the facility equipment and
                                                    resources required for the
                                                    relevant course tasks.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#10B981]/10 rounded-lg p-3 mt-3 border border-[#10B981]/20">
                                        <p className="text-sm text-[#10B981] font-medium">
                                            💡 Estimated Industry Earnings: Up
                                            to $500 per session, depending on
                                            duration and curriculum/training
                                            setup
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-600 italic mt-3">
                                        This service supports students in
                                        fulfilling course requirements while
                                        offering industries additional
                                        engagement and income opportunities.
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Service 4: Seminars and Webinars */}
                            <div className="bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-xl p-5 border border-[#044866]/20">
                                <h3 className="text-[#044866] font-semibold mb-4">
                                    4. Seminars and Webinars
                                </h3>

                                {/* Seminars */}
                                <div className="mb-5">
                                    <h4 className="text-[#0D5468] font-medium text-sm mb-3">
                                        A. Seminars
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-4">
                                        Industries can deliver seminars at RTO
                                        campuses, sharing professional insights
                                        and practical knowledge with students.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-4 border border-[#044866]/10">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-[#044866] mb-1">
                                                        Package 1
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-2">
                                                        Speaker delivers a talk
                                                        session (Minimum 1 hour)
                                                    </p>
                                                    <div className="text-[#F7A619] font-semibold">
                                                        {
                                                            editingAddOnServices.seminarPackage1
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-2 italic">
                                                * RTO to cover fuel cost or
                                                provide transport
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-[#044866]/10">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-[#044866] mb-1">
                                                        Package 2
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-2">
                                                        Speaker prepares slides
                                                        and delivers a full
                                                        seminar session (Minimum
                                                        4 hours)
                                                    </p>
                                                    <div className="text-[#F7A619] font-semibold">
                                                        {
                                                            editingAddOnServices.seminarPackage2
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-2 italic">
                                                * RTO to cover fuel cost or
                                                provide transport
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Webinars */}
                                <div>
                                    <h4 className="text-[#0D5468] font-medium text-sm mb-3">
                                        B. Webinars
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-4">
                                        Webinars offer a virtual alternative to
                                        seminars, allowing industry experts to
                                        engage with RTOs and students remotely.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-4 border border-[#044866]/10">
                                            <div className="font-medium text-[#044866] mb-1">
                                                Package 1
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2">
                                                Live online talk/discussion
                                            </p>
                                            <div className="text-[#F7A619] font-semibold">
                                                {
                                                    editingAddOnServices.webinarPackage1
                                                }
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-[#044866]/10">
                                            <div className="font-medium text-[#044866] mb-1">
                                                Package 2
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2">
                                                Online session with slides and
                                                structured delivery
                                            </p>
                                            <div className="text-[#F7A619] font-semibold">
                                                {
                                                    editingAddOnServices.webinarPackage2
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Service 5: Podcast Collaboration */}
                            <div className="bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-xl p-5 border border-[#044866]/20">
                                <div className="mb-4">
                                    <h3 className="text-[#044866] font-semibold">
                                        5. Podcast Collaboration
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm text-gray-700">
                                    <p>
                                        The Industry Podcast Series provides
                                        another way for speakers and industry
                                        representatives to participate in
                                        recorded discussions related to their
                                        field and RTO courses.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 border border-[#044866]/10 mt-3">
                                        <div className="font-medium text-[#044866] mb-2">
                                            Flexible Pricing
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            The speaker's fee for this service
                                            will be determined individually,
                                            based on their proposed rate and
                                            availability.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Summary Section */}
                            <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] rounded-xl p-6">
                                <h3 className="text-white font-semibold mb-4">
                                    Summary of Add-On Services
                                </h3>
                                <div className="space-y-2.5">
                                    {[
                                        {
                                            service: 'Conditional MOU',
                                            desc: 'Conditional agreement confirming eligibility and future placement intent',
                                            price: editingAddOnServices.conditionalMOU,
                                        },
                                        {
                                            service: 'Industry Consultations',
                                            desc: 'Curriculum-based discussions (online or in-person)',
                                            price: `${editingAddOnServices.consultationOnline} / ${editingAddOnServices.consultationFaceToFace}`,
                                        },
                                        {
                                            service: 'Simulation Labs',
                                            desc: 'Industry labs for RTO practical sessions',
                                            price: `${editingAddOnServices.simulationLabsHourly} / ${editingAddOnServices.simulationLabsSession}`,
                                        },
                                        {
                                            service: 'Seminars',
                                            desc: 'On-campus professional presentations',
                                            price: `${editingAddOnServices.seminarPackage1} / ${editingAddOnServices.seminarPackage2}`,
                                        },
                                        {
                                            service: 'Webinars',
                                            desc: 'Online seminars with or without prepared content',
                                            price: `${editingAddOnServices.webinarPackage1} / ${editingAddOnServices.webinarPackage2}`,
                                        },
                                        {
                                            service: 'Podcasts',
                                            desc: 'Recorded conversations on course and industry topics',
                                            price: editingAddOnServices.podcastRate,
                                        },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 bg-white/10 rounded-lg p-3"
                                        >
                                            <CheckCircle className="w-4 h-4 text-[#F7A619] flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-white font-medium text-sm">
                                                        {item.service}
                                                    </span>
                                                    <span className="text-[#F7A619] font-semibold text-sm">
                                                        {item.price}
                                                    </span>
                                                </div>
                                                <p className="text-white/80 text-xs">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Edit Pricing Section */}
                            <div className="bg-white rounded-xl p-6 border-2 border-[#F7A619]/30">
                                <h3 className="text-[#044866] font-semibold text-lg mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-[#F7A619]/10 rounded-lg flex items-center justify-center">
                                        💰
                                    </span>
                                    Edit Pricing for This Industry Profile
                                </h3>

                                <div className="space-y-5">
                                    {/* Conditional MOU */}
                                    <TextInput
                                        label="1. Conditional MOU (per MOU)"
                                        id="mou-price"
                                        name="conditionalMOU"
                                        value={
                                            editingAddOnServices.conditionalMOU
                                        }
                                        onChange={(e: any) =>
                                            updateAddOnService(
                                                'conditionalMOU',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., $90"
                                    />

                                    {/* Industry Consultations */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-[#044866]">
                                            2. Industry Consultations
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                                            <TextInput
                                                label="Online Consultation"
                                                id="consult-online"
                                                name="consultationOnline"
                                                value={
                                                    editingAddOnServices.consultationOnline
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'consultationOnline',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $50–$80/hr"
                                            />
                                            <TextInput
                                                label="Face-to-Face Consultation"
                                                id="consult-f2f"
                                                name="consultationFaceToFace"
                                                value={
                                                    editingAddOnServices.consultationFaceToFace
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'consultationFaceToFace',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $120–$150/hr"
                                            />
                                        </div>
                                    </div>

                                    {/* Simulation Labs */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-[#044866]">
                                            3. Simulation Labs
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                                            <TextInput
                                                label="Hourly Rate"
                                                id="sim-hourly"
                                                name="simulationLabsHourly"
                                                value={
                                                    editingAddOnServices.simulationLabsHourly
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'simulationLabsHourly',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $50–$80/hr"
                                            />
                                            <TextInput
                                                label="Per Session"
                                                id="sim-session"
                                                name="simulationLabsSession"
                                                value={
                                                    editingAddOnServices.simulationLabsSession
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'simulationLabsSession',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Up to $500"
                                            />
                                        </div>
                                    </div>

                                    {/* Seminars */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-[#044866]">
                                            4. Seminars
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                                            <TextInput
                                                label="Package 1 (Talk session)"
                                                id="seminar-pkg1"
                                                name="seminarPackage1"
                                                value={
                                                    editingAddOnServices.seminarPackage1
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'seminarPackage1',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $100/hr"
                                            />
                                            <TextInput
                                                label="Package 2 (Full session with slides)"
                                                id="seminar-pkg2"
                                                name="seminarPackage2"
                                                value={
                                                    editingAddOnServices.seminarPackage2
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'seminarPackage2',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $120–$150/hr"
                                            />
                                        </div>
                                    </div>

                                    {/* Webinars */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-[#044866]">
                                            5. Webinars
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                                            <TextInput
                                                label="Package 1 (Live discussion)"
                                                id="webinar-pkg1"
                                                name="webinarPackage1"
                                                value={
                                                    editingAddOnServices.webinarPackage1
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'webinarPackage1',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $40–$50/hr"
                                            />
                                            <TextInput
                                                label="Package 2 (With slides)"
                                                id="webinar-pkg2"
                                                name="webinarPackage2"
                                                value={
                                                    editingAddOnServices.webinarPackage2
                                                }
                                                onChange={(e: any) =>
                                                    updateAddOnService(
                                                        'webinarPackage2',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., $80–$100/hr"
                                            />
                                        </div>
                                    </div>

                                    {/* Podcasts */}
                                    <TextInput
                                        label="6. Podcast Collaboration"
                                        id="podcast-rate"
                                        name="podcastRate"
                                        value={editingAddOnServices.podcastRate}
                                        onChange={(e: any) =>
                                            updateAddOnService(
                                                'podcastRate',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Speaker's rate or $75/hr"
                                    />
                                </div>

                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            setAddOnDialogOpen(false)
                                        }
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveAddOnServices}
                                        className="flex-1 bg-gradient-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white"
                                    >
                                        Save Add-On Pricing
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}

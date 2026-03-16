import { Button } from '@components'
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui'

export const SectorEligibilityModal = ({
    data,
    eligibilityDialogOpen,
    setEligibilityDialogOpen,
    handleAddSector,
}: any) => {
    
    return (
        <>
            {' '}
            <Dialog
                open={eligibilityDialogOpen}
                onOpenChange={setEligibilityDialogOpen}
            >
                <DialogContent className="max-w-360 max-h-[75vh] bg-white">
                    <DialogHeader className="pb-4 border-b bg-linear-to-r from-primary/5 to-accent/5 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
                        <DialogTitle className="flex items-center gap-3 text-2xl text-primary">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            Expand Your Student Placement Opportunities
                        </DialogTitle>
                        <DialogDescription className="text-sm pt-2 pl-13">
                            Select additional sectors your workplace can
                            supervise to maximize placement opportunities
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[calc(75vh-180px)] py-5 bg-white">
                        <div className="space-y-5">
                            <div className="bg-linear-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-900 text-sm mb-1">
                                            Pro Tip
                                        </h4>
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            Many workplaces qualify for multiple
                                            sectors. Adding them now increases
                                            your visibility to students and
                                            maximizes placement opportunities.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Disability Sector Question */}
                                {!data.sectors.some(
                                    (s: any) => s.name === 'Disability'
                                ) && (
                                    <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all bg-white group">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                                <span className="text-2xl">
                                                    ♿
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold mb-1.5 text-gray-900">
                                                    Disability Services
                                                </h5>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    Complex/high-support needs
                                                    with behaviour plans?
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-800 mb-2">
                                                Available Courses:
                                            </p>
                                            <ul className="text-xs text-gray-700 space-y-1.5">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Certificate III in
                                                        Disability
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Certificate IV in
                                                        Disability
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <Button
                                            onClick={() =>
                                                handleAddSector('Disability')
                                            }
                                            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Add Disability Sector
                                        </Button>
                                    </div>
                                )}

                                {/* Mental Health Sector Question */}
                                {!data.sectors.some(
                                    (s: any) => s.name === 'Mental Health'
                                ) && (
                                    <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all bg-white group">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                                <span className="text-2xl">
                                                    🧠
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold mb-1.5 text-gray-900">
                                                    Mental Health Services
                                                </h5>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    Recovery-oriented mental
                                                    health support?
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-gray-50 to-purple-50 rounded-lg p-4 mb-4 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-800 mb-2">
                                                Available Courses:
                                            </p>
                                            <ul className="text-xs text-gray-700 space-y-1.5">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Certificate IV in Mental
                                                        Health
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <Button
                                            onClick={() =>
                                                handleAddSector('Mental Health')
                                            }
                                            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Add Mental Health Sector
                                        </Button>
                                    </div>
                                )}

                                {/* Health Care Sector Question */}
                                {!data.sectors.some(
                                    (s: any) => s.name === 'Health Care'
                                ) && (
                                    <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all bg-white group">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                                <span className="text-2xl">
                                                    ⚕️
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold mb-1.5 text-gray-900">
                                                    Health Care / Aged Care
                                                </h5>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    Health care, aged care, or
                                                    nursing services?
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-gray-50 to-orange-50 rounded-lg p-4 mb-4 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-800 mb-2">
                                                Available Courses:
                                            </p>
                                            <ul className="text-xs text-gray-700 space-y-1.5">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Certificate IV in Ageing
                                                        Support
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Other health care
                                                        qualifications
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <Button
                                            onClick={() =>
                                                handleAddSector('Health Care')
                                            }
                                            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Add Health Care Sector
                                        </Button>
                                    </div>
                                )}

                                {/* Individual Support Sector Question */}
                                {!data.sectors.some(
                                    (s: any) => s.name === 'Individual Support'
                                ) && (
                                    <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all bg-white group">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                                                <span className="text-2xl">
                                                    🤝
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold mb-1.5 text-gray-900">
                                                    Individual Support
                                                </h5>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    Individual support across
                                                    ageing/disability/home care?
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-linear-to-br from-gray-50 to-green-50 rounded-lg p-4 mb-4 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-800 mb-2">
                                                Available Courses:
                                            </p>
                                            <ul className="text-xs text-gray-700 space-y-1.5">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Cert III Individual
                                                        Support (Ageing)
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">
                                                        ✓
                                                    </span>
                                                    <span>
                                                        Cert III Individual
                                                        Support (Disability)
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <Button
                                            onClick={() =>
                                                handleAddSector(
                                                    'Individual Support'
                                                )
                                            }
                                            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Add Individual Support Sector
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-linear-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-yellow-900 text-sm mb-1">
                                            Note
                                        </h4>
                                        <p className="text-xs text-yellow-800 leading-relaxed">
                                            You can add more sectors anytime.
                                            Skip for now if unsure.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                    {data.sectors.length}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-gray-700">
                                {data.sectors.length} sector
                                {data.sectors.length !== 1 ? 's' : ''}{' '}
                                configured
                            </p>
                        </div>
                        <Button
                            onClick={() => setEligibilityDialogOpen(false)}
                            className="px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md"
                        >
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

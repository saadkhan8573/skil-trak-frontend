import { Badge, Card } from '@components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@components/ui/accordion'
import { Checkbox as UICheckbox } from '@components/ui/checkbox'
import { Progressbar } from '@partials/rto-v2/components'
import { motion } from 'framer-motion'
import {
    Award,
    Briefcase,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Clock,
    FileCheck,
    FileText,
    Info,
    Sparkles,
    User,
} from 'lucide-react'

export const EnhancedStudentPreferencesChecklistCard = ({
    verifiedPreferences,
    studentPreferences,
    togglePreferenceVerification,
    recentlyVerified,
}: any) => {
    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0D5468] to-[#044866] px-5 py-4">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                        <Briefcase className="h-5 w-5" />
                        <div>
                            <h3 className="font-semibold">
                                Student Workplace Preferences
                            </h3>
                            {/* <p className="text-white/80 text-xs mt-0.5">
                                Track preference matching progress
                            </p> */}
                            <h3 className="font-semibold">Coming Soon...!</h3>
                        </div>
                    </div>
                    {/* <div className="text-right">
                        <div className="text-2xl font-bold">
                            {verifiedPreferences.length}/20
                        </div>
                        <div className="text-xs text-white/80">Verified</div>
                    </div> */}
                </div>
                <div className="mt-3 blur-sm">
                    <Progressbar
                        value={(verifiedPreferences.length / 20) * 100}
                        className="h-2 bg-white/20"
                    />
                </div>
            </div>

            <div className="p-6 blur-sm">
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-[#044866]/20">
                        <Sparkles className="h-4 w-4 text-[#044866] shrink-0" />
                        <div className="flex-1">
                            <p className="text-[#044866] text-sm font-medium">
                                Automatic Preference Matching
                            </p>
                            <p className="text-[#0D5468] text-xs mt-0.5">
                                Preferences auto-verify as you progress through
                                the workflow stages
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-[#F7A619]/30">
                        <Info className="h-4 w-4 text-[#F7A619] shrink-0" />
                        <p className="text-amber-900 text-sm">
                            You can also manually tick/untick preferences at any
                            time
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="all" className="text-xs">
                            All ({studentPreferences.length})
                        </TabsTrigger>
                        <TabsTrigger value="verified" className="text-xs">
                            Verified ({verifiedPreferences.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="text-xs">
                            Pending ({20 - verifiedPreferences.length})
                        </TabsTrigger>
                        <TabsTrigger value="guide" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Guide
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {[
                            'Location & Accessibility',
                            'Schedule & Availability',
                            'Workplace Preferences',
                            'Learning & Development',
                            'Skills & Capabilities',
                            'Health & Wellbeing',
                            'Additional Information',
                        ].map((category) => {
                            const categoryPrefs = studentPreferences.filter(
                                (p: any) => p.category === category
                            )
                            const categoryVerified = categoryPrefs.filter(
                                (p: any) => verifiedPreferences.includes(p.id)
                            ).length

                            return (
                                <Accordion
                                    key={category}
                                    type="single"
                                    collapsible
                                >
                                    <AccordionItem
                                        value={category}
                                        className="border-slate-200"
                                    >
                                        <AccordionTrigger className="hover:no-underline py-3 hover:bg-slate-50 px-3 rounded-lg transition-colors">
                                            <div className="flex items-center justify-between w-full pr-3">
                                                <span className="text-slate-900 font-medium text-sm">
                                                    {category}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        text={`${categoryVerified}/${categoryPrefs.length}`}
                                                        className={
                                                            categoryVerified ===
                                                            categoryPrefs.length
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                : 'bg-slate-100 text-slate-700 border-slate-200'
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 pt-3">
                                                {categoryPrefs.map(
                                                    (pref: any) => {
                                                        const isVerified =
                                                            verifiedPreferences.includes(
                                                                pref.id
                                                            )
                                                        const isRecentlyVerified =
                                                            recentlyVerified.includes(
                                                                pref.id
                                                            )
                                                        return (
                                                            <motion.div
                                                                key={pref.id}
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: -10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                    scale: isRecentlyVerified
                                                                        ? [
                                                                              1,
                                                                              1.02,
                                                                              1,
                                                                          ]
                                                                        : 1,
                                                                }}
                                                                transition={{
                                                                    scale: {
                                                                        duration: 0.5,
                                                                        repeat: isRecentlyVerified
                                                                            ? 2
                                                                            : 0,
                                                                    },
                                                                }}
                                                                className={`p-4 rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden ${
                                                                    isVerified
                                                                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-sm'
                                                                        : 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                                                }`}
                                                                onClick={() =>
                                                                    togglePreferenceVerification(
                                                                        pref.id
                                                                    )
                                                                }
                                                            >
                                                                {isRecentlyVerified && (
                                                                    <motion.div
                                                                        initial={{
                                                                            opacity: 0,
                                                                        }}
                                                                        animate={{
                                                                            opacity:
                                                                                [
                                                                                    0,
                                                                                    1,
                                                                                    0,
                                                                                ],
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: 1,
                                                                        }}
                                                                        className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 pointer-events-none"
                                                                    />
                                                                )}
                                                                <div className="flex items-start gap-3 relative z-10">
                                                                    <UICheckbox
                                                                        checked={
                                                                            isVerified
                                                                        }
                                                                        className="mt-1"
                                                                        onCheckedChange={() =>
                                                                            togglePreferenceVerification(
                                                                                pref.id
                                                                            )
                                                                        }
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start gap-2 mb-2">
                                                                            <Badge
                                                                                text={`#${pref.id}`}
                                                                                className={
                                                                                    isVerified
                                                                                        ? 'bg-emerald-600 text-white border-0'
                                                                                        : 'bg-[#044866] text-white border-0'
                                                                                }
                                                                            />
                                                                            <p className="text-slate-600 text-xs font-medium flex-1">
                                                                                {
                                                                                    pref.question
                                                                                }
                                                                            </p>
                                                                            {isRecentlyVerified && (
                                                                                <motion.div
                                                                                    initial={{
                                                                                        scale: 0,
                                                                                    }}
                                                                                    animate={{
                                                                                        scale: [
                                                                                            0,
                                                                                            1.2,
                                                                                            1,
                                                                                        ],
                                                                                    }}
                                                                                    className="shrink-0"
                                                                                >
                                                                                    <Badge
                                                                                        text="NEW"
                                                                                        className="bg-[#F7A619] text-white border-0 text-[10px] px-2"
                                                                                    />
                                                                                </motion.div>
                                                                            )}
                                                                        </div>
                                                                        <p
                                                                            className={`text-sm ml-0 ${
                                                                                isVerified
                                                                                    ? 'text-emerald-900 font-medium'
                                                                                    : 'text-slate-900'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                pref.answer
                                                                            }
                                                                        </p>
                                                                        {isVerified && (
                                                                            <motion.div
                                                                                initial={{
                                                                                    opacity: 0,
                                                                                    y: -5,
                                                                                }}
                                                                                animate={{
                                                                                    opacity: 1,
                                                                                    y: 0,
                                                                                }}
                                                                                className="flex items-center gap-1.5 mt-2 text-emerald-700"
                                                                            >
                                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                                <span className="text-xs font-medium">
                                                                                    {isRecentlyVerified
                                                                                        ? 'Auto-verified'
                                                                                        : 'Verified & Matched'}
                                                                                </span>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )
                        })}
                    </TabsContent>

                    <TabsContent value="verified">
                        <div className="space-y-2">
                            {studentPreferences
                                .filter((p: any) =>
                                    verifiedPreferences.includes(p.id)
                                )
                                .map((pref: any) => (
                                    <motion.div
                                        key={pref.id}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.95,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-300 shadow-sm cursor-pointer"
                                        onClick={() =>
                                            togglePreferenceVerification(
                                                pref.id
                                            )
                                        }
                                    >
                                        <div className="flex items-start gap-3">
                                            <UICheckbox
                                                checked={true}
                                                className="mt-1"
                                                disabled
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <Badge
                                                        text={`#${pref.id}`}
                                                        className="bg-emerald-600 text-white border-0 text-xs shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-slate-600 text-xs font-medium mb-1">
                                                            {pref.question}
                                                        </p>
                                                        <Badge
                                                            text={pref.category}
                                                            className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-emerald-900 font-medium">
                                                    {pref.answer}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2 text-emerald-700">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-medium">
                                                        Verified & Matched
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            {verifiedPreferences.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">
                                        No preferences verified yet
                                    </p>
                                    <p className="text-xs mt-1">
                                        Start ticking off preferences as they
                                        are matched
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="pending">
                        <div className="space-y-2">
                            {studentPreferences
                                .filter(
                                    (p: any) =>
                                        !verifiedPreferences.includes(p.id)
                                )
                                .map((pref: any) => (
                                    <motion.div
                                        key={pref.id}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.95,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() =>
                                            togglePreferenceVerification(
                                                pref.id
                                            )
                                        }
                                    >
                                        <div className="flex items-start gap-3">
                                            <UICheckbox
                                                checked={false}
                                                className="mt-1"
                                                disabled
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <Badge
                                                        text={`#${pref.id}`}
                                                        className="bg-[#044866] text-white border-0 text-xs shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-slate-600 text-xs font-medium mb-1">
                                                            {pref.question}
                                                        </p>
                                                        <Badge
                                                            text={pref.category}
                                                            className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-900">
                                                    {pref.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            {verifiedPreferences.length === 20 && (
                                <div className="text-center py-8 text-emerald-600">
                                    <Award className="h-12 w-12 mx-auto mb-3" />
                                    <p className="text-sm font-medium">
                                        All preferences verified!
                                    </p>
                                    <p className="text-xs mt-1">
                                        Perfect workplace match achieved
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="guide">
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#044866]/20 rounded-xl">
                                <div className="flex items-start gap-3 mb-3">
                                    <Sparkles className="h-5 w-5 text-[#044866] shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-[#044866] font-semibold mb-1">
                                            Auto-Verification Guide
                                        </h4>
                                        <p className="text-[#0D5468] text-sm">
                                            Preferences are automatically
                                            verified as you progress through
                                            workflow stages
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-slate-900 font-semibold text-sm">
                                                Request Generated
                                            </h5>
                                            <p className="text-slate-600 text-xs">
                                                5 preferences verified
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-700 space-y-1">
                                        <p>• Previous healthcare experience</p>
                                        <p>• Medical conditions</p>
                                        <p>
                                            • Allergies & dietary requirements
                                        </p>
                                        <p>• Cultural considerations</p>
                                        <p>• Talent pool enrollment</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg border-2 border-[#044866]/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#044866]/10 flex items-center justify-center">
                                            <Building2 className="h-4 w-4 text-[#044866]" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-[#044866] font-semibold text-sm">
                                                Waiting for Student
                                            </h5>
                                            <p className="text-[#0D5468] text-xs">
                                                3 preferences verified
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-700 space-y-1">
                                        <p>• Special interests in aged care</p>
                                        <p>• Specific learning objectives</p>
                                        <p>• Career goals post-qualification</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-slate-900 font-semibold text-sm">
                                                Waiting for RTO
                                            </h5>
                                            <p className="text-slate-600 text-xs">
                                                6 preferences verified
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-700 space-y-1">
                                        <p>• Preferred workplace location</p>
                                        <p>• Preferred commute method</p>
                                        <p>• Access to own transport</p>
                                        <p>• Regional area willingness</p>
                                        <p>• Desired workplace type</p>
                                        <p>• Preferred facility size</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg border-2 border-[#0D5468]/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#0D5468]/10 flex items-center justify-center">
                                            <CalendarCheck className="h-4 w-4 text-[#0D5468]" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-[#0D5468] font-semibold text-sm">
                                                Appointment
                                            </h5>
                                            <p className="text-[#0D5468] text-xs">
                                                4 preferences verified
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-700 space-y-1">
                                        <p>• Availability for placement</p>
                                        <p>• Preferred shift type</p>
                                        <p>• Flexibility for weekend work</p>
                                        <p>• Current employment status</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg border-2 border-emerald-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <FileCheck className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-emerald-900 font-semibold text-sm">
                                                Agreement Signed
                                            </h5>
                                            <p className="text-emerald-700 text-xs">
                                                2 preferences verified
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-700 space-y-1">
                                        <p>• Technology proficiency level</p>
                                        <p>• Language skills</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-300">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                            <Award className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-emerald-900 font-semibold text-sm">
                                                Placement Started / Completed
                                            </h5>
                                            <p className="text-emerald-700 text-xs">
                                                All 20 preferences verified
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-emerald-800">
                                        All student workplace preferences
                                        confirmed and matched with the placement
                                        facility
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Card>
    )
}

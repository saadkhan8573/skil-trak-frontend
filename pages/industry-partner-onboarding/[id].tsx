import {
    OnboardingFooter,
    OnboardingStepper,
    Step1ConfirmDetails,
    Step1Data,
    Step2SectorsCourses,
    StepsHeader,
} from '@partials'
import { CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const defaultStep1Data: Step1Data = {
    entityName: 'Community Care Solutions Pty Ltd',
    abn: '12345678901',
    website: 'https://www.communitycaresolutions.com.au',
    workplaceType: 'Residential Aged Care & NDIS Provider',
    industryBio:
        'Community Care Solutions is a leading provider of aged care and disability support services across Victoria. We specialize in person-centered care delivery with a strong focus on student mentorship and professional development. Our facilities offer diverse placement opportunities in residential aged care, home care support, and NDIS service coordination, providing students with hands-on experience in real-world community care environments.',
    primaryContactName: 'Sarah Thompson',
    primaryContactRole: 'Training Coordinator',
    primaryContactEmail: 'sarah.thompson@communitycareolutions.com.au',
    primaryContactPhone: '0412 345 678',
    streetAddress: '123 Healthcare Drive',
    suburb: 'Springvale',
    state: 'VIC',
    postcode: '3171',
    country: 'Australia',
    termsAccepted: true,
    privacyAccepted: true,
    marketingConsent: true,
}

const defaultStep2Data = {
    sectors: [
        {
            id: '1',
            name: 'Community Services',
            workplaceTypes: '',
            supervisorName: '',
            supervisorLevel: 'Cert III',
            qualificationTitle: '',
            industryChecks: [
                {
                    id: 'wwcc',
                    name: 'WWCC',
                    icon: '👶',
                    description: 'Working with Children Check',
                    required: false,
                    showToStudents: true,
                },
                {
                    id: 'police',
                    name: 'Police Check',
                    icon: '🛡️',
                    description: 'National Police Check',
                    required: false,
                    showToStudents: true,
                },
                {
                    id: 'ndis',
                    name: 'NDIS',
                    icon: '♿',
                    description: 'NDIS Worker Screening',
                    required: false,
                    showToStudents: true,
                },
                {
                    id: 'other',
                    name: 'Other',
                    icon: '📋',
                    description: 'Other industry-specific checks',
                    required: false,
                    showToStudents: true,
                },
            ],
            capacity: 1,
            capacityPeriod: 'Month',
            eligibilityChecks: {
                directSupport: false,
                supervision: false,
                equipmentResources: false,
            },
        },
    ],
    selectedCourses: [],
}

const defaultStep4Data = {
    policies: {
        whs: false,
        childSafe: false,
        privacyConfidentiality: false,
        industrySpecific: false,
        qualityManagement: false,
        emergencyProcedures: false,
    },
    onboarding: {
        inductionSteps: '',
        trainingProvided: [],
    },
    assessment: {
        assessorVisitAllowed: false,
        signOffAvailability: '',
        flexibleScheduling: false,
        feedbackSystem: '',
    },
    employment: {
        likelyToHire: 5,
        paidRolesAvailable: false,
        careerPathways: [],
        graduateProgram: false,
    },
    communications: {
        preferences: [],
        responseSLA: '',
        languagesSupported: [],
    },
    accessibility: {
        disabilityAccess: false,
        culturalSafetyNotes: '',
        genderInclusive: false,
        languageSupport: [],
    },
    premium: {
        enabled: true,
        tier: 'premium',
        signedMOU: false,
        appAccess: false,
        industryConsultation: false,
        consultationRate: 150,
        // New premium features
        volunteerRequest: true,
        autoAssignRadius: 20,
        exclusiveMOU: true,
        appTraining: true,
        rtoConsultation: true,
        rtoRate: 150,
        mouCostPerCourse: 500,
        simulationHire: true,
        webinarSeminar: true,
        brandMarketing: true,
        jobAdvertising: true,
        sponsorshipOpportunity: true,
    },
}

const steps = [
    'Confirm details',
    'Sectors & Courses',
    'Sites & Shifts',
    'Policies & Premium',
]

const IndustryPartnerOnboarding: NextPageWithLayout = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [showPremiumSetup, setShowPremiumSetup] = useState(false)
    const [showPremiumSuccess, setShowPremiumSuccess] = useState(false)

    const [step1Data, setStep1Data] = useState(defaultStep1Data)
    const [step2Data, setStep2Data] = useState(defaultStep2Data)
    const [step4Data, setStep4Data] = useState(defaultStep4Data)
    const [stepValidation, setStepValidation] = useState({
        1: true,
        2: true,
        3: true,
        4: true,
    })
    const router = useRouter()
    const id = router.query.id
    const { data, isSuccess, refetch } =
        CommonApi.FindWorkplace.useIndustryListingProfileDetails(id, {
            skip: !id,
        })
    console.log('future industry details', data)
    const handleSubmit = async () => {
        setIsLoading(true)
    }

    const handleNext = async () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        } else {
            // Check if premium tier is selected in Step 4
            if (
                step4Data.premium.enabled &&
                step4Data.premium.tier === 'premium'
            ) {
                setShowPremiumSetup(true)
            } else {
                await handleSubmit()
            }
        }
    }
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    const renderCurrentStep = () => {
        // if (showPremiumSuccess) {
        //     return (
        //         <PremiumSuccess
        //             userEmail={step1Data.primaryContactEmail}
        //             companyName={step1Data.entityName}
        //             premiumTier={step4Data.premium.tier as 'premium'}
        //             onComplete={handlePremiumSuccessComplete}
        //         />
        //     )
        // }

        // if (showPremiumSetup) {
        //     return (
        //         <PremiumSetup
        //             data={premiumSetupData}
        //             onChange={setPremiumSetupData}
        //             onComplete={handlePremiumSetupComplete}
        //         />
        //     )
        // }

        const stepComponents = {
            1: (
                <Step1ConfirmDetails
                    key="step1"
                    data={step1Data}
                    onChange={setStep1Data}
                    onValidationChange={(isValid) =>
                        handleValidationChange(1, isValid)
                    }
                />
            ),
            2: (
                <Step2SectorsCourses
                    key="step2"
                    data={step2Data}
                    onChange={setStep2Data}
                    onValidationChange={(isValid) =>
                        handleValidationChange(2, isValid)
                    }
                />
            ),
            3: (
                <>Step 3</>
                // <Step3SitesShiftsInsurance
                //     key="step3"
                //     data={step3Data}
                //     onChange={setStep3Data}
                //     onValidationChange={(isValid) =>
                //         handleValidationChange(3, isValid)
                //     }
                // />
            ),
            4: (
                <>Step 4</>
                // <Step4PoliciesPremium
                //     key="step4"
                //     data={step4Data}
                //     onChange={setStep4Data}
                //     onValidationChange={(isValid) =>
                //         handleValidationChange(4, isValid)
                //     }
                // />
            ),
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {stepComponents[currentStep as keyof typeof stepComponents]}
                </motion.div>
            </AnimatePresence>
        )
    }
    const handleValidationChange = (step: number, isValid: boolean) => {
        setStepValidation((prev) => ({
            ...prev,
            [step]: isValid,
        }))
    }
    return (
        <div>
            <StepsHeader currentStep={currentStep} totalSteps={steps.length} />
            {!showPremiumSetup && !showPremiumSuccess && (
                <OnboardingStepper currentStep={currentStep} steps={steps} />
            )}
            <main
                className={
                    showPremiumSetup || showPremiumSuccess ? 'pb-8' : 'pb-32'
                }
            >
                <div className="min-h-150">{renderCurrentStep()}</div>
            </main>

            <OnboardingFooter
                currentStep={currentStep}
                totalSteps={steps.length}
                onBack={handleBack}
                onContinue={handleNext}
                canContinue={
                    stepValidation[currentStep as keyof typeof stepValidation]
                }
                isLastStep={currentStep === steps.length}
                isLoading={isLoading}
            />
        </div>
    )
}
export default IndustryPartnerOnboarding

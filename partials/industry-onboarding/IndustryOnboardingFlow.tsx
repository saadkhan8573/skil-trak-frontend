import { LoadingAnimation, NoData, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import {
    OnboardingFooter,
    OnboardingStepper,
    Step1ConfirmDetails,
    Step1Data,
    Step2SectorsCourses,
    StepsHeader,
} from '@partials'
import { Step3SitesShiftsInsurance } from '@partials/industry-onboarding/components/step-3/Step3SiteShiftsInsurance'
import { AdminApi, IndustryApi } from '@queries'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
    id: string | number | string[] | undefined
    onSuccess?: () => void
}

const defaultStep2Data = {
    sectors: [],
    selectedTaskIds: {} as Record<string, Record<string, number[]>>,
}

const defaultTradingDay = (open: string, close: string) => ({
    open,
    close,
    breakStart: '',
    breakEnd: '',
    isEnabled: false,
})

const defaultStep3Data = {
    tradingHours: {
        Monday: defaultTradingDay('08:00', '17:00'),
        Tuesday: defaultTradingDay('08:00', '17:00'),
        Wednesday: defaultTradingDay('08:00', '17:00'),
        Thursday: defaultTradingDay('08:00', '17:00'),
        Friday: defaultTradingDay('08:00', '16:00'),
        Saturday: defaultTradingDay('09:00', '13:00'),
        Sunday: defaultTradingDay('09:00', '13:00'),
    },
    insurance: {
        selectedInsuranceIds: [] as number[],
        additionalDetails: null as string | null,
    },
}

const STEPS = ['Confirm details', 'Sectors & Courses', 'Sites & Shifts']

export function IndustryOnboardingFlow({ id, onSuccess }: Props) {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [stepValidation, setStepValidation] = useState({
        1: true,
        2: true,
        3: true,
    })

    const { notification } = useNotification()
    const router = useRouter()
    const {
        data,
        isError,
        isLoading: industryDataLoading,
    } = IndustryApi.Profile.useIndustryOnboarding(id, { skip: !id })
    const [submitOnboarding, submitOnboardingResult] =
        AdminApi.Industries.useOnBoardingSubmission()
    // API returns { id, sector: { id, name, ... } } — flatten to the inner sector object
    const uniqueSectors = useMemo(() => {
        if (!data?.sectors?.length) return []
        return data.sectors.map((entry: any) => entry?.sector ?? entry)
    }, [data?.sectors])

    // -------------------------------------------------------------------------
    // Step data state
    // -------------------------------------------------------------------------

    const [step1Data, setStep1Data] = useState<Step1Data>({
        entityName: '',
        abn: '',
        website: '',
        workplaceType: '',
        isPartner: true,
        industryBio: '',
        primaryContactName: '',
        primaryContactRole: '',
        primaryContactEmail: '',
        primaryContactPhone: '',
        streetAddress: '',
        suburb: '',
        state: '',
        postcode: '',
        country: '',
        termsAccepted: false,
        privacyAccepted: false,
        marketingConsent: false,
        sectorsIds: [],
    })

    const [step2Data, setStep2Data] = useState(defaultStep2Data)
    const [step3Data, setStep3Data] = useState(defaultStep3Data)

    // Pre-fill step 1 from API profile data
    useEffect(() => {
        if (!data) return
        setStep1Data({
            entityName: data?.user?.name ?? '',
            abn: data?.abn ?? '',
            website: data?.website ?? '',
            workplaceType: data?.workplaceType ?? '',
            isPartner: !!data?.isPartner,
            industryBio: data?.bio ?? '',
            primaryContactName: data?.contactPerson ?? '',
            primaryContactRole: '',
            primaryContactEmail: '',
            primaryContactPhone: data?.contactPersonNumber ?? '',
            streetAddress: data?.addressLine1 ?? '',
            suburb: data?.suburb ?? '',
            state: data?.region ?? data?.state ?? '',
            postcode: data?.zipCode ?? '',
            country: data?.country?.name ?? '',
            termsAccepted: true,
            privacyAccepted: true,
            marketingConsent: true,
            sectorsIds: data?.sectors?.map((s: any) => s?.sector?.id) ?? [],
        })
    }, [data])

    // Load draft from localStorage
    useEffect(() => {
        if (!id) return
        try {
            const saved2 = localStorage.getItem(`onboarding_step2_${id}`)
            if (saved2) setStep2Data(JSON.parse(saved2))

            const saved3 = localStorage.getItem(`onboarding_step3_${id}`)
            if (saved3) {
                const parsed = JSON.parse(saved3)
                if (parsed?.tradingHours && !parsed?.site && !parsed?.shifts) {
                    setStep3Data(parsed)
                } else {
                    localStorage.removeItem(`onboarding_step3_${id}`)
                }
            }
        } catch {}
    }, [id])

    // Persist drafts to localStorage
    useEffect(() => {
        if (!id) return
        try {
            localStorage.setItem(
                `onboarding_step2_${id}`,
                JSON.stringify(step2Data)
            )
        } catch {}
    }, [step2Data, id])

    useEffect(() => {
        if (!id) return
        try {
            localStorage.setItem(
                `onboarding_step3_${id}`,
                JSON.stringify(step3Data)
            )
        } catch {}
    }, [step3Data, id])

    // On successful submit
    useEffect(() => {
        if (!submitOnboardingResult.isSuccess) return
        notification.success({
            title: 'Submit for approval',
            description: 'Successfully submitted',
        })
        try {
            localStorage.removeItem(`onboarding_step2_${id}`)
            localStorage.removeItem(`onboarding_step3_${id}`)
        } catch {}
        onSuccess?.()
    }, [submitOnboardingResult.isSuccess])

    // -------------------------------------------------------------------------
    // Payload builder
    // -------------------------------------------------------------------------

    const buildPayload = () => {
        const tasksBySectorId: Record<string, any> =
            step2Data?.selectedTaskIds || {}

        const sectors = (step2Data.sectors || [])
            .filter((sector: any) => {
                // Only include sectors that have highlighted tasks selected
                const courseMap = tasksBySectorId[sector.id] || {}
                const hasTasks = Object.values(courseMap).some(
                    (taskIds: any) => taskIds?.length > 0
                )
                return hasTasks
            })
            .map((sector: any) => {
                const selectedQuestionIds = Object.entries(
                    sector.questionChecks || {}
                )
                    .filter(
                        ([qId, checked]) =>
                            checked && !qId.startsWith('static_')
                    )
                    .map(([qId]) => Number(qId))

                const industryChecks = (sector.industryChecks || [])
                    .filter((c: any) => !c.required)
                    .map((c: any) => ({ id: c.id }))

                const courseMap = tasksBySectorId[sector.id] || {}
                const courses = Object.entries(courseMap)
                    .filter(([, taskIds]: [any, any]) => taskIds?.length > 0)
                    .map(([courseId, taskIds]: [string, any]) => ({
                        id: Number(courseId),
                        taskIds: taskIds as number[],
                    }))

                const base: Record<string, any> = {
                    id: sector.id,
                    name: sector.name,
                    // isClusterSector: !!sector.isClusterSector,
                    supervisorName: sector.supervisorName ?? '',
                    position: sector.position ?? '',
                    email: sector.email ?? '',
                    phone: sector.phone ?? '',
                    supervisorLevel: sector.supervisorLevel ?? null,
                    experience: sector.experience ?? null,
                    title: sector.title ?? '',
                    capacity: sector.capacity ?? null,
                    capacityPeriod: sector.capacityPeriod ?? null,
                    confirmed: !!sector.confirmed,
                    industryChecks,
                    selectedQuestionIds,
                    courses,
                }

                if (sector.customCheck?.enabled)
                    base.customCheck = sector.customCheck
                return base
            })

        return {
            entityName: step1Data.entityName,
            abn: step1Data.abn,
            website: step1Data.website ?? null,
            industryBio: step1Data.industryBio ?? null,
            workplaceType:
                typeof step1Data.workplaceType === 'object'
                    ? (step1Data.workplaceType?.id ??
                      step1Data.workplaceType?.name ??
                      null)
                    : step1Data.workplaceType || null,
            isPartner: step1Data.isPartner,
            primaryContactName: step1Data.primaryContactName,
            primaryContactRole: step1Data.primaryContactRole ?? null,
            primaryContactEmail: step1Data.primaryContactEmail ?? null,
            primaryContactPhone: step1Data.primaryContactPhone,
            streetAddress: step1Data.streetAddress,
            suburb: step1Data.suburb,
            stateId:
                typeof step1Data.state === 'object'
                    ? (step1Data.state?.id ?? step1Data.state?.value ?? null)
                    : step1Data.state || null,
            postcode: step1Data.postcode,
            country: step1Data.country ?? null,
            termsAccepted: step1Data.termsAccepted,
            privacyAccepted: step1Data.privacyAccepted,
            marketingConsent: step1Data.marketingConsent,
            sectors,
            tradingHours: Object.fromEntries(
                Object.entries(step3Data.tradingHours).map(([day, hours]) => [
                    day.toLowerCase(),
                    hours,
                ])
            ),
            insurance: {
                selectedInsuranceIds:
                    step3Data.insurance?.selectedInsuranceIds ?? [],
                // additionalDetails:
                //     step3Data.insurance?.additionalDetails ?? null,
            },
        }
    }
    // -------------------------------------------------------------------------
    // Navigation
    // -------------------------------------------------------------------------

    const handleValidationChange = (step: number, isValid: boolean) => {
        setStepValidation((prev) => ({ ...prev, [step]: isValid }))
    }
    console.log('const router = useRouter()', router.pathname)
    const getPortalRole = (path: string) => {
        const segments = path.split('/').filter(Boolean)
        return segments[1] // because [0] = portals, [1] = sub-admin/admin
    }
    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const body = buildPayload()
            // console.log(
            //     '[Onboarding] submit payload::::::',
            //     JSON.stringify(body, null, 2)
            // )
            const role = getPortalRole(router.pathname)

            if (role === 'admin') {
                router.push(
                    '/portals/admin/future-industries?tab=all&page=1&pageSize=50'
                )
            } else if (role === 'sub-admin') {
                router.push(
                    '/portals/sub-admin/tasks/industry-listing?tab=all&page=1&pageSize=50'
                )
            } else if (role === 'student') {
                localStorage.removeItem('industryOnboarding')
                router.push(
                    '/portals/student/workplace/my-workplace/have-workplace'
                )
            }
            await submitOnboarding({ id, body })

            //
        } finally {
            setIsLoading(false)
        }
    }

    const handleNext = async () => {
        if (currentStep < STEPS.length) {
            setCurrentStep((s) => s + 1)
        } else {
            await handleSubmit()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1)
    }

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    const stepComponents: Record<number, React.ReactNode> = {
        1: (
            <Step1ConfirmDetails
                key="step1"
                data={step1Data}
                onChange={setStep1Data}
                onValidationChange={(v) => handleValidationChange(1, v)}
            />
        ),
        2: (
            <Step2SectorsCourses
                key="step2"
                data={step2Data}
                onChange={setStep2Data}
                onValidationChange={(v) => handleValidationChange(2, v)}
                uniqueSectors={uniqueSectors}
                {...(data?.courses ? { course: data.courses } : {})}
            />
        ),
        3: (
            <Step3SitesShiftsInsurance
                key="step3"
                id={id}
                data={step3Data}
                onChange={setStep3Data}
                onValidationChange={(v) => handleValidationChange(3, v)}
            />
        ),
    }

    return (
        <>
            <ShowErrorNotifications result={submitOnboardingResult} />
            <StepsHeader currentStep={currentStep} totalSteps={STEPS.length} />
            <OnboardingStepper currentStep={currentStep} steps={STEPS} />

            <main className="pb-32">
                {isError && <NoData isError />}
                {industryDataLoading ? (
                    <LoadingAnimation />
                ) : data && Object.keys(data).length > 0 ? (
                    <div className="min-h-150">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                }}
                            >
                                {stepComponents[currentStep]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    !isError && <NoData text="No data found" />
                )}
            </main>

            <OnboardingFooter
                currentStep={currentStep}
                totalSteps={STEPS.length}
                onBack={handleBack}
                onContinue={handleNext}
                canContinue={
                    stepValidation[currentStep as keyof typeof stepValidation]
                }
                isLastStep={currentStep === STEPS.length}
                isLoading={isLoading}
            />
        </>
    )
}

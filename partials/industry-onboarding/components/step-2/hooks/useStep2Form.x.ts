import { createContext, useContext } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { industryChecks } from '../mockData'
import { EligibilityChecks, Sector } from '../types/sectorsAndCourses'

// ============================================================
// Types
// ============================================================

export interface Step2FormData {
    sectors: Sector[]
}

export interface SectorSubmitPayload {
    sectors: {
        name: string
        supervisor: {
            name: string
            qualificationLevel: string
            qualificationTitle: string
        }
        capacity: {
            count: number
            period: string
        }
        eligibilityChecks: EligibilityChecks
        requiredIndustryChecks: { id: string; name: string }[]
        coursePrerequisites: Record<string, EligibilityChecks>
    }[]
}

export interface SectorFormContextValue {
    fields: (Sector & { _rhfId: string })[]
    update: (index: number, data: Sector) => void
    remove: (index: number | number[]) => void
    getValues: () => Step2FormData
    addSector: (name: string) => void
    getSubmitPayload: () => SectorSubmitPayload
}

// ============================================================
// Context
// ============================================================

const SectorFormContext = createContext<SectorFormContextValue | null>(null)

export const useSectorFormContext = (): SectorFormContextValue => {
    const ctx = useContext(SectorFormContext)
    if (!ctx)
        throw new Error(
            'useSectorFormContext must be used within a SectorFormContext.Provider'
        )
    return ctx
}

export { SectorFormContext }

// ============================================================
// Hook
// ============================================================

export const useStep2Form = (initialSectors: Sector[]) => {
    const form = useForm<Step2FormData>({
        defaultValues: { sectors: initialSectors },
        mode: 'onChange',
    })

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: 'sectors',
        keyName: '_rhfId' as any,
    })

    const addSector = (sectorName: string) => {
        const currentSectors = form.getValues('sectors')
        const inheritedEligibilityChecks: EligibilityChecks =
            currentSectors.length > 0
                ? currentSectors[0].eligibilityChecks
                : {
                      directSupport: false,
                      supervision: false,
                      equipmentResources: false,
                  }

        append({
            id: Date.now().toString(),
            name: sectorName,
            workplaceTypes: '',
            supervisorName: '',
            supervisorLevel: '',
            qualificationTitle: '',
            industryChecks: industryChecks.map((c) => ({
                id: c.id,
                name: c.name,
                icon: c.icon,
                description: c.description,
                required: false,
                showToStudents: true,
            })),
            capacity: 1,
            capacityPeriod: 'monthly',
            eligibilityChecks: inheritedEligibilityChecks,
        } as Sector)
    }

    const getSubmitPayload = (): SectorSubmitPayload => {
        const { sectors } = form.getValues()
        return {
            sectors: sectors.map((sector) => ({
                name: sector.name,
                supervisor: {
                    name: sector.supervisorName,
                    qualificationLevel: sector.supervisorLevel,
                    qualificationTitle: sector.qualificationTitle,
                },
                capacity: {
                    count: sector.capacity,
                    period: sector.capacityPeriod,
                },
                eligibilityChecks: sector.eligibilityChecks,
                requiredIndustryChecks: sector.industryChecks
                    .filter((c) => c.required)
                    .map((c) => ({ id: c.id, name: c.name })),
                coursePrerequisites: sector.coursePrerequisites ?? {},
            })),
        }
    }

    const contextValue: SectorFormContextValue = {
        fields: fields as unknown as (Sector & { _rhfId: string })[],
        update: update as (index: number, data: Sector) => void,
        remove,
        getValues: form.getValues as () => Step2FormData,
        addSector,
        getSubmitPayload,
    }

    return {
        form,
        contextValue,
        addSector,
        getSubmitPayload,
    }
}

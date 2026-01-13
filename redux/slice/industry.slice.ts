import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Industry, IndustryCourseApproval, IndustryCourseApprovals, Supervisor } from '@types'

type initialStateType = {
    industryDetail: Industry | null
    activeSector: number | null
    industrySupervisors: {
        [sectorId: number]: Supervisor[]
    } | null
    industrySectorCapacity: any[] | null
    navigationTarget: {
        tab?: string
        section?: string
    } | null
    pendingCourses: any[] | null
    deletedCourses: IndustryCourseApproval[] | null
}

const initialState: initialStateType = {
    industryDetail: null,
    activeSector: null,
    industrySupervisors: null,
    industrySectorCapacity: null,
    navigationTarget: null,
    pendingCourses: null,
    deletedCourses: null,
}

export const industrySlice = createSlice({
    name: 'industry-slice',
    initialState,
    reducers: {
        setIndustryDetail: (state, action: PayloadAction<Industry>) => {
            state.industryDetail = action.payload
        },
        setActiveSector: (state, action: PayloadAction<number | null>) => {
            state.activeSector = action.payload
        },
        setIndustrySupervisors: (
            state,
            action: PayloadAction<{
                [sectorId: number]: Supervisor[]
            }>
        ) => {
            state.industrySupervisors = {
                ...state.industrySupervisors,
                ...action.payload,
            }
        },
        setIndustrySectorCapacity: (state, action: PayloadAction<any[]>) => {
            state.industrySectorCapacity = action.payload
        },
        setNavigationTarget: (
            state,
            action: PayloadAction<{ tab?: string; section?: string } | null>
        ) => {
            state.navigationTarget = action.payload
        },
        setPendingCourses: (state, action: PayloadAction<any[]>) => {
            state.pendingCourses = action.payload
        },
        setDeletedCourses: (state, action: PayloadAction<any[]>) => {
            state.deletedCourses = action.payload
        },
    },
})

export const {
    setIndustryDetail,
    setActiveSector,
    setIndustrySupervisors,
    setIndustrySectorCapacity,
    setNavigationTarget,
    setPendingCourses,
    setDeletedCourses,
} = industrySlice.actions
export default industrySlice.reducer

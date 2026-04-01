import { configureStore } from '@reduxjs/toolkit'
import { industrySlice, studentSlice, rtoSlice } from './slice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { studentReducer, industryReducer, rtoReducer } from './reducer'
import {
    apiSlice,
    authApi,
    industryApi,
    refreshTokenApi,
    stripeApi,
} from '@queries'

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        student: studentReducer,
        industry: industryReducer,
        rto: rtoReducer,
        [authApi.reducerPath]: authApi.reducer,
        [apiSlice.reducerPath]: industryApi.reducer,
        [stripeApi.reducerPath]: stripeApi.reducer,
        [refreshTokenApi.reducerPath]: refreshTokenApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }).concat([
            authApi.middleware,
            apiSlice.middleware,
            stripeApi.middleware,
            refreshTokenApi.middleware,
        ]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the types from the store
export type AppDispatch = typeof store.dispatch

// Explicitly define RootState for proper autocomplete
// Using the slice's getInitialState return type for better type inference
type StudentState = ReturnType<typeof studentSlice.getInitialState>
type IndustryState = ReturnType<typeof industrySlice.getInitialState>
type RtoState = ReturnType<typeof rtoSlice.getInitialState>
export interface RootState {
    student: StudentState
    industry: IndustryState
    rto: RtoState
    // RTK Query API slices (these are added dynamically)
    [authApi.reducerPath]: ReturnType<typeof authApi.reducer>
    [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>
    [stripeApi.reducerPath]: ReturnType<typeof stripeApi.reducer>
    [refreshTokenApi.reducerPath]: ReturnType<typeof refreshTokenApi.reducer>
}

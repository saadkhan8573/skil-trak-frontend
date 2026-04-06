import { Badge, TextInput } from '@components'
import { Label } from '@components/ui/label'
import { CommonApi } from '@queries'
import { motion, AnimatePresence } from 'framer-motion'
import {
    AlertCircle,
    Building,
    CheckCircle,
    Loader2,
    Search,
} from 'lucide-react'
import { useEffect } from 'react'

interface AbnLookUpCardProps {
    abn: string
}

const ABN_LENGTH = 11

export const AbnLookUpCard = ({ abn }: AbnLookUpCardProps) => {
    const [
        getAbnDetails,
        { data: abnData, isFetching, isError, isUninitialized, reset },
    ] = CommonApi.FindWorkplace.useLazyGetAbnDetails()

    const normalizedAbn = (abn || '').replace(/\s/g, '')
    const isValidLength = normalizedAbn.length === ABN_LENGTH

    useEffect(() => {
        if (isValidLength) {
            getAbnDetails(normalizedAbn)
        } else {
            reset()
        }
    }, [normalizedAbn])

    // Don't render until user has entered a full ABN
    if (!isValidLength) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-2 rounded-xl p-6 ${
                    isError
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-green-200 bg-green-50/50'
                }`}
            >
                <div className="flex items-start gap-4">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isError
                                ? 'bg-gradient-to-br from-red-400 to-rose-500'
                                : 'bg-gradient-to-br from-green-500 to-emerald-500'
                        }`}
                    >
                        {isFetching ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : isError ? (
                            <AlertCircle className="w-5 h-5 text-white" />
                        ) : (
                            <Search className="w-5 h-5 text-white" />
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <h4
                                className={`font-semibold ${isError ? 'text-red-900' : 'text-green-900'}`}
                            >
                                ABN Lookup
                            </h4>
                            {isFetching && (
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700 border-blue-300"
                                    text="Looking up..."
                                />
                            )}
                            {!isFetching && !isError && abnData && (
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-700 border-green-300"
                                    Icon={CheckCircle}
                                    text="Verified"
                                />
                            )}
                            {!isFetching && isError && (
                                <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-700 border-red-300"
                                    Icon={AlertCircle}
                                    text="Not found"
                                />
                            )}
                        </div>

                        {isFetching && (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-4 bg-green-200 rounded w-3/4" />
                                <div className="h-10 bg-green-100 rounded" />
                            </div>
                        )}

                        {!isFetching && isError && (
                            <p className="text-sm text-red-700">
                                We couldn't find a business registered with ABN{' '}
                                <span className="font-mono font-semibold">
                                    {normalizedAbn}
                                </span>
                                . Please check the number and try again.
                            </p>
                        )}

                        {!isFetching && !isError && abnData && (
                            <>
                                <p className="text-sm text-green-700">
                                    Legal name retrieved for ABN{' '}
                                    <span className="font-mono font-semibold">
                                        {abnData.abn}
                                    </span>
                                    . Edit below if incorrect.
                                </p>

                                <div className="space-y-2 mt-4">
                                    <Label
                                        htmlFor="legalName"
                                        className="flex items-center gap-2"
                                    >
                                        <Building className="w-4 h-4 text-green-700" />
                                        Legal Name (from ABN Lookup)
                                    </Label>
                                    <div className="relative">
                                        <TextInput
                                            name="legalName"
                                            value={abnData.legalName ?? ''}
                                            onChange={() => {}}
                                            className="bg-white border-2 border-green-300 font-medium"
                                        />
                                        <CheckCircle className="absolute right-3 top-5 -translate-y-1/2 w-4 h-4 text-green-600" />
                                    </div>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span>✓</span> Registered legal name
                                        from the Australian Business Register.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

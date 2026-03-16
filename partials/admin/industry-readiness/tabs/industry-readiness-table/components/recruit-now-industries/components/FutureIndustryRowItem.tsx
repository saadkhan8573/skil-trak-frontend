import { ellipsisText } from '@utils'
import { MapPin, User, Users2, X } from 'lucide-react'
import React from 'react'

export const FutureIndustryRowItem = ({
    partner,
    setSelectedPartner,
    index,
}: any) => {
    console.log('future industry', partner)
    const getInitials = (name: string) => {
        const words = name.split(' ')
        if (words.length >= 2) {
            return words[0][0] + words[1][0]
        }
        return name.substring(0, 2)
    }

    const getFirstLetter = (name: string) => {
        if (!name) return
        return name?.charAt(0)?.toUpperCase()
    }
    const getAvatarColor = (index: number) => {
        const colors = [
            '#C0C0C0',
            '#A8A8A8',
            '#909090',
            '#B8B8B8',
            '#D0D0D0',
            '#989898',
        ]
        return colors[index % colors.length]
    }
    return (
        <div
            key={partner.id}
            className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => setSelectedPartner(partner)}
        >
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-slate-700 font-bold text-lg flex-shrink-0"
                    style={{
                        backgroundColor: getAvatarColor(index),
                    }}
                >
                    {getFirstLetter(partner?.businessName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-slate-900 font-semibold text-sm">
                            {ellipsisText(partner?.businessName, 20)}
                        </h3>
                        {!partner.signedUp && (
                            <span className="flex items-center gap-1 text-blue-600 text-xs font-semibold whitespace-nowrap">
                                <X className="w-3.5 h-3.5" />
                                Not Signed Up
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">
                                {partner?.address ?? '___'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-slate-600 text-xs flex-shrink-0">
                            <User className="w-4 h-4 text-teal-600" />
                            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400 rounded-full"
                                    style={{
                                        width: `${Math.min((partner?.distance / 20) * 100, 100)}%`,
                                    }}
                                ></div>
                            </div>
                            <Users2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            <span className="font-medium">
                                {partner?.distance?.toFixed(2)} km away
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                            partner?.isContacted
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {partner?.isContacted ? 'Contacted' : 'Not Contacted'}
                    </span>
                    <span
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                            partner?.emailSent
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {partner?.emailSent ? 'Email Sent' : 'No Email Sent'}
                    </span>
                </div>
            </div>
        </div>
    )
}

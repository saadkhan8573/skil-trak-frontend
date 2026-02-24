import React from 'react'
import { MapPin } from 'lucide-react'

interface DetailStat {
    courseName: string | null
    suburb: string
    postalCode: string | null
    rtoName: string
    studentCount: string
}

interface DetailedForecastTableProps {
    data: DetailStat[]
}

export const DetailedForecastTable = ({ data }: DetailedForecastTableProps) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            {/* Header Section */}
            <div className="p-5 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg text-slate-900 font-bold mb-0.5">
                    Detailed Forecast
                </h3>
                <p className="text-sm text-slate-600">
                    Complete breakdown of expected student arrivals by course
                    and location
                </p>
            </div>

            <div className="overflow-auto max-h-150 custom-scrollbar">
                {/* !border-collapse ensures borders show up on internal cells correctly */}
                <table className="w-full border-collapse!">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            {/* !border-y ensures both top and bottom borders of header are fixed */}
                            {[
                                'Course',
                                'Location',
                                'Training Organisation',
                                'Students',
                            ].map((header, i) => (
                                <th
                                    key={header}
                                    className={`text-left px-5 py-4 text-xs text-slate-600 font-bold uppercase tracking-wider bg-slate-50 border-y! border-slate-200! ${i === 3 ? 'text-right' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white!">
                        {data?.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-blue-50/30 transition-colors group bg-white!"
                            >
                                <td className="px-5 py-4 text-xs text-slate-900 font-semibold border-b! border-slate-200!">
                                    {item.courseName || (
                                        <span className="text-slate-400 italic font-normal">
                                            No Course Assigned
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-xs text-slate-700 border-b! border-slate-200!">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">
                                            {item.suburb}
                                        </span>
                                        {item.postalCode && (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                <MapPin className="size-2.5" />
                                                {item.postalCode}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-1 text-xs text-slate-700 border-b! border-slate-200!">
                                    {item.rtoName}
                                </td>
                                <td className="px-5 py-1 text-xs text-slate-900 text-right border-b! border-slate-200!">
                                    <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full  text-slate-900 font-bold text-xs">
                                        {item.studentCount}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Info */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <span className="text-xs text-slate-500">
                    Showing {data.length} unique entries
                </span>
            </div>
        </div>
    )
}

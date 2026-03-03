import { ellipsisText } from '@utils'
import React from 'react'

export const CardTable = ({
    title,
    data = [],
    pagination,
    onPageChange,
}: any) => {
    return (
        <div className="border rounded-xl shadow-sm bg-white mb-6">
            <div className="flex justify-between items-center px-4 py-2 border-b">
                <h3 className="text-blue-600 font-semibold">{title}</h3>
                <span className="text-sm text-gray-500">
                    {pagination?.totalResult ?? 0}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                        <tr>
                            <th className="px-4 py-2">Student ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-6 text-gray-400"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((item: any, idx: any) => (
                                <tr
                                    key={item.id || idx}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {ellipsisText(item.studentId, 8)}
                                    </td>
                                    <td className="px-4 py-2">{`${
                                        item.givenName || ''
                                    } ${item.familyName || ''}`}</td>
                                    <td className="px-4 py-2">{item.email}</td>
                                    <td className="px-4 py-2">{item.phone}</td>
                                    <td className="px-4 py-2">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.status === 'done' ? (
                                            <span className="text-green-600 text-xl">
                                                ✔
                                            </span>
                                        ) : (
                                            <span className="text-red-600 text-xl">
                                                ✖
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination?.totalPage > 1 && (
                <div className="flex justify-end items-center gap-2 px-4 py-3 text-sm">
                    <button
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevious}
                        className={`px-3 py-1 rounded ${
                            !pagination.hasPrevious
                                ? 'bg-gray-200'
                                : 'bg-gray-100 hover:bg-gray-300'
                        }`}
                    >
                        Prev
                    </button>
                    <span className="px-2">
                        Page {pagination.currentPage} of {pagination.totalPage}
                    </span>
                    <button
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className={`px-3 py-1 rounded ${
                            !pagination.hasNext
                                ? 'bg-gray-200'
                                : 'bg-gray-100 hover:bg-gray-300'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

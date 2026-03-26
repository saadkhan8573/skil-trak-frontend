import { useRouter } from 'next/router'

export const PageNotFound = () => {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* 404 Icon */}
                <div className="flex justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primaryNew to-primaryNew">
                            404
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-gray-600">
                        Sorry, the page you're looking for doesn't exist or has
                        been moved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg cursor-pointer bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

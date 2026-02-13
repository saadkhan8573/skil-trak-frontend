import Link from 'next/link'
import Image from 'next/image'

export const PendingSignatureCard = () => {
    return (
        <div className="bg-gradient-to-r from-[#394C69] to-[#0C041A] rounded-2xl p-4">
            <div className="flex justify-between items-center">
                <div className="text-white font-medium text-sm">
                    Pending E-Signatures
                </div>
                <div>
                    <Link href="#" className="text-xs rounded-full bg-white px-2 py-1 text-indigo-800">
                        
                            View All
                        
                    </Link>
                </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
                <div>
                    <h2 className="text-white font-semibold text-lg">
                        3 files
                    </h2>
                    <p className="text-[#D1D5DB] font-medium">Please Sign</p>
                </div>
                <div className="animate-float">
                    <Image
                        src="/images/card-icons/ic_esign.png"
                        width={100}
                        height={100}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

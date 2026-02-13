import Link from 'next/link'
import Image from 'next/image'

interface DocumentCardProps {
    title: string
    description: string
    idx: number
}
export const DocumentCard = ({
    title,
    description,
    idx,
}: DocumentCardProps) => {
    return (
        <Link href="#" className="rounded-2xl bg-white shadow-xl inline-block overflow-hidden">

            {/* <Image
                src={`https://loremflickr.com/180/100/work?random=${idx}`}
                width={180}
                height={100}
            /> */}
            <div
                className="w-full h-32"
                style={{
                    backgroundImage: `url(https://loremflickr.com/180/100/work?random=${idx})`,
                }}
            ></div>
            <div className="px-2 pb-2">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-[11px]">{description}</p>
            </div>

        </Link>
    );
}

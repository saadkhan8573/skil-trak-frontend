import Link from 'next/link'

export const FeatureSlide = ({ icon, title, link }: any) => {
    const Icon = () => icon
    return (
        <Link
            href={link}
            className="text-white flex flex-col items-center py-8"
            style={{
                backgroundColor: '#284d6487',
            }}
        >
            <div className="text-theme-secondary text-5xl">
                <Icon />
            </div>
            <h3 className="mt-4 font-bold">{title}</h3>
            {/* <Link  className="hidden md:inline-block mt-4 border px-3 py-2">Learn More</Link> */}
        </Link>
    )
}

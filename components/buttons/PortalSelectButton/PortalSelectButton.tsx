import { Card } from '@components/cards'
import { Typography } from '@components/Typography'
import Link from 'next/link'
import { ReactNode } from 'react'
// import { PortalLinksStyles } from "./style";

interface PortalSelectButtonProps {
    link: string
    Icon: string
    children: ReactNode
    onMouseEnter: () => void
}
export const PortalSelectButton = ({
    link,
    Icon,
    children,
    onMouseEnter,
}: PortalSelectButtonProps) => {
    return (
        <Card>
            <div className="flex flex-col justify-center items-center gap-y-5 h-48 w-60">
                <div>
                    <img src={Icon} alt="" className="" />
                </div>
                <Typography variant={'h4'} color="text-[#24556D]" center>
                    {children}
                </Typography>
                <Link
                    href={link}
                    className={`group transition-all text-center text-sm font-semibold flex justify-center items-center px-4 py-2 rounded-lg text-white bg-primary`}
                    onMouseEnter={() => {
                        onMouseEnter()
                    }}>
                    
                        Choose
                    
                </Link>
            </div>
        </Card>
    );
}

import { useRef, useEffect, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
    children: ReactNode
    zIndex?: number
}

export const Portal = ({ children, zIndex = 99999 }: PortalProps) => {
    const ref = useRef<Element | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        ref.current = document.querySelector<HTMLElement>('#portal')
        setMounted(true)
    }, [])

    return mounted && ref.current
        ? createPortal(
            <div style={{ zIndex: zIndex, position: 'relative' }}>
                {children}
            </div>,
            ref.current
        )
        : null
}

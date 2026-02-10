import React, { useRef, useEffect, ReactNode } from 'react';

interface OutsideClickHandlerProps {
    onOutsideClick: (event: any) => void;
    children: ReactNode;
    disabled?: boolean;
}

export const OutsideClickHandler: React.FC<OutsideClickHandlerProps> = ({
    onOutsideClick,
    children,
    disabled = false,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutsideClick(event);
            }
        };

        // Add event listeners for both mouse and touch events
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [onOutsideClick, disabled]);

    return <div ref={ref}>{children}</div>;
};

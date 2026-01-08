interface FilterToggleButtonProps {
    active: boolean
    onClick: () => void
    children: React.ReactNode
    activeClass: string
}

export const FilterToggleButton = ({
    active,
    onClick,
    children,
    activeClass,
}: FilterToggleButtonProps) => (
    <button
        onClick={onClick}
        className={`
            px-3 py-1.5 rounded-lg text-xs transition-all
            ${
                active
                    ? `${activeClass} text-white shadow-md`
                    : 'bg-gray-50 text-[#044866] border border-gray-200 hover:border-[#044866]/30'
            }
        `}
    >
        {children}
    </button>
)

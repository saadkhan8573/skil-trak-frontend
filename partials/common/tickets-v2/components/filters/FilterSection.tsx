interface FilterSectionProps {
    label: string
    children: React.ReactNode
}

export const FilterSection = ({ label, children }: FilterSectionProps) => (
    <div>
        <label className="block text-xs text-[#044866] mb-2 uppercase tracking-wider">
            {label}
        </label>
        {children}
    </div>
)

import { ReactNode } from 'react'

export const InitialAvatarContainer = ({
    children,
    show = 3,
}: {
    children: ReactNode[]
    show: number
}) => {
    return (
        <div className="relative flex items-center">
            {children?.length > 0
                ? children?.map((child: any, idx: number) => {
                    if (idx < show) {
                        return child
                    }
                })
                : children}

            {children?.length > show && (
                <div className="text-blue-500 text-xs font-semibold ml-2 relative cursor-pointer group">
                    <span className="whitespace-nowrap">
                        {' '}
                        +{children?.length - show} More
                    </span>

                    <div className="group-hover:flex hidden z-10 absolute -top-14 right-0 shadow-lg rounded bg-slate-800 text-slate-100 font-normal flex-col">
                        {children?.map((child: any, idx: number) => {
                            if (idx >= show) {
                                return (
                                    <span
                                        key={idx}
                                        className={`whitespace-nowrap p-1 ${idx !== children.length - 1
                                                ? 'border-b border-slate-700'
                                                : ''
                                            }`}
                                    >
                                        {child.props.name}
                                    </span>
                                )
                            }
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

import classNames from 'classnames'
import { ReactNode } from 'react'
import { PulseLoader } from 'react-spinners'

interface BadgeProps {
    className?: string
    children?: ReactNode
    text?: string
    iconPlacement?: 'left' | 'right'
    Icon?: any
    variant?:
        | 'primary'
        | 'primaryNew'
        | 'secondary'
        | 'accent'
        | 'success'
        | 'info'
        | 'error'
        | 'warning'
        | 'muted'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    shape?: 'rounded' | 'pill' | 'flat'
    disabled?: boolean
    loading?: boolean
    outline?: boolean
    title?: string
    onClick?: (e: any) => void
}

const LoaderColor = {
    primary: '#f97316',
    secondary: '#0ea5e9',
    accent: '#6366f1',
    success: '#22c55e',
    info: '#3b82f6',
    error: '#ef4444',
    warning: '#f59e0b',
    muted: '#64748b',
}
export const Badge = ({
    text,
    variant = 'primary',
    size = 'sm',
    shape = 'rounded',
    disabled,
    onClick,
    loading,
    outline,
    Icon,
    iconPlacement = 'left',
    className,
    children,
    title,
}: BadgeProps) => {
    const classes = classNames({
        'px-2 py-0.5 inline-block uppercase': true,
        rounded: shape === 'rounded',
        'rounded-full': shape === 'pill',
        'text-sm font-medium': size === 'md',
        'text-xs font-medium': size === 'sm',
        'text-[10px]': size === 'xs',
        'text-normal': size === 'lg',
        border: outline,

        // Colors
        'bg-orange-100 text-orange-500':
            !disabled && variant === 'primary' && !outline,
        'bg-primaryNew text-white':
            !disabled && variant === 'primaryNew' && !outline,
        'bg-sky-100 text-sky-500': variant === 'secondary' && !outline,
        'bg-indigo-100 text-indigo-500':
            !disabled && variant === 'accent' && !outline,
        'bg-green-100 text-green-500':
            !disabled && variant === 'success' && !outline,
        'bg-blue-100 text-blue-500':
            !disabled && variant === 'info' && !outline,
        'bg-red-100 text-red-500': !disabled && variant === 'error' && !outline,
        'bg-amber-100 text-amber-500':
            !disabled && variant === 'warning' && !outline,
        'bg-slate-200 text-slate-500':
            !disabled && variant === 'muted' && !outline,
        'bg-gray-100 text-gray-500': disabled,

        'border-orange-100 text-orange-500':
            !disabled && variant === 'primary' && outline,
        'border-primaryNew text-primaryNew':
            !disabled && variant === 'primaryNew' && outline,
        'border-sky-100 text-sky-500': variant === 'secondary' && outline,
        'border-indigo-100 text-indigo-500':
            !disabled && variant === 'accent' && outline,
        'border-green-100 text-green-500':
            !disabled && variant === 'success' && outline,
        'border-blue-100 text-blue-500':
            !disabled && variant === 'info' && outline,
        'border-red-100 text-red-500':
            !disabled && variant === 'error' && outline,
        'border-amber-100 text-amber-500':
            !disabled && variant === 'warning' && outline,
        'border-slate-200 text-slate-500':
            !disabled && variant === 'muted' && outline,
        '!cursor-pointer': !!onClick,
    })
    return (
        <div
            title={title}
            className={`${classes} ${className}`}
            {...(onClick ? { onClick: (e) => onClick(e) } : {})}
        >
            {loading ? (
                <PulseLoader
                    size={5}
                    data-testid="puff-loader"
                    color={(LoaderColor as any)[variant]}
                />
            ) : (
                <div className="flex items-center gap-x-1">
                    {Icon && iconPlacement === 'left' && (
                        <Icon className="text-xs" size={12} />
                    )}
                    <span>{text || children}</span>
                    {Icon && iconPlacement === 'right' && (
                        <Icon className="text-xs" size={12} />
                    )}
                </div>
            )}
        </div>
    )
}

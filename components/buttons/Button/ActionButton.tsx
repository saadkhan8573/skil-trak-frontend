import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@components/ui/tooltip'
import classNames from 'classnames'
import { LucideProps } from 'lucide-react'
import {
    ReactNode,
    MouseEvent,
    ForwardRefExoticComponent,
    RefAttributes,
} from 'react'
import { IconType } from 'react-icons'
import { PulseLoader } from 'react-spinners'

const VariantOptions = [
    'success',
    'error',
    'info',
    'warning',
    'neutral',
    'light',
    'dark',
    'link',
] as const

interface ButtonProps {
    variant?: (typeof VariantOptions)[number]
    Icon?:
        | IconType
        | ForwardRefExoticComponent<
              Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
          >
    children?: ReactNode
    onClick?: (e: MouseEvent<HTMLElement>) => void
    disabled?: boolean
    loading?: boolean
    mini?: boolean
    simple?: boolean
    rounded?: boolean
    submit?: boolean
    title?: string
    small?: boolean
    fullWidth?: boolean
    noPadding?: boolean
    text?: string
}

export const ActionButton = ({
    variant = 'light',
    disabled,
    onClick,
    children,
    loading,
    Icon,
    mini,
    simple,
    rounded,
    submit,
    title,
    small,
    text,
    fullWidth,
    noPadding,
}: ButtonProps) => {
    const classes = classNames({
        'text-xs font-medium uppercase transition-all duration-300 focus:outline-none shadow cursor-pointer':
            true,
        'rounded-full px-2 py-2': rounded && !small,
        'rounded px-4 py-2': !rounded && !small,
        'rounded px-1.5 py-1.5': small,
        '!p-0 !px-0 !py-0': noPadding,
        'w-full': fullWidth,
        'bg-red-100 text-red-500 hover:bg-red-200 hover:shadow-red-100':
            variant === 'error',
        'bg-green-100 text-green-500 hover:bg-green-200 hover:shadow-green-100':
            variant === 'success',
        'bg-orange-100 text-orange-500 hover:bg-orange-200 hover:shadow-orange-100':
            variant === 'warning',
        'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-gray-100':
            variant === 'light',
        'bg-slate-700 text-slate-200 hover:bg-slate-800 hover:shadow-slate-100':
            variant === 'dark',
        'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:shadow-slate-100':
            variant === 'neutral',
        'bg-blue-100 text-blue-500 hover:bg-blue-200 hover:shadow-blue-100':
            variant === 'link',
        'bg-indigo-100 text-indigo-500 hover:bg-indigo-200 hover:shadow-indigo-100':
            variant === 'info',
        'bg-gray-300 text-slate-300 hover:text-gray-400 cursor-not-allowed':
            disabled,
    })

    const simpleClasses = classNames({
        'text-xs font-medium uppercase transition-all duration-300 px-4 py-2 rounded focus:outline-none hover:bg-gray-200 cursor-pointer':
            true,
        '!rounded-full ': rounded,
        'text-red-500 ': variant === 'error',
        'text-green-500 hover:text-green-700': variant === 'success',
        'text-orange-500 hover:text-orange-700': variant === 'warning',
        'text-gray-700 hover:text-gray-900': variant === 'light',
        'text-slate-700 hover:text-slate-900': variant === 'dark',
        'text-slate-100 hover:text-slate-700': variant === 'neutral',
        'text-blue-500 hover:text-blue-700': variant === 'link',
        'text-indigo-500 hover:text-indigo-700': variant === 'info',
        'text-gray-300 hover:text-gray-400': disabled,
    })

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        disabled={disabled}
                        type={submit ? 'submit' : 'button'}
                        className={`${
                            simple ? simpleClasses : classes
                        } relative group`}
                        {...(!submit
                            ? { onClick: (e) => onClick && onClick(e) }
                            : {})}
                    >
                        <div className="flex items-center justify-center gap-x-2">
                            {loading ? (
                                <PulseLoader size={6} />
                            ) : mini ? (
                                Icon && <Icon />
                            ) : (
                                <>
                                    {Icon && <Icon size={16} />}
                                    {text || children}
                                </>
                            )}
                        </div>
                    </button>
                </TooltipTrigger>
                {title && <TooltipContent side="top">{title}</TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    )
}

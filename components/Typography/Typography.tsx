import { createElement, ReactNode } from 'react'

const TypographyOptions = {
    h1: { defaultClasses: `text-2xl md:text-4xl font-bold`, element: 'h1' },
    h2: { defaultClasses: `text-xl md:text-3xl font-bold`, element: 'h2' },
    h3: { defaultClasses: `text-xl md:text-2xl font-bold`, element: 'h3' },
    h4: { defaultClasses: `text-base md:text-xl font-bold`, element: 'h4' },
    body: { defaultClasses: `text-base text-normal`, element: 'p' },
    title: { defaultClasses: `text-lg font-semibold`, element: 'p' },
    subtitle: { defaultClasses: `text-base font-medium`, element: 'p' },
    label: { defaultClasses: `text-sm font-medium`, element: 'label' },
    muted: { defaultClasses: `text-xs font-medium`, element: 'p' },
    small: { defaultClasses: `text-xs font-normal`, element: 'p' },
    xs: { defaultClasses: `text-[11px] font-normal`, element: 'p' },
    xxs: { defaultClasses: `text-[10px] font-normal`, element: 'p' },
    tableCell: { defaultClasses: `text-xs font-medium`, element: 'p' },
    badge: { defaultClasses: `text-[9px] font-semibold`, element: 'span' },
}

const VariantOptions = [
    'h1',
    'h2',
    'h3',
    'h4',
    'body',
    'title',
    'subtitle',
    'label',
    'muted',
    'small',
    'xs',
    'xxs',
    'tableCell',
    'badge',
] as const

interface TypographyProps {
    variant?: (typeof VariantOptions)[number]
    as?: any

    children: ReactNode

    // Label Specific
    htmlFor?: string

    // Transform
    uppercase?: boolean
    capitalize?: boolean

    // Alignment
    center?: boolean
    left?: boolean
    right?: boolean

    color?: string

    extraBold?: boolean
    bold?: boolean
    semibold?: boolean
    medium?: boolean
    light?: boolean
    normal?: boolean

    underline?: boolean

    cursorPointer?: boolean
    block?: boolean
    italic?: boolean
    whiteSpacePre?: boolean
    className?: string
}

export const Typography = ({
    variant = 'body',
    as,
    children,

    // Alignment
    center,
    left,
    right,

    // Transform
    uppercase,
    capitalize,

    // Label Specific
    htmlFor,

    // tailwind class
    color = 'text-typography',

    bold,
    medium,
    light,
    normal,
    semibold,
    extraBold,

    underline,
    italic,

    cursorPointer,

    block,
    whiteSpacePre,
    className,
}: TypographyProps) => {
    let classes = `${color}`

    if (left) {
        classes = `${classes} text-left`
    } else if (center) {
        classes = `${classes} text-center`
    } else if (right) {
        classes = `${classes} text-right`
    }

    if (capitalize) {
        classes = `${classes} capitalize`
    } else if (uppercase) {
        classes = `${classes} uppercase`
    }

    if (extraBold) {
        classes = `${classes} !font-extrabold`
    } else if (bold) {
        classes = `${classes} !font-bold`
    } else if (semibold) {
        classes = `${classes} !font-semibold`
    } else if (medium) {
        classes = `${classes} !font-medium`
    } else if (normal) {
        classes = `${classes} !font-normal`
    } else if (light) {
        classes = `${classes} !font-light`
    }

    if (underline) {
        classes = `${classes} underline`
    }

    if (italic) {
        classes = `${classes} italic`
    }

    if (cursorPointer) {
        classes = `${classes} cursor-pointer`
    }

    if (block) {
        classes = `${classes} !block`
    }

    if (whiteSpacePre) {
        classes = `${classes} !whitespace-pre`
    }

    const { element, defaultClasses } = TypographyOptions[variant]
    return createElement(
        as || element,
        {
            className: `${defaultClasses} ${classes} ${className || ''}`.trim(),
            ...(htmlFor ? { htmlFor } : {}),
        },
        children
    )
}

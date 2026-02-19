/**
 * Color and styling constants for status displays
 */

export const STATUS_COLORS = {
    primary: {
        gradient: 'from-[#0D5468] via-[#044866] to-[#0D5468]',
        text: 'text-[#044866]',
        textDark: 'text-[#0D5468]',
        textLight: 'text-[#0D5468]',
        bg: 'bg-[#044866]',
    },
    success: {
        gradient: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        textDark: 'text-emerald-900',
        textLight: 'text-emerald-700',
    },
    warning: {
        gradient: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        textDark: 'text-amber-900',
        textLight: 'text-amber-700',
    },
    danger: {
        gradient: 'from-red-50 via-rose-50 to-orange-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        textDark: 'text-red-900',
        textLight: 'text-red-700',
    },
    info: {
        gradient: 'from-blue-50 to-cyan-50',
        border: 'border-[#044866]/20',
        icon: 'text-[#044866]',
        textDark: 'text-[#044866]',
        textLight: 'text-[#0D5468]',
    },
    purple: {
        gradient: 'from-indigo-50 to-purple-50',
        border: 'border-[#0D5468]/20',
        icon: 'text-purple-600',
        textDark: 'text-purple-600',
        textLight: 'text-purple-600',
    },
}

export const BUTTON_STYLES = {
    primary:
        'bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] hover:from-[#0D5468] hover:via-[#044866] hover:to-[#0D5468] text-white shadow-xl shadow-[#044866]/30 h-12 font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-[#044866]/40 hover:-translate-y-0.5',
    secondary:
        'bg-linear-to-r from-[#0D5468] to-[#044866] hover:from-[#044866] hover:to-[#0D5468] text-white shadow-lg shadow-[#0D5468]/20 h-11',
    success:
        'bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-600/20 h-11',
    outline:
        'border-2 border-slate-200 hover:border-slate-300 h-11 outline-secondary',
}

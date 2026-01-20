import classNames from 'classnames'

export const getTextInputClasses = (error: boolean, disabled: boolean) => {
    return classNames({
        'border text-black caret-black w-full rounded-md outline-none px-4 py-2 placeholder-gray text-[13px]':
            true,
        'border-error': error,
        'border-gray-200': !error,
        '!bg-secondary-dark cursor-not-allowed placeholder-muted': disabled,
        'bg-white': !disabled,
    })
}

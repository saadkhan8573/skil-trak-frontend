import { MenuPlacement, default as ReactSelect } from 'react-select'

// components
import { Typography } from '@components'
import {
    HelpText,
    InputErrorMessage,
    RequiredStar,
    Tooltip,
    ValidationIcon,
} from './components'

// Colors

import { getThemeColors } from '@theme'
import { OptionType } from '@types'
import { forwardRef, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { InputProps } from './InputPropType'

const Colors = getThemeColors()

export type SelectProps = {
    options: OptionType[] | any
    value?: any
    defaultValue?: any
    multi?: boolean
    onlyValue?: boolean
    placeholder?: string
    inputRef?: any
    menuPlacement?: MenuPlacement
    components?: any
    formatOptionLabel?: any
    showError?: boolean
    shadow?: string
    onInputChange?: (e: any) => void
    onMenuOpen?: () => void
    onMenuClose?: () => void
    passValue?: boolean
    menuPortalTarget?: HTMLElement | null
    menuPosition?: 'absolute' | 'fixed'
    height?: string
    maxMenuHeight?: number
} & InputProps

export const Select = forwardRef(
    (
        {
            id,
            name,
            label,
            onMenuOpen,
            onMenuClose,
            multi,
            options,
            defaultValue,
            placeholder,

            value,
            rules,
            onChange,
            onInputChange,
            onBlur,

            helpText,
            tooltip,
            passValue = true,
            required,
            loading,
            disabled,
            validationIcons,

            onlyValue,
            components,
            menuPlacement,
            formatOptionLabel,
            shadow,
            menuPortalTarget,
            menuPosition,
            showError = true,
            height,
            maxMenuHeight,
        }: SelectProps,
        ref: any
    ) => {
        const formContext = useFormContext()

        // useEffect(() => {
        //     if ((value || defaultValue) && formContext) {
        //         formContext.setValue(name, handleChange(value || defaultValue))
        //     }
        // }, [value, defaultValue])

        // Convert form values to react-select format
        const getDisplayValue = (fieldValue: any) => {
            if (!fieldValue) return multi ? [] : null

            if (multi) {
                // Multi-select: convert array of values to array of options
                if (onlyValue) {
                    // if (typeof fieldValue === 'object') {
                    //     return fieldValue
                    // } else {
                    //     return options?.filter((opt: OptionType) =>
                    //         fieldValue.includes(opt.value)
                    //     )
                    // }

                    if (
                        Array.isArray(fieldValue) &&
                        fieldValue.length > 0 &&
                        typeof fieldValue[0] !== 'object'
                        // (typeof fieldValue[0] === 'number' ||
                        //     typeof fieldValue[0] === 'string')
                    ) {
                        return options?.filter((opt: OptionType) =>
                            fieldValue.includes(opt.value)
                        )
                    } else {
                        // It's an array of objects, return as is
                        return fieldValue
                    }
                } else {
                    if (typeof fieldValue?.[0] === 'object') {
                        return fieldValue?.map((f: OptionType) => ({
                            label: f?.label,
                            value: f?.value,
                        }))
                    } else {
                        return options?.filter((opt: OptionType) =>
                            fieldValue.includes(opt.value)
                        )
                    }
                }
            } else {
                const optionData =
                    options?.find(
                        (opt: OptionType) => opt.value === fieldValue
                    ) || null
                // Single select: convert value to option object
                if (onlyValue) {
                    // If onlyValue is true, fieldValue is a primitive value
                    if (typeof fieldValue === 'object') {
                        return fieldValue
                    } else {
                        return optionData
                    }
                } else {
                    if (typeof fieldValue === 'object') {
                        return fieldValue
                    } else {
                        return optionData
                    }
                }
            }
        }

        const CustomStyle = {
            control: (
                base: any,
                state: { isFocused: boolean; isDisabled: boolean }
            ) => ({
                ...base,
                backgroundColor: state.isDisabled
                    ? Colors.secondary.dark
                    : 'white',
                color: 'white',
                boxShadow: state.isFocused ? '0.5px 0.5px #888888' : 'none',
                border: state.isFocused
                    ? `1px solid ${Colors.secondary.dark} !important`
                    : // formContext &&
                      //   formContext.formState.touchedFields[name] &&
                      formContext?.formState.errors[name]
                      ? `1px solid red !important`
                      : `1px solid ${Colors.secondary.dark} !important`,
                '&:hover': {
                    border: state.isFocused
                        ? `1px solid ${Colors.muted} !important`
                        : `1px solid ${Colors.muted} !important`,
                },
                height: height || 'auto',
                minHeight: height || '38px',
                // border: '1px solid blue',
            }),
            valueContainer: (base: any) => ({
                ...base,
                height: height ? `calc(${height} - 2px)` : 'auto',
                padding: '0 8px',
            }),
            indicatorsContainer: (base: any) => ({
                ...base,
                height: height ? `calc(${height} - 2px)` : 'auto',
            }),
            input: (base: any, state: any) => ({
                ...base,
                fontSize: '14px',
            }),
            placeholder: (
                base: any,
                state: {
                    selectProps: { menuIsOpen: boolean; isDisabled: boolean }
                }
            ) => ({
                ...base,
                color: state.selectProps.isDisabled
                    ? '#d0d0d0'
                    : state.selectProps.menuIsOpen
                      ? Colors.secondary.dark
                      : Colors.muted.dark,
                fontSize: '12px',
            }),
            option: (base: any, state: any) => ({
                ...base,
                borderBottom: '1px dotted #ccc',
                backgroundColor: state.isSelected ? '#00000010' : '#ffffff',
                color: 'black',
                fontSize: '14px',
                '&:hover': {
                    backgroundColor: Colors.secondary.DEFAULT,
                },
            }),
            menu: (provided: any, state: any) => ({
                ...provided,
                borderBottom: '1px dotted pink',
                color: 'black',
                // position: 'relative',
                // zIndex: 10,
            }),
            dropdownIndicator: (style: any, state: any) => ({
                transform: state.selectProps.menuIsOpen
                    ? 'rotateX(-180deg)'
                    : 'rotateX(0)',
                transition: 'all 0.5s',
                color: state.isDisabled ? '#d0d0d0' : 'black',
                padding: '7px',
            }),
            singleValue: (provided: any, state: any) => {
                const color = state.selectProps.menuIsOpen
                    ? Colors.secondary.DEFAULT
                    : '#000000'
                const transition = 'opacity 300ms'
                const fontSize = '14px'

                return { ...provided, color, transition, fontSize }
            },
            noOptionsMessage: (provided: any, state: any) => ({
                ...provided,
                fontSize: '14px',
            }),
            multiValue: (styles: any, { data }: { data: any }) => {
                const color = 'transparent'
                return {
                    ...styles,
                    backgroundColor: color,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }
            },
            multiValueRemove: (styles: any, { data }: { data: any }) => {
                return data.isFixed
                    ? { ...styles, display: 'none' }
                    : {
                          ...styles,
                          color: 'orange',
                          ':hover': {
                              backgroundColor: 'orange',
                              color: 'white',
                          },
                      }
            },
            menuPortal: (base: any) => ({
                ...base,
                zIndex: 9999,
                pointerEvents: 'auto',
            }),
            menuList: (base: any) => ({
                ...base,
                maxHeight: maxMenuHeight || 300,
            }),
        }

        const handleChange = (event: any) => {
            return Array.isArray(event)
                ? onlyValue
                    ? event.map((e) => e.value)
                    : event
                : onlyValue
                  ? event?.value
                  : event
        }

        const getSimpleSelect = (
            onChange: any,
            onBlur: any,
            defaultValue: any,
            fieldValue: any
        ) => {
            return (
                <ReactSelect
                    name={name}
                    isSearchable
                    onBlur={onBlur}
                    isMulti={multi}
                    options={options}
                    isClearable={!options?.some((opt: any) => opt.isFixed)}
                    onChange={(newValue: any, actionMeta: any) => {
                        if (
                            (actionMeta.action === 'remove-value' ||
                                actionMeta.action === 'pop-value' ||
                                actionMeta.action === 'deselect-option') &&
                            actionMeta.removedValue?.isFixed
                        ) {
                            return
                        }
                        if (
                            actionMeta.action === 'clear' &&
                            options?.some((opt: any) => opt.isFixed)
                        ) {
                            return
                        }
                        onChange(newValue, actionMeta)
                    }}
                    isLoading={loading}
                    styles={CustomStyle}
                    isDisabled={disabled}
                    classNamePrefix="select"
                    {...(ref ? { ref } : {})}
                    placeholder={placeholder}
                    onMenuClose={onMenuClose}
                    defaultValue={defaultValue}
                    onInputChange={onInputChange}
                    {...(passValue && fieldValue
                        ? { value: getDisplayValue(fieldValue) }
                        : {})}
                    // value={value}
                    formatOptionLabel={formatOptionLabel}
                    {...(components ? { components } : {})}
                    className={`basic-single w-full ${shadow}`}
                    {...(menuPlacement ? { menuPlacement } : {})}
                    {...(menuPortalTarget ? { menuPortalTarget } : {})}
                    {...(menuPosition ? { menuPosition } : {})}
                />
            )
        }

        const getControlledSelect = () => {
            return (
                <Controller
                    control={formContext.control}
                    name={name}
                    render={({ field }) => {
                        return getSimpleSelect(
                            (event: any, actionMeta: any) => {
                                const selectedData = handleChange(event)
                                field.onChange(selectedData)
                                onChange && onChange(selectedData, actionMeta)
                            },
                            onBlur,
                            defaultValue,
                            field.value || value
                        )
                    }}
                />
            )
        }

        return (
            <div className="">
                {label && (
                    <div className="flex justify-between items-center mb-1">
                        <div>
                            <Typography variant={'label'}>{label}</Typography>
                            {required && <RequiredStar />}
                        </div>
                        {tooltip && <Tooltip text={tooltip} />}
                    </div>
                )}

                <div className="w-full flex items-center relative">
                    {formContext
                        ? getControlledSelect()
                        : getSimpleSelect(
                              (event: any) =>
                                  onChange && onChange(handleChange(event)),
                              onBlur,
                              defaultValue,
                              value
                          )}
                    {validationIcons && <ValidationIcon name={name} />}
                </div>

                <HelpText text={helpText} />
                {showError && <InputErrorMessage name={name} />}
            </div>
        )
    }
)

Select.displayName = 'Select'

import { ChangeEvent, useState } from 'react'
import { usePlacesWidget } from 'react-google-autocomplete'
import { useFormContext } from 'react-hook-form'

import { Typography } from '@components'
import {
    HelpText,
    LoadingSpinner,
    RequiredStar,
    Tooltip,
    ValidationIcon,
} from './components'

import { getMethodsForInput } from '@utils'

import { InputErrorMessage, PasswordView } from './components'
import { InputProps } from './InputPropType'
import { getTextInputClasses } from './inputStyleClasses'
import moment from 'moment'

export type InputType =
    | 'text'
    | 'number'
    | 'password'
    | 'email'
    | 'search'
    | 'tel'
    | 'date'
    | 'time'
    | 'url'
    | 'color'
    | 'file'
    | 'datetime-local'

export type TextInputProps = InputProps & {
    type?: InputType
    placeholder?: string
    min?: string | number
    max?: string | number
    onPlaceSuggetions?: {
        placesSuggetions: boolean
        setIsPlaceSelected: any //(value: boolean) => void
    }
    placesSuggetions?: any
    onFocus?: any
    color?: string
    defaultValue?: string
    showError?: boolean
    shadow?: string
}

export const TextInput = ({
    id,
    name,
    label,

    type,
    placeholder,

    helpText,
    tooltip,

    value,
    rules,
    onChange,
    onBlur,

    loading = false,
    required = false,
    disabled = false,
    validationIcons = false,
    placesSuggetions,
    color,

    min,
    max,
    onPlaceSuggetions,
    defaultValue,
    onFocus,
    showError = true,
    shadow,
}: TextInputProps) => {
    const [passwordType, setPasswordType] = useState<string | null>(
        type || null
    )
    const [isPlaceSelected, setIsPlaceSelected] = useState<boolean>(false)
    const formContext = useFormContext()

    const inputFieldClasses = getTextInputClasses(
        formContext && formContext.getFieldState(name).error !== undefined,
        disabled
    )

    const { ref }: any = usePlacesWidget({
        apiKey: process.env.NEXT_PUBLIC_MAP_KEY,
        onPlaceSelected: (place) => {
            if (onChange) {
                onChange({
                    target: {
                        value: place?.formatted_address,
                    },
                })
            }
            onPlaceSuggetions?.setIsPlaceSelected(true)
        },
        options: {
            types: ['address'],
            componentRestrictions: {
                country: 'au',
            },
        },
    })

    // const { ref: preferableLocationRef, ...rest } = formContext.register(name)

    const formRef = formContext && formContext.register(name)

    return (
        <div className="w-full">
            {label && (
                <div className={`flex justify-between items-center mb-1`}>
                    <div>
                        <Typography variant={'label'} htmlFor={id}>
                            {label}
                        </Typography>
                        {required && <RequiredStar />}
                    </div>
                    {tooltip && <Tooltip text={tooltip} />}
                </div>
            )}

            <div className="w-full">
                <div className="relative">
                    <input
                        className={`${inputFieldClasses} ${shadow}  ${color ? color : 'bg-white'
                            }`}
                        {...(id ? { id } : {})}
                        {...formRef}
                        type={passwordType || type}
                        placeholder={placeholder || ''}
                        disabled={disabled}
                        name={name}
                        min={min}
                        max={max}
                        {...(defaultValue ? { defaultValue } : {})}
                        {...getMethodsForInput(
                            name,
                            formContext,
                            rules,
                            onChange,
                            onBlur
                            // onFocus
                        )}
                        onFocus={(e) => {
                            onFocus && onFocus(e)
                        }}
                        {...(value ? { value } : {})}
                        {...(onPlaceSuggetions?.placesSuggetions ||
                            placesSuggetions
                            ? {
                                ref: (e: any) => {
                                    formRef && formRef.ref(e)
                                    ref.current = e
                                },
                            }
                            : {})}
                    />

                    {type === 'password' && (
                        <PasswordView
                            onClick={() => {
                                setPasswordType(
                                    passwordType !== 'password'
                                        ? 'password'
                                        : 'text'
                                )
                            }}
                            passwordType={passwordType}
                        />
                    )}

                    {!loading && validationIcons && (
                        <ValidationIcon name={name} />
                    )}
                    {loading && <LoadingSpinner loading={loading} />}
                </div>

                <HelpText text={helpText} />
                {showError ? <InputErrorMessage name={name} /> : null}
            </div>
        </div>
    )
}

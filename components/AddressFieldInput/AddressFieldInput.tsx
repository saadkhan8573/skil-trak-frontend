import { TextInput } from '@components/inputs'
import { useAddressToPostCode } from '@hooks'

export const AddressFieldInput = ({
    placesSuggetions,
    onChange,
    helpText,
    name,
    label,
    placeholder,
    value,
    defaultValue,
}: {
    label?: string
    placeholder?: string
    name?: string
    value?: string
    helpText?: string
    onChange?: (value: string) => void
    placesSuggetions?: {
        placesSuggetions: boolean
        setIsPlaceSelected: (value: boolean) => void
    }
    defaultValue?: string
}) => {
    const { onAddressToPostcodeClicked } = useAddressToPostCode()
    return (
        <TextInput
            label={label || 'Primary Address'}
            name={name || 'addressLine1'}
            placeholder={placeholder || 'Your Primary Address...'}
            validationIcons
            defaultValue={defaultValue}
            placesSuggetions
            value={value}
            onChange={async (e: any) => {
                const val = e.target?.value
                if (onChange) {
                    onChange(val)
                }

                onAddressToPostcodeClicked(val)
            }}
            onPlaceSuggetions={placesSuggetions}
            helpText={helpText}
        />
    )
}

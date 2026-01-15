import { TextInput } from '@components/inputs'
import { useAddressToPostCode } from '@hooks'

export const AddressFieldInput = ({
    placesSuggetions,
    onChange,
    helpText,
}: {
    helpText?: string
    onChange?: () => void
    placesSuggetions?: {
        placesSuggetions: boolean
        setIsPlaceSelected: (value: boolean) => void
    }
}) => {
    const { onAddressToPostcodeClicked } = useAddressToPostCode()
    return (
        <TextInput
            label={'Primary Address'}
            name={'addressLine1'}
            placeholder={'Your Primary Address...'}
            validationIcons
            placesSuggetions
            onChange={async (e: any) => {
                if (onChange) {
                    onChange()
                }

                onAddressToPostcodeClicked(e.target?.value)
            }}
            onPlaceSuggetions={placesSuggetions}
            helpText={helpText}
        />
    )
}

import { Typography } from '@components'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { PlacementTypeEnum } from '../enum'

const placementOptions = [
    {
        id: PlacementTypeEnum.FLEXIBLE,
        value: PlacementTypeEnum.FLEXIBLE,
        label: 'Flexible Placement',
        badge: 'Flexible',
        badgeColor: 'primary',
        description: 'Student can be placed any time before the expiry date',
    },
    // {
    //     id: PlacementTypeEnum.BLOCK,
    //     value: PlacementTypeEnum.BLOCK,
    //     label: 'Block Placement',
    //     badge: 'Scheduled',
    //     badgeColor: 'primaryNew',
    //     description:
    //         'Student must be placed before the start date and will have an end date',
    // },
]

export const PlacementType = () => {
    const formMethod = useFormContext()

    const placementType = formMethod.watch('placementType')

    return (
        <div className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-lg">
            <Typography variant="label" className="mb-2 block">
                Placement Type
            </Typography>

            <div className="flex flex-col gap-3">
                {placementOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            placementType === option.value
                                ? 'border-primaryNew bg-primaryNew/5'
                                : 'border-gray-300 hover:border-primaryNew/30'
                        }`}
                        onClick={() =>
                            formMethod.setValue('placementType', option.value)
                        }
                    >
                        <input
                            type="radio"
                            id={option.id}
                            name="placementType"
                            checked={placementType === option.value}
                            onChange={() =>
                                formMethod.setValue(
                                    'placementType',
                                    option.value
                                )
                            }
                            className="mt-1 accent-primaryNew cursor-pointer"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <Typography
                                    variant="body"
                                    className="font-semibold cursor-pointer"
                                >
                                    {option.label}
                                </Typography>
                                <div
                                    className={`inline-flex items-center justify-center rounded-full border border-${option.badgeColor}/30 bg-${option.badgeColor}/20 px-2.5 py-0.5 text-xs font-medium text-${option.badgeColor} text-center`}
                                >
                                    {option.badge}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {option.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

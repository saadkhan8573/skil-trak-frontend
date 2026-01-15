import moment from 'moment'
import * as yup from 'yup'
import { PlacementTypeEnum } from '../enum'
import { getDate } from '@utils'

// Utility to calculate date 3 months ahead
export const getMinExpiryDate = () => {
    return moment().add(3, 'months').format('YYYY-MM-DD')
}

export const importStudentValidationSchema = yup.object({
    batch: yup.string().required('Batch required'),
    // Placement Type
    placementType: yup
        .string()
        .oneOf(
            [PlacementTypeEnum.BLOCK, PlacementTypeEnum.FLEXIBLE],
            'Must select a valid placement type'
        )
        .required('Must select placement type'),

    // Conditional Date Validations
    startDate: yup.date().when('placementType', {
        is: PlacementTypeEnum.BLOCK,
        then: (schema) =>
            schema
                .min(new Date(getDate()), 'Start date cannot be in the past')
                .required('Must provide start date for block placement'),
        otherwise: (schema) => schema.nullable().notRequired(),
    }),

    endDate: yup.date().when(['placementType', 'startDate'], {
        is: (placementType: string, startDate: Date) =>
            placementType === PlacementTypeEnum.BLOCK && startDate,
        then: (schema) =>
            schema
                .min(yup.ref('startDate'), 'End date must be after start date')
                .required('Must provide end date for block placement'),
        otherwise: (schema) => schema.nullable().notRequired(),
    }),

    expiryDate: yup.date().when('placementType', {
        is: PlacementTypeEnum.FLEXIBLE,
        then: (schema) =>
            schema
                .min(
                    moment(getMinExpiryDate(), 'YYYY-MM-DD').toDate(),
                    'Expiry date must be at least 3 months from today'
                )
                .required('Must provide expiry date for rolling placement'),
        otherwise: (schema) => schema.nullable().notRequired(),
    }),
    courses: yup.array().min(1, 'Must select at least 1 course').required(),

    // list: yup
    //     .mixed()
    //     .required('A file is required')
    //     .test(
    //         'fileValue',
    //         'A file is required',
    //         (value) => [...value]?.length > 0
    //     )
    //     .test(
    //         'fileSize',
    //         'File size is too large. Maximum size is 5MB',
    //         (value) =>
    //             value &&
    //             value?.length > 0 &&
    //             value?.[0]?.size <= 5 * 1024 * 1024 // 5MB
    //     )
    //     .test(
    //         'fileType',
    //         'Unsupported file format. PDF,JPG,Png formats are allowed.',
    //         (value) =>
    //             value &&
    //             [
    //                 'image/jpg',
    //                 'image/png',
    //                 'image/jpeg',
    //                 'application/pdf',
    //             ].includes(value?.[0]?.type)
    //     ),
})

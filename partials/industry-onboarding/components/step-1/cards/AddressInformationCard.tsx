import { Card, Select, TextInput, Typography } from '@components'
import { Label } from '@components/ui/label'
import { CommonApi } from '@queries'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useState } from 'react'

export const AddressInformationCard = ({
    handleInputChange,
    data,
    errors,
}: any) => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const statesList = CommonApi.Countries.useStatesList({
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })
    const stateOptions =
        statesList?.data?.data &&
        statesList?.data?.data?.length > 0 &&
        statesList?.data?.data?.map((state: any) => ({
            label: state?.name,
            value: state?.id,
        }))
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card
                noPadding
                className="border-0 shadow-xl bg-linear-to-br from-white to-gray-50/30 hover-lift"
            >
                <div className="bg-linear-to-r from-[#F7A619]/5 to-primary/5 rounded-t-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-[#F7A619] to-primary rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <Typography>Address Information</Typography>
                            <p className="text-sm text-muted-foreground">
                                📍 Primary business address for correspondence
                                and documentation
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-8 p-8">
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Label
                            htmlFor="streetAddress"
                            className="flex items-center gap-2"
                        >
                            <MapPin className="w-4 h-4 text-primary" />
                            Street Address{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <TextInput
                                name="streetAddress"
                                value={data.streetAddress}
                                onChange={(e: any) =>
                                    handleInputChange(
                                        'streetAddress',
                                        e.target.value
                                    )
                                }
                                placeholder="123 Business Street"
                            />
                            {/* {data.streetAddress &&
                                    !errors.streetAddress && (
                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    )} */}
                        </div>
                        {errors.streetAddress && (
                            <motion.p
                                className="text-sm text-destructive flex items-center gap-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span>⚠️</span> {errors.streetAddress}
                            </motion.p>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <Label
                                htmlFor="suburb"
                                className="flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4 text-primary" />
                                Suburb{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <TextInput
                                    name="suburb"
                                    value={data.suburb}
                                    onChange={(e: any) =>
                                        handleInputChange(
                                            'suburb',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Suburb"
                                />
                                {/* {data.suburb && !errors.suburb && (
                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    )} */}
                            </div>
                            {errors.suburb && (
                                <motion.p
                                    className="text-sm text-destructive flex items-center gap-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <span>⚠️</span> {errors.suburb}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <Label
                                htmlFor="state"
                                className="flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4 text-primary" />
                                State{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                name="state"
                                // value={data?.state}
                                onChange={(value: any) =>
                                    handleInputChange('state', value?.value)
                                }
                                options={stateOptions}
                                value={stateOptions?.find(
                                    (opt: any) => opt.label === data?.state
                                )}
                            />

                            {errors.state && (
                                <motion.p
                                    className="text-sm text-destructive flex items-center gap-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <span>⚠️</span> {errors.state}
                                </motion.p>
                            )}
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <Label
                                htmlFor="postcode"
                                className="flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4 text-primary" />
                                Postcode{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <TextInput
                                    name="postcode"
                                    value={data.postcode}
                                    onChange={(e: any) =>
                                        handleInputChange(
                                            'postcode',
                                            e.target.value
                                        )
                                    }
                                    placeholder="1234"
                                />
                                {/* {data.postcode && !errors.postcode && (
                                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    )} */}
                            </div>
                            {errors.postcode && (
                                <motion.p
                                    className="text-sm text-destructive flex items-center gap-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <span>⚠️</span> {errors.postcode}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            <Label
                                htmlFor="country"
                                className="flex items-center gap-2"
                            >
                                <MapPin className="w-4 h-4 text-primary" />
                                Country
                            </Label>
                            <TextInput
                                name="country"
                                value={data?.country?.trim() || 'Australia'}
                                onChange={(e: any) =>
                                    handleInputChange('country', e.target.value)
                                }
                                placeholder="Australia"
                                disabled
                            />
                            {/* <Select
                                name="country"
                                value={data.country}
                                onChange={(value: any) =>
                                    handleInputChange('country', value)
                                }
                                options={[
                                    {
                                        label: 'Australia',
                                        value: 'australia',
                                    },
                                    {
                                        label: 'New Zealand',
                                        value: 'new-zealand',
                                    },
                                ]}
                            /> */}
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

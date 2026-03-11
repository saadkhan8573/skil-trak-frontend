import React, { ReactElement } from 'react'
import { AdminApi, SubAdminApi, RtoV2Api } from '@queries'
import { AdminLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, TextInput, Card, Typography } from '@components'

const WpAppReq: NextPageWithLayout = () => {
    const [appReq, appReqResult] = SubAdminApi.Workplace.removeWPApprovalReq()
    const [removeIndustryBlacklist, industryBlacklistResult] =
        RtoV2Api.PlacementRequests.removeIndustryFromBlackList()
    const [removeRtoStudentBlacklist, rtoBlacklistResult] =
        RtoV2Api.PlacementRequests.removeRtoStudentFromBlackList()

    const formMethods = useForm({ mode: 'all' })
    const industryBlacklistForm = useForm({ mode: 'all' })
    const rtoBlacklistForm = useForm({ mode: 'all' })

    const onSubmit = (values: any) => {
        appReq(values?.id)
    }

    const onSubmitIndustryBlacklist = (values: any) => {
        removeIndustryBlacklist(values?.id)
    }

    const onSubmitRtoBlacklist = (values: any) => {
        removeRtoStudentBlacklist({
            id: values?.id,
            indId: values?.indId,
        })
    }

    return (
        <div className="flex flex-col gap-y-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Remove WP Approval Request */}
                <Card
                    noPadding
                    className="overflow-hidden border-none shadow-lg"
                >
                    <div className="bg-primaryNew px-6 py-4">
                        <Typography variant="body" color="text-white" semibold>
                            WP Approval Request
                        </Typography>
                    </div>
                    <div className="p-6">
                        <FormProvider {...formMethods}>
                            <form
                                className="space-y-4"
                                onSubmit={formMethods.handleSubmit(onSubmit)}
                            >
                                <TextInput
                                    name="id"
                                    showError={false}
                                    placeholder="Enter Request ID"
                                />
                                <Button
                                    text="Remove WP Approval Req"
                                    submit
                                    loading={appReqResult.isLoading}
                                    disabled={appReqResult.isLoading}
                                    className="w-full"
                                />
                            </form>
                        </FormProvider>
                    </div>
                </Card>

                {/* Remove Industry from Blacklist */}
                <Card
                    noPadding
                    className="overflow-hidden border-none shadow-lg"
                >
                    <div className="bg-primaryNew px-6 py-4">
                        <Typography variant="body" color="text-white" semibold>
                            Industry/Student Blacklist
                        </Typography>
                    </div>
                    <div className="p-6">
                        <FormProvider {...industryBlacklistForm}>
                            <form
                                className="space-y-4"
                                onSubmit={industryBlacklistForm.handleSubmit(
                                    onSubmitIndustryBlacklist
                                )}
                            >
                                <TextInput
                                    name="id"
                                    showError={false}
                                    placeholder="Enter Industry ID"
                                />
                                <Button
                                    text="Remove Industry from Blacklist"
                                    submit
                                    loading={industryBlacklistResult.isLoading}
                                    disabled={industryBlacklistResult.isLoading}
                                    className="w-full"
                                />
                            </form>
                        </FormProvider>
                    </div>
                </Card>

                {/* Remove Blacklist From RTO */}
                <Card
                    noPadding
                    className="overflow-hidden border-none shadow-lg"
                >
                    <div className="bg-primaryNew px-6 py-4">
                        <Typography variant="body" color="text-white" semibold>
                            Blacklist From RTO
                        </Typography>
                    </div>
                    <div className="p-6">
                        <FormProvider {...rtoBlacklistForm}>
                            <form
                                className="space-y-4"
                                onSubmit={rtoBlacklistForm.handleSubmit(
                                    onSubmitRtoBlacklist
                                )}
                            >
                                <div className="space-y-4">
                                    <TextInput
                                        name="id"
                                        showError={false}
                                        placeholder="Enter ID"
                                    />
                                    <TextInput
                                        name="indId"
                                        showError={false}
                                        placeholder="Enter Industry ID"
                                    />
                                </div>
                                <Button
                                    text="Remove Blacklist From RTO"
                                    submit
                                    loading={rtoBlacklistResult.isLoading}
                                    disabled={rtoBlacklistResult.isLoading}
                                    className="w-full"
                                />
                            </form>
                        </FormProvider>
                    </div>
                </Card>
            </div>
        </div>
    )
}

WpAppReq.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default WpAppReq

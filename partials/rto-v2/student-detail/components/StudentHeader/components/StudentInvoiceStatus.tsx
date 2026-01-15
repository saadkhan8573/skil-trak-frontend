import { Badge, Typography } from '@components'
import { UserRoles } from '@constants'
import { paymentStatusData } from '@partials/admin/invoices'
import { AdminApi } from '@queries'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'

export const StudentInvoiceStatus = () => {
    const router = useRouter()
    const role = getUserCredentials()?.role

    const wpInvoiceStatus = AdminApi.Invoice.getInvoiceStatus(
        Number(router?.query?.id),
        {
            skip:
                !router?.query?.id ||
                ![UserRoles.ADMIN, UserRoles.RTO, UserRoles.SUBADMIN].includes(
                    role
                ),
        }
    )

    const data = wpInvoiceStatus?.data?.filter((p: any) => p?.paymentStatus)

    // Simplified permission check: valid data implies view access for now,
    // as strict 'workplaceRto' context is not available here.
    // Logic from WPInvoiceStatus adapted.

    if (!data || data.length === 0) return null

    return (
        <div className="flex flex-col gap-1">
            <Typography variant="xs" color={'text-slate-500'} medium>
                Invoice Status
            </Typography>
            <div className="flex items-center gap-2 flex-wrap">
                {data.map((d: any, index: number) => (
                    <div key={index} className="flex gap-x-2 group relative">
                        <Badge
                            text={paymentStatusData(d?.paymentStatus)?.text + ''}
                            variant={'error'}
                            className="!py-0.5 !px-2 !text-[10px]"
                        />

                        {/* Hover Details */}
                        <div className="hidden group-hover:block absolute top-full left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-100 p-3 w-48 mt-1">
                            <div className="flex flex-col gap-y-2">
                                <div>
                                    <Typography
                                        variant="xs"
                                        color="text-slate-500"
                                    >
                                        Course
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        semibold
                                        className="text-slate-700"
                                    >
                                        {d?.course?.title}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        variant="xs"
                                        color="text-slate-500"
                                    >
                                        Invoice Action
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        uppercase
                                        semibold
                                        className="text-slate-700"
                                    >
                                        {d?.invoiceAction}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

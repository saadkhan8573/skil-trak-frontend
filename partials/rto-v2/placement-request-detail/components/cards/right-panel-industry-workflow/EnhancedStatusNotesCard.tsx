import {
    Badge,
    Card,
    NoData,
    useWorldwideStudentDataRestriction,
} from '@components'
import { ScrollArea } from '@components/ui/scroll-area'
import { UserRoles } from '@constants'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux'
import { motion } from 'framer-motion'
import { ClipboardCheck, Clock } from 'lucide-react'
import { useRouter } from 'next/router'

export const EnhancedStatusNotesCard = ({
    rtoUserId,
}: {
    rtoUserId?: number
}) => {
    const router = useRouter()
    const wpId = router.query.id
    const { data, isLoading, isError } =
        RtoV2Api.PlacementRequests.useStudentPlacementStatusCheckNotes(wpId, {
            skip: !wpId,
        })

    const rtoUserDataId = useAppSelector(
        (state) => state.rto.rtoDetail?.user?.id
    )
    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoUserDataId || rtoUserId,
    })

    return (
        <Card noPadding className="border-0 shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-[#044866] to-[#0D5468] px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                    <ClipboardCheck className="h-5 w-5" />
                    <h3 className="font-semibold">Status Check Notes</h3>
                </div>
                <p className="text-white/80 text-xs mt-1">
                    Complete audit trail of status changes
                </p>
            </div>

            <div className="p-6">
                <ScrollArea className="max-h-96 overflow-auto">
                    <div className="space-y-3 pr-3">
                        {isError && <NoData isError />}
                        {data && data?.length > 0
                            ? data?.map((note: any, index: number) => {
                                  const isManualNote =
                                      note.status === 'Manual Note'
                                  const isQuickAction = [
                                      'On Hold',
                                      'Cancelled',
                                      'Terminated',
                                  ].includes(note.status)
                                  const isAppointmentMissed =
                                      note.status === 'Appointment Missed'

                                  const authorName =
                                      note?.author?.role ===
                                          UserRoles.STUDENT && !hasPermission
                                          ? 'Student'
                                          : note?.author?.name

                                  return (
                                      <motion.div
                                          key={index}
                                          initial={{
                                              opacity: 0,
                                              x: -20,
                                          }}
                                          animate={{
                                              opacity: 1,
                                              x: 0,
                                          }}
                                          transition={{
                                              delay: index * 0.05,
                                          }}
                                          className={`relative p-4 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all ${
                                              isManualNote
                                                  ? 'bg-linear-to-br from-blue-50 to-indigo-50/50 border-blue-500'
                                                  : isAppointmentMissed
                                                    ? 'bg-linear-to-br from-red-50 to-rose-50/50 border-red-500'
                                                    : isQuickAction
                                                      ? 'bg-linear-to-br from-amber-50 to-orange-50/50 border-amber-500'
                                                      : 'bg-linear-to-br from-slate-50 to-blue-50/50 border-[#044866]'
                                          }`}
                                      >
                                          <div className="flex items-start justify-between mb-3">
                                              {/* <Badge
                                                  text={note?.author?.name}
                                                  Icon={
                                                      isManualNote
                                                          ? MessageSquare
                                                          : isAppointmentMissed
                                                          ? Flag
                                                          : undefined
                                                  }
                                                  className={`border-0 shadow-sm ${
                                                      isManualNote
                                                          ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white'
                                                          : isAppointmentMissed
                                                          ? 'bg-linear-to-r from-red-500 to-rose-500 text-white'
                                                          : isQuickAction
                                                          ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white'
                                                          : 'bg-linear-to-r from-[#044866] to-[#0D5468] text-white'
                                                  }`}
                                              /> */}

                                              <span className="font-medium text-slate-900 capitalize">
                                                  {note?.title ?? '---'}
                                              </span>

                                              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                  <Clock className="h-3 w-3" />
                                                  {note?.updatedAt.slice(
                                                      0,
                                                      10
                                                  ) ?? '__'}
                                              </div>
                                          </div>
                                          <p
                                              dangerouslySetInnerHTML={{
                                                  __html: note?.body ?? '',
                                              }}
                                              className="text-slate-900 text-sm leading-relaxed max-h-56 overflow-auto"
                                          />
                                          {note?.author && (
                                              <div className="flex justify-end">
                                                  <Badge
                                                      text={authorName}
                                                      variant="info"
                                                  />
                                              </div>
                                          )}
                                          {/* <div
                                              className={`flex items-center gap-2 mt-3 pt-3 border-t ${
                                                  isManualNote
                                                      ? 'border-blue-200'
                                                      : isAppointmentMissed
                                                      ? 'border-red-200'
                                                      : isQuickAction
                                                      ? 'border-amber-200'
                                                      : 'border-slate-200'
                                              }`}
                                          >
                                              <div
                                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                      isManualNote
                                                          ? 'bg-blue-500/10'
                                                          : isAppointmentMissed
                                                          ? 'bg-red-500/10'
                                                          : isQuickAction
                                                          ? 'bg-amber-500/10'
                                                          : 'bg-[#044866]/10'
                                                  }`}
                                              >
                                                  <User
                                                      className={`h-3 w-3 ${
                                                          isManualNote
                                                              ? 'text-blue-600'
                                                              : isAppointmentMissed
                                                              ? 'text-red-600'
                                                              : isQuickAction
                                                              ? 'text-amber-600'
                                                              : 'text-[#044866]'
                                                      }`}
                                                  />
                                              </div>
                                              <span className="text-slate-600 text-xs">
                                                  By:{' '}
                                              </span>
                                          </div> */}
                                      </motion.div>
                                  )
                              })
                            : !isError && (
                                  <NoData text="No status note found" />
                              )}
                    </div>
                </ScrollArea>
            </div>
        </Card>
    )
}

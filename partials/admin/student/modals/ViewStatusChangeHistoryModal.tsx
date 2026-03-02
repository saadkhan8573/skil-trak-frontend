import { Modal, Typography } from '@components'
import React from 'react'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'
import moment from 'moment'

export const ViewStatusChangeHistoryModal = ({
    onCancel,
    updatedStatus,
}: {
    onCancel: () => void
    updatedStatus: any
}) => {
    return (
        <Modal
            title="Status Change History"
            subtitle="View Student Workplace Status Change History"
            showActions={false}
            onCancelClick={onCancel}
        >
            <div className={'flex flex-col gap-y-1.5'}>
                {updatedStatus?.map((wpStatus: any, i: number, list: any) => {
                    const date1 = moment(list?.[i - 1]?.date as any)
                    const date2 = moment(wpStatus?.date as any)

                    // Calculate the difference in days
                    const difference = date2.diff(date1, 'days')

                    return (
                        <div
                            className={
                                'flex justify-between items-center gap-x-8 bg-gray-200 px-3 py-1.5 rounded-md'
                            }
                        >
                            <Typography variant={'small'} medium>
                                {wpStatus?.text}
                            </Typography>
                            <Typography variant={'small'} bold>
                                {moment(wpStatus?.date).format(
                                    'MMM DD, YYYY [at] hh:mm:ss a'
                                )}
                            </Typography>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}

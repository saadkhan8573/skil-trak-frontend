import { useEffect, useState } from 'react'
import { EmptyData, LoadingAnimation, TechnicalError } from '@components'
import { useSocketListener } from '@hooks'
import { TicketMessageCard } from '@partials/common/Tickets'
import { CommonApi } from '@queries'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import {
    Button,
    Card,
    Select,
    TextInput,
} from '@components'

export const ForwardTicket = ({ ticketDetail }: any) => {
    const [subAdminId, setSubAdminId] = useState(null)
    const formMethods = useForm({
        mode: 'all',
        // resolver: yupResolver(validationSchema),
    })
    const [forwardTicket, resultForwardTicket] =
        CommonApi.Tickets.useForwardTicket()

    const subAdminOptions = ticketDetail?.course?.subadmin?.map(
        (subAdmin: any) => ({
            label: subAdmin?.user?.name,
            value: subAdmin?.user?.id,
        })
    )

    const onSubmit = () => {
        forwardTicket({ userId: subAdminId, id: ticketDetail?.id })
    }
    return (
        <>
            <Select
                label={'Forward To'}
                name={'assignedTo'}
                placeholder={'Forward TO...'}
                options={subAdminOptions}
                // value={subAdminId}
                // loading={ticketDetail?.isLoading}
                // disabled={ticketDetail?.isLoading}
                onChange={(e: any) => {
                    setSubAdminId(e)
                }}
                onlyValue
            />

            <Button
                text="Forward Ticket"
                onClick={() => {
                    onSubmit()
                }}
                loading={resultForwardTicket?.isLoading}
                disabled={resultForwardTicket?.isLoading || subAdminId === null}
            />
        </>
    )
}

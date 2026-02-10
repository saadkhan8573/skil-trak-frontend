import { Badge, Button, Card, OutsideClickHandler, Select, TextInput, Typography } from '@components'
import { CalendarStyles } from '@components/Calendar/style'
import { AdminApi } from '@queries'
import { debounce } from 'lodash'
import moment from 'moment'
import { useRouter } from 'next/router'
import { FilterType } from '@pages/portals/sub-admin/history'
import { useCallback } from 'react'
import Calendar from 'react-calendar'


export const HistoryFilters = ({
    filterType,
    isCustomRange,
    setFilterType,
    customRangeDate,
    setIsCustomRange,
    setSearchedValue,
    setCustomRangeDate,
    setSubAdminId,
}: {
    filterType: any
    isCustomRange: any
    setFilterType: any
    customRangeDate: any
    setIsCustomRange: any
    setSearchedValue: any
    setSubAdminId?: any
    setCustomRangeDate: ({
        startDate,
        endDate,
    }: {
        startDate: Date
        endDate: Date
    }) => void
}) => {
    const router = useRouter()
    const delayedSearch = useCallback(
        debounce((value) => setSearchedValue(value), 700),
        []
    )
    const { data, isLoading, isError } =
        AdminApi.SubAdmins.useSubAdminAsAdminList()
    const subAdminOptions = data?.map((subAdmin: any) => ({
        label: subAdmin?.user?.name,
        value: subAdmin?.user?.id,
    }))

    return (
        <div className="flex items-start gap-x-2">
            <div className="min-w-32">
                <TextInput
                    name={'history'}
                    showError={false}
                    placeholder={'Search History...'}
                    onChange={(e: any) => delayedSearch(e.target.value)}
                />
            </div>
            {router.pathname ===
                '/portals/admin/sub-admin-as-admin-activities' && (
                    <div className="w-full">
                        <Select
                            // label={'Filter By Sub Admin'}
                            name={'subAdmin'}
                            placeholder={'Filter Subadmin...'}
                            options={subAdminOptions}
                            // value={subAdminId}
                            // loading={isLoading}
                            // disabled={isLoading}
                            onChange={(e: any) => {
                                setSubAdminId(e)
                            }}
                            onlyValue
                        />
                    </div>
                )}

            <Typography>
                <span className="font-semibold whitespace-pre mt-1.5 block">
                    <Badge
                        text={
                            filterType === FilterType.Today
                                ? 'Today'
                                : filterType === FilterType.Range
                                    ? customRangeDate?.startDate &&
                                    customRangeDate?.endDate &&
                                    `${moment(customRangeDate?.startDate).format(
                                        'MMM, DD YYYY'
                                    )} - ${moment(
                                        customRangeDate?.endDate
                                    ).format('MMM, DD YYYY')}`
                                    : filterType === FilterType['7Days']
                                        ? 'Last 7 Days'
                                        : 'Last 7 Days'
                        }
                        variant={'info'}
                    />
                </span>
            </Typography>
            <Button
                text={'Today'}
                variant={'action'}
                onClick={() => {
                    setFilterType(FilterType.Today)
                }}
            />
            <div className="shrink-0">
                <Button
                    text={'Last 7 Days'}
                    variant={'dark'}
                    onClick={() => {
                        setFilterType(FilterType['7Days'])
                    }}
                />
            </div>
            <div className="relative">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setIsCustomRange(false)
                    }}
                >
                    <Button
                        text={'Range'}
                        variant={'secondary'}
                        onClick={() => {
                            setFilterType(FilterType.Range)
                            setIsCustomRange(!isCustomRange)
                        }}
                    />

                    {isCustomRange && (
                        <div className="absolute top-full right-0 shrink-0 z-50 min-w-[550px] mt-5">
                            <Card>
                                <div className="flex justify-between w-[inherit]">
                                    <CalendarStyles>
                                        <Calendar
                                            onChange={(e: any) => {
                                                setCustomRangeDate({
                                                    ...customRangeDate,
                                                    startDate: e,
                                                })
                                            }}
                                            value={customRangeDate?.startDate}
                                        />
                                    </CalendarStyles>
                                    <CalendarStyles>
                                        <Calendar
                                            onChange={(e: any) => {
                                                setCustomRangeDate({
                                                    ...customRangeDate,
                                                    endDate: e,
                                                })
                                            }}
                                            value={customRangeDate?.endDate}
                                        />
                                    </CalendarStyles>
                                </div>
                            </Card>
                        </div>
                    )}
                </OutsideClickHandler>
            </div>
        </div>
    )
}

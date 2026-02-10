import { ActionButton, Button, OutsideClickHandler, SidebarCalendar, Typography } from '@components'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import moment, { Moment } from 'moment'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import {
    BiMonthlyRecurringTasks,
    DailyRecurringTasks,
    MonthlyRecurringTasks,
    QuarterlyRecurringTasks,
    WeeklyRecurringTasks,
} from '../tabs'

import { RemoveAllTodosModal } from '../modal/RemoveAllTodosModal'
import { AddAllTodosModal } from '../modal/AddAllTodosModal'

type TabProps = {
    label: string
    slug: string // unique key for query param
    element: any
}

const tabs: TabProps[] = [
    {
        label: 'Daily Recurring Tasks',
        slug: 'daily-recurring-tasks',
        element: DailyRecurringTasks,
    },
    {
        label: 'Weekly Recurring Tasks',
        slug: 'weekly-recurring-tasks',
        element: WeeklyRecurringTasks,
    },
    {
        label: 'Monthly Recurring Tasks',
        slug: 'monthly-recurring-tasks',
        element: MonthlyRecurringTasks,
    },
    {
        label: 'Bi-Monthly Recurring Tasks',
        slug: 'student-move-to-flashing',
        element: BiMonthlyRecurringTasks,
    },
    {
        label: 'Quarterly Recurring Tasks',
        slug: 'quarterly-recurring-tasks',
        element: QuarterlyRecurringTasks,
    },
]

export const TodoTabs = ({ baseUrl }: { baseUrl?: string }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState<Moment | null>(null)
    const [endDate, setEndDate] = useState<Moment | null>(null)
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [filterDate, setFilterDate] = useState<Date | null>(null)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const role = getUserCredentials()?.role

    const tabSlug = searchParams.get('tab')
    const activeTabIndex =
        tabs.findIndex((tab) => tab.slug === tabSlug) === -1
            ? 0
            : tabs.findIndex((tab) => tab.slug === tabSlug)

    const handleTabChange = (index: number) => {
        // const slug = tabs[index].slug
        // const params = new URLSearchParams(searchParams.toString())
        // params.set('tab', slug)
        // router.replace(`?${params.toString()}`, { scroll: false })
    }

    const handleTabChangee = (slug: string) => {
        router.push({
            pathname: baseUrl,
            query: { tab: slug },
        })
    }

    const handleDatesChange = (date: Date) => {
        setFilterDate(date)
    }

    const Component = tabs[activeTabIndex].element

    const onCancel = () => setModal(null)

    const onAddTodos = () => {
        setModal(<AddAllTodosModal onCancel={onCancel} />)
    }
    const onRemoveTodos = () => {
        setModal(<RemoveAllTodosModal onCancel={onCancel} />)
    }

    return (
        <div className="">
            {modal}
            {/* <div className="flex justify-end items-center gap-x-2 mb-2">
                <Button
                    variant="success"
                    onClick={() => {
                        onAddTodos()
                    }}
                    text={'Add All Todos (Testing)'}
                />
                <Button
                    variant="error"
                    onClick={() => {
                        onRemoveTodos()
                    }}
                    text={'Remove All Todos (Testing)'}
                />
            </div> */}
            <div className="flex gap-x-0.5 justify-between mb-4  bg-[#F6F8FA] border border-[#EDEDED] rounded-lg p-0.5 ">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.slug}
                        onClick={() => handleTabChangee(tab.slug)}
                        className={` py-1.5 rounded-lg ${role === UserRoles.ADMIN
                                ? 'text-[13px] px-9'
                                : 'text-sm px-14'
                            }  ${index === activeTabIndex
                                ? 'bg-white shadow-sm text-link border border-[#1436B033]/20'
                                : ' text-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <OutsideClickHandler onOutsideClick={() => setShowFilter(false)}>
                <div className="relative">
                    <div className="flex justify-between">
                        <div>
                            <Typography variant="label" color="text-gray-600">
                                Selected Date
                            </Typography>
                            <Typography variant="small" color="text-gray-500">
                                {filterDate
                                    ? moment(filterDate).format('DD MMMM YYYY')
                                    : '---'}
                            </Typography>
                        </div>
                        <Button
                            onClick={() => {
                                setShowFilter(!showFilter)
                            }}
                            text="Filter"
                            variant="action"
                        />
                    </div>
                    {showFilter && (
                        <div className="absolute top-full right-0 bg-white mt-2 w-80">
                            <SidebarCalendar
                                setSelectedDate={handleDatesChange}
                            />
                        </div>
                    )}
                </div>
            </OutsideClickHandler>

            {/* Active Tab Content */}
            <div>
                <Component
                    // {...(filterDate
                    //     ? {
                    //           filterDate:
                    //               moment(filterDate).format('yyyy-MM-DD'),
                    //       }
                    //     : {})}
                    filterDate={moment(filterDate || new Date()).format(
                        'yyyy-MM-DD'
                    )}
                    filterDates={{ startDate, endDate }}
                />
            </div>
        </div>
    )
}

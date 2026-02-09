import classNames from 'classnames'
import moment from 'moment'
import { ToolbarProps } from 'react-big-calendar'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { CalendarEvent } from './BigCalendar'

export const CustomToolbar = (toolbar: ToolbarProps<CalendarEvent, object>) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV')
    }

    const goToNext = () => {
        // switch (toolbar.view) {
        //     case 'day':
        //         toolbar.date.setDate(toolbar.date.getDate() + 1)
        //         break

        //     case 'week':
        //         toolbar.date.setDate(toolbar.date.getDate() + 1)
        //         break

        //     case 'month':
        //         toolbar.date.setDate(toolbar.date.getMonth() + 1)
        //         break
        // }
        toolbar.onNavigate('NEXT')
    }

    const goToCurrent = () => {
        // const now = new Date()
        // toolbar.date.setMonth(now.getMonth())
        // toolbar.date.setYear(now.getFullYear())
        toolbar.onNavigate('TODAY')
    }

    const goToDayView = () => {
        toolbar.onView('day')
    }

    const goToWeekView = () => {
        toolbar.onView('week')
    }

    const goToMonthView = () => {
        toolbar.onView('month')
    }

    const getLabelByView = () => {
        const date = moment(toolbar.date)
        switch (toolbar.view) {
            case 'day':
                return (
                    <span>
                        {date.format('MMMM')} {date.format('DD')},{' '}
                        {date.format('YYYY')}
                    </span>
                )

            case 'week':
                return <span>{toolbar.label}</span>

            case 'month':
                return (
                    <span>
                        {date.format('MMMM')}, {date.format('YYYY')}
                    </span>
                )
        }
    }

    const label = () => {
        return <div className="text-sm font-medium">{getLabelByView()}</div>
    }

    const viewButtonClasses = classNames({
        'px-4 py-1 rounded-lg text-sm hover:bg-gray-200': true,
    })

    const viewButtonActiveClass = 'bg-red-500 text-white hover:bg-red-400'
    const viewButtonInActiveClass = 'text-gray-500'

    const monthButtonClass = classNames({
        [viewButtonActiveClass]: toolbar.view === 'month',
        [viewButtonInActiveClass]: toolbar.view !== 'month',
    })

    const dayButtonClass = classNames({
        [viewButtonActiveClass]: toolbar.view === 'day',
        [viewButtonInActiveClass]: toolbar.view !== 'day',
    })

    const weekButtonClass = classNames({
        [viewButtonActiveClass]: toolbar.view === 'week',
        [viewButtonInActiveClass]: toolbar.view !== 'week',
    })

    return (
        <div className={'flex justify-between items-center py-2'}>
            {/* Navigation */}
            <div className={'flex items-stretch justify-between gap-x-0.5'}>
                <button
                    className={
                        'px-2 py-2 rounded-l-md bg-gray-200 hover:bg-gray-300'
                    }
                    onClick={goToBack}
                >
                    <FaChevronLeft />
                </button>
                <button
                    className={'text-sm px-4 bg-gray-200 hover:bg-gray-300'}
                    onClick={goToCurrent}
                >
                    Today
                </button>
                <button
                    className={
                        'px-2 py-2 rounded-r-md bg-gray-200 hover:bg-gray-300'
                    }
                    onClick={goToNext}
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Label */}
            <label className={''}>{label()}</label>

            {/* Calendar View */}
            <div className="flex items-center">
                <button
                    onClick={goToDayView}
                    className={`${viewButtonClasses} ${dayButtonClass}`}
                >
                    Day
                </button>
                <button
                    className={`${viewButtonClasses} ${weekButtonClass}`}
                    onClick={goToWeekView}
                >
                    Week
                </button>
                <button
                    className={`${viewButtonClasses} ${monthButtonClass}`}
                    onClick={goToMonthView}
                >
                    Month
                </button>
            </div>
        </div>
    )
}

// moment.locale('en')
// BigCalendar.momentLocalizer(moment)

// const Calendar = (props) => {
//     return (
//         <div className={sCalendar['layout']}>
//             <BigCalendar
//                 events={props.events}
//                 timeslots={4}
//                 components={{
//                     toolbar: CustomToolbar,
//                 }}
//                 onSelectEvent={props.onSelectEvent}
//             />
//         </div>
//     )
// }

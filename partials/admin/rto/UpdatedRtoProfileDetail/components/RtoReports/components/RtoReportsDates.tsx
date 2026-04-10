import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { RtoReportDateCard } from '../Cards'
import { User } from '@types'
import { NoData } from '@components'
import moment from 'moment'

export const RtoReportsDates = ({
    user,
    startDate,
    createdAt,
    onSetDates,
}: {
    startDate: Date
    onSetDates: (startDate: string, endDate: string) => void
    user?: User
    createdAt: Date
}) => {
    const [width, setWidth] = useState<number | null>(null)

    const ref = useRef<any>(null)
    const dates = () => {
        const currentDate = new Date() // Current date
        const maxWeeks = 20
        const dateObjects = []

        // Function to get the start of the week (Monday)
        const getStartOfWeek = (date: Date) => {
            const dayOfWeek = date.getDay()
            const difference = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 6 : 1 // Adjust for Sunday
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - difference
            )
        }

        // Calculate the start of the current week (Monday)
        const startOfWeek = getStartOfWeek(currentDate)

        // Calculate the difference in weeks
        const weeksDifference = createdAt
            ? Math.floor(
                  (currentDate.getTime() - new Date(createdAt).getTime()) /
                      (7 * 24 * 60 * 60 * 1000)
              )
            : 0

        // Determine the number of weeks to generate, capped at 20 weeks
        const numberOfWeeks = Math.min(weeksDifference, maxWeeks)

        for (let i = 0; i < numberOfWeeks; i++) {
            const startDate = new Date(startOfWeek)
            startDate.setDate(startDate.getDate() - i * 7) // Decrement by a week

            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 6) // End of the week (Sunday)

            const dateObject = {
                startDate: startDate.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                endDatee: endDate.toISOString().slice(0, 10),
            }

            dateObjects.push(dateObject)
        }

        return dateObjects.reverse() // Reverse the array to start from the current date
    }
    const dateObjects = dates()

    const lastDate = dateObjects?.[dateObjects?.length - 1]
    useEffect(() => {
        if (dateObjects && dateObjects?.length > 0) {
            onSetDates(lastDate?.startDate, lastDate?.endDatee)
        }
    }, [])

    useEffect(() => {
        if (dateObjects && dateObjects?.length > 0) {
            if (ref?.current) {
                setWidth(ref?.current?.offsetWidth)
            }
        }
    }, [ref, startDate])

    return (
        <div ref={ref} className="">
            {dateObjects && dateObjects?.length > 0 ? (
                <div
                    className="flex items-center gap-x-2.5 overflow-x-auto custom-scrollbar"
                    style={{
                        width: `${width}px`,
                    }}
                >
                    {dateObjects?.reverse().map((dateObject: any) => (
                        <RtoReportDateCard
                            key={dateObject?.startDate}
                            dateObject={dateObject}
                            onClick={() => {
                                onSetDates(
                                    dateObject?.startDate,
                                    dateObject?.endDatee
                                )
                            }}
                            active={
                                dateObject?.startDate ===
                                moment(startDate).format('YYYY-MM-DD')
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white">
                    <NoData text={'No Report Dates were found'} simple />
                </div>
            )}
        </div>
    )
}

import moment from 'moment'

interface TimeSlot {
    time: string
    available: boolean
    id: number
}

export interface AvailableDay {
    date: string
    dayName: string
    dayNumber: number
    month: string
    slots: TimeSlot[]
    dates?: any
}

interface ApiSlot {
    id: number
    isActive: boolean
    day: string | null
    startTime: string
    endTime: string
}

export interface AvailabilityData {
    id: number
    type: string
    isActive: boolean
    startDate?: string | null
    endDate?: string | null
    slots: ApiSlot[]
    dates: any
}

export const generateAvailabilityDays = (
    availability: AvailabilityData
): AvailableDay[] => {
    if (!availability?.slots?.length) return []

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const availableDays: AvailableDay[] = []

    /* =======================
       MONTHLY (NEW STRUCTURE)
       ======================= */
    if (availability.type === 'monthly' && availability?.dates?.length) {
        availability?.dates?.forEach((dateItem: any) => {
            if (!dateItem.isActive) return

            const currentDate = new Date(dateItem.date)
            const dayOfWeek = currentDate.getDay()

            const year = currentDate.getFullYear()
            const month = (currentDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')
            const day = currentDate.getDate().toString().padStart(2, '0')
            const formattedDate = `${year}-${month}-${day}`

            const timeSlots: TimeSlot[] = []

            availability.slots.forEach((slot) => {
                if (!slot.isActive) return

                const [startHour] = slot.startTime.split(':').map(Number)
                const [endHour] = slot.endTime.split(':').map(Number)

                for (let hour = startHour; hour <= endHour; hour++) {
                    const period = hour >= 12 ? 'PM' : 'AM'
                    const displayHour =
                        hour > 12 ? hour - 12 : hour === 0 ? 12 : hour

                    timeSlots.push({
                        time: `${displayHour
                            .toString()
                            .padStart(2, '0')}:00 ${period}`,
                        available: true,
                        id: slot.id,
                    })
                }
            })

            if (timeSlots.length) {
                availableDays.push({
                    date: formattedDate,
                    dayName: dayNames[dayOfWeek],
                    dayNumber: currentDate.getDate(),
                    month: monthNames[currentDate.getMonth()],
                    slots: timeSlots,
                })
            }
        })

        return availableDays
    }

    /* =======================
       WEEKLY (MODIFIED: NEXT 7 DAYS)
       ======================= */
    const dayMap: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    }

    // Iterate through the next 7 days (including today)
    for (let i = 0; i < 7; i++) {
        const currentDate = moment().add(i, 'days').toDate()
        const dayOfWeek = currentDate.getDay()
        const formattedDate = moment(currentDate).format('YYYY-MM-DD')

        const dayName = Object.keys(dayMap).find(
            (key) => dayMap[key] === dayOfWeek
        )

        const daySlots = availability.slots.filter(
            (slot) => slot.isActive && slot.day?.toLowerCase() === dayName
        )

        if (!daySlots.length) continue

        const timeSlots: TimeSlot[] = []

        daySlots.forEach((slot: any) => {
            const [startHour] = slot.startTime.split(':').map(Number)
            const [endHour] = slot.endTime.split(':').map(Number)

            for (let hour = startHour; hour <= endHour; hour++) {
                const period = hour >= 12 ? 'PM' : 'AM'
                const displayHour =
                    hour > 12 ? hour - 12 : hour === 0 ? 12 : hour

                timeSlots.push({
                    time: `${displayHour
                        .toString()
                        .padStart(2, '0')}:00 ${period}`,
                    available: true,
                    id: slot.id,
                })
            }
        })

        if (timeSlots?.length) {
            availableDays.push({
                date: formattedDate,
                dayName: dayNames[dayOfWeek],
                dayNumber: currentDate.getDate(),
                month: monthNames[currentDate.getMonth()],
                slots: timeSlots,
            })
        }
    }

    return availableDays
}

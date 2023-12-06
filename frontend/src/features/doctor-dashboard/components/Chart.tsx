import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import Title from './Title'
//import { Tooltip } from '@mui/material';
//import { Tooltip } from '@mui/material';

type SlotsPerDay = Record<string, number>

// Generate Sales Data
function createData(timeSlots: Date[]) {
  const slotsPerDay: SlotsPerDay = {}

  // Loop through the time slots and count slots per day
  timeSlots.forEach((slot) => {
    const date = slot.toDateString()

    if (!slotsPerDay[date]) {
      slotsPerDay[date] = 1
    } else {
      slotsPerDay[date]++
    }
  })

  // Convert slots per day to an array of objects
  const data = Object.entries(slotsPerDay).map(([date, count]) => ({
    time: date,
    amount: count,
  }))

  return data
}

export default function Chart({
  availableTimeSlots,
}: {
  availableTimeSlots?: Date[]
}) {
  const theme = useTheme()

  const parsedTimeSlots = availableTimeSlots?.map(
    (slotString) => new Date(slotString)
  )

  // Check if parsedTimeSlots is defined and is an array
  const data =
    parsedTimeSlots && Array.isArray(parsedTimeSlots)
      ? createData(parsedTimeSlots)
      : []

  return (
    <React.Fragment>
      <Title>Working Slots Rate</Title>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />

          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={{ r: 5, fill: theme.palette.primary.main }} // Customize the appearance of data points
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}

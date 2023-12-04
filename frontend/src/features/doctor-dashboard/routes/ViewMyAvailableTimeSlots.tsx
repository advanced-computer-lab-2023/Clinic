import { addAvailableTimeSlots, getDoctor } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import AddIcon from '@mui/icons-material/Add'
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { useState } from 'react'
import dayjs from 'dayjs'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function ViewMyAvailableTimeSlots() {
  const [fromDate, setFromDate] = useState(dayjs)
  const [ToDate, setToDate] = useState(dayjs)
  const { user } = useAuth()
  const query = useQuery({
    queryFn: () => getDoctor(user!.username),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  if (query.data?.availableTimes == null) {
    return (
      <Button size="small" startIcon={<AddIcon />}>
        Add Available Time Slots
      </Button>
    )
  }

  function handleAdd() {
    const fromTime = fromDate.toDate()
    const toTime = ToDate.toDate()
    const currentDate = new Date()
    const timeSlots = []

    if (
      currentDate.getMonth() !== fromTime.getMonth() ||
      currentDate.getFullYear() !== fromTime.getFullYear()
    )
      toast.error('You should enter dates within this month and year')
    else if (fromTime.getDate() !== toTime.getDate())
      toast.error('The from date and To date must be on the same day')
    else if (
      fromTime.getHours() > toTime.getHours() ||
      (fromTime.getHours() == toTime.getHours() &&
        fromTime.getMinutes() >= toTime.getMinutes())
    )
      toast.error('The from time must be before the to time')
    else if (fromTime.getTime() <= currentDate.getTime())
      toast.error('You can only add future dates')
    else {
      for (
        let i = 0;
        i <
        Math.floor((toTime.getTime() - fromTime.getTime()) / (1000 * 60 * 60));
        i++
      ) {
        const startDateTime = new Date(
          fromTime.getTime() + (i + 2) * 1000 * 60 * 60
        )
        timeSlots.push(startDateTime)
      }

      timeSlots.forEach((time) => {
        addAvailableTimeSlots({ time })
      })

      query.refetch()
      toast.success('Time slot(s) added successfully')
    }
  }

  return (
    <>
      <ToastContainer />
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="text.secondary">
                Your Available Time Slots in this month
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {query.data?.availableTimes.map((time) => (
                <Typography variant="body1">{time.toString()}</Typography>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Grid item xl={3}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" color="text.secondary">
                  Add the Time Slots you are available in within this month
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <DateTimePicker
                  label="From"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue!)}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
                <DateTimePicker
                  label="To"
                  value={ToDate}
                  onChange={(newValue) => setToDate(newValue!)}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    handleAdd()
                  }}
                >
                  Add Time Slot
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

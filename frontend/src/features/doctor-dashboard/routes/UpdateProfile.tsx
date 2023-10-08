import { getDoctor, updateDoctor } from '@/api/doctor'
import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAlerts } from '@/hooks/alerts'
import { useAuth } from '@/hooks/auth'
import { Alert } from '@/providers/AlertsProvider'
import { UpdateDoctorRequest } from '@/types/doctor.types'
import { UpdateDoctorRequestValidator } from '@/validators/doctor.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, Stack, TextField } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'

export function UpdateProfile() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdateDoctorRequest>({
    resolver: zodResolver(UpdateDoctorRequestValidator),
  })
  const { user } = useAuth()
  const { addAlert } = useAlerts()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['doctors', user!.username],
    queryFn: () => getDoctor(user!.username),
  })
  const mutation = useMutation({
    mutationFn: (data: UpdateDoctorRequest) =>
      updateDoctor(user!.username, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctors', user!.username],
      })
      addAlert(
        new Alert('Profile updated successfully!', 'success', 'profile-form')
      )
    },
    onError: (e) => {
      console.log(e)
      addAlert(new Alert('Failed to update profile!', 'error'))
    },
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutateAsync(data))}>
      <Card>
        <AlertsBox scope="profile-form" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message as string}
              defaultValue={query.data?.email}
            />
            <TextField
              fullWidth
              label="Hourly Rate"
              {...register('hourlyRate', {
                valueAsNumber: true,
              })}
              error={!!errors.hourlyRate}
              helperText={errors.hourlyRate?.message as string}
              defaultValue={query.data?.hourlyRate}
            />
            <TextField
              fullWidth
              label="Affiliation"
              {...register('affiliation')}
              error={!!errors.affiliation}
              helperText={errors.affiliation?.message as string}
              defaultValue={query.data?.affiliation}
            />

            <LoadingButton loading={mutation.isLoading} type="submit">
              Update
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </form>
  )
}

import { AlertsBox } from '@/components/AlertsBox'
import { useAlerts } from '@/hooks/alerts'
import { useAuth } from '@/hooks/auth'
import { Alert } from '@/providers/AlertsProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { AddFamilyMemberRequest } from '@/types/familyMember.types'
import { AddFamilyMemberRequestValidator } from '@/validators/familyMembers.validator'
import { addFamilyMember } from '@/api/familyMembers'

export function AddFamilyMember({ onSuccess }: { onSuccess: () => void }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<AddFamilyMemberRequest>({
    resolver: zodResolver(AddFamilyMemberRequestValidator),
  })
  const { user } = useAuth()
  const { addAlert } = useAlerts()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: AddFamilyMemberRequest) =>
      addFamilyMember(user!.username, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['familyMembers'],
      })
      addAlert(new Alert('Family member added successfully!', 'success'))
      onSuccess()
      reset()
    },
    onError: (e) => {
      console.log(e)
      addAlert(
        new Alert(
          'Failed to add family member!',
          'error',
          'family-members-form'
        )
      )
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutateAsync(data))}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <AlertsBox scope="family-members-form" />
            <TextField
              fullWidth
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
            <TextField
              fullWidth
              label="National ID"
              {...register('nationalId')}
              error={!!errors.nationalId}
              helperText={errors.nationalId?.message as string}
            />
            <TextField
              fullWidth
              label="Age"
              {...register('age', {
                valueAsNumber: true,
              })}
              error={!!errors.age}
              helperText={errors.age?.message as string}
            />
            <TextField
              fullWidth
              label="Gender"
              {...register('gender')}
              error={!!errors.gender}
              helperText={errors.gender?.message as string}
            />
            <TextField
              fullWidth
              label="Relation"
              {...register('relation')}
              error={!!errors.relation}
              helperText={errors.relation?.message as string}
            />
            <LoadingButton loading={mutation.isLoading} type="submit">
              Add
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </form>
  )
}

import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAlerts } from '@/hooks/alerts'
import { Alert } from '@/providers/AlertsProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, Stack, TextField } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Path, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { v4 as uuidv4 } from 'uuid'
import { useMemo } from 'react'

export interface Field<Request extends { [key: string]: unknown }> {
  label: string
  property: Path<Request>
  valueAsNumber?: boolean
}

export function ApiForm<Request extends { [key: string]: unknown }>({
  fields,
  validator,
  initialDataFetcher,
  queryKey,
  successMessage,
  action,
  onSuccess,
  buttonText,
}: {
  fields: Field<Request>[]
  validator: Zod.AnyZodObject
  initialDataFetcher?: () => Promise<Request>
  queryKey?: string[]
  successMessage: string
  action: (data: Request) => Promise<unknown>
  onSuccess?: () => void
  buttonText?: string
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Request>({
    resolver: zodResolver(validator),
  })
  const { addAlert } = useAlerts()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey,
    enabled: !!initialDataFetcher,
    queryFn: initialDataFetcher,
  })

  const alertScope = useMemo(() => uuidv4(), [])

  const mutation = useMutation({
    mutationFn: action,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      })
      addAlert(new Alert(successMessage, 'success', alertScope))
      onSuccess?.()
    },
    onError: (e) => {
      console.log(e)
      addAlert(new Alert('Failed! Try again.', 'error', alertScope))
    },
  })

  if (queryKey && initialDataFetcher && query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutateAsync(data))}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <AlertsBox scope={alertScope} />
            {fields.map((field) => (
              <TextField
                fullWidth
                label={field.label}
                {...register(field.property, {
                  valueAsNumber: field.valueAsNumber,
                })}
                error={!!errors[field.property]}
                helperText={errors[field.property]?.message as string}
                defaultValue={query.data && query.data[field.property]}
              />
            ))}

            <LoadingButton loading={mutation.isLoading} type="submit">
              {buttonText ?? 'Submit'}
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </form>
  )
}

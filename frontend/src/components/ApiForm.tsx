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

/**
 * Used to create a form that submits to an API endpoint.
 *
 * @param fields The fields to display in the form.
 *               The `property` field is the property of the request object.
 *               The `label` field is the label of the text field.
 *              The `valueAsNumber` field is whether the value should be parsed as a number. (False by default)
 * @param validator The validator to use for the form.
 * @param initialDataFetcher The function to fetch the initial data for the form,
 *                           if not provided, the form will be empty at first.
 * @param queryKey An array of strings that uniquely identifies the query that is used to fetch the initial data
 *                 for the form. If not provided, the form will be empty at first.
 * @param successMessage The message to display when the form is successfully submitted.
 * @param action The function to call when the form is submitted.
 * @param onSuccess The function to call when the form is successfully submitted.
 * @param buttonText The text to display on the submit button.
 * 
 * @example
 * ```tsx
 * <ApiForm<UpdateDoctorRequest>
      fields={[
        { label: 'Email', property: 'email' },
        { label: 'Hourly Rate', property: 'hourlyRate', valueAsNumber: true },
        { label: 'Affiliation', property: 'affiliation' },
      ]}
      validator={UpdateDoctorRequestValidator}
      initialDataFetcher={() => getDoctor(user!.username)}
      queryKey={['doctors', user!.username]}
      successMessage="Updated doctor successfully."
      action={(data) => updateDoctor(user!.username, data)}
    />
    ```
 */
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

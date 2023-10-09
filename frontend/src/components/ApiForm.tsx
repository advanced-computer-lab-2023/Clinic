import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAlerts } from '@/hooks/alerts'
import { Alert } from '@/providers/AlertsProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Path,
  useForm,
  Controller,
  ControllerRenderProps,
  ControllerFieldState,
} from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { v4 as uuidv4 } from 'uuid'
import { useMemo } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

type ObjectWithStringKeys = { [key: string]: unknown }

export interface Field<Request extends ObjectWithStringKeys> {
  label: string
  property: Path<Request>
  valueAsNumber?: boolean
  type?: string
  selectedValues?: { label: string; value: string }[]
  customError?: string
  customComponent?: unknown
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
export function ApiForm<Request extends ObjectWithStringKeys>({
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
  const { handleSubmit, control } = useForm<Request>({
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
    onError: (e: Error) => {
      addAlert(new Alert(e.message ?? 'Failed! Try again', 'error', alertScope))
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
            {fields.map((field, i) => {
              return (
                <Controller
                  key={i}
                  name={field.property}
                  control={control}
                  render={({ field: fieldItem, fieldState }) => (
                    <>
                      {field.selectedValues ? (
                        <SelectInputField
                          field={field}
                          fieldState={fieldState}
                          fieldItem={fieldItem}
                          defaultValue={
                            query.data && query.data[field.property]
                          }
                        />
                      ) : field.type === 'date' ? (
                        <DateInputField
                          field={field}
                          fieldState={fieldState}
                          fieldItem={fieldItem}
                          defaultValue={
                            query.data && query.data[field.property]
                          }
                        />
                      ) : field.customComponent ? (
                        field.customComponent
                      ) : !field.type ? (
                        <TextInputField
                          field={field}
                          fieldState={fieldState}
                          fieldItem={fieldItem}
                          defaultValue={
                            query.data && query.data[field.property]
                          }
                        />
                      ) : null}
                    </>
                  )}
                />
              )
            })}

            <LoadingButton loading={mutation.isLoading} type="submit">
              {buttonText ?? 'Submit'}
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </form>
  )
}

type FieldComponentProps<T extends ObjectWithStringKeys> = {
  field: Field<T>
  fieldItem: ControllerRenderProps<T, Path<T>>
  fieldState: ControllerFieldState
  defaultValue?: unknown
}

const TextInputField = <T extends ObjectWithStringKeys>({
  field,
  fieldState,
  fieldItem,
  defaultValue,
}: FieldComponentProps<T>) => {
  return (
    <TextField
      fullWidth
      label={field.label}
      {...fieldItem}
      onChange={(e) => {
        if (field.valueAsNumber) {
          if (e.target.value == '' || isNaN(Number(e.target.value))) {
            fieldItem.onChange(e.target.value)
          } else {
            fieldItem.onChange(Number(e.target.value))
          }
        } else {
          fieldItem.onChange(e.target.value)
        }
      }}
      defaultValue={defaultValue}
      error={!!fieldState.error}
      helperText={fieldState.error?.message as string}
    />
  )
}

const SelectInputField = <T extends ObjectWithStringKeys>({
  field,
  fieldState,
  fieldItem,
  defaultValue,
}: FieldComponentProps<T>) => {
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel id="demo-simple-select-label">{field.label}</InputLabel>
      <Select
        label={field.label}
        {...fieldItem}
        error={!!fieldState.error}
        defaultValue={defaultValue}
      >
        {field.selectedValues?.map((value) => (
          <MenuItem value={value.value}>{value.label}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}
const DateInputField = <T extends ObjectWithStringKeys>({
  field,
  fieldState,
  fieldItem,
  defaultValue,
}: FieldComponentProps<T>) => {
  return (
    <FormControl error={!!fieldState.error}>
      <DatePicker
        label={field.label}
        {...fieldItem}
        value={dayjs(fieldItem.value as Date)}
        onChange={(date: Dayjs | null) => {
          fieldItem.onChange(date?.toDate())
        }}
        disableFuture={!!fieldState.error}
        defaultValue={dayjs(defaultValue as Date)}
      />
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}

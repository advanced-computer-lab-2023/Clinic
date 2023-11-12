import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAlerts } from '@/hooks/alerts'
import { zodResolver } from '@hookform/resolvers/zod'
import FireBase from '../../../../../firebase.config'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

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
import { useMemo, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

type ObjectWithStringKeys = { [key: string]: unknown }

export interface Field<Request extends ObjectWithStringKeys> {
  label: string
  property: Path<Request>
  valueAsNumber?: boolean
  type?: 'text' | 'number' | 'date' | 'file'
  selectedValues?: { label: string; value: string }[]
  customError?: string
  customComponent?: unknown
}

/**
 * Used to create a form that submits to an API endpoint.
 *
 * @param fields The fields to display in the form.
 *               The `property` field is the property of the request object.
 *             
 *   The `label` field is the label of the text field.
 *              The `valueAsNumber` field iss whether the value should be parsed as a number. (False by default)
 * @param validator The validator to use for the form.
 * @param initialDataFetcher The function to fetch the initial data for the form,
 *                           if not provided, the form will be empty at first.
 * @param queryKey An array of strings that uniquely identsifies the query that is used to fetch the initial data
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
export function DoctorApiForm<Request extends ObjectWithStringKeys>({
  fields,
  validator,
  initialDataFetcher,
  queryKey,
  successMessage,
  action,
  onSuccess,
  buttonText,
  file,
}: {
  fields: Field<Request>[]
  validator: Zod.AnyZodObject
  initialDataFetcher?: () => Promise<Request>
  queryKey?: string[]
  successMessage: string
  action: (data: Request) => Promise<unknown>
  // onDocumentPathsChange: (newPaths: string[]) => void;
  onSuccess?: () => void
  buttonText?: string
  file?: boolean
}) {
  const { handleSubmit, control } = useForm<Request>({
    resolver: zodResolver(validator),
  })
  const { addAlert } = useAlerts()
  const [fileError, setFileError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [documentPaths, setDocumentPaths] = useState<string[]>([])

  console.log(file)
  // useEffect(() => {
  //   console.log(documents);
  //   if(documents){
  //      handleMultipleFileUpload(documents,setDocumentPaths);
  //   console.log(documentPaths);

  //   }
  // },[documents]);
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
      addAlert({
        message: successMessage,
        severity: 'success',
        scope: alertScope,
      })
      onSuccess?.()
    },
    onError: (e: Error) => {
      addAlert({
        message: e.message ?? 'Failed! Try again',
        severity: 'error',
        scope: alertScope,
      })
    },
  })

  if (queryKey && initialDataFetcher && query.isLoading) {
    return <CardPlaceholder />
  }

  const changeData = (data: any) => {
    console.log(file)

    if (file) {
      console.log(documents)

      if (documents) {
        handleMultipleFileUpload(documents, setDocumentPaths)
        data.documents = documentPaths
        setFileError(null)
      } else {
        setFileError('Please select a file')
      }
    }

    mutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit((data) => changeData(data))}>
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
                      {field.type === 'file' ? (
                        <>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => {
                              setDocuments(e.target.files)
                              setFileError(null)
                            }}
                          />
                          {fileError && (
                            <div style={{ color: 'red' }}>{fileError}</div>
                          )}
                        </> // <InputField/>
                      ) : null}
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
  /**
   * Used only when valueAsNum is true. Because there was a problem when entering numbers,
   * when you enter 1234 it is shown correctly, but when you try to write 1234.4, you cant
   * go past the decimal sign, so this helps by storing the original string value, and transforming
   * it to number only when it is actually a number. And when displaing it displaying the original value */
  const [originalValue, setOriginalValue] = useState('')

  if (field.valueAsNumber) {
    return (
      <TextField
        fullWidth
        label={field.label}
        {...fieldItem}
        onChange={(e) => {
          if (e.target.value == '' || isNaN(Number(e.target.value))) {
            fieldItem.onChange(e.target.value)
          } else {
            fieldItem.onChange(Number(e.target.value))
          }

          setOriginalValue(e.target.value)
        }}
        value={fieldState.isDirty ? originalValue : defaultValue}
        defaultValue={defaultValue}
        error={!!fieldState.error}
        helperText={fieldState.error?.message as string}
      />
    )
  }

  return (
    <TextField
      fullWidth
      label={field.label}
      {...fieldItem}
      defaultValue={defaultValue}
      error={!!fieldState.error}
      helperText={fieldState.error?.message as string}
    />
  )
}

function generateUniqueFilename() {
  const timestamp = new Date().getTime() // Get the current timestamp
  const randomString = Math.random().toString(36).substring(2, 8) // Generate a random string

  // Combine the timestamp and random string to create a unique filename
  const uniqueFilename = `${timestamp}_${randomString}`

  return uniqueFilename
}

const handleMultipleFileUpload = async (
  fileList: FileList | null,
  setDocumentPaths: (newPaths: string[]) => void
) => {
  if (!fileList) {
    return
  }

  const files: File[] = Array.from(fileList)
  const storage = getStorage(FireBase)
  const storageRef = ref(storage, 'doctors/')

  const newDocumentPaths = [] // Create an array to store the new document paths

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const uniqueFilename = generateUniqueFilename() // Implement a function to generate unique filenames
    const fileRef = ref(storageRef, uniqueFilename)

    try {
      await uploadBytes(fileRef, file)
      const fullPath = await getDownloadURL(fileRef)
      newDocumentPaths.push(fullPath) // Store the path, not the file
      setDocumentPaths(newDocumentPaths)
      console.log(`Uploaded ${file.name} successfully!`)
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error)
    }
  }

  setDocumentPaths(newDocumentPaths)
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
        value={
          fieldState.isDirty
            ? fieldItem.value
              ? dayjs(new Date(fieldItem.value as string))
              : null
            : defaultValue
            ? dayjs(defaultValue as Date)
            : null
        }
        onChange={(date: Dayjs | null) => {
          fieldItem.onChange(date?.toDate())
        }}
        disableFuture={!!fieldState.error}
      />
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}

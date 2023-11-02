import { CardPlaceholder } from '@/components/CardPlaceholder'
import { ExpandMore, FilterList } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'

export interface Filter<T, V = any> {
  property: (obj: T) => V
  label: string
  filter: (actualValue: V, filterValue: V) => boolean
  type: 'text' | 'date' | 'boolean' | 'dateRange' | 'select'
  selectValues?: { label: string; value: V }[]
  id?: string
  defaultValue?: V
  customComponent?: (params: {
    value: V
    setValue: (val: V) => void
  }) => JSX.Element | undefined
}

export class DateRange {
  constructor(
    public from: Date | undefined,
    public to: Date | undefined
  ) {}
}

export function FilteredList<T>({
  filters,
  queryKey,
  dataFetcher,
  component,
}: {
  filters: Filter<T>[]
  dataFetcher: () => Promise<T[]>
  queryKey: string[]
  component: (item: T) => JSX.Element
}) {
  const query = useQuery({
    queryKey: queryKey,
    queryFn: dataFetcher,
  })

  filters = useMemo(() => {
    return filters.map((filter) => ({
      ...filter,
      id: filter.id || uuidv4(),
    }))
  }, [filters])

  const [filterValues, setFilterValues] = useState({
    ...Object.fromEntries(
      filters.map((filter) => [filter.id, filter.defaultValue])
    ),
  })

  const filteredValues = useMemo(() => {
    if (!query.data) return []

    return query.data.filter((item) => {
      for (const filter of filters) {
        if (
          filterValues[filter.id as string] != undefined &&
          !filter.filter(
            filter.property(item),
            filterValues[filter.id as string]
          )
        )
          return false
      }

      return true
    })
  }, [query.data, filters, filterValues])

  const hasFilters = useMemo(() => {
    return Object.values(filterValues).some(
      (val) => val !== undefined && val !== ''
    )
  }, [filterValues])

  const resetFilters = () => {
    setFilterValues(
      Object.fromEntries(filters.map((filter) => [filter.id, undefined]))
    )
  }

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <>
      <Stack
        spacing={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Container maxWidth="md">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <FilterList sx={{ mr: 2 }} />
              <Typography>Filter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {filters.map((filter) => (
                  <Grid item xs={12}>
                    {
                      {
                        text: (
                          <TextField
                            fullWidth
                            label={filter.label}
                            value={filterValues[filter.id as string]}
                            onChange={(e) =>
                              setFilterValues({
                                ...filterValues,
                                [filter.id as string]: e.target.value,
                              })
                            }
                          />
                        ),
                        date: (
                          <DateTimePicker
                            label={filter.label}
                            sx={{ width: '100%' }}
                            value={
                              filterValues[filter.id as string]
                                ? dayjs(filterValues[filter.id as string])
                                : null
                            }
                            onChange={(date) =>
                              setFilterValues({
                                ...filterValues,
                                [filter.id as string]: date?.toDate(),
                              })
                            }
                          />
                        ),
                        boolean: (
                          <FormControlLabel
                            control={
                              <Switch
                                size="medium"
                                value={filterValues[filter.id as string]}
                                onChange={(e) =>
                                  setFilterValues({
                                    ...filterValues,
                                    [filter.id as string]: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Is Filled?"
                          />
                        ),
                        dateRange: (
                          <Stack direction="row" spacing={2}>
                            <DateTimePicker
                              label={filter.label + ' From'}
                              sx={{ width: '100%' }}
                              value={
                                filterValues[filter.id as string]?.from
                                  ? dayjs(
                                      (
                                        filterValues[
                                          filter.id as string
                                        ] as DateRange
                                      ).from
                                    )
                                  : null
                              }
                              onChange={(date) => {
                                setFilterValues({
                                  ...filterValues,
                                  [filter.id as string]: new DateRange(
                                    date!.toDate(),
                                    (
                                      filterValues[
                                        filter.id as string
                                      ] as DateRange
                                    )?.to
                                  ),
                                })
                                console.log(filterValues)
                              }}
                            />
                            <DateTimePicker
                              label={filter.label + ' To'}
                              sx={{ width: '100%' }}
                              value={
                                filterValues[filter.id as string]?.to
                                  ? dayjs(
                                      (
                                        filterValues[
                                          filter.id as string
                                        ] as DateRange
                                      ).to
                                    )
                                  : null
                              }
                              onChange={(date) =>
                                setFilterValues({
                                  ...filterValues,
                                  [filter.id as string]: new DateRange(
                                    (
                                      filterValues[
                                        filter.id as string
                                      ] as DateRange
                                    )?.from,
                                    date!.toDate()
                                  ),
                                })
                              }
                            />
                          </Stack>
                        ),
                        select: (
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              {filter.label}
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label={filter.label}
                              value={filterValues[filter.id as string] ?? ''}
                              onChange={(e) =>
                                setFilterValues({
                                  ...filterValues,
                                  [filter.id as string]: e.target.value,
                                })
                              }
                            >
                              {filter.selectValues?.map(({ label, value }) => (
                                <MenuItem value={value}>{label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ),
                      }[filter.type]
                    }
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Container>
        <Grid spacing={2} container>
          {hasFilters && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {filters.map((filter) =>
                      [undefined, ''].includes(
                        filterValues[filter.id as string]
                      ) ? undefined : filter.customComponent ? (
                        filter.customComponent({
                          value: filterValues[filter.id as string],
                          setValue: (val) =>
                            setFilterValues({
                              ...filterValues,
                              [filter.id as string]: val,
                            }),
                        })
                      ) : filter.type == 'dateRange' ? (
                        <>
                          <Chip
                            label={`${filter.label}: ${
                              filterValues[filter.id as string]?.from
                                ? 'From ' +
                                  filterValues[
                                    filter.id as string
                                  ]?.from?.toLocaleString()
                                : ''
                            }
                            
                            ${
                              filterValues[filter.id as string]?.to
                                ? 'To ' +
                                  filterValues[
                                    filter.id as string
                                  ]?.to?.toLocaleString()
                                : ''
                            }`}
                            sx={{ mr: 1 }}
                            onDelete={() =>
                              setFilterValues({
                                ...filterValues,
                                [filter.id as string]: undefined,
                              })
                            }
                          />
                        </>
                      ) : (
                        <Chip
                          label={`${filter.label}: '${
                            filterValues[filter.id as string] instanceof Date
                              ? filterValues[
                                  filter.id as string
                                ].toLocaleString()
                              : filterValues[filter.id as string]
                          }'`}
                          sx={{ mr: 1 }}
                          onDelete={() =>
                            setFilterValues({
                              ...filterValues,
                              [filter.id as string]: undefined,
                            })
                          }
                        />
                      )
                    )}
                    <Chip
                      label="Reset"
                      onClick={resetFilters}
                      color="error"
                      sx={{ ml: 'auto' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {filteredValues.map((filteredValue, i) => (
            <React.Fragment key={i}>{component(filteredValue)}</React.Fragment>
          ))}
        </Grid>
      </Stack>
    </>
  )
}

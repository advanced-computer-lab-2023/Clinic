import { Card, CardContent, Stack, Typography } from '@mui/material'

export function DetailsCard({
  fields,
}: {
  fields: {
    label: string
    value: unknown
  }[]
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          {fields.map((f) => (
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                {f.label}
              </Typography>
              <Typography variant="body1">{f.value as string}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

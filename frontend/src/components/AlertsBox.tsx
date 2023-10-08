import { useAlerts } from '@/hooks/alerts'
import { Alert, Stack } from '@mui/material'

export function AlertsBox({ scope }: { scope?: string }) {
  const { alerts } = useAlerts()

  scope = scope || 'global'

  return (
    <Stack>
      {alerts
        .filter((a) => a.scope == scope)
        .map((alert) => (
          <Alert key={alert.message} severity={alert.severity}>
            {alert.message}
          </Alert>
        ))}
    </Stack>
  )
}

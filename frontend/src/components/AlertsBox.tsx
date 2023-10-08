import { useAlerts } from '@/hooks/alerts'
import { Alert } from '@mui/material'

export function AlertsBox({ scope }: { scope?: string }) {
  const { alerts } = useAlerts()

  return (
    <>
      {(scope ? alerts.filter((a) => a.scope == scope) : alerts).map(
        (alert) => (
          <Alert key={alert.message} severity={alert.severity}>
            {alert.message}
          </Alert>
        )
      )}
    </>
  )
}

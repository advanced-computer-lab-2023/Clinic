import { SnackbarKey, closeSnackbar, enqueueSnackbar } from 'notistack'
import { createContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

type AlertSeverity = 'error' | 'warning' | 'info' | 'success'

export interface Alert {
  id: string
  message: string
  severity: AlertSeverity
  scope: string
  temporary: boolean
  duration: number
}

interface AlertsContextType {
  alerts: Alert[]
  addAlert: (alert: Partial<Alert> & Pick<Alert, 'message'>) => void
  removeAlert: (alertId: string) => void
}

export const AlertsContext = createContext<AlertsContextType>(
  {} as AlertsContextType
)

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (
    options: Partial<Omit<Alert, 'id'>> & Pick<Alert, 'message'>
  ) => {
    const alert: Alert = {
      severity: 'info',
      scope: 'global',
      temporary: true,
      duration: 3000,
      id: uuid(),
      ...options,
    }

    setAlerts((alerts) => [...alerts, alert])

    let snackbarId: SnackbarKey | null = null

    if (alert.scope == 'global') {
      snackbarId = enqueueSnackbar(alert.message, {
        variant: alert.severity,
        persist: true,
      })
    }

    if (alert.temporary) {
      setTimeout(() => {
        removeAlert(alert.id), alert.duration
        if (snackbarId) closeSnackbar(snackbarId)
      }, alert.duration)
    }
  }

  const removeAlert = (alertId: string) => {
    setAlerts((alerts) => alerts.filter((a) => a.id !== alertId))
  }

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  )
}

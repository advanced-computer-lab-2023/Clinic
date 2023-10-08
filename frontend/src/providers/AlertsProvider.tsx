import { createContext, useState } from 'react'

type AlertSeverity = 'error' | 'warning' | 'info' | 'success'

export class Alert {
  constructor(
    public message: string,
    public severity: AlertSeverity = 'info',
    public scope: string = 'global',
    public temporary: boolean = true,
    public duration: number = 3000
  ) {}
}

interface AlertsContextType {
  alerts: Alert[]
  addAlert: (alert: Alert) => void
  removeAlert: (alert: Alert) => void
}

export const AlertsContext = createContext<AlertsContextType>(
  {} as AlertsContextType
)

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (alert: Alert) => {
    setAlerts((alerts) => [...alerts, alert])

    if (alert.temporary) {
      setTimeout(() => removeAlert(alert), alert.duration)
    }
  }

  const removeAlert = (alert: Alert) => {
    setAlerts((alerts) => alerts.filter((a) => a !== alert))
  }

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  )
}

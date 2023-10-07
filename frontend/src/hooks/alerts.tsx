import { AlertsContext } from '@/providers/AlertsProvider'
import { useContext } from 'react'

/**
 * Used for accessing alerts helper methods.
 *
 * The helper methods available are:
 * - `alerts` - The currently active alerts.
 * - `addAlert` - Add an alert to the list of active alerts.
 * - `removeAlert` - Remove an alert from the list of active alerts.
 */
export function useAlerts() {
  return useContext(AlertsContext)
}

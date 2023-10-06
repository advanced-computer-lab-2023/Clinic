import { OutletContextType } from '@/components/BaseLayout'
import { useOutletContext } from 'react-router-dom'

/**
 * Used when you want to change the sidebar links from a component
 * See DoctorDashboardLayout for example
 *
 * - `setSidebarLinks` - Used to set the links in the sidebar
 */
export function useSidebar() {
  return useOutletContext<OutletContextType>()
}

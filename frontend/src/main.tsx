import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'regenerator-runtime/runtime'

// https://mui.com/material-ui/getting-started/installation/#roboto-font
// import '@fontsource/roboto/300.css'
// import '@fontsource/roboto/400.css'
// import '@fontsource/roboto/500.css'
// import '@fontsource/roboto/700.css'

import '@fontsource-variable/quicksand'

import { AuthProvider } from './providers/AuthProvider'
import { AlertsProvider } from './providers/AlertsProvider'
import { SnackbarProvider } from 'notistack'
import { ToastContainer } from 'react-toastify'
import { CustomThemeProvider } from './providers/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
const router = createBrowserRouter(routes)

const currentUrl = new URL(window.location.href)

const token = currentUrl.searchParams.get('token')

if (token) {
  localStorage.setItem('token', token)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <CustomThemeProvider>
      {' '}
      {/* Custom Theme Provider wrapping all */}
      <AuthProvider>
        {' '}
        {/* Authentication Provider */}
        <QueryClientProvider client={queryClient}>
          {' '}
          {/* Query Client Provider */}
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <AlertsProvider>
              {' '}
              {/* Alerts Provider */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {' '}
                {/* Localization Provider */}
                <RouterProvider router={router} /> {/* Router Provider */}
              </LocalizationProvider>
            </AlertsProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </AuthProvider>
    </CustomThemeProvider>
    <ToastContainer />
  </>
)

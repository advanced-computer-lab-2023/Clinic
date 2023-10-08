import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes'

// https://mui.com/material-ui/getting-started/installation/#roboto-font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { AuthProvider } from './providers/AuthProvider'
import { AlertsProvider } from './providers/AlertsProvider'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AlertsProvider>
          <RouterProvider router={router} />
        </AlertsProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
)

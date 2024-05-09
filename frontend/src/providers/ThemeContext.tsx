import React, { createContext, useContext, useState, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// Extend the type to include dark mode settings
interface ThemeContextType {
  fontSize: number
  setFontSize: (fontSize: number) => void
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
  color: string
  setColor: (color: string) => void
}

// Update the default value to include the initial dark mode state
const defaultContextValue: ThemeContextType = {
  fontSize: 16,
  setFontSize: () => {},
  isDarkMode: false, // Initial mode is light
  setIsDarkMode: () => {},
  color: '#D0D0D0',
  setColor: () => {},
}

const CustomThemeContext = createContext<ThemeContextType>(defaultContextValue)

export const useCustomTheme = () => useContext(CustomThemeContext)

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState<number>(16)
  const [color, setColor] = useState<string>('#D0D0D0') // State to manage color
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false) // State to manage theme mode

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light', // Toggleable theme modes
        },
        typography: {
          fontSize, // Dynamic font size
        },
        // Additional theme configurations can be added here
      }),
    [fontSize, isDarkMode]
  )

  return (
    <CustomThemeContext.Provider
      value={{
        fontSize,
        setFontSize,
        isDarkMode,
        setIsDarkMode,
        color,
        setColor,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  )
}
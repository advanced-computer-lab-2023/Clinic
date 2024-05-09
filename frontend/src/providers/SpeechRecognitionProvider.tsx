import 'regenerator-runtime/runtime'
import React, { createContext, useContext, ReactNode, useState } from 'react'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { Button, Typography, Box, Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import MicIcon from '@mui/icons-material/Mic'
import { useCustomTheme } from './ThemeContext'

const defaultExpressionData: SpeechRecognitionContextType = {
  transcript: '',
  resetTranscript: () => {}, // Dummy function
  startListening: () => {}, // Dummy function
  handleStopListening: () => {}, // Dummy function
}

interface Urls {
  [key: string]: string // Index signature
  dashboard: string
  'family members': string
  prescriptions: string
  doctors: string
  appointments: string
  'health packages': string
  'health records': string
  pharmacy: string
}
// Creating the context
interface SpeechRecognitionContextType {
  transcript: string
  resetTranscript: () => void
  startListening: () => void
  handleStopListening: (event: React.MouseEvent<HTMLButtonElement>) => void
}
const SpeechRecognitionContext = createContext<SpeechRecognitionContextType>(
  defaultExpressionData
)

// Provider component
export const SpeechRecognitionProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [showControls, setShowControls] = useState(false)
  const { setIsDarkMode, setFontSize } = useCustomTheme() // Now you can access these values and setters

  const urls: Urls = {
    dashboard: '/',
    'family members': '/patient-dashboard/family-members',
    prescriptions: '/patient-dashboard/prescriptions',
    doctors: '/patient-dashboard/approved-doctors',
    appointments: '/patient-dashboard/appointments',
    'health packages': '/patient-dashboard/health-packages',
    'health records': '/patient-dashboard/MyMedicalHistory',
    pharmacy: '/patient-dashboard/pharmacy',
  }

  const handleNavigation = (pageName: string) => {
    const path = urls[pageName]

    if (path) {
      navigate(path)
      setErrorMessage('') // Clear any previous error message
    } else {
      setErrorMessage("Sorry, couldn't find the page you wanted.")
    }
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const commands = [
    {
      command: [
        'Go to (the) * (please)',
        'Open (the) * (please)',
        'take me to (the) * (please)',
      ],
      callback: (pageName: string) => handleNavigation(pageName),
    },
    {
      command: ['Switch to dark mode', 'Switch to night mode'],
      callback: () => setIsDarkMode(true),
    },
    {
      command: 'Switch to light mode',
      callback: () => setIsDarkMode(false),
    },
    {
      command: 'unmatched',
      callback: () => {
        setErrorMessage("I didn't understand that command, Please Try Again")
      },
    },
    {
      command: [
        'Increase (the) font size',
        'Increase (the) text size',
        'make (the) font (a) size bigger',
        'make (the) fonts bigger',
        'make (the) text bigger',
      ],
      callback: () => {
        setFontSize(20)
      },
    },
    {
      command: [
        'decrease (the) font size',
        'make (the) font size smaller',
        'make (the) fonts smaller',
        'make (the) text smaller',
      ],
      callback: () => {
        setFontSize(12)
      },
    },
    {
      command: ['reset font (size)', 'reset text (size)'],
      callback: () => {
        setFontSize(16)
      },
    },
  ]

  useSpeechRecognition({ commands })

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  const startListening = () => {
    setShowControls(true)
    SpeechRecognition.startListening()
  }

  const handleStartListening = (event: React.MouseEvent<HTMLButtonElement>) => {
    setErrorMessage('') // Clear any previous error message
    setShowControls(true)
    event.preventDefault()
    SpeechRecognition.startListening()
  }

  const handleStopListening = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    SpeechRecognition.stopListening()
  }

  const handleResetTranscript = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    resetTranscript()
    setErrorMessage('') // Also clear error message when resetting transcript
  }

  const boxStyle = {
    position: 'fixed',
    right: 20,
    bottom: 20,
    padding: '20px',
    borderRadius: '8px',
    backgroundcolor: 'primary',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    paddingbottom: 5,
    justifyContent: 'center',
  }
  const value = {
    transcript,
    resetTranscript,
    startListening,
    handleStopListening,
  }

  return (
    <SpeechRecognitionContext.Provider value={value}>
      {children}
      <Card sx={boxStyle}>
        <Box display={'flex'} justifyContent={'center'} paddingBottom={1}>
          <Button
            variant={listening ? 'contained' : 'outlined'}
            color={listening ? 'secondary' : 'primary'}
            onClick={toggleControls}
          >
            <MicIcon />
          </Button>
        </Box>
        {showControls && (
          <div>
            <Typography>{transcript}</Typography>
            <Typography color="error">{errorMessage}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartListening}
            >
              Start
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleStopListening}
            >
              Stop
            </Button>
            <Button variant="outlined" onClick={handleResetTranscript}>
              Reset
            </Button>
          </div>
        )}
      </Card>
    </SpeechRecognitionContext.Provider>
  )
}

// Hook to use the speech recognition context
export const useSpeechRecognitionContext = () =>
  useContext(SpeechRecognitionContext)

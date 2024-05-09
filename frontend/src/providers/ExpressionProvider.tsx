import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import { Box } from '@mui/material'
import { useAlerts } from '@/hooks/alerts'
import { useSpeechRecognitionContext } from './SpeechRecognitionProvider'
import { useCustomTheme } from './ThemeContext'

const defaultExpressionData: FaceExpressionData = {
  expressions: {},
  setExpressions: () => {}, // Dummy function
}

const FaceExpressionContext = createContext<FaceExpressionData>(
  defaultExpressionData
)

interface FaceExpressionData {
  expressions: Record<string, number>
  setExpressions: (expressions: Record<string, number>) => void
}

export const FaceExpressionProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [expressions, setExpressions] = useState<Record<string, number>>({})
  const [lastEmotion, setLastEmotion] = useState<string>('')
  const [emotionCount, setEmotionCount] = useState<number>(0)
  const { addAlert } = useAlerts()
  const { startListening } = useSpeechRecognitionContext()
  const [initialized, setInitialized] = useState(false)
  const [switchedModality, setSwitchedModality] = useState(false)
  const { setColor } = useCustomTheme()
  const [switchedColors, setSwitchedColors] = useState(false)
  const handleWebcamRef = useCallback((node: any) => {
    if (node) {
      //@ts-expect-error - video is a property of the node
      webcamRef.current = node.video
    }
  }, [])

  function handleSwitchToAudio() {
    console.log(switchedModality)

    if (
      !switchedModality &&
      Object.keys(expressions).length !== 0 &&
      !expressions['happy'] &&
      !expressions['neutral']
    ) {
      addAlert({
        message:
          'You seem to be unhappy, Please use the Voice command bot, Switching modality in 3 seconds',
        severity: 'info',
        scope: 'global',
        temporary: true,
        duration: 8000,
      })
      setSwitchedModality(true)
      setTimeout(() => {
        // This function will execute after 3 seconds
        startListening()
      }, 3000)
    }
  }

  const emotionToColor: { [key: string]: string } = {
    sad: '#E6E6FA',
    angry: '#66CDAA',
    fearful: '#E6E6FA',
    surprised: '#483C32',
  }

  function handleSwitchColors() {
    if (
      !switchedColors &&
      Object.keys(expressions).length !== 0 &&
      !expressions['happy'] &&
      !expressions['neutral']
    ) {
      const detectedEmotion = Object.keys(expressions)[0]
      const color = emotionToColor[detectedEmotion]

      if (color) {
        setColor(color)
        setSwitchedColors(true)
        setTimeout(() => {
          // After 2 minutes, set switchedColors back to false
          setSwitchedColors(false)
        }, 120000) // 2 minutes in milliseconds
        addAlert({
          message: `We noticed you were ${detectedEmotion}, we changed UI colors to fix that. If you want to cancel that click HERE`,
          severity: 'info',
          scope: 'global',
          temporary: true,
          duration: 8000,
          onClick: () => {
            setColor('#D0D0D0')
          },
        })
        console.log(`Detected ${detectedEmotion} emotion. Color: ${color}`)
      } else {
        console.log(`No color mapping found for ${detectedEmotion} emotion.`)
      }
    }
  }

  // Load models

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)

      setInitialized(true)
    }

    loadModels()
  }, [])

  // Detect expressions and draw on canvas
  useEffect(() => {
    const interval = setInterval(async () => {
      if (initialized && webcamRef.current && canvasRef.current) {
        const video = webcamRef.current
        const canvas = canvasRef.current
        const displaySize = {
          width: video.clientWidth,
          height: video.clientHeight,
        }
        faceapi.matchDimensions(canvas, displaySize)

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        if (detections.length > 0) {
          const highestExpression = detections[0].expressions.asSortedArray()[0]

          if (highestExpression.expression === lastEmotion) {
            if (emotionCount + 1 === 4) {
              setExpressions({
                [highestExpression.expression]: highestExpression.probability,
              })
              setEmotionCount(0) // Reset count after updating
              handleSwitchToAudio()
              handleSwitchColors()
            } else {
              setEmotionCount(emotionCount + 1)
            }
          } else {
            setLastEmotion(highestExpression.expression)
            setEmotionCount(1)
          }
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [initialized, webcamRef, canvasRef, lastEmotion, emotionCount])

  const value = { expressions, setExpressions }

  return (
    <FaceExpressionContext.Provider value={value}>
      {children}
      <Box
        style={{
          position: 'fixed',
          top: 150,
          right: 20,
          width: 200,
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 900000000000,
        }}
      >
        <Webcam
          ref={handleWebcamRef}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      </Box>
    </FaceExpressionContext.Provider>
  )
}

export const useFaceExpression = () => useContext(FaceExpressionContext)

import { Box, CircularProgress } from '@mui/material'

export function ProgressCircle() {
  return (
    <Box
      margin={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <CircularProgress />
    </Box>
  )
}

import { getMedicalHistory } from '@/api/doctor'
import { Typography, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ViewMedicalHistory() {
  const { id } = useParams()
  const [MedicalHistory, setMedicalHistoryFiles] = useState([])

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await getMedicalHistory(id)
        setMedicalHistoryFiles(response.data)
      } catch (error) {
        console.error('Error fetching health records:', error)
      }
    }

    fetchMedicalHistory()
  }, [id])

  return (
    <Container maxWidth="md" className="App">
      <Typography
        variant="h3"
        style={{ marginTop: '50px' }}
        color="primary"
        component="h1"
        gutterBottom
      >
        Medical History Files
      </Typography>

      {MedicalHistory.map((url, index) => (
        <div key={index}>
          <h2>{'File ' + (index + 1)}</h2>
          <iframe title={'File' + index} src={url} width="80%" height="400px" />
          <br />
        </div>
      ))}
    </Container>
  )
}

export default ViewMedicalHistory

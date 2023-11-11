import { getMyHealthRecordsFiles, getPatientHealthRecords } from '@/api/patient'
import { Card, CardContent, Typography, Container, Grid } from '@mui/material'
import { useEffect, useState } from 'react'

function HealthRecords() {
  const [healthRecords, setHealthRecords] = useState([])
  const [healthRecordsFiles, setHealthRecordsFiles] = useState([])

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const records = await getPatientHealthRecords()
        if (records == '') setHealthRecords([])
        else setHealthRecords(records)
        const files = await getMyHealthRecordsFiles()
        setHealthRecordsFiles(files)
      } catch (error) {
        console.error('Error fetching health records:', error)
      }
    }

    fetchHealthRecords()
  }, [])

  return (
    <Container maxWidth="md" className="App">
      {healthRecords.length > 0 && (
        <Typography variant="h3" color="primary" component="h1" gutterBottom>
          Health Records Notes
        </Typography>
      )}
      <Grid container spacing={2} className="health-record-container">
        {healthRecords.map((record, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="health-record-card">
              <CardContent>
                <Typography color="textSecondary">{record}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {healthRecordsFiles.length > 0 && (
        <Typography
          variant="h3"
          style={{ marginTop: '50px' }}
          color="primary"
          component="h1"
          gutterBottom
        >
          Health Records Files
        </Typography>
      )}
      {healthRecordsFiles.map((url, index) => (
        <div key={index}>
          <h2>{'File ' + (index + 1)}</h2>
          <iframe title={'File' + index} src={url} width="80%" height="400px" />
          <br />
        </div>
      ))}
    </Container>
  )
}

export default HealthRecords

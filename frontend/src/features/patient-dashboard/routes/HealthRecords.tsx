import { getPatientHealthRecords } from '@/api/patient'
import { Card, CardContent, Typography, Container, Grid } from '@mui/material'
import { useEffect, useState } from 'react'

function HealthRecords() {
  const [healthRecords, setHealthRecords] = useState([])

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const records = await getPatientHealthRecords()
        console.log(records)
        setHealthRecords(records)
      } catch (error) {
        console.error('Error fetching health records:', error)
      }
    }

    fetchHealthRecords()
  }, [])

  return (
    <Container maxWidth="md" className="App">
      <Typography variant="h3" component="h1" gutterBottom>
        Health Records
      </Typography>
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
    </Container>
  )
}

export default HealthRecords

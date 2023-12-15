import {
  AddNotes,
  addHealthRecord,
  deleteHealthRecord,
  getMedicalHistory,
} from '@/api/doctor'
import { getPatient, getPatientHealthRecordsFiles } from '@/api/patient'
//import { getMyMedicalHistory } from '@/api/patient'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

function AddHealthRecord() {
  const { id } = useParams()
  const [downloadURLs, setDownloadURLs] = useState([])
  const [MedicalHistory, setMedicalHistoryFiles] = useState([])
  const [value, setValue] = useState(0)
  const [notes, setNotes] = useState('')
  const [healthRecords, setHealthRecords] = useState<string[]>([])
  const [notesError, setNotesError] = useState(false)

  const [imageValue, setImageValue] = useState({ file: null } as any)
  useEffect(() => {
    const fetchDownloadURLs = async () => {
      try {
        const response = await getPatientHealthRecordsFiles(id || '')

        setDownloadURLs(response)
        const responseM = await getMedicalHistory(id)
        setMedicalHistoryFiles(responseM.data)
        const records = await getPatient(id!)
        if (records.notes.length == 0) setHealthRecords([])
        else setHealthRecords(records.notes)

        console.log(response)
      } catch (err: any) {
        console.error('Error fetching download URLs:', err)
      }
    }

    fetchDownloadURLs()
  }, [id])

  const handleFileInputChange = (event: any) => {
    setImageValue({ file: event.currentTarget.files[0] })
  }

  const handleDelete = async (urlToDelete: string) => {
    try {
      // Send a POST request to delete the URL
      await deleteHealthRecord(id, urlToDelete)
      // Remove the deleted URL from the state
      setDownloadURLs((prevURLs) =>
        prevURLs.filter((url) => url !== urlToDelete)
      )
    } catch (err) {
      console.error('Error deleting URL:', err)
    }
  }

  async function submit() {
    if (notes === '') {
      setNotesError(true)
      toast.error('Please enter a health record')
    } else {
      setNotesError(false)

      await AddNotes(id, notes)

      toast.success('Note added successfully')
      const records = await getPatient(id!)
      if (records.notes.length == 0) setHealthRecords([])
      else setHealthRecords(records.notes)

      setNotes('')
    }
  }

  const handleUpload = async () => {
    if (!imageValue.file) {
      alert('Please select a file to upload.')

      return
    }

    const formData = new FormData()
    formData.append('HealthRecord', imageValue.file)

    try {
      await addHealthRecord(id, formData)
      const downloadURLsResponse = await getPatientHealthRecordsFiles(id || '')
      setDownloadURLs(downloadURLsResponse)
    } catch (err) {
      console.error('Error uploading file:', err)
    }
  }

  return (
    <div>
      {/* Upload file input and button */}
      <TextField
        type="file"
        onChange={handleFileInputChange}
        variant="outlined"
        style={{ marginBottom: '16px' }}
      />
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        style={{ margin: 10 }}
      >
        Upload File
      </Button>

      <TextField
        onChange={(e) => setNotes(e.target.value)}
        label="Add health record"
        variant="outlined"
        color="primary"
        error={notesError}
        style={{ marginBottom: '16px' }}
      />

      <Button
        type="submit"
        onClick={submit}
        variant="contained"
        color="primary"
        style={{ margin: 10 }}
      >
        ADD
      </Button>

      {/* Tabs Section */}
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          centered
        >
          <Tab label="All" />
          <Tab label="Uploaded by a doctor" />
          <Tab label="Uploaded by patient " />
        </Tabs>

        {/* Content Section */}
        <Box sx={{ p: 3 }}>
          {value === 0 && (
            <Grid container spacing={2}>
              {downloadURLs.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    style={{ width: '100%', height: 580 }}
                  >
                    <CardContent>
                      <iframe
                        title={`File${index}`}
                        src={url}
                        width="100%"
                        height="500px"
                      />

                      <br />
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={() => handleDelete(url)}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {MedicalHistory.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    style={{ width: '100%', height: 580 }}
                  >
                    <CardContent>
                      {/* <h2>{'File ' + (index + 1)}</h2> */}
                      <iframe
                        title={'File' + index}
                        src={url}
                        width="100%"
                        height="500px"
                      />
                      <br />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid
                container
                spacing={2}
                direction="column"
                style={{ marginTop: 10, marginLeft: 2 }}
                className="health-record-container"
              >
                {healthRecords.map((record, index) => (
                  <Grid item xs={1} sm={1} md={1} key={index}>
                    <Card variant="outlined" style={{ width: '100%' }}>
                      <CardContent>
                        <Typography color="textSecondary">{record}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
          {value === 1 && (
            <Grid container spacing={2}>
              {downloadURLs.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    style={{ width: '100%', height: 580 }}
                  >
                    <CardContent>
                      <iframe
                        title={`File${index}`}
                        src={url}
                        width="100%"
                        height="500px"
                      />

                      <br />
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={() => handleDelete(url)}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid
                container
                spacing={2}
                direction="column"
                style={{ marginTop: 10, marginLeft: 2 }}
                className="health-record-container"
              >
                {healthRecords.map((record, index) => (
                  <Grid item xs={1} sm={1} md={1} key={index}>
                    <Card variant="outlined" style={{ width: '100%' }}>
                      <CardContent>
                        <Typography color="textSecondary">{record}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {value === 2 && (
            <Grid container spacing={2}>
              {MedicalHistory.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    style={{ width: '100%', height: 580 }}
                  >
                    <CardContent>
                      {/* <h2>{'File ' + (index + 1)}</h2> */}
                      <iframe
                        title={'File' + index}
                        src={url}
                        width="100%"
                        height="500px"
                      />
                      <br />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default AddHealthRecord

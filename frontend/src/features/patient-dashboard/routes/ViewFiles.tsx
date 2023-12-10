import {
  addMedicalHistory,
  deleteMedicalHistory,
  getMyMedicalHistory,
} from '@/api/patient'
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
import { getMyHealthRecordsFiles, getPatientHealthRecords } from '@/api/patient'

function FileViewer() {
  const [downloadURLs, setDownloadURLs] = useState([])
  const [healthRecords, setHealthRecords] = useState([])
  const [healthRecordsFiles, setHealthRecordsFiles] = useState([])
  const [imageValue, setImageValue] = useState({ file: null } as any)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const fetchDownloadURLs = async () => {
      try {
        const response = await getMyMedicalHistory()

        setDownloadURLs(response)
        console.log(response)
        const records = await getPatientHealthRecords()
        if (records == '') setHealthRecords([])
        else setHealthRecords(records)
        const files = await getMyHealthRecordsFiles()
        setHealthRecordsFiles(files)
      } catch (err: any) {
        console.error('Error fetching download URLs:', err)
      }
    }

    fetchDownloadURLs()
  }, [])

  const handleDelete = async (urlToDelete: string) => {
    try {
      // Send a POST request to delete the URL
      await deleteMedicalHistory(urlToDelete)
      // Remove the deleted URL from the state
      setDownloadURLs((prevURLs) =>
        prevURLs.filter((url) => url !== urlToDelete)
      )
    } catch (err) {
      console.error('Error deleting URL:', err)
    }
  }

  const handleFileInputChange = (event: any) => {
    setImageValue({ file: event.currentTarget.files[0] })
  }

  const handleUpload = async () => {
    if (!imageValue.file) {
      alert('Please select a file to upload.')

      return
    }

    const formData = new FormData()
    formData.append('medicalHistory', imageValue.file)

    try {
      // Send a POST request with the uploaded file
      await addMedicalHistory(formData)
      // Fetch updated download URLs after the upload is complete
      const downloadURLsResponse = await getMyMedicalHistory()

      setDownloadURLs(downloadURLsResponse)
    } catch (err) {
      console.error('Error uploading file:', err)
    }
  }

  // if (downloadURLs.length === 0) {
  //   return <div>Loading...</div>;
  // }

  // Render files using <img> elements with delete buttons

  return (
    <div>
      {/* File Upload Section */}
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

      {/* Tabs Section */}
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          centered
        >
          <Tab label="All" />
          <Tab label="Uploaded by me" />
          <Tab label="Uploaded by doctor" />
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
              {healthRecordsFiles.map((url, index) => (
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
              <br />
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
            </Grid>
          )}
          {value === 2 && (
            <Grid container spacing={2}>
              {healthRecordsFiles.map((url, index) => (
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
        </Box>
      </Box>
    </div>
  )
}

export default FileViewer

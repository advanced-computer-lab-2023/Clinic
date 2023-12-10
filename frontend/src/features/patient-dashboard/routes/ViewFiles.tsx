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
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getMyHealthRecordsFiles, getPatientHealthRecords } from '@/api/patient'
import { toast } from 'react-toastify'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import nodata from '@/assets/No data-cuate.png'
import { LoadingButton } from '@mui/lab'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

function FileViewer() {
  const [downloadURLs, setDownloadURLs] = useState([])
  const [healthRecords, setHealthRecords] = useState([])
  const [healthRecordsFiles, setHealthRecordsFiles] = useState([])
  const [value, setValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

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
    // setImageValue({ file: event.currentTarget.files[0] })
    handleUpload(event.currentTarget.files[0])
  }

  const handleUpload = async (file: any) => {
    if (!file) {
      toast.error('Please select a file to upload')

      return
    }

    const formData = new FormData()
    formData.append('medicalHistory', file)

    try {
      setIsLoading(true)
      // Send a POST request with the uploaded file
      await addMedicalHistory(formData)
      // Fetch updated download URLs after the upload is complete
      const downloadURLsResponse = await getMyMedicalHistory()

      setDownloadURLs(downloadURLsResponse)
    } catch (err) {
      console.error('Error uploading file:', err)
    }

    setIsLoading(false)
  }

  return (
    <div>
      <LoadingButton
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        loading={isLoading}
      >
        Upload file
        <VisuallyHiddenInput type="file" onChange={handleFileInputChange} />
      </LoadingButton>

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

        {(downloadURLs.length === 0 &&
          healthRecordsFiles.length === 0 &&
          value === 0) ||
        (value === 1 && downloadURLs.length === 0) ||
        (value === 2 && healthRecordsFiles.length === 0) ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              style={{
                width: '500px', // Set your desired width
                height: '500px', // Set your desired height
                objectFit: 'cover',
              }}
              src={nodata}
              alt="No data available"
            />
          </div>
        ) : (
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
                          <Typography color="textSecondary">
                            {record}
                          </Typography>
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
                          <Typography color="textSecondary">
                            {record}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </div>
  )
}

export default FileViewer

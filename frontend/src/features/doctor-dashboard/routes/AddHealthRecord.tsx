import { api } from '@/api'
import { getPatientHealthRecordsFiles } from '@/api/patient'
//import { getMyMedicalHistory } from '@/api/patient'
import { Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function AddHealthRecord() {
  const { id } = useParams()
  const [downloadURLs, setDownloadURLs] = useState([])

  const [imageValue, setImageValue] = useState({ file: null } as any)
  useEffect(() => {
    const fetchDownloadURLs = async () => {
      try {
        const response = await getPatientHealthRecordsFiles(id || '')

        setDownloadURLs(response)
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
      await api.post(
        `http://localhost:3000/patients/deleteHealthRecord/${id}`,
        { url: urlToDelete }
      )

      // Remove the deleted URL from the state
      setDownloadURLs((prevURLs) =>
        prevURLs.filter((url) => url !== urlToDelete)
      )
    } catch (err) {
      console.error('Error deleting URL:', err)
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
      // Send a POST request with the uploaded file
      await api.post(
        `http://localhost:3000/patients/uploadHealthRecords/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data; ${formData.getBoundary()}',
          },
        }
      )
      // Fetch updated download URLs after the upload is complete
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
      />
      <Button onClick={handleUpload}>Upload File</Button>
      {downloadURLs.map((url, index) => (
        <div key={index}>
          <h2>{'File ' + (index + 1)}</h2>
          <iframe title={'File' + index} src={url} width="80%" height="400px" />
          <br />
          <Button
            color="error"
            variant="outlined"
            onClick={() => handleDelete(url)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  )
}

export default AddHealthRecord

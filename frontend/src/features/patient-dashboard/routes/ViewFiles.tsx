import { api } from '@/api'
import { getMyMedicalHistory } from '@/api/patient'
import { Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

function FileViewer() {
  const [downloadURLs, setDownloadURLs] = useState([])

  const [imageValue, setImageValue] = useState({ file: null } as any)

  useEffect(() => {
    const fetchDownloadURLs = async () => {
      try {
        const response = await getMyMedicalHistory()

        setDownloadURLs(response)
        console.log(response)
      } catch (err: any) {
        console.error('Error fetching download URLs:', err)
      }
    }

    fetchDownloadURLs()
  }, [])

  const handleDelete = async (urlToDelete: string) => {
    try {
      // Send a POST request to delete the URL
      const response = await fetch('/api/deleteURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urlToDelete }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete URL')
      }

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
      await api.post(
        'http://localhost:3000/patients/uploadMedicalHistory/mine',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data; ${formData.getBoundary()}', // Axios sets the correct Content-Type header with the boundary.
          },
        }
      )
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

export default FileViewer

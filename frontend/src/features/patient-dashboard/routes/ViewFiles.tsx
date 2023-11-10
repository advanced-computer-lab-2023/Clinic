import { getMyMedicalHistory } from '@/api/patient'
import axios from 'axios'
import { useEffect, useState } from 'react'

function FileViewer() {
  const [downloadURLs, setDownloadURLs] = useState([])

  const [imageValue, setImageValue] = useState({ file: null } as any)

  useEffect(() => {
    // Fetch download URLs from the backend API when the component mounts
    const fetchDownloadURLs = async () => {
      try {
        const response = await getMyMedicalHistory() // Replace with your backend API endpoint

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setDownloadURLs(data.downloadURLs)
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

    console.log(imageValue.file)
    const formData = new FormData()
    formData.append('medicalHistory', imageValue.file)

    try {
      // Send a POST request with the uploaded file
      await axios.post(
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

      if (!downloadURLsResponse.ok) {
        throw new Error('Failed to fetch download URLs')
      }

      const data = await downloadURLsResponse.json()

      setDownloadURLs(data.downloadURLs)
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
      {downloadURLs.map((url, index) => (
        <div key={index}>
          <img src={url} alt={`File ${index}`} />
          <button onClick={() => handleDelete(url)}>Delete</button>
        </div>
      ))}

      {/* Upload file input and button */}
      <input type="file" onChange={handleFileInputChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  )
}

export default FileViewer

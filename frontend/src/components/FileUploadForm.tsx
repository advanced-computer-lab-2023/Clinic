import React, { useState } from 'react';
import axios from 'axios';

interface FileWithError {
  file: File | null;
  error: string;
}

const FileUploadForm: React.FC = () => {
  const [fileData, setFileData] = useState<FileWithError>({ file: null, error: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File size exceeds 5MB";
    }

    if (file.type !== 'application/pdf') {
      return "Only PDF files are allowed";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFileData({ file: null, error: "No file selected" });
      return;
    }

    const error = validateFile(selectedFile);
    if (error) {
      setFileData({ file: null, error });
    } else {
      setFileData({ file: selectedFile, error: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileData.file) {
      setFileData({ ...fileData, error: "Please select a file" });
      return;
    }

    const formData = new FormData();
    formData.append('file', fileData.file);

    setMessage("");
    try {
      setLoading(true);

      
      const response = await axios.post('https://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage("File uploaded successfully!");
      } else {
        setFileData({ ...fileData, error: "Server responded with an error. Please try again." });
      }
    } catch (error: unknown) { 
    if (error instanceof Error) {
      setFileData({ ...fileData, error: error.message });
    } else {
      setFileData({ ...fileData, error: "An error occurred during the upload. Please try again." });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {fileData.error && <div style={{ color: 'red' }}>{fileData.error}</div>}
        {message && <div style={{ color: 'green' }}>{message}</div>}
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUploadForm;

import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all files
  const fetchFiles = async () => {
    const { data } = await axios.get('http://localhost:5000/files');
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`File uploaded successfully`);
      fetchFiles(); // Refresh file list
    } catch (err) {
      setMessage('Failed to upload file');
    }
  };

  // Handle file download
  const handleDownload = async (filename) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/download/${filename}`,
        method: 'GET',
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setMessage('Failed to download file');
    }
  };

  return (
    <div className="p-20 flex flex-col items-center justify-center bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800">File Manager</h1>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            required 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Upload
          </button>
        </form>
        <p className="text-gray-600">{message}</p>
        <h2 className="text-xl font-semibold text-gray-700">Uploaded Files</h2>
        <ul>
          {files.map((f) => (
            <li 
              key={f._id} 
              className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded-lg"
            >
              <span>{f.filename}</span>
              <button 
                onClick={() => handleDownload(f.filename)}
                className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
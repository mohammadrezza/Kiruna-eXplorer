import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa'; 
import { Button, ListGroup, Modal } from 'react-bootstrap';
import API from '@/services/API.mjs';
import '@/style/OriginalDocumentSelector.css'
const DocumentUploader = ({ mode, edit, existingDocuments = [], onDocumentsChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('Nessun file scelto');
  const [fileSize, setFileSize] = useState('');
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  const MAX_FILE_SIZE = 50 * 1024 * 1024; 

  const handleFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Il file non può superare i 50MB.');
      setFileName('Nessun file scelto');
      setFileSize('');
      return;
    }

    setFileError('');
    setFileName(file.name);
    setFileSize(`Dimensione: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setFileError('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await API.uploadDocument(formData);
      if (response.success) {
        onDocumentsChange(response.data);
        setSelectedFile(null); 
        setFileName('Nessun file scelto');
        setFileSize('');
        setFileError('');
        setShowModal(false); 
      } else {
        setFileError('Error uploading file');
      }
    } catch (error) {
      setFileError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-uploader">
      <h4>Original Documents</h4>

      <Button className='upload-button'
        variant="outline-primary"
        onClick={() => setShowModal(true)} 
        style={{ marginBottom: '20px' }}
      >
        <h1><FaFileUpload/></h1> Upload File
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Carica un Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="upload-section"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #aaa',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: isDragging ? '#e8e8e8' : '#fff',
            }}
          >
            <p>Trascina qui il tuo file o clicca per selezionarlo</p>
            <input
              type="file"
              accept=".pdf, .png, .jpeg"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              disabled={loading}
            />
            <Button
              variant="primary"
              onClick={() => document.querySelector('input[type="file"]').click()}
              disabled={loading}
            >
              <FaFileUpload /> Seleziona file
            </Button>

            <p>File selezionato: <span>{fileName}</span></p>
            <p>{fileSize}</p>

            {fileError && <div className="error-message" style={{ color: 'red' }}>{fileError}</div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)} 
          >
            Annulla
          </Button>
          <Button
            variant="success"
            onClick={handleFileUpload}
            disabled={loading || !selectedFile}
          >
            {loading ? 'Caricamento...' : 'Carica Documento'}
          </Button>
        </Modal.Footer>
      </Modal>

      {loading && <div className="loading-spinner">Uploading...</div>}
    </div>
  );
};

export default DocumentUploader;
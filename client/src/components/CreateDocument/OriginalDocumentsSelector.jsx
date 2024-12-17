import React, { useState, useEffect } from 'react';
import { FaFileUpload, FaTrash } from 'react-icons/fa';
import { MdOutlineCancel } from "react-icons/md";
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa'; // Aggiungi icone pertinenti
import { Button, Modal } from 'react-bootstrap';
import API from '@/services/API.mjs';  // Importa il modulo API
import '@/style/OriginalDocumentSelector.css';
import PropTypes from 'prop-types';


const DocumentUploader = ({ mode, edit, documentId, files: initialFiles, onFileAdded, onFileRemoved }) => {
  const [files, setFiles] = useState(initialFiles || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [fileSize, setFileSize] = useState('');
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

  useEffect(() => {
    // Gestisce gli aggiornamenti alla lista dei file
    setFiles(initialFiles || []);
  }, [initialFiles]);

  const handleFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setFileError('The file cannot exceed 50MB.');
      setFileName('No file chosen');
      setFileSize('');
      return;
    }

    setFileError('');
    setFileName(file.name);
    setFileSize(`Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
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

  const truncateFileName = (filePath, maxLength = 20) => {
    const fileName = filePath.split('/').pop(); // Prende solo il nome del file
    if (fileName.length <= maxLength) return fileName;
    const fileExtension = fileName.slice(fileName.lastIndexOf('.'));
    const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'));
    // Calcola la parte del nome che rimane prima del '...'
    const truncatedName = nameWithoutExtension.slice(0, maxLength - 3) + '...';
    return truncatedName + fileExtension;
  };

  // Funzione per ottenere l'icona corretta in base al tipo di file
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="file-icon pdf-icon" />;
      case 'jpeg':
      case 'jpg':
      case 'png':
        return <FaFileImage className="file-icon image-icon" />;
      default:
        return <FaFileAlt className="file-icon default-icon" />;
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setFileError('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const response = await API.uploadDocument(documentId, selectedFile);
      if (response.success) {
        setSelectedFile(null);
        setFileName('No file chosen');
        setFileSize('');
        setFileError('');
        setShowModal(false);
        onFileAdded && onFileAdded(selectedFile.name);
      } else {
        setFileError('Error uploading file');
      }
    } catch (error) {
      setFileError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (file) => {
    try {
      await API.deleteFile(file);
      setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
      if (onFileRemoved) onFileRemoved(file);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    mode === 'add' ? ("") : (
    <div className="document-uploader">
      <h4>Original Documents</h4>

      <div className="file-display">
        {files && files.length > 0 ? (
          files.map((file, index) => {
            const fileUrl = file;
            console.log(file);
            return (
                <button
                  key={index}
                  className="file-added-button"
                  onClick={() => window.open(fileUrl, '_blank')}
                >
                  {edit && (
                    <button
                      className="delete-file-btn"
                      
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete(file)
                      }}
                    >
                      <MdOutlineCancel className="delete-icon" />
                    </button>
                  )}
                  <h1>{getFileIcon(file)}</h1>
                  {truncateFileName(file, 6)} 
                  
                </button>
            );
          })
        ) : (mode === 'view' && !edit) ? (
          <p>No files available.</p>
        ) : ""}
        {(edit) && (
        <>
          <Button
            className="upload-button"
            variant="outline-primary"
            onClick={() => setShowModal(true)}
            style={{ marginBottom: '20px' }}
          >
            <h1><FaFileUpload className='file-icon' /></h1> Upload File
          </Button>

          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Upload a Document</Modal.Title>
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
                <p>Drag and drop your file here or click to select it</p>
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
                  <FaFileUpload /> Select file
                </Button>

                <p className='selected-file-text'>Selected file: <span>{fileName}</span></p>
                <p>{fileSize}</p>

                {fileError && <div className="error-message" style={{ color: 'red' }}>{fileError}</div>}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleFileUpload}
                disabled={loading || !selectedFile}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      </div>

      
      {loading && <div className="loading-spinner">Uploading...</div>}
    </div>
  ));
};

DocumentUploader.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired, // Modalità del componente
  edit: PropTypes.bool.isRequired,                         // Flag per la modalità modifica
  documentId: PropTypes.string.isRequired,                 // ID del documento
  files: PropTypes.arrayOf(PropTypes.string).isRequired,   // Lista di file (URL o nomi)
  onFileAdded: PropTypes.func,                             // Funzione per aggiungere un file
  onFileRemoved: PropTypes.func,                           // Funzione per rimuovere un file
};


export default DocumentUploader;
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentUploader from '../../src/components/CreateDocument/OriginalDocumentsSelector';
import API from '@/services/API.mjs';

jest.mock('@/services/API.mjs', () => ({
  uploadDocument: jest.fn(),
  deleteFile: jest.fn(),
}));

describe('DocumentUploader Component', () => {
  const mockOnFileAdded = jest.fn();
  const mockOnFileRemoved = jest.fn();
  const initialFiles = ['test.pdf', 'image.png'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly in view mode', () => {
    render(
      <DocumentUploader mode="view" edit={false} files={initialFiles} />
    );

    expect(screen.getByText('Original Documents')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('test.pdf'))).toBeInTheDocument();
    expect(screen.getByText('image.png')).toBeInTheDocument();
  });

  test('renders upload button in edit mode', () => {
    render(
      <DocumentUploader mode="view" edit={true} files={initialFiles} />
    );

    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  test('opens the upload modal when the upload button is clicked', () => {
    render(
      <DocumentUploader mode="view" edit={true} files={[]} />
    );

    fireEvent.click(screen.getByText('Upload File'));
    expect(screen.getByText('Upload a Document')).toBeInTheDocument();
  });

  test('displays file name and size after selecting a file', async () => {
    render(
      <DocumentUploader mode="view" edit={true} files={[]} />
    );

    const file = new File(['content'], 'sample.pdf', { type: 'application/pdf', size: 1000 });

    fireEvent.click(screen.getByText('Upload File'));
    const fileInput = screen.getByLabelText('Select file');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('Selected file:')).toBeInTheDocument();
    expect(screen.getByText('sample.pdf')).toBeInTheDocument();
  });

  test('shows an error when a file exceeds the maximum size', async () => {
    render(
      <DocumentUploader mode="view" edit={true} files={[]} />
    );

    const file = new File(['content'], 'largefile.pdf', { type: 'application/pdf', size: 60 * 1024 * 1024 });

    fireEvent.click(screen.getByText('Upload File'));
    const fileInput = screen.getByLabelText('Select file');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('The file cannot exceed 50MB.')).toBeInTheDocument();
  });

  test('uploads a file successfully', async () => {
    API.uploadDocument.mockResolvedValue({ success: true });

    render(
      <DocumentUploader
        mode="view"
        edit={true}
        files={[]}
        onFileAdded={mockOnFileAdded}
      />
    );

    const file = new File(['content'], 'sample.pdf', { type: 'application/pdf', size: 1000 });

    fireEvent.click(screen.getByText('Upload File'));
    const fileInput = screen.getByLabelText('Select file');
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Upload Document'));

    await waitFor(() => {
      expect(mockOnFileAdded).toHaveBeenCalledWith('sample.pdf');
      expect(screen.queryByText('Upload a Document')).not.toBeInTheDocument();
    });
  });

  test('handles file deletion correctly', async () => {
    API.deleteFile.mockResolvedValue();

    render(
      <DocumentUploader
        mode="view"
        edit={true}
        files={initialFiles}
        onFileRemoved={mockOnFileRemoved}
      />
    );

    const deleteButton = screen.getAllByRole('button', { name: /cancel/i })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnFileRemoved).toHaveBeenCalledWith('test.pdf');
    });
  });

  test('shows an error if file upload fails', async () => {
    API.uploadDocument.mockRejectedValue(new Error('Upload failed'));

    render(
      <DocumentUploader mode="view" edit={true} files={[]} />
    );

    const file = new File(['content'], 'sample.pdf', { type: 'application/pdf', size: 1000 });

    fireEvent.click(screen.getByText('Upload File'));
    const fileInput = screen.getByLabelText('Select file');
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Upload Document'));

    await waitFor(() => {
      expect(screen.getByText('Error uploading file')).toBeInTheDocument();
    });
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RelatedDocumentsSelector from '../../src/components/RelatedDocumentsSelector';
import dayjs from 'dayjs';
describe('RelatedDocumentsSelector Component', () => {
  const mockOnDocumentSelect = jest.fn();
  const mockOnRelatedDocumentClick = jest.fn();

  const sampleDocuments = [
    { id: '1', title: 'Document 1', stakeholders: 'Stakeholder A', issuanceDate: '2022-10-01' },
    { id: '2', title: 'Document 2', stakeholders: 'Stakeholder B', issuanceDate: '2022-11-01' },
  ];
  const selectedDocuments = ['1'];

  beforeEach(() => {
    render(
      <RelatedDocumentsSelector
        mode="view"
        edit={false}
        allDocuments={sampleDocuments}
        selectedDocuments={selectedDocuments}
        onDocumentSelect={mockOnDocumentSelect}
        onRelatedDocumentClick={mockOnRelatedDocumentClick}
      />
    );
  });

  it('renders the list with headers and document details', () => {
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Stakeholders/i)).toBeInTheDocument();
    expect(screen.getByText(/Issuance Date/i)).toBeInTheDocument();

    sampleDocuments.forEach((doc) => {
      expect(screen.getByText(doc.title)).toBeInTheDocument();
      expect(screen.getByText(doc.stakeholders)).toBeInTheDocument();
      expect(screen.getByText(dayjs(doc.issuanceDate).format('DD/MM/YYYY'))).toBeInTheDocument();
    });
  });

  it('displays row numbers in view mode', () => {
    const rowNumber1 = screen.getByText('1');
    const rowNumber2 = screen.getByText('2');

    expect(rowNumber1).toBeInTheDocument();
    expect(rowNumber2).toBeInTheDocument();
  });

  it('calls onRelatedDocumentClick when a document is clicked in view mode', () => {
    const documentRow = screen.getByText('Document 1').closest('div');
    fireEvent.click(documentRow);

    expect(mockOnRelatedDocumentClick).toHaveBeenCalledWith('1');
    expect(mockOnDocumentSelect).not.toHaveBeenCalled();
  });

//   it('renders checkboxes in add or edit mode', () => {
//     render(
//       <RelatedDocumentsSelector
//         mode="add"
//         edit={true}
//         allDocuments={sampleDocuments}
//         selectedDocuments={selectedDocuments}
//         onDocumentSelect={mockOnDocumentSelect}
//         onRelatedDocumentClick={mockOnRelatedDocumentClick}
//       />
//     );

//     sampleDocuments.forEach((doc) => {
//       const checkbox = screen.getByTestId(`checkbox-${doc.id}`);
//       expect(checkbox).toBeInTheDocument();
//       if (selectedDocuments.includes(doc.id)) {
//         expect(checkbox).toBeChecked();
//       } else {
//         expect(checkbox).not.toBeChecked();
//       }
//     });
//   });

//   it('calls onDocumentSelect when a document is clicked in add or edit mode', () => {
//     render(
//       <RelatedDocumentsSelector
//         mode="add"
//         edit={true}
//         allDocuments={sampleDocuments}
//         selectedDocuments={selectedDocuments}
//         onDocumentSelect={mockOnDocumentSelect}
//         onRelatedDocumentClick={mockOnRelatedDocumentClick}
//       />
//     );

//     const documentRow = screen.getByText('Document 2').closest('li');
//     fireEvent.click(documentRow);

//     expect(mockOnDocumentSelect).toHaveBeenCalledWith('2');
//   });

  it('applies selected class to selected documents', () => {
    const selectedRow = screen.getByText('Document 1').closest('div');
    expect(selectedRow).toHaveClass('selected');
  });
});
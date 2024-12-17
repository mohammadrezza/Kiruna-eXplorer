import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RelatedDocumentsSelector from '../../src/components/CreateDocument/RelatedDocumentsSelector';
import dayjs from 'dayjs';

describe('RelatedDocumentsSelector Component', () => {
  const mockOnDocumentSelect = jest.fn();
  const mockOnRelatedDocumentClick = jest.fn();

  const sampleDocuments = [
    { id: '1', title: 'Document 1', stakeholders: ['Stakeholder A'], issuanceDate: '2022-10-01' },
    { id: '2', title: 'Document 2', stakeholders: ['Stakeholder B'], issuanceDate: '2022-11-01' },
    { id: '3', title: 'Document 3', stakeholders: ['Stakeholder C'], issuanceDate: '2022-12-01' },
    { id: '4', title: 'Document 4', stakeholders: ['Stakeholder D'], issuanceDate: '2023-01-01' },
  ];
  const selectedDocuments = ['1'];

  beforeEach(() => {
    render(
      <RelatedDocumentsSelector
      mode="view"
      edit={false}
      allDocuments={sampleDocuments}
      selectedDocuments={selectedDocuments}
      relatedDocuments={[]} // Aggiunto
      selectedConnectionTypes={[]} // Inizializzazione corretta
      onDocumentSelect={mockOnDocumentSelect}
      onRelatedDocumentClick={mockOnRelatedDocumentClick}
      setSelectedConnectionTypes={jest.fn()} // Mock
      onConnectionTypeChange={jest.fn()} // Mock
    />
    );
  });

  it('renders the list with headers and document details', () => {
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Stakeholders/i)).toBeInTheDocument();

    sampleDocuments.forEach((doc) => {
      expect(screen.getByText(doc.title)).toBeInTheDocument();
      expect(screen.getByText(doc.stakeholders[0])).toBeInTheDocument();
    });
  });

  it('displays row numbers in view mode', () => {
    sampleDocuments.forEach((doc, index) => {
      const rowNumber = screen.getByText((index + 1).toString());
      expect(rowNumber).toBeInTheDocument();
    });
  });

  it('calls onRelatedDocumentClick when a document is clicked in view mode', () => {
    const documentRow = screen.getByText('Document 1').closest('div');
    fireEvent.click(documentRow);

    expect(mockOnRelatedDocumentClick).toHaveBeenCalledWith('1');
    expect(mockOnDocumentSelect).not.toHaveBeenCalled();
  });

  it('applies selected class to selected documents', () => {
    const selectedRow = screen.getByText('Document 1').closest('div');
    expect(selectedRow).toHaveClass('selected');
  });

  // describe('Pagination Tests', () => {
  //   const manyDocuments = Array.from({ length: 25 }, (_, i) => ({
  //     id: (i + 1).toString(),
  //     title: `Document ${i + 1}`,
  //     stakeholders: [`Stakeholder ${i + 1}`],
  //   }));

  //   beforeEach(() => {
  //     render(
  //       <RelatedDocumentsSelector
  //         mode="view"
  //         edit={false}
  //         allDocuments={manyDocuments}
  //         selectedDocuments={[]}
  //         onDocumentSelect={mockOnDocumentSelect}
  //         onRelatedDocumentClick={mockOnRelatedDocumentClick}
  //       />
  //     );
  //   });

  //   it('displays the correct number of documents per page', () => {
  //     expect(screen.getByText('Document 1')).toBeInTheDocument();
  //     expect(screen.queryByText('Document 11')).not.toBeInTheDocument(); // Next page doc
  //   });

  //   it('navigates to the next page', () => {
  //     const nextButton = screen.getByText('Next');
  //     fireEvent.click(nextButton);

  //     expect(screen.getByText('Document 11')).toBeInTheDocument();
  //     expect(screen.queryByText('Document 1')).not.toBeInTheDocument();
  //   });

  //   it('navigates to the last page', () => {
  //     const lastButton = screen.getByText('Last');
  //     fireEvent.click(lastButton);

  //     expect(screen.getByText('Document 21')).toBeInTheDocument();
  //   });

  //   it('navigates back to the first page', () => {
  //     const firstButton = screen.getByText('First');
  //     fireEvent.click(firstButton);

  //     expect(screen.getByText('Document 1')).toBeInTheDocument();
  //   });
  // });

  describe('Add/Edit Mode Tests', () => {
    beforeEach(() => {
      render(
        <RelatedDocumentsSelector
          mode="add"
          edit={true}
          allDocuments={sampleDocuments}
          selectedDocuments={selectedDocuments}
          relatedDocuments={[]} // Aggiunto
          onDocumentSelect={mockOnDocumentSelect}
          onRelatedDocumentClick={mockOnRelatedDocumentClick}
          setSelectedConnectionTypes={jest.fn()} // Mock

        />
      );
    });

    it('renders checkboxes in add or edit mode', () => {
      sampleDocuments.forEach((doc) => {
        const checkbox = screen.getByRole('checkbox', {
          name: `checkbox-${doc.id}`,
        });
        expect(checkbox).toBeInTheDocument();

        if (selectedDocuments.includes(doc.id)) {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it('calls onDocumentSelect when a document is clicked in add/edit mode', () => {
      const documentRows = screen.getAllByText('Document 2');
      const documentRow = documentRows[0].closest('div'); // Seleziona il primo
      fireEvent.click(documentRow);

      expect(mockOnDocumentSelect).toHaveBeenCalledWith('2');
    });

    it('selects a document when its checkbox is clicked', () => {
      const checkbox = screen.getByRole('checkbox', {
        name: 'checkbox-2',
      });

      fireEvent.click(checkbox);
      expect(mockOnDocumentSelect).toHaveBeenCalledWith('2');
    });
  });

  describe('Search Functionality', () => {
    it('filters documents based on search query', () => {
      const searchInput = screen.getByPlaceholderText(
        /Enter the document name to search/i
      );

      fireEvent.change(searchInput, { target: { value: 'Document 2' } });
      expect(screen.getByText('Document 2')).toBeInTheDocument();
      expect(screen.queryByText('Document 1')).not.toBeInTheDocument();
    });

    it('displays a no documents message when no results match the search', () => {
      const searchInput = screen.getByPlaceholderText(
        /Enter the document name to search/i
      );

      fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
      expect(screen.getByText(/No documents found/i)).toBeInTheDocument();
    });
  });
});
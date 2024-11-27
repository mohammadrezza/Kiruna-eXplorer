import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MunicipalDocuments from '../../../src/components/DocumentsMap/MunicipalDocuments';
import { mockDocuments } from '../../__mocks__/document';

describe('MunicipalDocuments component', () => {
  const mockToggleList = jest.fn();

//   it('renders the title and list of documents when municipalDocuments is populated', () => {
//     render(
//       <MunicipalDocuments
//         municipalDocuments={mockDocuments}
//         showDocuments={true}
//         toggleList={mockToggleList}
//       />
//     );

//     // Check if the title is rendered
//     expect(
//       screen.getByText(/There are documents for the whole municipal/i)
//     ).toBeInTheDocument();

//     // Check if the documents are rendered
//     mockDocuments.forEach((doc) => {
//       expect(screen.getByText(doc.title)).toBeInTheDocument();
//       expect(screen.getByText(`Type: ${doc.type}`)).toBeInTheDocument();
//       expect(
//         screen.getByText(`Stakeholders: ${doc.stakeholders}`)
//       ).toBeInTheDocument();
//       expect(
//         screen.getByText(`Issuance Date: ${doc.issuanceDate}`)
//       ).toBeInTheDocument();
//     });
//   });

  it('does not render document list when municipalDocuments is empty', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={[]}
        showDocuments={false}
        toggleList={mockToggleList}
      />
    );

    // Ensure no documents are displayed
    expect(screen.queryByText(/Type:/)).toBeNull();
  });

  it('calls toggleList when "Show them" link is clicked', () => {
    render(
      <MunicipalDocuments
        municipalDocuments={mockDocuments}
        showDocuments={true}
        toggleList={mockToggleList}
      />
    );

    // Click on the "Show them" link
    fireEvent.click(screen.getByText(/Show them/i));

    // Ensure toggleList was called
    expect(mockToggleList).toHaveBeenCalled();
  });
});

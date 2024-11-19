jest.mock('dayjs', () => {
    const formatMock = jest.fn(() => '2024-01-01');
    const dayjsMock = jest.fn(() => ({
      format: formatMock,
    }));
  
    return {
      __esModule: true,
      default: dayjsMock,
      format: formatMock,
    };
  });
  
  

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import List from '../../src/components/List';
import dayjs from 'dayjs'
import MockDate from 'mockdate';

jest.mock('../../src/components/DocumentDetailsModal', () => (props) => (
    <div data-testid="DocumentDetailsModal" {...props}></div>
  ));
  
  

describe('List component',() =>{
    const mockNavigate = jest.fn();
    const MockHandleDocumentClick = jest.fn();
    const MockHandleIconClick = jest.fn();
    const MockCurrentDocument = jest.fn();
    const MockSetCurrentDocument = jest.fn();
    const MockShowModal = jest.fn();
    const MockSetShowModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    MockDate.reset()
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('render the document list',()=>{
    const MockList = [{title: 'doc1',
        stakeholders: ['KLAB'],
        scale: 'Mock Scale',
        issuanceDate: '2023-01-01',
        type: 'tipo1',
        language: 'english',
        description: 'Mock description',
        coordinates: { lat: '67.821', lng: '20.216' },
        connections: '2'  },
        {title: 'doc2',
        stakeholders: ['Mun','City'],
        scale: 'Mock Scale',
        issuanceDate: '2023-01-01',
        type: 'tipo2',
        language: 'swedish',
        description: 'Mock description',
        coordinates: { lat: '67.821', lng: '20.216' },
        connections: '1'  }]
        
   
    render(<List list={MockList} 
        handleDocumentClick={MockHandleDocumentClick} 
        handleIconClick={MockHandleIconClick}
        currentDocument={MockCurrentDocument}
        handleCurrentDocument={MockSetCurrentDocument}
        showModal={MockShowModal}
        handleShowModal={MockSetShowModal}/>)

    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Stakeholders/i)).toBeInTheDocument();
    expect(screen.getByText(/Issuance Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Connections/i)).toBeInTheDocument();
    
    MockList.forEach((doc)=>{
        MockDate.set(doc.issuanceDate)
        expect(screen.getByText(doc.title)).toBeInTheDocument()
        doc.stakeholders.forEach((s)=>{
            expect(screen.getByText(s)).toBeInTheDocument();
        })
        
        expect(screen.getByText(doc.type)).toBeInTheDocument();
        expect(screen.getByText(doc.connections)).toBeInTheDocument();
        //expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    })
  })

  test('call show modal if preview button pressed',()=>{
    const MockList = [{title: 'doc1',
        stakeholders: ['stakeholder6'],
        scale: 'Mock Scale',
        issuanceDate: '2023-01-01',
        type: 'tipo1',
        language: 'english',
        description: 'Mock description',
        coordinates: { lat: '67.821', lng: '20.216' },
        connections: '2'  },
        ]
        
   
    render(<List list={MockList} 
        handleDocumentClick={MockHandleDocumentClick} 
        handleIconClick={MockHandleIconClick}
        currentDocument={MockCurrentDocument}
        handleCurrentDocument={MockSetCurrentDocument}
        showModal={MockShowModal}
        handleShowModal={MockSetShowModal}/>)

    const previewElement = screen.getByText('Preview')
    fireEvent.click(previewElement)
    expect(MockHandleIconClick).toHaveBeenCalledWith(MockList[0])
  })


  test('navigate to doc if title pressed',()=>{
    const MockList = [{
        id: 'doc',
        title: 'doc1',
        stakeholders: ['stakeholder6'],
        scale: 'Mock Scale',
        issuanceDate: '2023-01-01',
        type: 'tipo1',
        language: 'english',
        description: 'Mock description',
        coordinates: { lat: '67.821', lng: '20.216' },
        connections: '2'  },
        ]
        
   
    render(<List list={MockList} 
        handleDocumentClick={MockHandleDocumentClick} 
        handleIconClick={MockHandleIconClick}
        currentDocument={MockCurrentDocument}
        handleCurrentDocument={MockSetCurrentDocument}
        showModal={MockShowModal}
        handleShowModal={MockSetShowModal}/>)

    const titleElement = screen.getByText(MockList[0].title)
    fireEvent.click(titleElement)
    expect(MockHandleDocumentClick).toHaveBeenCalledWith(MockList[0].id)
  })
})
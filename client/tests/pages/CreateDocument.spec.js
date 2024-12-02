import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormDocument from '../../src/pages/CreateDocument.jsx';
import API from '../../src/services/API.mjs';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, AuthContext } from '../../src/layouts/AuthContext.jsx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';  // Importa il plugin

// Estendi dayjs con il plugin customParseFormat

'../components/CreateDocument/OriginalDocumentsSelector'

jest.mock('../../src/components/CreateDocument/OriginalDocumentsSelector', () => (props) => (
  <div data-testid="OriginalDocumentsSelector" {...props}></div>
));

jest.mock('../../src/components/CreateDocument/LocationForm', () => (props) => (
  <div data-testid="LocationForm" {...props}></div>
));

jest.mock('../../src/utils/convertToDecimal', () => ({
  dmsToDecimal: jest.fn(), // crea un mock della funzione
}));

jest.mock('../../src/components/CreateDocument/RelatedDocumentsSelector', () => (props) => (
  <div data-testid="RelatedDocumentsSelector" {...props}></div>
));

jest.mock('../../src/services/API.mjs', () => ({
  getTypes: jest.fn(), // Mock di getTypes
  getDocuments: jest.fn(),
  AddDocumentDescription: jest.fn(),
  getData: jest.fn(),
  EditDocumentDescription: jest.fn().mockResolvedValue({ success: true }),
  getStake: jest.fn(),
  getScale: jest.fn()
}));




jest.mock('../../src/mocks/Document.mjs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      title: 'Mocked Title',
      stakeholder: 'Mocked Stakeholder',
      scale: '1:100',
      issuanceDate: '2024-01-01',
      type: 'Type1',
      language: 'English',
      description: 'Mocked Description',
    };
  });
});

jest.mock("react-select", () => ({ options, value, onChange, placeholder, isMulti }) => {
  function handleChange(event) {

    let selectedOptions = [];
    if (isMulti) {
      // In modalità multipla, selezioniamo tutte le opzioni selezionate
      const selectedValues = Array.from(event.currentTarget.selectedOptions).map(option => option.value);
      selectedOptions = options.filter(option => selectedValues.includes(option.value));
    } else {
      // In modalità singola, selezioniamo solo un'opzione
      const option = options.find(option => option.value == event.currentTarget.value);
      selectedOptions.push(option);
    }
    onChange(selectedOptions); // Restituiamo tutte le opzioni selezionate
  }

  return (
    <select
      id="uc"
      data-testid="select"
      value={value}
      onChange={handleChange}
      multiple={isMulti} // Aggiungiamo l'attributo 'multiple' se necessario
    >
      <option disabled value="">
        {placeholder}
      </option>
      {options?.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});


jest.mock("react-select/creatable", () => {
  return ({ options = [], value, onChange, placeholder, isMulti, onCreateOption }) => {
    function handleChange(event) {
      let selectedOptions = [];
      if (isMulti) {
        // Selezione multipla
        const selectedValues = Array.from(event.currentTarget.selectedOptions).map(option => option.value);
        selectedOptions = options.filter(option => selectedValues.includes(option.value));
      } else {
        // Selezione singola
        const option = options.find(option => option.value === event.currentTarget.value);
        selectedOptions = option ? [option] : [];
      }
      onChange(isMulti ? selectedOptions : selectedOptions[0]);
    }

    function handleCreateOption(newValue) {
      const newOption = { value: newValue, label: newValue };
      options.push(newOption); // Simula l'aggiunta di una nuova opzione
      onCreateOption && onCreateOption(newValue);
      onChange(isMulti ? [...(value || []), newOption] : newOption);
    }

    return (
      <div>
        <select
          id="creatable-select"
          data-testid="select"
          value={isMulti ? value?.map(v => v.value) : value?.value || ""}
          onChange={handleChange}
          multiple={isMulti}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {/* Input per creare una nuova opzione */}
        <input
          type="text"
          data-testid="creatable-input"
          placeholder="Create option"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              handleCreateOption(e.target.value.trim());
              e.target.value = ""; // Resetta l'input
            }
          }}
        />
      </div>
    );
  };
});



jest.mock('../../src/layouts/AuthContext', () => ({
  ...jest.requireActual('../../src/layouts/AuthContext'), // Se vuoi mantenere altre funzioni esistenti
  useAuth: jest.fn()
}));



describe('CreateDocument', () => {
  dayjs.extend(customParseFormat);
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });
  
  it('should render the form correctly', async () => {
    useParams.mockReturnValue({ id: '' });
    const mockContextValue = {
      user: {username: 'urban_planner',role: 'Urban Planner'}, // Assicurati che l'utente non sia loggato
    };
    API.getTypes.mockResolvedValue([{ value: 'type1', label: 'type1' },
      { value: 'type2', label: 'type2' },
      { value: 'type3', label: 'type3' }])
      API.getStake.mockResolvedValue([{ value: 'stakeholder1', label: 'Stakeholder 1' },
        { value: 'stakeholder2', label: 'Stakeholder 2' },
        { value: 'stakeholder3', label: 'Stakeholder 3' },
        { value: 'stakeholder4', label: 'Stakeholder 4' },
        { value: 'stakeholder5', label: 'Stakeholder 5' },
        { value: 'stakeholder6', label: 'Stakeholder 6' },
        { value: 'stakeholder7', label: 'Stakeholder 7' }])
        API.getScale.mockResolvedValue([{ value: '1:200', label: '1:200' },
          { value: '1:300', label: '1:300' },
          { value: '1:400', label: '1:400' }])
    API.getDocuments.mockResolvedValue([])
    render(<AuthContext.Provider value={mockContextValue}><FormDocument mode="add" /></AuthContext.Provider>);

    await waitFor(() => {
    
    const formElement = screen.getByText(/New Document/i);
    expect(formElement).toBeInTheDocument();

    const titleField = screen.getByPlaceholderText(/Enter title/i);
    expect(titleField).toBeInTheDocument();

    const stakeholderField = screen.getByText(/Select one or more stakeholders/i);
    expect(stakeholderField).toBeInTheDocument();

    const scaleField = screen.getByText(/Select scale/i);
    expect(scaleField).toBeInTheDocument();

    const dateField = screen.getByText(/Issuance Date/i);
    expect(dateField).toBeInTheDocument();

    const typeField = screen.getByText(/Select type/i)
    expect(typeField).toBeInTheDocument();

    const languageField = screen.getByText(/Select language/i);
    expect(languageField).toBeInTheDocument();

    const descriptionField = screen.getByText(/Description/i);
    expect(descriptionField).toBeInTheDocument();
    })
  });

  

  test('submits the form and calls AddDocumentDescription', async () => {
    useParams.mockReturnValue({ id: '' });
    const mockContextValue = {
      user: {username: 'urban_planner',role: 'Urban Planner'}, // Assicurati che l'utente non sia loggato
    };
    API.getDocuments.mockResolvedValue([])
    API.getTypes.mockResolvedValue([{ value: 'type1', label: 'type1' },
      { value: 'type2', label: 'type2' },
      { value: 'type3', label: 'type3' }])
    API.getStake.mockResolvedValue([{ value: 'stakeholder1', label: 'stakeholder1' },
      { value: 'stakeholder2', label: 'stakeholder2' },
      { value: 'stakeholder3', label: 'stakeholder3' },
      { value: 'stakeholder4', label: 'stakeholder4' },
      { value: 'stakeholder5', label: 'stakeholder5' },
      { value: 'stakeholder6', label: 'stakeholder6' },
      { value: 'stakeholder7', label: 'stakeholder7' }])
      API.getScale.mockResolvedValue([{ value: '1:200', label: '1:200' },
        { value: '1:300', label: '1:300' },
        { value: '1:400', label: '1:400' }])
    API.AddDocumentDescription.mockResolvedValue({ success: true })

    jest.useFakeTimers();
  
    render(<AuthContext.Provider value={mockContextValue}><FormDocument mode="add" /></AuthContext.Provider>);
    
    

    

    await waitFor(() => {
    const selectOptions = screen.getAllByTestId(/select/i);
    
    fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'Document Title' } });
    fireEvent.change(screen.getByPlaceholderText(/DD/i), { target: { value: '01' } });
    fireEvent.change(screen.getByPlaceholderText(/MM/i), { target: { value: '01' } });
    fireEvent.change(screen.getByPlaceholderText(/YYYY/i), { target: { value: '2024' } });
    fireEvent.change(selectOptions[0], {target: {value: 'stakeholder2'}})
    fireEvent.change(selectOptions[1], {target: {value: '1:200'}})
    fireEvent.change(selectOptions[2], { target: { value: 'type1' } });
    fireEvent.change(selectOptions[3], { target: { value: 'swedish' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter description/i), { target: { value: 'Some description' } });
    })

    fireEvent.submit(screen.getByTestId('mocked-form'));
  
    await waitFor(() => {
      expect(API.AddDocumentDescription).toHaveBeenCalledWith(
        expect.any(Object), 
        [],
        { lat: '', lng: '' },
        []
      );
      
    });
    jest.advanceTimersByTime(2000)
    expect(mockNavigate).toHaveBeenCalledWith('/documents');
    
  });


  test('loads document data when in "view" mode', async () => {
    const mockContextValue = {
      user: {username: 'urban_planner',role: 'Urban Planner'}, // Assicurati che l'utente non sia loggato
    };
    useParams.mockReturnValue({ id: '123' });
    API.getStake.mockResolvedValue([{ value: 'stakeholder1', label: 'stakeholder1' },
      { value: 'stakeholder2', label: 'stakeholder2' },
      { value: 'stakeholder3', label: 'stakeholder3' },
      { value: 'stakeholder4', label: 'stakeholder4' },
      { value: 'stakeholder5', label: 'stakeholder5' },
      { value: 'stakeholder6', label: 'stakeholder6' },
      { value: 'stakeholder7', label: 'stakeholder7' }])
    API.getDocuments.mockResolvedValue([])
    API.getScale.mockResolvedValue([{ value: '1:200', label: '1:200' },
      { value: '1:300', label: '1:300' },
      { value: '1:400', label: '1:400' }])
    API.getTypes.mockResolvedValue([{ value: 'type1', label: 'type1' },
      { value: 'type2', label: 'type2' },
      { value: 'type3', label: 'type3' }])
    API.getData.mockResolvedValue({  
      title: 'Mock Title',
      stakeholders: ['stakeholder6'],
      scale: '1:200',
      issuanceDate: '01-01-2014',
      type: 'type1',
      language: 'Italian',
      description: 'description',
      coordinates: { lat: '67.821', lng: '20.216' },
      area:[],
      connections: []  
    })
    render(<AuthContext.Provider value={mockContextValue}><FormDocument mode="view" /></AuthContext.Provider>);
    

    
    await waitFor(() => {
      expect(API.getData).toHaveBeenCalledWith('123')
    });
  
    await waitFor(() => {
      const selectOptions = screen.getAllByTestId(/select/i);
      expect(screen.getByPlaceholderText(/Enter title/i)).toHaveValue('Mock Title');
      expect(selectOptions[0]).toHaveValue(['stakeholder6']);
      expect(selectOptions[1]).toHaveValue('1:200');
      expect(screen.getByPlaceholderText(/Enter description/i)).toHaveValue('description');
      expect(selectOptions[2]).toHaveValue('type1');
      expect(selectOptions[3]).toHaveValue('Italian');
    });
  });


  test('edit document in "view" mode', async () => {
    useParams.mockReturnValue({ id: '123' });
    const mockContextValue = {
      user: {username: 'urban_planner',role: 'Urban Planner'}, // Assicurati che l'utente non sia loggato
    };
    useAuth.mockReturnValue(mockContextValue);
    API.getStake.mockResolvedValue([{ value: 'stakeholder1', label: 'stakeholder1' },
      { value: 'stakeholder2', label: 'stakeholder2' },
      { value: 'stakeholder3', label: 'stakeholder3' },
      { value: 'stakeholder4', label: 'stakeholder4' },
      { value: 'stakeholder5', label: 'stakeholder5' },
      { value: 'stakeholder6', label: 'stakeholder6' },
      { value: 'stakeholder7', label: 'stakeholder7' }])
    API.getDocuments.mockResolvedValue([])
    API.getScale.mockResolvedValue([{ value: '1:200', label: '1:200' },
      { value: '1:300', label: '1:300' },
      { value: '1:400', label: '1:400' }])
    API.getTypes.mockResolvedValue([{ value: 'type1', label: 'type1' },
      { value: 'type2', label: 'type2' },
      { value: 'type3', label: 'type3' }])
    API.getData.mockResolvedValue({  
      title: 'Mock Title',
      stakeholders: ['stakeholder6'],
      scale: '1:200',
      issuanceDate: '01-01-2014',
      type: 'type1',
      language: 'Italian',
      description: 'description',
      coordinates: { lat: '67.821', lng: '20.216' },
      area:[],
      connections: []  
    })
    render(<AuthContext.Provider value={mockContextValue}><FormDocument mode="view" /></AuthContext.Provider>);
    

    
    await waitFor(() => {
      expect(API.getData).toHaveBeenCalledWith('123')
    });

    fireEvent.click(screen.getByTestId(/edit/i))
  
    await waitFor(() => {
      const selectOptions = screen.getAllByTestId(/select/i);
      expect(screen.getByPlaceholderText(/Enter title/i)).toHaveValue('Mock Title');
      expect(selectOptions[0]).toHaveValue(['stakeholder6']);
      expect(selectOptions[1]).toHaveValue('1:200');
      expect(screen.getByPlaceholderText(/Enter description/i)).toHaveValue('description');
      expect(selectOptions[2]).toHaveValue('type1');
      expect(selectOptions[3]).toHaveValue('Italian');
    });

    fireEvent.change(screen.getByPlaceholderText(/YYYY/i), { target: { value: '2023' } });

    fireEvent.submit(screen.getByTestId('mocked-form'));
  
    await waitFor(() => {
      expect(API.EditDocumentDescription).toHaveBeenCalledWith(
        expect.any(Object), 
        [],
        { lat: '67.821', lng: '20.216' },
        [],
        '123'
      );
      
    });

  });

  test('shows error when required fields are empty', async () => {
    const mockContextValue = {
      user: {username: 'urban_planner',role: 'Urban Planner'}, // Assicurati che l'utente non sia loggato
    };
    useParams.mockReturnValue({ id: '' });
    API.getTypes.mockResolvedValue([{ value: 'type1', label: 'type1' },
      { value: 'type2', label: 'type2' },
      { value: 'type3', label: 'type3' }])
    API.getStake.mockResolvedValue([{ value: 'stakeholder1', label: 'Stakeholder 1' },
      { value: 'stakeholder2', label: 'Stakeholder 2' },
      { value: 'stakeholder3', label: 'Stakeholder 3' },
      { value: 'stakeholder4', label: 'Stakeholder 4' },
      { value: 'stakeholder5', label: 'Stakeholder 5' },
      { value: 'stakeholder6', label: 'Stakeholder 6' },
      { value: 'stakeholder7', label: 'Stakeholder 7' }])
    API.getDocuments.mockResolvedValue([]);
    
    render(<AuthContext.Provider value={mockContextValue}><FormDocument mode="view" /></AuthContext.Provider>);
  
    // Simulate submitting the form with empty fields
    fireEvent.submit(screen.getByTestId('mocked-form'));
  
    // Wait for the form to be validated
    await waitFor(() => {
      // Check that the required fields show validation errors
      expect(screen.getByText(/Title cannot be empty!/i)).toBeInTheDocument();
      expect(screen.getByText(/Stakeholder cannot be empty!/i)).toBeInTheDocument();
      expect(screen.getByText(/Scale cannot be empty!/i)).toBeInTheDocument();
      expect(screen.getByText(/Description cannot be empty!/i)).toBeInTheDocument();
      expect(screen.getByText(/Type cannot be empty!/i)).toBeInTheDocument();
    });
  });
  
});
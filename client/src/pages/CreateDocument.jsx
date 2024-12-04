import React, { useState,useEffect,useContext, useRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams} from 'react-router-dom'
import { PiNotePencilThin } from "react-icons/pi";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { LiaCheckCircle } from "react-icons/lia";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { AuthContext } from '@/layouts/AuthContext';
import RelatedDocumentsSelector from '@/components/CreateDocument/RelatedDocumentsSelector';
import LocationForm from '@/components/CreateDocument/LocationForm'; 
import API from '@/services/API.mjs';
import Document from '@/mocks/Document.mjs';
import { showSuccess } from '@/utils/notifications';
import '../style/CreateDocument.css'
import DocumentUploader from '../components/CreateDocument/OriginalDocumentsSelector';

function FormDocument(props) {

  dayjs.extend(customParseFormat);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const locationFormRef = useRef();
  const [docID,setDocID] = useState(props.mode==='view' ? id : '');
  const [title,setTitle] = useState('');
  const [stakeholder,setStakeholder] = useState([]);
  const [scale,setScale] = useState(null);
  const [type,setType] = useState(null);
  const [language,setLanguage] = useState('');
  const [description,setDescription] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [area, setArea] = useState([]);
  const [loading,setLoading] = useState(true);
  const [isLoadingStake,setIsLoadingStake] = useState(false);
  const [isLoadingType,setIsLoadingType] = useState(false);
  const [isLoadingScale,setIsLoadingScale] = useState(false);
  const [day,setDay] = useState('')
  const [month,setMonth] = useState('')
  const [year,setYear] = useState('')
  const [edit,setEdit] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]); 
  const [selectedDocuments, setSelectedDocuments] = useState([]); 
  const [relatedDocuments, setRelatedDocuments] = useState([]); 
  const [selectedConnectionTypes, setSelectedConnectionTypes] = useState([]);
  const [allTypes,setAllTypes] = useState([]);
  const [allStake,setAllStake] = useState([]);
  const [allScale,setAllScale] = useState([]);
  const [errors, setErrors] = useState([]);
  const [rights, setRights] = useState(false);
  const [files, setFiles] = useState([]);

  const customStyles = {
    control: (base) => ({
      ...base,
      fontFamily: 'Open Sans',                  // Font
      fontSize: '24px',                          // Dimensione del font
      color: 'var(--demo-black)',                // Colore del testo
      maxWidth: '450px',                         // Larghezza massima
      width: '100%',                             // Larghezza dinamica
      height: '51px',                            // Altezza del campo
      paddingLeft: '20px',                       // Padding sinistro
      backgroundColor: 'var(--lily-white)',      // Colore di sfondo
      border: 'none',                            // Nessun bordo
      borderRadius: '0',                         // Nessun arrotondamento
      boxShadow: 'none',                         // Nessuna ombra
    }),
    placeholder: (base) => ({
      ...base,
      fontFamily: 'Open Sans',
      fontSize: '24px',
      color: 'var(--demo-black)',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--demo-black)',               // Colore del testo selezionato
    }),
    menu: (base) => ({
      ...base,
      fontFamily: 'Open Sans',
      fontSize: '24px',
      color: 'var(--demo-black)',
      backgroundColor: 'var(--lily-white)',
      borderRadius: '0',                        // Bordo del menu
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#e9ecef' : 'var(--lily-white)', // Colore di sfondo quando selezionata o no
      color: 'var(--demo-black)',
      '&:active': {
        backgroundColor: '#e9ecef',
      },
    }),
  };

  const allLanguage = [{ value: 'Italian', label: 'Italian' },
    { value: 'Swedish', label: 'Swedish' },
    { value: 'English', label: 'English' }]

  useEffect(() => {
    if (props.mode === 'view') {
      setDocID(id); // Update docID whenever id changes
    }
  }, [id, props.mode]); // Only run when `id` or `props.mode` changes

  useEffect(()=>{
    const loadData = async () => {
      try {
        const [types, documents, stake, sca] = await Promise.all([API.getTypes(), API.getDocuments(), API.getStake(), API.getScale()]);
        setAllTypes(types);
        setAllStake(stake);
        setAllScale(sca);
        const filteredDocuments = props.mode === 'view' ? documents.filter(doc => doc.id !== id) : documents;
        setAllDocuments(filteredDocuments);

        if (props.mode === 'view') {
          if(user){
            if(user.role==='Urban Planner')
              setRights(true)
          }
          const doc = await API.getData(docID);
          const connectedDocumentIds = doc.connections.map(doc => doc.id);
          setTitle(doc.title);
          const st = [];
          doc.stakeholders.forEach((s) => st.push({value:s, label:s}))
          setStakeholder(st);
          setScale({value:doc.scale, label:doc.scale});
          setDescription(doc.description);
          setType({value:doc.type, label:doc.type});
          setLanguage({value:doc.language, label:doc.language});
          setCoordinates(doc.coordinates);
          setArea(doc.area);
          const [dd, mm, yyyy] = doc.issuanceDate.split("-");
          if(dd!=='00')
            setDay(dd)
          if(mm!=='00')
            setMonth(mm)
          setYear(yyyy)
          setRelatedDocuments(doc.connections);
          setSelectedDocuments(connectedDocumentIds);
          setFiles(doc.files);
          console.log(doc)
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [props.mode, docID, id]);

  const handleRelatedDocumentClick = (relatedDocumentId) => navigate(`/document/view/${relatedDocumentId}`);
  const handleCoordinatesChange = (newCoordinates) => { setCoordinates(newCoordinates)};
  const handleAreaChange = (area) => { setArea(area)};
  const validateForm = () => {
    const validationErrors = {};
    if (!title.trim()) validationErrors.title = 'Title cannot be empty!';
    if (stakeholder.length === 0) validationErrors.stakeholder = 'Stakeholder cannot be empty!';
    if (scale === null) validationErrors.scale = 'Scale cannot be empty!';
    if (type === null) validationErrors.type = 'Type cannot be empty!';
    if (!description.trim()) validationErrors.description = 'Description cannot be empty!';
    
    if (day && (!month && !year)) {
        validationErrors.day = 'Insert month and year before the day.';
    }
    if (month && !year) {
        validationErrors.month = 'Insert year before the month.';
    }
    if (day || month || year) {
        const { errors, formattedDate } = validateAndFormatDate(day, month, year);
        if (Object.keys(errors).length > 0) {
            Object.assign(validationErrors, errors);
        } else {
            setDay(formattedDate.day);
            setMonth(formattedDate.month);
            setYear(formattedDate.year);
        }
    }

    if (
        locationFormRef.current &&
        Object.keys(coordinates).length &&
        coordinates.lat !== '' &&
        coordinates.lng !== ''
    ) {
        const isValid = locationFormRef.current.areValidCoordinates(coordinates);
        if (!isValid) validationErrors.coordinates = 'Not correct format or not inside Kiruna area';
    }

    selectedConnectionTypes.forEach((connection) => {
        const documentId = connection.id;
        const connectionsForDocument = selectedConnectionTypes.filter(
            (item) => item.id === documentId
        );

        if (connectionsForDocument.length === 1 && connectionsForDocument[0].type === "") {
            validationErrors[documentId] = `Connection type for document with ID ${documentId} is missing!`;
        }
    });
    return validationErrors;
  };

  function validateAndFormatDate(day, month, year) {
    const errors = {};

    // Convert to numbers
    const dayNum = day ? parseInt(day, 10) : null;
    const monthNum = month ? parseInt(month, 10) : null;
    const yearNum = year ? parseInt(year, 10) : null;

    // Validate day if provided
    if (day && (isNaN(dayNum) || dayNum < 1 || dayNum > 31)) {
        errors.day = "Il giorno deve essere compreso tra 1 e 31.";
    }

    // Validate month if provided
    if (month && (isNaN(monthNum) || monthNum < 1 || monthNum > 12)) {
        errors.month = "Il mese deve essere compreso tra 1 e 12.";
    }

    // Validate year (mandatory)
    if (!year || isNaN(yearNum) || yearNum.toString().length !== 4) {
        errors.year = "L'anno deve essere composto da 4 cifre.";
    }

    // Format values
    const formattedDay = day && dayNum < 10 ? `0${dayNum}` : day || "";
    const formattedMonth = month && monthNum < 10 ? `0${monthNum}` : month || "";
    const formattedYear = year ? yearNum.toString() : "";

    return {
        errors,
        formattedDate: !Object.keys(errors).length
            ? { day: formattedDay, month: formattedMonth, year: formattedYear }
            : null,
    };
}



  const handleSubmit = (event) =>{
    if(event)
      event.preventDefault()

    const validationErrors = validateForm();

    //event.preventDefault();
    const connections = selectedConnectionTypes.filter(
      (connection) => connection.type !== ""
    );
  
    
    if(Object.keys(validationErrors).length>0){
      console.log("Form not submitted"); // Debugging
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    const st=[];
    stakeholder.forEach((s) =>st.push(s.value))
    let issuanceDate;
    if(!day){
      if(!month){
        issuanceDate = `00-00-${year}`
      }else{
        issuanceDate= `00-${month}-${year}`
      }
    }else{
      issuanceDate = `${day}-${month}-${year}`
    }
    const doc = new Document(docID, title.trim(), st, scale.value, issuanceDate, type.value, language.value, description);
    if(props.mode==='add'){
      API.AddDocumentDescription(doc, connections, coordinates, area);
    } else if (props.mode === 'view') {
      API.EditDocumentDescription(doc, connections, coordinates, area, docID );
    }
    showSuccess('Action successful!')
    setTimeout(()=>{
      navigate('/documents');
    }, 2000)
  };

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments(prevSelected =>
      prevSelected.includes(documentId)
        ? prevSelected.filter(id => id !== documentId)
        : [...prevSelected, documentId]
    );
  };

  const handleSelectStakeChange = (selectedOptions) => {
    
    setStakeholder(selectedOptions);
  };

  const handleSelectTypeChange = (selectedOption) => {
    setType(selectedOption);
  };

  const handleSelectLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
  };

  const handleSelectScaleChange = (selectedOption) => {
    setScale(selectedOption);
  };

  const handleFileAdded = (newFileName) => {
    setFiles((prevFiles) => [...prevFiles, newFileName]);
  };

  const handleFileRemoved = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileName));
  };

  const handleConnectionTypeSelect = (documentId, selectedConnectionType) => {
    console.log("Tipo selezionato:", selectedConnectionType);
  
    setSelectedConnectionTypes((prevSelected) => {
      // Trova tutte le connessioni esistenti per il documento
      const existingConnections = prevSelected.filter(
        (item) => item.id === documentId
      );
  
      console.log("Precedente stato:", prevSelected);
  
      // Controlla se il tipo di connessione è già presente
      const isConnectionPresent = existingConnections.some(
        (item) => item.type === selectedConnectionType
      );
  
      if (isConnectionPresent) {
        // Se il tipo di connessione è già presente, rimuovilo
        const updatedSelected = prevSelected.filter(
          (item) =>
            !(item.id === documentId && item.type === selectedConnectionType)
        );
        console.log("Connessione rimossa:", updatedSelected);
        return updatedSelected;
      } else {
        // Altrimenti, aggiungilo come nuovo oggetto
        const newConnection = { id: documentId, type: selectedConnectionType };
        const newState = [...prevSelected, newConnection];
        console.log("Nuova connessione aggiunta:", newState);
        return newState;
      }
    });
  };
  
  
  const handleEditChange=()=>{
    setEdit(true);
  };

  const createOption = (label) => ({
    label,
    value: label,
  });

  const handleCreateStake = (inputValue) => {
    setIsLoadingStake(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      API.addStakeholder(inputValue);
      setIsLoadingStake(false);
      setAllStake((prev) => [prev, newOption]);
      setStakeholder((prev) => [...prev, newOption]);
    }, 1000);
  };

  const handleCreateType = (inputValue) => {
    setIsLoadingType(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      API.addType(inputValue);
      setIsLoadingType(false);
      setAllTypes((prev) => [...prev, newOption]);
      setType(newOption);
    }, 1000);
  };

  const handleCreateScale = (inputValue) => {
    setIsLoadingScale(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      API.addScale(inputValue);
      setIsLoadingScale(false);
      setAllScale((prev) => [...prev, newOption]);
      setScale(newOption);
    }, 1000);
  };

  return  (
    <div className="wrapper">
      <div className="form-container">
        <h2 className='form-container-title'>
          <HiArrowUturnLeft className='back-button' onClick={()=>navigate(-1)}/>
          {props.mode==='view' ? title : 'New Document'}
          {(props.mode==='view' && edit===false && rights) && <PiNotePencilThin className='edit-button' data-testid="edit" onClick={() => handleEditChange() }/>}
          {(props.mode==='add' || (edit===true && rights)) && <LiaCheckCircle className='save-button-icon' onClick={() => handleSubmit() }/>}
          </h2>
        <Form onSubmit={handleSubmit} data-testid="form-component">
          <Row>
            <Col className='col-form'>
              <Form.Group className='form-group'  controlId="title">
                <Form.Label>Title{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control type="text" placeholder="Enter title" minLength={2} value={title} onChange={(event) => setTitle(event.target.value)}  isInvalid={!!errors.title} readOnly={!edit && props.mode!=='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className='form-group' controlId="stakeholder">
                <Form.Label>
                  Stakeholder{(props.mode === 'add' || edit) && <span>*</span>}
                </Form.Label>
                {!loading && <CreatableSelect
                  classNamePrefix="react-select"
                  styles={customStyles}
                  isMulti
                  isLoading={isLoadingStake}
                  options={allStake} // Dati da mostrare nel dropdown
                  value={stakeholder} // Valori selezionati
                  onCreateOption={handleCreateStake}
                  onChange={handleSelectStakeChange} // Funzione per aggiornare lo stato
                  getOptionLabel={(e) => e.label} // Personalizza l'etichetta dell'opzione
                  getOptionValue={(e) => e.value} // Personalizza il valore dell'opzione
                  placeholder="Select one or more stakeholders"
                  isDisabled={!edit && props.mode !== 'add'}
                >
                </CreatableSelect>
                }
                {errors.stakeholder && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {errors.stakeholder}
                  </div>
                  )}
              </Form.Group>
              
              <Form.Group className='form-group'  controlId="scale">
                <Form.Label>Scale{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                {!loading && <CreatableSelect
                  classNamePrefix="react-select"
                  styles={customStyles}
                  isLoading={isLoadingScale}
                  onCreateOption={handleCreateScale}
                  options={allScale} // Dati da mostrare nel dropdown
                  value={scale} // Valori selezionati
                  onChange={handleSelectScaleChange} // Funzione per aggiornare lo stato
                  getOptionLabel={(e) => e.label} // Personalizza l'etichetta dell'opzione
                  getOptionValue={(e) => e.value} // Personalizza il valore dell'opzione
                  placeholder="Select scale"
                  isDisabled={!edit && props.mode !== 'add'}
                >
                </CreatableSelect>}
                {errors.scale && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {errors.scale}
                  </div>
                  )}
              </Form.Group>

              <Form.Group className='form-group'  controlId="issuanceDate">
                <Form.Label>Issuance Date{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Row>
                    <Col xs={3}>
                      <Form.Control type="text" placeholder="DD" value={day} onChange={(event) => setDay(event.target.value)}  isInvalid={!!errors.day} readOnly={!edit && props.mode!=='add'}/>
                      <Form.Control.Feedback type="invalid">
                        {errors.day}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={3}>
                      <Form.Control type="text" placeholder="MM" value={month} onChange={(event) => setMonth(event.target.value)}  isInvalid={!!errors.month} readOnly={!edit && props.mode!=='add'}/>
                      <Form.Control.Feedback type="invalid">
                        {errors.month}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={5}>
                      <Form.Control type="text" placeholder="YYYY" value={year} onChange={(event) => setYear(event.target.value)}  isInvalid={!!errors.year} readOnly={!edit && props.mode!=='add'}/>
                    </Col>
                </Row>
              </Form.Group>

              <Form.Group className='form-group' controlId="type">
                <Form.Label>Type{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                {!loading && <CreatableSelect
                  classNamePrefix="react-select"
                  styles={customStyles}
                  isLoading={isLoadingType}
                  onCreateOption={handleCreateType}
                  options={allTypes} // Dati da mostrare nel dropdown
                  value={type} // Valori selezionati
                  onChange={handleSelectTypeChange} // Funzione per aggiornare lo stato
                  getOptionLabel={(e) => e.label} // Personalizza l'etichetta dell'opzione
                  getOptionValue={(e) => e.value} // Personalizza il valore dell'opzione
                  placeholder="Select type"
                  isDisabled={!edit && props.mode !== 'add'}
                >
                </CreatableSelect>}
                {errors.type && (
                  <div className="invalid-feedback" style={{ display: "block" }}>
                    {errors.type}
                  </div>
                  )}
              </Form.Group>

              <Form.Group className='form-group' controlId="language">
                <Form.Label>Language{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Select
                  classNamePrefix="react-select"
                  styles={customStyles}
                  options={allLanguage} // Dati da mostrare nel dropdown
                  value={language} // Valori selezionati
                  onChange={handleSelectLanguageChange} // Funzione per aggiornare lo stato
                  getOptionLabel={(e) => e.label} // Personalizza l'etichetta dell'opzione
                  getOptionValue={(e) => e.value} // Personalizza il valore dell'opzione
                  placeholder="Select language"
                  isDisabled={!edit && props.mode !== 'add'}
                >
                </Select>
              </Form.Group>
            </Col>

            <Col className='col-form'>
              <Form.Group  className='form-group' controlId="description">
                <Form.Label>Description{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control as="textarea" placeholder="Enter description" value={description} onChange={(event) => setDescription(event.target.value)}  isInvalid={!!errors.description} readOnly={!edit && props.mode!=='add'}     className={!edit && props.mode === 'view' ? 'scrollable-description' : ''}
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                    {errors.description}
              </Form.Control.Feedback>

              <DocumentUploader 
                mode={props.mode}
                edit={edit}
                documentId={docID}
                files={files}
                onFileAdded={handleFileAdded}
                onFileRemoved={handleFileRemoved}         
              ></DocumentUploader>

            </Col>
          </Row>

          <Row>
            <LocationForm
              ref={locationFormRef} 
              mode={props.mode}
              edit={edit}
              coordinates={coordinates}
              handleCoordinatesChange={handleCoordinatesChange}
              area={area}
              handleAreaChange={handleAreaChange}
            />
          </Row>
          <Row className='mt-6'>
            <Row>
              <Col md={4}>
                <Form.Group  className='form-group' controlId="description">
                  <Form.Label>{(props.mode === 'add' || edit) ? 'Connect to the documents' : 'Connections'}</Form.Label>
                  </Form.Group>
                </Col>
            </Row>
            {!loading && <RelatedDocumentsSelector 
              mode={props.mode}
              edit={edit}
              allDocuments={(props.mode === 'add' || edit) ? allDocuments : relatedDocuments}
              relatedDocuments={relatedDocuments}
              selectedDocuments={selectedDocuments}
              selectedConnectionTypes={selectedConnectionTypes}
              onDocumentSelect={handleDocumentSelect}
              onRelatedDocumentClick={handleRelatedDocumentClick}
              onConnectionTypeChange={handleConnectionTypeSelect}
              setSelectedConnectionTypes={setSelectedConnectionTypes}
            />}
          </Row>
          {(props.mode === 'add' || edit) && (
            <Row className="justify-content-end">
              <Button 
                className="save-button" 
                type="submit" 
                data-testid={props.mode === 'add' ? 'add' : undefined}
              >
                {'Save'}
              </Button>
            </Row>
          )}
        </Form>
      </div>
    </div>
  );
}


export default FormDocument;
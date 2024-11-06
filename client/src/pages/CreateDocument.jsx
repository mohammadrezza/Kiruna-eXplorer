import React, { useState,useEffect } from 'react';
import { Form, Button, Row, Col, Modal, ListGroup, InputGroup, Table, FormControl } from 'react-bootstrap';
import { useNavigate, useParams} from 'react-router-dom'
import { PiMapPinSimpleAreaFill, PiPen, PiNotePencilThin } from "react-icons/pi";
import * as dayjs from 'dayjs'
import MapPointSelector from '../components/MapPointSelector'
import RelatedDocumentsSelector from '../components/RelatedDocumentsSelector';
import API from '../services/API.mjs';
import Document from '../mocks/Document.mjs';
import { dmsToDecimal } from '../utils/convertToDecimal';
import '../style/CreateDocument.css'

function FormDocument(props) {

  const { id } = useParams();
  const navigate = useNavigate();


  const [docID,setDocID] = useState(props.mode==='view' ? id : '');
  const [title,setTitle] = useState('');
  const [stakeholder,setStakeholder] = useState('');
  const [scale,setScale] = useState('');
  const [issuanceDate,setIssuanceDate] = useState('');
  const [type,setType] = useState(null);
  const [language,setLanguage] = useState('');
  const [description,setDescription] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [loading,setLoading] = useState(true);
  const [loadingDocs,setLoadingDocs] = useState(true);
  const [edit,setEdit] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isWholeMunicipal, setIsWholeMunicipal] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]); 
  const [selectedDocuments, setSelectedDocuments] = useState([]); 
  const [relatedDocuments, setRelatedDocuments] = useState([]); 
  const [allTypes,setAllTypes] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (props.mode === 'view') {
      setDocID(id); // Update docID whenever id changes
    }
  }, [id, props.mode]); // Only run when `id` or `props.mode` changes

  useEffect(()=>{
    const loadData = async () => {
      try {
        const [types, documents] = await Promise.all([API.getTypes(), API.getDocuments()]);
        setAllTypes(types);
        const filteredDocuments = props.mode === 'view' ? documents.filter(doc => doc.id !== id) : documents;
        setAllDocuments(filteredDocuments);

        if (props.mode === 'view') {
          const doc = await API.getData(docID);
          const connectedDocumentIds = doc.connections.map(doc => doc.id);
          setTitle(doc.title);
          setStakeholder(doc.stakeholders);
          setScale(doc.scale);
          setDescription(doc.description);
          setType(doc.type);
          setLanguage(doc.language);
          if(doc.coordinates.lat === 0 && doc.coordinates.lng === 0 )
            setIsWholeMunicipal(true)
          else setCoordinates(doc.coordinates);
          setIssuanceDate(dayjs(doc.issuanceDate).format('YYYY-MM-DD'));
          setRelatedDocuments(doc.connections);
          setSelectedDocuments(connectedDocumentIds)
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
        setLoadingDocs(false);
      }
    };

    loadData();
  }, [props.mode, docID, id]);

  const areCoordinatesValid = (coordinates) => {
    return /^-?\d*\.?\d*$/.test(coordinates.lat) && /^-?\d*\.?\d*$/.test(coordinates.lng);
  };
  const handleDMSConversion = (coordinates, setCoordinates, setErrors) => {
    try {
      const decimalCoordinate = dmsToDecimal(`${coordinates.lat} ${coordinates.lng}`);
      setCoordinates(decimalCoordinate);
      setErrors([]);
    } catch (error) {
      setErrors({ coordinates: 'Not correct format' });
      setCoordinates({ lat: '', lng: '' });
    }
  };
  const toggleMap = () => {
    if (areCoordinatesValid(coordinates) || coordinates === '') {
      setShowMap(prev => !prev);
      setIsWholeMunicipal(false)
    } else {
      handleDMSConversion(coordinates, setCoordinates, setErrors);
      setShowMap(prev => !prev);
      setIsWholeMunicipal(false)
    }
  };
  const handleCoordinatesChange = (newCoordinates) => {
    setErrors([]);
    setCoordinates(newCoordinates)
    setIsWholeMunicipal(false)
  };
  const handleDMSChange = () => {
    if (areCoordinatesValid(coordinates) || coordinates === '') {
      setErrors([]);
    } else {
      handleDMSConversion(coordinates, setCoordinates, setErrors);
    }
  };
  const handleSelectWholeMunicipal = () => {
    setIsWholeMunicipal(!isWholeMunicipal)
    setCoordinates({ lat: '', lng: '' });
    setErrors([]);
  };
  const handleRelatedDocumentClick = (relatedDocumentId) => navigate(`/documents/view/${relatedDocumentId}`);

  const validateForm = () => {
    const validationErrors = {};
    if (!title.trim()) validationErrors.title = 'Title cannot be empty!';
    if (!stakeholder.trim()) validationErrors.stakeholder = 'Stakeholder cannot be empty!';
    if (!scale.trim()) validationErrors.scale = 'Scale cannot be empty!';
    if (type === null) validationErrors.type = 'Type cannot be empty!';
    if (!description.trim()) validationErrors.description = 'Description cannot be empty!';
    if (!areCoordinatesValid(coordinates)) validationErrors.coordinates = 'Not correct format. Try to convert it';
    if(!isWholeMunicipal && (!coordinates.lat || !coordinates.lng)) validationErrors.coordinates = 'Coordinates cannot be empty!';
    return validationErrors;
  };



  const handleSubmit = (event) =>{
    event.preventDefault();
    const validationErrors = validateForm();
    console.log("Form submitted"); // Debugging
    if(Object.keys(validationErrors).length>0){
      setErrors(validationErrors);
      console.log(errors);
      return;
    }
    if(isWholeMunicipal) {coordinates.lat = 0; coordinates.lng = 0}
    setErrors([]);
    const doc = new Document(docID, title.trim(), stakeholder.trim(), scale, issuanceDate, type, language, description);
    if(props.mode==='add'){
      API.AddDocumentDescription(doc, selectedDocuments, coordinates);
    } else if (props.mode === 'view') {
      API.EditDocumentDescription(doc, selectedDocuments, coordinates, docID);
    }
    //if we want to set the connections 
    //by using this API we pass selectedDocuments as
    // an argument here
    //otherwise we create a new API
    navigate('/');
  };

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments(prevSelected =>
      prevSelected.includes(documentId)
        ? prevSelected.filter(id => id !== documentId)
        : [...prevSelected, documentId]
    );
  };
  
  
  return  (
    <div className="wrapper">
      <div className="form-container">
        <h2 className='form-container-title'>
          {props.mode==='view' ? title : 'New Document'}
          {(props.mode==='view' && edit===false) && <PiNotePencilThin className='edit-button' onClick={() => setEdit(true)}/>}
          </h2>
        <Form onSubmit={handleSubmit} data-testid="form-component">
          <Row>
            <Col className='col-form'>
              <Form.Group className='form-group'  controlId="title">
                <Form.Label>Title{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control type="text" placeholder="Enter title" minLength={2} value={title} onChange={(event) => setTitle(event.target.value)}  isInvalid={!!errors.title} readOnly={!edit && props.mode!='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className='form-group'  controlId="stakeholder">
                <Form.Label>Stakeholder{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control type="text" placeholder="Enter stakeholder" value={stakeholder} onChange={(event) => setStakeholder(event.target.value)}  isInvalid={!!errors.stakeholder} readOnly={!edit && props.mode!='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.stakeholder}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className='form-group'  controlId="scale">
                <Form.Label>Scale{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control type="text" placeholder="Enter scale" value={scale} onChange={(event) => setScale(event.target.value)}  isInvalid={!!errors.scale} readOnly={!edit && props.mode!='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.scale}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='form-group'  controlId="issuanceDate">
                <Form.Label>Issuance Date{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control  data-testid="date-input" type="date" value={issuanceDate} onChange={(event) => setIssuanceDate(event.target.value)} readOnly={!edit && props.mode!='add'}/>
              </Form.Group>

              <Form.Group className='form-group' controlId="type">
                <Form.Label>Type{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                {!loading && <Form.Select  data-testid="type-input" value={type || ''} onChange={(event) => setType(event.target.value)}  isInvalid={!!errors.type} readOnly={!edit && props.mode!='add'}>
                  <option>Select type</option>
                  { allTypes.map((t) => 
                    <option key={t} value={t}>{t}</option>
                  )}
                </Form.Select>}
              </Form.Group>

              <Form.Group className='form-group' controlId="language">
                <Form.Label>Language{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Select  data-testid="language-input" value={language} onChange={(event) => setLanguage(event.target.value)} readOnly={!edit && props.mode!='add'}>
                  <option>Select language</option>
                  <option>english</option>
                  <option>italian</option>
                  <option>swedish</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col className='col-form'>
              <Form.Group  className='form-group' controlId="description">
                <Form.Label>Description{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                <Form.Control as="textarea" placeholder="Enter description" value={description} onChange={(event) => setDescription(event.target.value)}  isInvalid={!!errors.description} readOnly={!edit && props.mode!='add'}     className={!edit && props.mode === 'view' ? 'scrollable-description' : ''}
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                    {errors.description}
              </Form.Control.Feedback>
            </Col>
          </Row>
          <Row>
            <Row className="align-bottom" >
              <Col md={4}>
                <Form.Group  className='form-group' controlId="description">
                  <Form.Label>Coordinates{(props.mode === 'add' || edit) && <span>*</span>}</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="latitude" 
                    minLength={2} 
                    value={coordinates.lat} 
                    onChange={(event) => handleCoordinatesChange({lat:event.target.value, lng:coordinates.lng})}
                    isInvalid={!!errors.coordinates} 
                    readOnly={(!edit && props.mode !=='add') || showMap}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group  className='form-group' controlId="description">
                    <Form.Control 
                      type="text" 
                      placeholder="longitude" 
                      minLength={2} 
                      value={coordinates.lng} 
                      onChange={(event) => handleCoordinatesChange({lat: coordinates.lat, lng:event.target.value})}
                      isInvalid={!!errors.coordinates} 
                      readOnly={(!edit && props.mode !== 'add' )|| showMap}
                      />
                  </Form.Group>
                </Col>
                <Col md={3}>
                {(props.mode === 'add' || edit) && (
                  <div className='convert-btn' onClick={handleDMSChange}>convert DMS format</div>  
                )}
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <div className="map-view-trigger">
                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Check 
                        type="checkbox" 
                        label="Select the whole municipal" 
                        disabled={!(props.mode === 'add' || edit)}
                        checked={isWholeMunicipal} 
                        onChange={handleSelectWholeMunicipal} 
                      />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={3}>
                {(props.mode === 'add' || edit) && (
                  <div className="map-view-trigger" onClick={toggleMap}>
                    {showMap ? (<PiPen />) : (<PiMapPinSimpleAreaFill />)}
                    <span>{showMap ? 'Type coordinates' : 'Select on map'}</span>
                  </div>
                )}
                </Col>
              </Row>
            {(showMap || (props.mode !== 'add' && !edit)) && <MapPointSelector 
              coordinates={coordinates}
              mode={props.mode}
              edit={edit}
              onCoordinatesChange={handleCoordinatesChange} 
            />}
          </Row>
          <Row className='mt-6'>
            <Row>
              <Col md={4}>
                <Form.Group  className='form-group' controlId="description">
                  <Form.Label>{(props.mode === 'add' || edit) ? 'Connect to the documents' : 'Connections'}</Form.Label>
                  </Form.Group>
                </Col>
            </Row>
            <RelatedDocumentsSelector 
              mode={props.mode}
              edit={edit}
              allDocuments={(props.mode === 'add' || edit) ? allDocuments : relatedDocuments}
              selectedDocuments={selectedDocuments}
              onDocumentSelect={handleDocumentSelect}
              onRelatedDocumentClick={handleRelatedDocumentClick}
            />
          </Row>
          {(props.mode === 'add' || edit) && (
            <Button 
              className="add-button" 
              type="submit" 
              data-testid={props.mode === 'add' ? 'add' : undefined}
            >
              {'Save'}
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
}


export default FormDocument;
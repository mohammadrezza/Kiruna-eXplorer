import React from 'react';
import { Form, Button, Row, Col, Modal, ListGroup, InputGroup, Table, FormControl } from 'react-bootstrap';
import { useNavigate, useParams} from 'react-router-dom'
import { useState,useEffect } from 'react';
import {FaPenSquare}from 'react-icons/fa';
import { PiMapPinSimpleAreaFill, PiPen } from "react-icons/pi";
import dayjs from 'dayjs';
import MapPointSelector from '../components/MapPointSelector'
import API from '../services/API.mjs';
import Document from '../mocks/Document.mjs';
import '../style/CreateDocument.css'

function FormDocument(props) {

  const param = useParams();
  const navigate = useNavigate();

  const [docID,setDocID] = useState(props.mode==='view' ? param.id : '')
  const [title,setTitle] = useState('');
  const [stakeholder,setStakeholder] = useState('');
  const [scale,setScale] = useState('');
  const [issuanceDate,setIssuanceDate] = useState();
  const [type,setType] = useState(null);
  const [language,setLanguage] = useState('');
  const [description,setDescription] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [loading,setLoading] = useState(true);
  const [loadDoc,setLoadDoc] = useState(true);
  const [edit,setEdit] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showDocumentList, setShowDocumentList] = useState(false); 
  const [allDocuments, setAllDocuments] = useState([]); 
  const [selectedDocuments, setSelectedDocuments] = useState([]); 
  const [relatedDocuments, setRelatedDocuments] = useState([]); 
  const [allTypes,setAllTypes] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(()=>{
    const loadType = async() => {
      try
      {API.getTypes().then((types) =>{
        setAllTypes(types);
      })}
      catch(error)
      {
        console.error("Error loading types:", error);
      }
      finally{
        setLoading(false)
      }
    }

    loadType();

    const loadDocuments = async () => {
      try {
        const documents = await API.getDocuments(); 
        setAllDocuments(documents);
      } catch (error) {
        console.error("Error loading documents:", error);
      }
      finally{
        setLoadDoc(false);
      }
    };
    if(props.mode==='add')
      loadDocuments();

    const loadData = async () => {
      try{
        const doc = await API.getData(docID);
        setTitle(doc.title);
        setStakeholder(doc.stakeholder);
        setScale(doc.scale);
        setDescription(doc.description);
        setType(doc.type);
        setLanguage(doc.language);
        setIssuanceDate(dayjs(doc.issuanceDate).format('YYYY-MM-DD'));
        if (props.mode === 'view') {
          const relatedDocs = await API.getRelatedDocuments(docID);
          setRelatedDocuments(relatedDocs);
        }
      }catch(error){
        console.error("Error loading document data:", error)
      }
    }
    if(props.mode==='view')
      loadData();
  }, []);
  

  const toggleMap = () => {
    setShowMap((prevShowMap) => !prevShowMap);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  const handleRelatedDocumentClick = (relatedDocumentId) => {
    navigate(`/view/${relatedDocumentId}`);
  };

  const validateForm = () => {
    const validationErrors = {};

    if(title.trim() === ''){
      validationErrors.title = 'Title cannot be empty!';
    }

    if(stakeholder.trim() === ''){
      validationErrors.stakeholder = 'Stakeholder cannot be empty!';
    }

    if(scale.trim() === ''){
      validationErrors.scale = 'Scale cannot be empty!';
    }

    if(type === null){
      validationErrors.type = 'Type cannot be empty!';
    }

    if (dayjs(issuanceDate).isAfter(dayjs())) {
      validationErrors.issuanceDate='Issuance date cannot be in the future!';
    }

    if(description === ''){
      validationErrors.description = 'Description cannot be empty!'
    }

    return validationErrors;
  }



  const handleSubmit = (event) =>{
    event.preventDefault();
    const validationErrors = validateForm();
    if(Object.keys(validationErrors).length>0){
      setErrors(validationErrors);
      console.log(errors);
      return;
    }
    setErrors([]);
    setTitle(title.trim());
    setStakeholder(stakeholder.trim());
    const doc = new Document(0,title,stakeholder,scale,issuanceDate,type,language,description);
    API.AddDocumentDescription(doc, selectedDocuments, coordinates); 
    //if we want to set the connections 
    //by using this API we pass selectedDocuments as
    // an argument here
    //otherwise we create a new API
    navigate('/')
  }

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(documentId)
        ? prevSelected.filter((id) => id !== documentId) 
        : [...prevSelected, documentId]                  
    );
  };
  
  
  return  (
    <div className="wrapper">
      <div className="form-container">
        <h2>New Document{(props.mode==='view' && edit===false) && <FaPenSquare className='edit-button' onClick={() => setEdit(true)}/>}</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col className='col-form'>
              <Form.Group className='form-group'  controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" minLength={2} value={title} onChange={(event) => setTitle(event.target.value)}  isInvalid={!!errors.title} readOnly={!edit && props.mode!='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className='form-group'  controlId="stakeholder">
                <Form.Label>Stakeholder</Form.Label>
                <Form.Control type="text" placeholder="Enter stakeholder" value={stakeholder} onChange={(event) => setStakeholder(event.target.value)}  isInvalid={!!errors.stakeholder} readOnly={!edit && props.mode!='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.stakeholder}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className='form-group'  controlId="scale">
                <Form.Label>Scale</Form.Label>
                <Form.Control type="text" placeholder="Enter scale" value={scale} onChange={(event) => setScale(event.target.value)}  isInvalid={!!errors.scale} readOnly={!edit && props.mode!='add'}/>
                <Form.Control.Feedback type="invalid">
                    {errors.scale}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='form-group'  controlId="issuanceDate">
                <Form.Label>Issuance Date</Form.Label>
                <Form.Control type="date" value={issuanceDate} onChange={(event) => setIssuanceDate(event.target.value)} readOnly={!edit && props.mode!='add'}/>
              </Form.Group>

              <Form.Group className='form-group' controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Select value={type || ''} onChange={(event) => setType(event.target.value)}  isInvalid={!!errors.type} readOnly={!edit && props.mode!='add'}>
                  <option>Select type</option>
                  { allTypes.map((t) => 
                    <option key={t} value={t}>{t}</option>
                  )}
                </Form.Select>
              </Form.Group>

              <Form.Group className='form-group' controlId="language">
                <Form.Label>Language</Form.Label>
                <Form.Select value={language} onChange={(event) => setLanguage(event.target.value)} readOnly={!edit && props.mode!='add'}>
                  <option>Select language</option>
                  <option>English</option>
                  <option>Italian</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col className='col-form'>
              <Form.Group  className='form-group' controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" placeholder="Enter description" value={description} onChange={(event) => setDescription(event.target.value)}  isInvalid={!!errors.description} readOnly={!edit && props.mode!='add'}/>
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
                  <Form.Label>Coordinates<span>*</span></Form.Label>
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
                <Col md={2}>
                {showMap ? <div className="map-view-trigger" onClick={toggleMap}>
                  <PiPen></PiPen>
                  <span>
                    Type coordinates
                  </span>
                  
                </div>: <div className="map-view-trigger" onClick={toggleMap}>
                  <PiMapPinSimpleAreaFill></PiMapPinSimpleAreaFill>
                  <span>
                    Select on map
                  </span>
                  
                </div>}
                </Col>
              </Row>
            {showMap && <MapPointSelector 
              coordinates={coordinates}
              onCoordinatesChange={handleCoordinatesChange} 
            />}
          </Row>
           <div>
          
          {(props.mode === 'add' || edit) ? (
            !showDocumentList ? (
              <Button className="selectrelated" variant="dark" onClick={() => setShowDocumentList(true)}>
                Select Related Documents
              </Button>
            ) : (
              <div className="document-list">
                <h5>Select Related Documents</h5>
                <ListGroup className='relateddocs'>
                  {allDocuments.map((doc) => (
                    <ListGroup.Item key={doc.id}>
                      <Form.Check 
                        type="checkbox"
                        label={
                          <Row>
                            <Col>{doc.title}</Col>
                            <Col>{doc.stakeholder}</Col>
                            <Col>{dayjs(doc.issuanceDate).format('DD/MM/YYYY')}</Col>
                          </Row>
                        } 
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => handleDocumentSelect(doc.id)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button className="saveselection" variant="dark" onClick={() => setShowDocumentList(false)}>
                  Save Selection
                </Button>
              </div>
            )
          ) : (
            <div className="document-list">
              <h5>Related Documents</h5>
              <ListGroup className='relateddocs'>
                {relatedDocuments.map((relatedDoc) => {
                  return (
                    relatedDoc && (
                      <ListGroup.Item 
                      key={relatedDoc.id}
                      action
                      onClick={() => handleRelatedDocumentClick(relatedDoc.id)}>
                        <Row>
                          <Col>{relatedDoc.title}</Col>
                          <Col>{relatedDoc.stakeholder}</Col>
                          <Col>{dayjs(relatedDoc.issuanceDate).format('DD/MM/YYYY')}</Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  );
                })}
              </ListGroup>
            </div>
          )}
        </div>
          {props.mode==='add' && <Button className="add-button" type='submit'>+Add</Button>}
          {edit && <Button className="add-button" type='submit'>+Edit</Button>}
        </Form>
      </div>
    </div>
  );
}


export default FormDocument;
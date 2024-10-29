import React from 'react';
import { Form, Button, Row, Col, InputGroup, Table, FormControl } from 'react-bootstrap';
import { useParams} from 'react-router-dom'
import { useState,useEffect } from 'react';
import {FaPenSquare}from 'react-icons/fa';
import dayjs from 'dayjs';
import MapPointSelector from '../components/MapPointSelector'
import API from '../services/API.mjs';
import Document from '../mocks/Document.mjs';
import '../style/CreateDocument.css'

function FormDocument(props) {

  const param = useParams();

  const [title,setTitle] = useState('');
  const [stakeholder,setStakeholder] = useState('');
  const [scale,setScale] = useState('');
  const [issuanceDate,setIssuanceDate] = useState();
  const [type,setType] = useState(null);
  const [language,setLanguage] = useState('');
  const [description,setDescription] = useState('');
  const [loading,setLoading] = useState(true);
  const [edit,setEdit] = useState(false);

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
  }, [])

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

    if(type.trim() === ''){
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
      console.log(errors.title);
      return;
    }
    setErrors([]);
    setTitle(title.trim());
    setStakeholder(stakeholder.trim());
    const doc = new Document(title,stakeholder,scale,issuanceDate,type,language,description);
    API.AddDocumentDescription(doc);
  }

  
  
  return  (
    <div className="form-container">
      <h2>New Document</h2>
      {param.mode==='view' && <FaPenSquare className='edit-button' onClick={() => setEdit(true)}/>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className='col-form'>
            <Form.Group className='form-group'  controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" minLength={2} value={title} onChange={(event) => setTitle(event.target.value)}  isInvalid={!!errors.title} readOnly={!edit && param.mode!='add'}/>
              <Form.Control.Feedback type="invalid">
                  {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className='form-group'  controlId="stakeholder">
              <Form.Label>Stakeholder</Form.Label>
              <Form.Control type="text" placeholder="Enter stakeholder" value={stakeholder} onChange={(event) => setStakeholder(event.target.value)}  isInvalid={!!errors.stakeholder} readOnly={!edit && param.mode!='add'}/>
              <Form.Control.Feedback type="invalid">
                  {errors.stakeholder}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className='form-group'  controlId="scale">
              <Form.Label>Scale</Form.Label>
              <Form.Control type="text" placeholder="Enter scale" value={scale} onChange={(event) => setScale(event.target.value)}  isInvalid={!!errors.scale} readOnly={!edit && param.mode!='add'}/>
              <Form.Control.Feedback type="invalid">
                  {errors.scale}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='form-group'  controlId="issuanceDate">
              <Form.Label>Issuance Date</Form.Label>
              <Form.Control type="date" value={issuanceDate} onChange={(event) => setIssuanceDate(event.target.value)} readOnly={!edit && param.mode!='add'}/>
            </Form.Group>

            <Form.Group className='form-group' controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select value={type || ''} onChange={(event) => setType(event.target.value)}  isInvalid={!!errors.type} readOnly={!edit && param.mode!='add'}>
                <option>Select type</option>
                { allTypes.map((t) => 
                  <option key={t} value={t}>{t}</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className='form-group' controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Select value={language} onChange={(event) => setLanguage(event.target.value)} readOnly={!edit && param.mode!='add'}>
                <option>Select language</option>
                <option>English</option>
                <option>Italian</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className='col-form'>
            <Form.Group  className='form-group' controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" placeholder="Enter description" value={description} onChange={(event) => setDescription(event.target.value)}  isInvalid={!!errors.description} readOnly={!edit && param.mode!='add'}/>
            </Form.Group>
            <Form.Control.Feedback type="invalid">
                  {errors.description}
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          {/* <MapPointSelector></MapPointSelector> */}
        </Row>
        
        
        {param.mode==='add' && <Button className="add-button" type='submit'>+Add</Button>}
        {edit && <Button className="add-button" type='submit'>+Edit</Button>}
      </Form>
    </div>
  );
}


export default FormDocument;
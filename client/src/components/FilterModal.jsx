import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import API from '../services/API.mjs';
import Select from 'react-select'
import '../style/FilterModal.css'

import '../style/DocumentDetailsModal.css'
function FilterModal({ show, onHide, handleFilter }) {
    const customStyles = {
        control: (base) => ({
          ...base,
          fontFamily: 'Times',                  // Font
          fontSize: '24px',                          // Dimensione del font
          lineHeight: "18px",
          color: 'var(--demo-black)',                // Colore del testo
          maxWidth: '668px',                         // Larghezza massima
          width: '100%',                             // Larghezza dinamica
          height: '71px',                            // Altezza del campo
          paddingLeft: '20px',                       // Padding sinistro
          backgroundColor: 'var(--lily-white)',      // Colore di sfondo
          border: '1px solid #969696',                            // Nessun bordo
          borderRadius: '0',                         // Nessun arrotondamento
          boxShadow: 'none',                         // Nessuna ombra
        }),
        placeholder: (base) => ({
          ...base,
          fontFamily: 'Times',
          fontSize: '24px',
          color: 'var(--demo-black)',
        }),
        singleValue: (base) => ({
          ...base,
          color: 'var(--demo-black)',               // Colore del testo selezionato
        }),
        menu: (base) => ({
          ...base,
          fontFamily: 'Times',
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

  const [loading,setLoading] = useState(true)
  const [stakeholders,setStakeholders] = useState([])
  const [types,setTypes] = useState([])
  const [issuanceDateStart, setissuanceDateStart] = useState('');
  const [issuanceDateEnd, setissuanceDateEnd] = useState('');
  const [allTypes,setAllTypes] = useState([]);
  const [allStake,setAllStake] = useState([]);


  useEffect(()=>{
    const loadData = async () => {
      try {
        const [types, stake] = await Promise.all([API.getTypes(), API.getStake()]);
        setAllTypes(types);
        setAllStake(stake);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectStakeChange = (selectedOptions) => {
    setStakeholders(selectedOptions);
  };

  const handleSelectTypeChange = (selectedOption) => {
    setTypes(selectedOption);
  };

  
  const handleSubmitFilter = () => {
    const filters = { documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' }
    let st = ''
    stakeholders.forEach((s) =>{st= st.concat(s.value,',')} )
    filters.stakeholders=st.slice(0,-1);
    let dt = '';
    types.forEach((t) => dt = dt.concat(t.value,','))
    filters.documentTypes=dt.slice(0,-1);
    filters.issuanceDateEnd=(issuanceDateEnd ? dayjs(issuanceDateEnd).format('DD-MM-YYYY') : '');
    filters.issuanceDateStart=(issuanceDateStart ? dayjs(issuanceDateStart).format('DD-MM-YYYY'): '');
    handleFilter(filters)
    onHide()
  };
  

  



  

  return (
        <Modal show={show} onHide={onHide} centered size="lg" className="filter-modal">
            <Modal.Header>
                <Modal.Title className='filter-modal-title'>Filter By</Modal.Title>
                <Button variant="close" onClick={onHide} aria-label="Close" />
            </Modal.Header>
          <Modal.Body className="p-5">
          <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Stakeholders</Form.Label>
          {!loading && <Select
            isMulti
            options={allStake}
            value={stakeholders}
            onChange={handleSelectStakeChange}
            placeholder="Select stakeholders"
            styles={customStyles}
          />}
        </Form.Group>

        {/* Scale 
        <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Scale</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter scale"
            className="filter-modal-input"
          />
        </Form.Group>
        */}

        {/* Issuance date */}
        <Form.Group className="mb-4">
          <div className="d-flex w-100 gap-3">
            <div className="d-flex flex-column w-100">
            <Form.Label className="filter-modal-label">Issuance date from</Form.Label>
            <Form.Control
                type="date"
                className="filter-modal-input"
                value={issuanceDateStart}
                onChange={(event) => 
                  setissuanceDateStart(event.target.value)}
                placeholder="dd-mm-yyyy"
            />
            </div>

            <div className="d-flex flex-column w-100">
            <Form.Label className="filter-modal-label">To</Form.Label>
            <Form.Control
                type="date"
                value={issuanceDateEnd}
                onChange={(event) => 
                  setissuanceDateEnd(event.target.value)}
                className="filter-modal-input"
                placeholder="To"
            />
            </div>
            </div>
        </Form.Group>

        {/* Type */}
        <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Type</Form.Label>
          {!loading && <Select
            isMulti
            options={allTypes}
            onChange={handleSelectTypeChange}
            value={types}
            placeholder="Select type"
            styles={customStyles}
          />}
        </Form.Group>

        {/* Language 
        <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Language</Form.Label>
          <Select
            isMulti
            options={options}
            placeholder="Select language"
            styles={customStyles}
          />
        </Form.Group>
    */}
            
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                variant="outline-secondary"
                className="filter-modal-cancel"
                onClick={onHide}
              >
                Cancel
              </Button>
              <Button variant="primary" className="filter-modal-submit" onClick={handleSubmitFilter}>
                Apply Filters
              </Button>
            </div>
          </Modal.Body>
        </Modal>
  );
}

export default FilterModal;
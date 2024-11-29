import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import '../style/FilterModal.css'

import '../style/DocumentDetailsModal.css'
function FilterModal({ show, onHide, document }) {
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

  const navigate = useNavigate();

  const [loading,setLoading] = useState(true)

  const options = [
    { value: "architecture_firms", label: "Architecture Firms" },
    { value: "engineering_firms", label: "Engineering Firms" },
    // Aggiungi altre opzioni se necessario
  ];



  

  return (
        <Modal show={show} onHide={onHide} centered size="lg" className="filter-modal">
            <Modal.Header>
                <Modal.Title className='filter-modal-title'>Filter By</Modal.Title>
                <Button variant="close" onClick={onHide} aria-label="Close" />
            </Modal.Header>
          <Modal.Body className="p-5">
            <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Stakeholders</Form.Label>
          <Select
            isMulti
            options={options}
            placeholder="Select stakeholders"
            styles={customStyles}
          />
        </Form.Group>

        {/* Scale */}
        <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Scale</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter scale"
            className="filter-modal-input"
          />
        </Form.Group>

        {/* Issuance date */}
        <Form.Group className="mb-4">
          <div className="d-flex w-100 gap-3">
            <div className="d-flex flex-column w-100">
            <Form.Label className="filter-modal-label">Issuance date from</Form.Label>
            <Form.Control
                type="date"
                className="filter-modal-input"
                placeholder="dd-mm-yyyy"
            />
            </div>

            <div className="d-flex flex-column w-100">
            <Form.Label className="filter-modal-label">To</Form.Label>
            <Form.Control
                type="date"
                className="filter-modal-input"
                placeholder="To"
            />
            </div>
            </div>
        </Form.Group>

        {/* Type */}
        <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Type</Form.Label>
          <Select
            isMulti
            options={options}
            placeholder="Select type"
            styles={customStyles}
          />
        </Form.Group>

        {/* Language */}
        <Form.Group className="mb-4">
          <Form.Label className="filter-modal-label">Language</Form.Label>
          <Select
            isMulti
            options={options}
            placeholder="Select language"
            styles={customStyles}
          />
        </Form.Group>
    
            {/* Buttons */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                variant="outline-secondary"
                className="filter-modal-cancel"
                onClick={onHide}
              >
                Cancel
              </Button>
              <Button variant="primary" className="filter-modal-submit">
                Show Results
              </Button>
            </div>
          </Modal.Body>
        </Modal>
  );
}

export default FilterModal;
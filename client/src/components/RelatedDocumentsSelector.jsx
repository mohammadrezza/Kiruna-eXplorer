// import React, { useState, useEffect } from 'react';
// import { ListGroup, Row, Col, Form } from 'react-bootstrap';
// import API from '../services/API.mjs';
// import '../style/RelatedDocumentSelector.css';
// import { PiFileMagnifyingGlassLight } from 'react-icons/pi';
// import DocumentDetailsModal from './DocumentDetailsModal';

// function RelatedDocumentsSelector({
//   mode,
//   edit,
//   allDocuments,
//   relatedDocuments,
//   selectedDocuments,
//   selectedConnectionTypes, // Assicurati che selectedConnectionTypes venga passato come prop
//   onDocumentSelect,
//   onRelatedDocumentClick,
//   onConnectionTypeChange,
//   setSelectedConnectionTypes // Funzione per aggiornare selectedConnectionTypes
// }) {
//   const [connectionTypes, setConnectionTypes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentDocument, setCurrentDocument] = useState(null);

//   useEffect(() => {
    
//     const fetchConnectionTypes = async () => {
//       try {
//         const response = await API.getConnectionTypes();
//         setConnectionTypes(response);
//       } catch (error) {
//         console.error('Error fetching connection types:', error);
//       }
//     };

//     fetchConnectionTypes();
//   }, []);

//   useEffect(() => {
//     // Inizializza selectedConnectionTypes con i dati di relatedDocuments
//     const initialConnectionTypes = relatedDocuments.map(doc => ({
//       id: doc.id,
//       type: doc.connectionType || connectionTypes[0] // Utilizza il primo tipo di connessione come fallback
//     }));
//     setSelectedConnectionTypes(initialConnectionTypes);
//     console.log(initialConnectionTypes)
//     console.log(selectedConnectionTypes)
//     console.log(relatedDocuments)
//   }
//   , [relatedDocuments, connectionTypes, setSelectedConnectionTypes]);

//   // When selectedDocuments change, trigger onConnectionTypeChange for any new selected document
//   useEffect(() => {
//     selectedDocuments.forEach((docId) => {
//       const relatedDoc = relatedDocuments.find((doc) => doc.id === docId);
//       onConnectionTypeChange(docId, relatedDoc?.connectionType || connectionTypes[0]);
//     });
//   }, []);

//   const handleIconClick = async (doc) => {
//     try {
//       const docData = await API.getData(doc.id);
//       setCurrentDocument(docData);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Error fetching document data:", error);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentDocument(null);
//   };

//   const handleCheckboxChange = (docId, checked) => {
//     if (checked) {
//       if (connectionTypes.length > 0) {
//         onConnectionTypeChange(docId, connectionTypes[0]);
//         console.log(selectedConnectionTypes);
//       }
//     } else {
//       setSelectedConnectionTypes(prev => prev.filter(item => item.id !== docId));
//       console.log(selectedConnectionTypes);

//     }
//   };

//   const handleRowClick = (docId) => {
//     const isSelected = selectedDocuments.includes(docId);
//     // Toggle checkbox selection when row is clicked
//     if (isSelected) {
//       setSelectedConnectionTypes(prev => prev.filter(item => item.id !== docId));
//       onDocumentSelect(docId);
//     } else {
//       setSelectedConnectionTypes(prev => [
//         ...prev,
//         { id: docId, type: connectionTypes[0] }
//       ]);
//       onDocumentSelect(docId);
//     }
//   };
  
//   return (
//     <div className="document-list">
//       <ListGroup className="relatedDocs">
//         <ListGroup.Item className="relatedDocs-header">
//           <Row>
//             <Col md={1}></Col>
//             <Col md={3}>Title</Col>
//             <Col md={2}>Stakeholders</Col>
//             <Col md={2}>Type</Col>
//             <Col md={1}>Connected</Col>
//             <Col md={2}>Connection type</Col>
//           </Row>
//         </ListGroup.Item>
//         {allDocuments.map((doc, num) => (
//           <ListGroup.Item
//             key={doc.id}
//             className={selectedDocuments.includes(doc.id) ? 'selected' : ''}
//             onClick={() => {
//               if (mode === 'add' || edit) {
//                 // This will handle the selection of the document
//                 handleRowClick(doc.id);
//               } else {
//                 onRelatedDocumentClick(doc.id);
//               }
//             }}
//           >
//             <Row className="align-items-center">
//               <Col md={1} className="text-center">
//                 {(mode === 'add' || edit) ? (
//                   <Form.Check
//                     type="checkbox"
//                     id={`checkbox-${doc.id}`}
//                     checked={selectedDocuments.includes(doc.id)}
//                     onChange={(e) => {
//                       e.stopPropagation(); // Prevent row click event
//                       handleCheckboxChange(doc.id, e.target.checked);
//                     }}
//                   />
//                 ) : num + 1}
//               </Col>
//               <Col md={3}>{doc.title}</Col>
//               <Col md={2}>{doc.stakeholders.join(', ')}</Col>
//               <Col md={2}>{doc.type}</Col>
//               <Col md={1} className="text-center">{doc.connections}</Col>
//               <Col md={2}>
//                 {(mode === 'add' || edit) && selectedDocuments.includes(doc.id) ? (
//                   <Form.Select
//                     className="connectionform"
//                     aria-label="Select connection type"
//                     defaultValue={
//                       selectedConnectionTypes.find((relatedDoc) => relatedDoc.id === doc.id)?.type ||
//                       connectionTypes[0] ||
//                       ''
//                     }
//                     onChange={(e) => onConnectionTypeChange(doc.id, e.target.value)} // Notify parent on change
//                   >
//                     <option value="" disabled>
//                       Select connection
//                     </option>
//                     {connectionTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 ) : mode === 'view' ? (
//                   doc.connectionType
//                 ) : null}
//               </Col>
//               <Col>
//                 <span className="filesymbol">
//                   <PiFileMagnifyingGlassLight
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent row click event
//                       handleIconClick(doc);
//                     }}
//                   />
//                 </span>
//               </Col>
//             </Row>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//       <DocumentDetailsModal show={showModal} onHide={handleCloseModal} document={currentDocument} />
//     </div>
//   );
// }



// export default RelatedDocumentsSelector;
// import React, { useState, useEffect } from "react";
// import { ListGroup, Row, Col, Form, Button } from "react-bootstrap";
// import API from "../services/API.mjs";
// import "../style/RelatedDocumentSelector.css";
// import { PiFileMagnifyingGlassLight } from "react-icons/pi";
// import DocumentDetailsModal from "./DocumentDetailsModal";

// function RelatedDocumentsSelector({
//   mode,
//   edit,
//   allDocuments,
//   relatedDocuments,
//   selectedDocuments,
//   selectedConnectionTypes,
//   onDocumentSelect, //handleDocumentSelect
//   onRelatedDocumentClick, //handleRelatedDocumentClick
//   onConnectionTypeChange,
//   setSelectedConnectionTypes, //setSelectedConnectionTypes
// }) {
//   const [connectionTypes, setConnectionTypes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentDocument, setCurrentDocument] = useState(null);

//   // Fetch connection types on component mount
//   useEffect(() => {
//     const fetchConnectionTypes = async () => {
//       try {
//         const response = await API.getConnectionTypes(); // Fetch from API
//         setConnectionTypes(response);
//       } catch (error) {
//         console.error("Error fetching connection types:", error);
//       }
//     };
//     fetchConnectionTypes();
//   }, []);

//   // Initialize connection types for related documents
//   useEffect(() => {
//     const initialConnectionTypes = relatedDocuments.map((doc) => ({
//       id: doc.id,
//       types: doc.connectionTypes || [],
//     }));
//     setSelectedConnectionTypes(initialConnectionTypes);
//   }, [relatedDocuments, setSelectedConnectionTypes]);

//   const handleIconClick = async (doc) => {
//     try {
//       const docData = await API.getData(doc.id);
//       setCurrentDocument(docData);
//       setShowModal(true);
//     } catch (error) {
//       console.error("Error fetching document data:", error);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentDocument(null);
//   };

//   const handleRowClick = (docId, e) => {
//     if (e.target.type === "checkbox") return; // Don't trigger on row click when clicking checkbox

//     const isSelected = selectedDocuments.includes(docId);
//     if (isSelected) {
//       onDocumentSelect(docId); // Deselect the document
//     } else {
//       onDocumentSelect(docId); // Select the document
//     }
//   };

//   const handleConnectionTypeToggle = (docId, type) => {
//     console.log(docId);
//     console.log(type);
//     setSelectedConnectionTypes((prev) =>
//       prev.map((item) =>
//         item.id === docId
//           ? {
//               ...item,
//               types: item.types.includes(type)
//                 ? item.types.filter((t) => t !== type) // Remove type if already selected
//                 : [...item.types, type], // Add type if not selected
//             }
//           : item
//       )
//     );

//     console.log(selectedConnectionTypes);
//   };

//   return (
//     <div className="document-list">
//       <ListGroup className="relatedDocs">
//         <ListGroup.Item className="relatedDocs-header">
//           <Row>
//             <Col md={1}></Col>
//             <Col md={3}>Title</Col>
//             <Col md={2}>Stakeholders</Col>
//             <Col md={2}>Type</Col>
//             <Col md={2}>Connection Types</Col>
//             <Col md={2}></Col>
//           </Row>
//         </ListGroup.Item>
//         {allDocuments.map((doc) => (
//           <ListGroup.Item
//             key={doc.id}
//             className={selectedDocuments.includes(doc.id) ? "selected" : ""}
//             onClick={(e) => handleRowClick(doc.id, e)}
//           >
//             <Row className="align-items-center">
//               {/* Checkbox for selection */}
//               <Col md={1} className="text-center">
//                 <Form.Check
//                   type="checkbox"
//                   id={`checkbox-${doc.id}`}
//                   checked={selectedDocuments.includes(doc.id)}
//                   onChange={(e) => {
//                     e.stopPropagation(); // Prevent row click event
//                     handleRowClick(doc.id, e);
//                   }}
//                 />
//               </Col>
//               <Col md={3}>{doc.title}</Col>
//               <Col md={2}>{doc.stakeholders.join(", ")}</Col>
//               <Col md={2}>{doc.type}</Col>
//               <Col md={3}>
//                 {/* Connection Type Buttons */}
//                 {selectedDocuments.includes(doc.id) &&
//                   connectionTypes.map((type, index) => {
//                     // Find the related document's connection types or default to an empty array
//                     const relatedDoc =
//                       selectedConnectionTypes.find((item) => item.id === doc.id) || { type: [] };

//                     return (
//                       <Button
//                         key={type}
//                         variant={
//                           relatedDoc.type.includes(type)
//                             ? ["primary", "success", "warning", "danger"][index % 4] // Rotate colors
//                             : "outline-secondary"
//                         }
//                         size="sm"
//                         className="me-1"
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent row click event
//                           onConnectionTypeChange(doc.id, type); // Toggle the type
//                         }}
//                       >
//                         {type.charAt(0)} {/* Display only the first letter */}
//                       </Button>
//                     );
//                   })}
//               </Col>
//               <Col>
//                 {/* Preview Button */}
//                 <span className="filesymbol">
//                   <PiFileMagnifyingGlassLight
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent row click event
//                       handleIconClick(doc);
//                     }}
//                   />
//                 </span>
//               </Col>
//             </Row>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//       <DocumentDetailsModal
//         show={showModal}
//         onHide={handleCloseModal}
//         document={currentDocument}
//       />
//     </div>
//   );
// }

// export default RelatedDocumentsSelector;




import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Form, Button } from "react-bootstrap";
import API from "../services/API.mjs";
import "../style/RelatedDocumentSelector.css";
import { PiFileMagnifyingGlassLight } from "react-icons/pi";
import DocumentDetailsModal from "./DocumentDetailsModal";

function RelatedDocumentsSelector({
  mode,
  edit,
  allDocuments,
  relatedDocuments,
  selectedDocuments,
  selectedConnectionTypes,
  onDocumentSelect, // handleDocumentSelect
  onRelatedDocumentClick, // handleRelatedDocumentClick
  onConnectionTypeChange,
  setSelectedConnectionTypes, // setSelectedConnectionTypes
}) {
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  // Fetch connection types on component mount
  useEffect(() => {
    console.log(selectedConnectionTypes);
    const fetchConnectionTypes = async () => {
      try {
        const response = await API.getConnectionTypes(); // Fetch from API
        setConnectionTypes(response);
      } catch (error) {
        console.error("Error fetching connection types:", error);
      }
    };
    fetchConnectionTypes();
  }, []);

  // Initialize connection types for related documents
  useEffect(() => {
    const initialConnectionTypes = relatedDocuments.map((doc) => ({
      id: doc.id,
      type: doc.connectionType || [],
    }));
    setSelectedConnectionTypes(initialConnectionTypes);
  }, [relatedDocuments, setSelectedConnectionTypes]);

  const handleIconClick = async (doc) => {
    try {
      const docData = await API.getData(doc.id);
      setCurrentDocument(docData);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDocument(null);
  };

  const handleRowClick = (docId, e) => {
    if (mode === "view" && !edit) {
      onRelatedDocumentClick(docId); // View document details
      return;
    }

    if (e.target.type === "checkbox") return; // Prevent checkbox click from triggering row click

    const isSelected = selectedDocuments.includes(docId);
    if (isSelected) {
      onDocumentSelect(docId); // Deselect the document
    } else {
      onDocumentSelect(docId); // Select the document
    }
  };

  const handleConnectionTypeToggle = (docId, type) => {
    setSelectedConnectionTypes((prev) =>
      prev.map((item) =>
        item.id === docId
          ? {
              ...item,
              types: item.types.includes(type)
                ? item.types.filter((t) => t !== type) // Remove type if already selected
                : [...item.types, type], // Add type if not selected
            }
          : item
      )
    );
    onConnectionTypeChange(docId, type); // Notify parent of the change
  };

  return (
    <div className="document-list">
      <ListGroup className="relatedDocs">
        <ListGroup.Item className="relatedDocs-header">
          <Row>
            <Col md={1}></Col>
            <Col md={3}>Title</Col>
            <Col md={2}>Stakeholders</Col>
            <Col md={2}>Type</Col>
            <Col md={2}>Connection Types</Col>
            <Col md={2}></Col>
          </Row>
        </ListGroup.Item>
        {allDocuments.map((doc, num) => (
          <ListGroup.Item
            key={doc.id}
            className={selectedDocuments.includes(doc.id) ? "selected" : ""}
            onClick={(e) => handleRowClick(doc.id, e)}
          >
            <Row className="align-items-center">
              {/* Checkbox for selection (only in add/edit modes) */}
               <Col md={1} className="text-center">
                {(mode === "add" || edit) ? (
                  <Form.Check
                    type="checkbox"
                    id={`checkbox-${doc.id}`}
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleRowClick(doc.id, e);
                    }}
                  />) : (num + 1)
                }
              </Col>
              <Col md={3}>{doc.title}</Col>
              <Col md={2}>{doc.stakeholders.join(", ")}</Col>
              <Col md={2}>{doc.type}</Col>
              <Col md={3}>
                {/* Connection Type Buttons */}
                {(mode === "add" || edit) && selectedDocuments.includes(doc.id)
                  ? connectionTypes.map((type, index) => {
                      // Find the related document's connection types or default to an empty array
                      const relatedDoc =
                        selectedConnectionTypes.find((item) => item.id === doc.id) || { type: [] };
                        console.log(selectedConnectionTypes);
                        console.log(relatedDoc);
                      return (
                        <Button
                          key={type}
                          variant={
                            relatedDoc.type.includes(type)
                              ? ["primary", "success", "warning", "danger"][index % 4] // Rotate colors
                              : "outline-secondary"
                          }
                          size="sm"
                          className="me-1"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            onConnectionTypeChange(doc.id, type); // Toggle the type
                          }}
                        >
                          {type.charAt(0)} {/* Display only the first letter */}
                        </Button>
                      );
                    }) 
                    : doc.connectionType}
                  {/* // : selectedConnectionTypes
                  //      .find((item) => item.id === doc.id)?.types.join(", ") || ""}  */}
              </Col>
              <Col>
                {/* Preview Button */}
                <span className="filesymbol">
                  <PiFileMagnifyingGlassLight
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleIconClick(doc);
                    }}
                  />
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <DocumentDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        document={currentDocument}
      />
    </div>
  );
}

export default RelatedDocumentsSelector;
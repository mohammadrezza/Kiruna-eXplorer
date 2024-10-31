import Document from "../components/document.mjs";
import { addDocument} from "../db/db.mjs";

export const createDocument = (req, res) => {

  const { id, title, stakeholders, scale, issuanceDate, type, language, coordinates, connectionIds } = req.body;

  //creation logic
  const document = new Document();

  document.createFromObject({

    title,
    stakeholders,
    scale,
    issuanceDate,
    type,
    language,
    coordinates,
    connections: connectionIds.length 
  });
 

  addDocument(document.id, title, stakeholders, scale, issuanceDate, type, language, coordinates, connectionIds.length);

  
  console.log("document created", document);

 
  res.status(201).json({ message: 'Document successfully created', data: req.body });

};
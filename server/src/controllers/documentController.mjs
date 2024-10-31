import Document from "../components/document.mjs";

export const createDocument = (req, res) => {

  const { title, stakeholders, scale, issuanceDate, type, language, coordinates, connectionIds } = req.body;

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
    connections: connectionIds 
  });

  //db insertion ...
  
  console.log("document created", document);

 
  res.status(201).json({ message: 'Document successfully created', data: req.body });

};
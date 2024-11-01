import Document from "../components/document.mjs";
import {addDocument} from "../db/db.mjs";

export const createDocument = async (req, res) => {
    const {
        title,
        stakeholders,
        scale,
        issuanceDate,
        type,
        language,
        coordinates,
        connectionIds,
    } = req.body;

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
        connections: connectionIds.length,
    });

    try {
        await addDocument(
            document.id,
            title,
            stakeholders,
            scale,
            issuanceDate,
            type,
            language,
            coordinates,
            connectionIds.length
        );

        res
            .status(201)
            .json({message: "Document successfully created", data: req.body});
    } catch (error) {

        console.error("Failed to create document in database:", error);
        res.status(500).json({message: "Failed to create document"});

    }
};

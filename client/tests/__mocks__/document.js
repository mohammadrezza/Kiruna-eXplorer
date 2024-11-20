export const mockDocuments = [
  {
    id: 1,
    title: 'Document 1',
    type: 'Material Effect',
    stakeholders: 'Stakeholder A',
    issuanceDate: '2024-11-20',
    coordinates: { lat: 67.85572, lng: 20.22513 },
  },
  {
    id: 2,
    title: 'Document 2',
    type: 'Design Document',
    stakeholders: 'Stakeholder B',
    issuanceDate: '2024-11-21',
    coordinates: { lat: 0, lng: 0 }, // Will be filtered by municipalDocuments
  },
  {
    id: 3,
    title: 'Document 3',
    type: 'Material Effect',
    stakeholders: 'Stakeholder C',
    issuanceDate: '2024-11-22',
    coordinates: { lat: 67.856, lng: 20.2255 },
  },
];

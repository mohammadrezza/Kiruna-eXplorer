import dayjs from 'dayjs'

function Document(title,stakeholder,scale,issuanceDate,type,language,description){
    this.title = title;
    this.stakeholder = stakeholder;
    this.scale = scale;
    this.issuanceDate = dayjs(issuanceDate);
    this.type=type;
    this.language = language;
    this.description = description;
}

export default Document;
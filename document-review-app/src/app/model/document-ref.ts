export class DocumentRef {

  private _speciality : string;

  private _type : string;

  private _patient : fhir.Patient;

  private _file : File;

  private _docDate : Date;

  private _organisation : fhir.Organization;

  private _practitioner : fhir.Practitioner;

  private _service : string;


  get speciality(): string {
    return this._speciality;
  }

  set speciality(value: string) {
    this._speciality = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get service(): string {
    return this._service;
  }

  set service(value: string) {
    this._service = value;
  }

  set patient(value: fhir.Patient) {
    this._patient = value;
  }

  set file(value: File) {
    this._file = value;
  }

  set docDate(value: Date) {
    this._docDate = value;
  }

  set organisation(value: fhir.Organization) {
    this._organisation = value;
  }

  set practitioner(value: fhir.Practitioner) {
    this._practitioner = value;
  }


  get patient(): fhir.Patient {
    return this._patient;
  }

  get file(): File {
    return this._file;
  }

  get docDate(): Date {
    return this._docDate;
  }

  get organisation(): fhir.Organization {
    return this._organisation;
  }

  get practitioner(): fhir.Practitioner {
    return this._practitioner;
  }

  get patientName() : string {
    let retStr : string = "";
    if (this._patient.name.length == 0) return "";
    if (this._patient.name[0].prefix != undefined) retStr = retStr + this._patient.name[0].prefix + " ";
    for (let forename of this._patient.name[0].given) {
      retStr = retStr + forename + " ";
    }
    if (this._patient.name[0].family != undefined) retStr = retStr + this._patient.name[0].family + " ";

    return retStr;
  }

  get practitionerName() : string {
    let retStr : string = "";
    if (this._practitioner.name.length == 0) return "";
    if (this._practitioner.name[0].prefix != undefined) retStr = retStr + this._practitioner.name[0].prefix + " ";
    for (let forename of this._practitioner.name[0].given) {
      retStr = retStr + forename + " ";
    }
    if (this._practitioner.name[0].family != undefined) retStr = retStr + this._practitioner.name[0].family + " ";

    return retStr;
  }
}

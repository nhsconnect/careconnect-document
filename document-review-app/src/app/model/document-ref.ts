export class DocumentRef {

  private _speciality : fhir.Coding;

  private _type : fhir.Coding;

  private _patient : fhir.Patient;

  private _file : File;

  private _docDate : Date;

  private _organisation : fhir.Organization;

  private _practitioner : fhir.Practitioner;


  set speciality(value: fhir.Coding) {
    this._speciality = value;
  }

  set type(value: fhir.Coding) {
    this._type = value;
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

  get speciality(): fhir.Coding {
    return this._speciality;
  }

  get type(): fhir.Coding {
    return this._type;
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
}

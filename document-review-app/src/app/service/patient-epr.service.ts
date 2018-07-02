import {EventEmitter, Injectable} from '@angular/core';
import {User} from "../model/user";

@Injectable()
export class PatientEprService {

  patient: fhir.Patient = undefined;

  resource : any = undefined;

  section : string;

  documentReference : fhir.DocumentReference;

  private patientChangeEvent : EventEmitter<fhir.Patient> = new EventEmitter();

  private resourceChangeEvent : EventEmitter<any> = new EventEmitter();

  private sectionChangeEvent : EventEmitter<string> = new EventEmitter();

  set(patient: fhir.Patient) {

    this.patient = patient;
    this.patientChangeEvent.emit(this.patient);
  }
  clear() {
    this.patient = undefined;
    this.patientChangeEvent.emit(this.patient);
  }
  getPatientChangeEmitter() {
    return this.patientChangeEvent;
  }

  getResourceChangeEvent() {
    return this.resourceChangeEvent;
  }

  getSectionChangeEvent() {
    return this.sectionChangeEvent;
  }

  setSection(section : string) {
    this.section = section;
    this.sectionChangeEvent.emit(section);
  }

  setResource(resource) {
    this.resource = resource;
    this.resourceChangeEvent.emit(resource);
  }

  setDocumentReference(document : fhir.DocumentReference) {
    this.documentReference = document;
  }

}

import {EventEmitter, Injectable} from '@angular/core';
import {User} from "../model/user";

@Injectable()
export class PatientEprService {

  patient: fhir.Patient = undefined;

  resource : any = undefined;

  private patientChangeEvent : EventEmitter<fhir.Patient> = new EventEmitter();

  private resourceChangeEvent : EventEmitter<any> = new EventEmitter();

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

  setResource(resource) {
    this.resource = resource;
    this.resourceChangeEvent.emit(resource);
  }

}

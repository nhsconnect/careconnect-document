import {EventEmitter, Injectable} from '@angular/core';
import {Permission} from "../model/permission";

@Injectable()
export class PatientEprService {

  patient: fhir.Patient = undefined;

  private patientChangeEvent : EventEmitter<fhir.Patient> = new EventEmitter();

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
}

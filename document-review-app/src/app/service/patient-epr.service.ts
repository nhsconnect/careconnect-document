import { Injectable } from '@angular/core';

@Injectable()
export class PatientEprService {

  patient: fhir.Patient = undefined;



  set(patient: fhir.Patient) {
    this.patient = patient;
  }
  clear() {
    this.patient = undefined;
  }
}

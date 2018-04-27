import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PatientChangeService {

  messages: fhir.Patient = undefined;

  set(patient: fhir.Patient) {
    this.messages = patient;
  }
  clear() {
    this.messages = undefined;
  }
}

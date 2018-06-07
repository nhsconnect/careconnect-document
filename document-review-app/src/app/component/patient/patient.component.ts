import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  @Input() patients : fhir.Patient[];

  @Input() showDetail : boolean = false;

  @Output() patient = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }
  select(patient) {
    this.patient.emit(patient);
  }
}

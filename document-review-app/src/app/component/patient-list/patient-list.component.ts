import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  @Input() patients : fhir.Patient[];

  @Input() showDetail : boolean = false;

  @Output() patient = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {PatientEprService} from "../../service/patient-epr.service";

@Component({
  selector: 'app-epr-observation',
  templateUrl: './epr-observation.component.html',
  styleUrls: ['./epr-observation.component.css']
})
export class EprObservationComponent implements OnInit {

  model;

  @Input() observations :fhir.Observation[];

    @Input() obsTotal :number;
  constructor(public patientEprService : PatientEprService) { }

  page : number;
  ngOnInit() {
  }

}

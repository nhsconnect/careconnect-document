import {Component, Input, OnInit} from '@angular/core';
import {PatientEprService} from "../../service/patient-epr.service";

@Component({
  selector: 'app-epr-encounter',
  templateUrl: './epr-encounter.component.html',
  styleUrls: ['./epr-encounter.component.css']
})
export class EprEncounterComponent implements OnInit {

  /*

  THIS IS NOT CURRENTLY IN USE

   */

  @Input() encounters: fhir.Encounter[];
  encTotal : number;

  page : number;

//  @Input() encounter : fhir.Encounter;
  constructor(public patientEprService : PatientEprService) { }

  ngOnInit() {
  }


}

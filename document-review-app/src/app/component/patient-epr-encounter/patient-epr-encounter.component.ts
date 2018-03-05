import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-patient-epr-encounter',
  templateUrl: './patient-epr-encounter.component.html',
  styleUrls: ['./patient-epr-encounter.component.css']
})
export class PatientEprEncounterComponent implements OnInit {

  @Input() encounter : fhir.Encounter;
  constructor() { }

  ngOnInit() {
  }

  getType() : String {

    if (this.encounter == undefined) return "";
    if (this.encounter.type == undefined || this.encounter.type.length > 0 == undefined || this.encounter.type[0].coding.length == 0)
      return "";

    return this.encounter.type[0].coding[0].display;


  }

  getParticipant() : String {
    if (this.encounter == undefined) return "";
    if (this.encounter.participant == undefined || this.encounter.participant.length == 0)
      return "";

    return this.encounter.participant[0].individual.display;

  }


  getProvider() : String {

    if (this.encounter == undefined) return "";

    if (this.encounter.serviceProvider == undefined )
      return "";

    return this.encounter.serviceProvider.display;

  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-patient-epr-encounter',
  templateUrl: './patient-epr-encounter.component.html',
  styleUrls: ['./patient-epr-encounter.component.css']
})
export class PatientEprEncounterComponent implements OnInit {

  @Input() encounters : fhir.Encounter[];
  constructor() { }

  ngOnInit() {
  }

  getSNOMEDLink(code : string) {
    window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001", "_blank");
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-allergy-intollerance',
  templateUrl: './allergy-intollerance.component.html',
  styleUrls: ['./allergy-intollerance.component.css']
})
export class AllergyIntolleranceComponent implements OnInit {

  @Input() allergies : fhir.AllergyIntolerance[];

  constructor() { }

  ngOnInit() {
  }
  getSNOMEDLink(code : string) {
    window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1="+code+"&edition=uk-edition&release=v20171001", "_blank");
  }
}

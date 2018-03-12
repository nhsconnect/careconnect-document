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

}

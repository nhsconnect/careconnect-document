import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-allergy-intollerance',
  templateUrl: './epr-allergy-intollerance.component.html',
  styleUrls: ['./epr-allergy-intollerance.component.css']
})
export class EprAllergyIntolleranceComponent implements OnInit {

  @Input() allergies :fhir.AllergyIntolerance[];

  @Input() allergiesTotal :number;
  constructor() { }

  ngOnInit() {
  }

}

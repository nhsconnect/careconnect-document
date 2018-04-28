import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-immunisation',
  templateUrl: './epr-immunisation.component.html',
  styleUrls: ['./epr-immunisation.component.css']
})
export class EprImmunisationComponent implements OnInit {

  @Input() immunisations :fhir.Immunization[];

  @Input() immsTotal :number;

  page : number;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-epr-observation',
  templateUrl: './epr-observation.component.html',
  styleUrls: ['./epr-observation.component.css']
})
export class EprObservationComponent implements OnInit {

  model;

  @Input() observations :fhir.Observation[];

  @Input() obsTotal :number;
  constructor() { }

  ngOnInit() {
  }

}

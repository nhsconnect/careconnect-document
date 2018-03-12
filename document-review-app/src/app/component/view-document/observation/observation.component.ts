import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  @Input() observations : fhir.Observation[];
  constructor() { }

  ngOnInit() {
  }

}

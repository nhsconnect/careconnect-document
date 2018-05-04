import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class PractitionerComponent implements OnInit {

  @Input() practitioner : fhir.Practitioner;

  constructor() { }

  ngOnInit() {
  }

}

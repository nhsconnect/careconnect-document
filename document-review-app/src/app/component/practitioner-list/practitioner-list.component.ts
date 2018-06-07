import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-practitioner-list',
  templateUrl: './practitioner-list.component.html',
  styleUrls: ['./practitioner-list.component.css']
})
export class PractitionerListComponent implements OnInit {

  @Input() practitioners : fhir.Practitioner[];

  @Output() practitioner = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}

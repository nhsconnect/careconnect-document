import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.css']
})
export class OrganisationListComponent implements OnInit {

  @Input() organisations : fhir.Organization[];

  @Output() organisation = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}

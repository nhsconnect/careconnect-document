import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {

  @Input() organisation : fhir.Organization;

  constructor() { }

  ngOnInit() {
  }

}

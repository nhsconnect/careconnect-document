import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {

  @Input() organisation : fhir.Organization;

  @Input() detail : boolean;

  constructor() { }

  ngOnInit() {
  }

  getIdentifier(identifier : fhir.Identifier) : String {
    let name : String = identifier.system
    if (identifier.system.indexOf('ods-organization-code') != -1) {

      name = 'ODS Code';
    }
    return name;
  }

}

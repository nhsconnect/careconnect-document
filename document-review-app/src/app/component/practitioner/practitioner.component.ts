import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-practitioner',
  templateUrl: './practitioner.component.html',
  styleUrls: ['./practitioner.component.css']
})
export class PractitionerComponent implements OnInit {

  @Input() practitioner : fhir.Practitioner;

  @Input() detail : boolean;

  constructor() { }

  ngOnInit() {
  }

  getLastName() : String {
    if (this.practitioner == undefined) return "";
    if (this.practitioner.name == undefined || this.practitioner.name.length == 0)
      return "";

    let name = "";
    if (this.practitioner.name[0].family != undefined) name += this.practitioner.name[0].family.toUpperCase();
    return name;

  }
  getIdentifier(identifier : fhir.Identifier) : String {
    let name : String = identifier.system
    if (identifier.system == 'https://fhir.nhs.uk/Id/sds-user-id') {
      name = 'SDS User Id';
    } else {identifier.system == 'https://fhir.nhs.uk/Id/local-practitioner-identifier'} {
      name = 'Local Id';
    }
    return name;
  }
  getFirstName() : String {
    if (this.practitioner == undefined) return "";
    if (this.practitioner.name == undefined || this.practitioner.name.length == 0)
      return "";
    // Move to address
    let name = "";
    if (this.practitioner.name[0].given != undefined && this.practitioner.name[0].given.length>0) name += ", "+ this.practitioner.name[0].given[0];

    if (this.practitioner.name[0].prefix != undefined && this.practitioner.name[0].prefix.length>0) name += " (" + this.practitioner.name[0].prefix[0] +")" ;
    return name;

  }

}

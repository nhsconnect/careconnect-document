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

  getLastName() : String {
    if (this.practitioner == undefined) return "";
    if (this.practitioner.name == undefined || this.practitioner.name.length == 0)
      return "";

    let name = "";
    if (this.practitioner.name[0].family != undefined) name += this.practitioner.name[0].family.toUpperCase();
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

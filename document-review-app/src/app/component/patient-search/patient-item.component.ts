/// <reference path="../../../../node_modules/@types/fhir/index.d.ts" />

import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-patient-item',
  templateUrl: './patient-item.component.html',
  styleUrls: ['../../app.component.css']
})
export class PatientItemComponent implements OnInit {
  @Input() patient : fhir.Patient;

  constructor() {

  }

  ngOnInit() {
    if (this.patient==undefined) this.patient = {} ;
  }

  getFirstAddress() : String {
    if (this.patient == undefined) return "";
    if (this.patient.address == undefined || this.patient.address.length == 0)
      return "";
    // Move to address
    return this.patient.address[0].line.join(", ")+", "+this.patient.address[0].city+", "+this.patient.address[0].postalCode;

  }

  getFirstName() : String {
    if (this.patient == undefined) return "";
    if (this.patient.name == undefined || this.patient.name.length == 0)
      return "";
    // Move to address
    var name = "";
    if (this.patient.name[0].prefix != undefined && this.patient.name[0].prefix.length>0) name = this.patient.name[0].prefix[0] +" ";
    if (this.patient.name[0].given != undefined && this.patient.name[0].given.length>0) name = name + this.patient.name[0].given[0] +" ";
    if (this.patient.name[0].family != undefined) name = name + this.patient.name[0].family;
    return name;

  }

  getFirstTelecom() : String {
    if (this.patient == undefined) return "";
    if (this.patient.telecom == undefined || this.patient.telecom.length == 0)
      return "";
    // Move to address
    return this.patient.telecom[0].value;

  }
  getNHSIdentifier() : String {
    if (this.patient == undefined) return "";
    if (this.patient.identifier == undefined || this.patient.identifier.length == 0)
      return "";
    // Move to address
    var NHSNumber :String = "";
    for (var f=0;f<this.patient.identifier.length;f++) {
      if (this.patient.identifier[f].system.includes("nhs-number") )
        NHSNumber = this.patient.identifier[f].value;
    }
    return NHSNumber;

  }

}

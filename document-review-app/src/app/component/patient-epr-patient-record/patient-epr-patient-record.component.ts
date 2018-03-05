import { Component, OnInit } from '@angular/core';
import {FhirService} from "../../service/fhir.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-patient-epr-patient-record',
  templateUrl: './patient-epr-patient-record.component.html',
  styleUrls: ['./patient-epr-patient-record.component.css']
})
export class PatientEprPatientRecordComponent implements OnInit {

  composition : fhir.Bundle = undefined;

  encounters: fhir.Encounter[];

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute) { }


  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('docid');
    this.selectPatientEPR(id);
  }

  selectPatientEPR(patientId : string) {
  //  console.log("Patient clicked = " + patientId);
  //  let scrDocument: fhir.Bundle = undefined;

    this.fhirService.getEPREncounters(patientId).subscribe( data=> {
      this.encounters = [];
       for (let entNo =0; entNo < data.entry.length; entNo++) {
          this.encounters.push(<fhir.Encounter>data.entry[entNo].resource);
       }
    } );

    this.fhirService.getEPRSCRDocument(patientId).subscribe( document => {
        this.composition = document;
        console.log("Bundle Retrieved");
      }, err=>{}

);

}

}

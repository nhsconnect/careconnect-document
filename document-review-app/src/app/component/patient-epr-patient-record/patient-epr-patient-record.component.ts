import {Component, OnInit, ViewChild} from '@angular/core';
import {FhirService} from "../../service/fhir.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-patient-epr-patient-record',
  templateUrl: './patient-epr-patient-record.component.html',
  styleUrls: ['./patient-epr-patient-record.component.css']
})
export class PatientEprPatientRecordComponent implements OnInit {

  composition : fhir.Bundle = undefined;

  encounterdoc : fhir.Bundle = undefined;

  encounters: fhir.Encounter[];

  encounterEnabled = false;

  @ViewChild('tabs')
  private tabs:NgbTabset;

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute) { }


  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('docid');
    this.selectPatientEPR(id);
  }

  selectEncounter(encounter : fhir.Encounter) {
    this.fhirService.getEPREncounter(encounter.id).subscribe(
      document => {
        this.encounterdoc = document;
        this.tabs.select("tab-encounterdoc");
      //  this.encounterEnabled = true;

      }
    )
  }

  backClick() {
    this.encounterEnabled = false;
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

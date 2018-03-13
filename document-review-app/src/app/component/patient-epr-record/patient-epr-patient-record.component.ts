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
  encTotal : number;

  observations: fhir.Observation[];
  obsTotal : number;

  prescriptions : fhir.MedicationRequest[];
  presTotal : number;

  patient : fhir.Patient;

  encounterEnabled = false;
  encounterDate = undefined;



  @ViewChild('tabs')
  private tabs:NgbTabset;

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute) { }


  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('docid');
    this.selectPatientEPR(id);
  }

  selectEncounter(encounter : fhir.Encounter) {
    this.encounterEnabled = true;
    this.encounterDate = encounter.period.start;

    this.fhirService.getEPREncounter(encounter.id).subscribe(
      document => {
        this.encounterdoc = document;
        this.tabs.select("tab-encounterdoc");


      }
    )
  }

  selectPatientEPR(patientId : string) {

    this.fhirService.getEPREncounters(patientId).subscribe(data => {
        this.encounters = [];
        if (data.entry != undefined) {
          this.encTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.encounters.push(<fhir.Encounter>data.entry[entNo].resource);
          }
        }
      }
    );

    this.fhirService.getEPRSCRDocument(patientId).subscribe(document => {
        this.composition = document;
        console.log("Bundle Retrieved");
        if (document.entry != undefined) {

          for (let entNo = 0; entNo < document.entry.length; entNo++) {
            if (document.entry[entNo].resource.resourceType==="Patient")
                this.patient = <fhir.Patient> document.entry[entNo].resource;
          }
        }
          }, err => {
      }
    );

    this.fhirService.getEPRObservations(patientId).subscribe(data => {
        this.observations = [];
        if (data.entry != undefined) {
          this.obsTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.observations.push(<fhir.Observation>data.entry[entNo].resource);
          }
        }
      }
    );

    this.fhirService.getEPRMedicationRequests(patientId).subscribe(data => {
        this.prescriptions = [];
        if (data.entry != undefined) {
          this.presTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.prescriptions.push(<fhir.MedicationRequest>data.entry[entNo].resource);
          }
        }
      }
    );
  }
}

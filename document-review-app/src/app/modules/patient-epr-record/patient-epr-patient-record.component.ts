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

  procedures : fhir.Procedure[];
  procTotal : number;

  conditions : fhir.Condition[];
  conditionTotal : number;

  allergies : fhir.AllergyIntolerance[];
  allergiesTotal : number;

  documents : fhir.DocumentReference[];
  documentsTotal : number;


  patient : fhir.Patient;

  encounterEnabled = false;
  encounterDate = undefined;

  page : number;

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

    this.fhirService.getEPRPatient(patientId).subscribe(document => {
        this.patient = document;
      }
    );
    /*

    Needs a Composition creation service which has currently been disabled 12/Apr/2018

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
    */

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

    this.fhirService.getEPRProcedures(patientId).subscribe(data => {
        this.procedures = [];
        if (data.entry != undefined) {
          this.procTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.procedures.push(<fhir.Procedure>data.entry[entNo].resource);
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

    this.fhirService.getEPRConditions(patientId).subscribe(data => {
        this.conditions = [];
        if (data.entry != undefined) {
          this.conditionTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.conditions.push(<fhir.Condition>data.entry[entNo].resource);
          }
        }
      }
    );

    this.fhirService.getEPRAllergies(patientId).subscribe(data => {
        this.allergies = [];
        if (data.entry != undefined) {
          this.allergiesTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.allergies.push(<fhir.AllergyIntolerance>data.entry[entNo].resource);
          }
        }
      }
    );

    this.fhirService.getEPRDocuments(patientId).subscribe(data => {
        this.documents = [];
        if (data.entry != undefined) {
          this.documentsTotal = data.total;
          for (let entNo = 0; entNo < data.entry.length; entNo++) {
            this.documents.push(<fhir.DocumentReference>data.entry[entNo].resource);
          }
        }
      }
    );
  }
}

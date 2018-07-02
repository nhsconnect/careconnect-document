import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FhirService} from "../../service/fhir.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import {LinksService} from "../../service/links.service";
import {PatientEprService} from "../../service/patient-epr.service";




@Component({
  selector: 'app-patient-epr-patient-record',
  templateUrl: './epr-record.component.html',
  styleUrls: ['./epr-record.component.css']
})
export class EprRecordComponent implements OnInit {

  composition : fhir.Bundle = undefined;

//  encounterdoc : fhir.Bundle = undefined;

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

  immunisations : fhir.Immunization[];
  immsTotal : number;

  patientId : string;

  @Input()
  section : string = undefined;

  page : number;

  graphData = {};

  @ViewChild('tabs')
  private tabs:NgbTabset;

  constructor(private fhirService: FhirService,
              private route: ActivatedRoute,
              private linksService : LinksService,
              private patientEprService : PatientEprService,
              private router : Router
              ) { }


  ngOnInit() {
    this.patientId = this.patientEprService.patient.id;

    this.selectPatientEPR(this.patientId);

    this.patientEprService.getSectionChangeEvent().subscribe( (section) => {
        console.log("Section = "+this.section);
        this.section = section;
      }
    );

    console.log("Section = "+this.section);
    if (this.section == undefined ) {
      this.section = "documents";
    }

    /*
    this.router.events.subscribe((val) => {
      // see also
      // console.log(val instanceof NavigationEnd);
      if (val instanceof NavigationEnd) {
        console.log(this.route.snapshot.paramMap.get('tabid'));
        this.section = this.route.snapshot.paramMap.get('tabid');
        if (this.section == undefined ) {
          this.section = "documents";
        }
      }
    });
*/
  }


/*
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
*/
  isSNOMED(system: string) : boolean {
    if (system == undefined) return false;
    if (system == "http://snomed.info/sct")
      return true;

  }

  getCodeSystem(system : string) : string {
    switch(system) {
      case "http://snomed.info/sct": return "SNOMED";
      case "http://loinc.org": return "LOINC";
      default: return system;
    }
  }


  getSNOMEDLink(code : fhir.Coding) {
    if (this.isSNOMED(code.system)) {
      window.open("https://termbrowser.nhs.uk/?perspective=full&conceptId1=" + code.code + "&edition=uk-edition&release=v20180401", "_blank");
    }
  }


  selectPatientEPR(patientId : string) {

    if (this.fhirService.hasScope("Encounter")) {
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
    }
/*
    this.fhirService.getEPRPatient(patientId).subscribe(document => {
        this.patient = document;
        this.patientEprService.set(document);
      },
      error => {
        console.log(error);
       if (error.status = 401) {
        // this.authService.logout();
       }
      }
    );
    */


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

    /* Called when required
    if (this.fhirService.hasScope("Observation")) {

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
    }
    if (this.fhirService.hasScope("Procedure")) {
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
    }

    if (this.fhirService.hasScope("MedicationRequest")) {
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

    if (this.fhirService.hasScope("Condition")) {
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
    }

    if (this.fhirService.hasScope("Immunization")) {
      this.fhirService.getEPRImmunisations(patientId).subscribe(data => {
          this.immunisations = [];
          if (data.entry != undefined) {
            this.immsTotal = data.total;
            for (let entNo = 0; entNo < data.entry.length; entNo++) {
              this.immunisations.push(<fhir.Immunization>data.entry[entNo].resource);
            }
          }
        }
      );
    }
    if (this.fhirService.hasScope("AllergyIntolerance")) {
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
    }
    */
    if (this.fhirService.hasScope("DocumentReference")) {
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
}

import {Component, Input, OnInit} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {isNumber} from "util";
import {LinksService} from "../../../service/links.service";
import {EprService} from "../../../service/epr.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {BundleService} from "../../../service/bundle.service";
import {ResourceDialogComponent} from "../../../dialog/resource-dialog/resource-dialog.component";

@Component({
  selector: 'app-view-document-section',
  templateUrl: './view-document-section.component.html',
  styleUrls: ['./view-document-section.component.css']
})
export class ViewDocumentSectionComponent implements OnInit {

  @Input() section : fhir.CompositionSection;


  // Reference for modal size https://stackoverflow.com/questions/46977398/ng-bootstrap-modal-size
  resource = undefined;

  entries : any[];

  medicationStatements : fhir.MedicationStatement[];
  prescriptions : fhir.MedicationRequest[];
  medications : fhir.Medication[];
  conditions : fhir.Condition[];
  procedures : fhir.Procedure[];
  observations : fhir.Observation[];
  allergies : fhir.AllergyIntolerance[];
  encounters : fhir.Encounter[];
  patients : fhir.Patient[];
  practitioners : fhir.Practitioner[];
  organisations : fhir.Organization[];
  locations : fhir.Location[];
  roles : fhir.PractitionerRole[];
  services : fhir.HealthcareService[];

  showStructured : boolean = false;

  constructor(private modalService: NgbModal,
              public dialog: MatDialog,
              private linksService : LinksService,
              public patientEPRService : EprService,
              public bundleService : BundleService 
  ) { }

  ngOnInit() {
    this.entries = [];
    this.medicationStatements =[];
    this.prescriptions =[];
    this.medications=[];
    this.conditions=[];
    this.procedures=[];
    this.observations=[];
    this.encounters=[];
    this.allergies=[];
    this.patients=[];
    this.practitioners=[];
    this.organisations=[];
    this.roles=[];
    this.services=[];

    this.getPopover(this.section);

  }


  getPopover(section : fhir.CompositionSection)  {


    if (section.entry != undefined) {
      for (let entry  of section.entry) {
        this.getReferencedItem(entry.reference);

      }
    }
  }

  open() {
    this.showStructured = !this.showStructured;
  }

  getReferencedItem(reference : string)  {
    //console.log("In getReferenced and medications count = "+this.medications.length);
    let resource = this.bundleService.getResource(reference).subscribe(
      (resource) => {
        if (resource != undefined) {

          switch (resource.resourceType) {
            case "AllergyIntolerance" :
              let allergyIntolerance: fhir.AllergyIntolerance = <fhir.AllergyIntolerance> resource;
              this.allergies.push(allergyIntolerance);
              break;
            case "Condition" :
              let condition: fhir.Condition = <fhir.Condition> resource;
              this.conditions.push(condition);

              break;
            case "Encounter" :
              let encounter: fhir.Encounter = <fhir.Encounter> resource;
              this.encounters.push(encounter);
              break;
            case "List" :
              let list: fhir.List = <fhir.List> resource;
              if (list.entry != undefined) {
                if (list.code != undefined && list.code.coding.length > 0) {
                  this.entries.push({
                    "resource": "List"
                    , "code": list.code.coding[0].code
                    , "display": "Entries " + list.entry.length
                  });
                } else {
                  this.entries.push({
                    "resource": "List"
                    , "display": "Entries " + list.entry.length
                  });
                }

                for (let entry of list.entry) {

                  if (entry.item != undefined && entry.item.reference != undefined) {
                    // console.log(entry.item.reference);
                    this.getReferencedItem(entry.item.reference);
                  }
                  else {
                    this.entries.push({
                      "resource": "Error"
                      , "display": "Missing Reference"
                    });
                  }
                }
              }
              break;
            case "Medication" :
              let medication: fhir.Medication = <fhir.Medication> resource;
              //medication.id = resource.fullUrl;

              this.medications.push(medication);

              break;
            case "MedicationRequest" :
              let medicationRequest: fhir.MedicationRequest = <fhir.MedicationRequest> resource;
              this.prescriptions.push(medicationRequest);
              if (medicationRequest.medicationReference != undefined) {
                this.getReferencedItem(medicationRequest.medicationReference.reference);
              }

              break;
            case "MedicationStatement" :
              let medicationStatement: fhir.MedicationStatement = <fhir.MedicationStatement> resource;
              this.medicationStatements.push(medicationStatement);
              if (medicationStatement.medicationReference != undefined) {
                this.getReferencedItem(medicationStatement.medicationReference.reference);
              }
              break;
            case "Observation" :
              let observation: fhir.Observation = <fhir.Observation> resource;
              this.observations.push(observation);
              break;
            case "Procedure" :
              let procedure: fhir.Procedure = <fhir.Procedure> resource;
              this.procedures.push(procedure)
              break;
            case "Patient" :
              let patient: fhir.Patient = <fhir.Patient> resource;
              this.patients.push(patient);
              break;
            case "Practitioner":
              let practitioner: fhir.Practitioner = <fhir.Practitioner> resource;
              practitioner.id = reference.replace('urn:uuid:','');
              this.practitioners.push(practitioner);

              break;
            case "PractitionerRole":
              let practitionerRole: fhir.PractitionerRole = <fhir.PractitionerRole> resource;
              practitionerRole.id = reference.replace('urn:uuid:','');
              this.roles.push(practitionerRole);
              break;
            case "Organization":
              let organization: fhir.Organization = <fhir.Organization> resource;
              this.organisations.push(organization);
              break;
            case "HealthcareService":
              let service: fhir.HealthcareService = <fhir.HealthcareService> resource;
              this.services.push(service);
              break;
            case "Location":
              let location: fhir.Location = <fhir.Location> resource;

              this.locations.push(location);
              break;
            default :
              console.log('**** missing ' + resource.resourceType);
              this.entries.push(resource.resourceType);
          }
        }
      })



  }

    getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }

  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }

  onResoureSelected(event ) {
    this.resource = event;
    this.patientEPRService.setResource(event);
  }

  select(resource) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      resource: resource
    };
    let resourceDialog : MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
  }

}

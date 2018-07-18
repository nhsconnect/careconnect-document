import {Component, EventEmitter, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";
import {FhirService} from "../../service/fhir.service";
import {Router} from "@angular/router";
import {EprService} from "../../service/epr.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DocumentRef} from "../../model/document-ref";
import { v4 as uuid } from 'uuid';
import {IAlertConfig, TdDialogService, TdLoadingService} from "@covalent/core";
import {IConfirmConfig} from "@covalent/core/dialogs/services/dialog.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {IssueDialogComponent} from "../../dialog/issue-dialog/issue-dialog.component";


@Component({
  selector: 'app-load-document',
  templateUrl: './load-document.component.html',
  styleUrls: ['./load-document.component.css']
})
export class LoadDocumentComponent implements OnInit {

  // PDF Viewer https://www.npmjs.com/package/ng2-pdf-viewer

  // Jpeg viewer http://fcrohas.github.io/angular-canvas-viewer/

  response: fhir.OperationOutcome;

  formData: FormData = undefined;


  notFhir :boolean;

  file : File;


  practiceSettings : fhir.ValueSet;

  facilityCodes : fhir.ValueSet;

  documentType : fhir.ValueSet;

  document : DocumentRef = new DocumentRef();

  documentForm : FormGroup;

  compositionFG : FormGroup;
  documentReferenceFG : FormGroup;

  fileName : FormControl;

  public loadComplete: EventEmitter<any> = new EventEmitter();

  public progressBar: boolean = false;


  @ViewChild('docCreated') inputCreated;

  constructor(private http: HttpClient,
              private router: Router,
              public auth : AuthService,
              private fhirService : FhirService,
              public eprService : EprService,
              private modalService : NgbModal,
              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef,
              public dialog: MatDialog) { }



  ngOnInit() :void {



      if (this.eprService.patient != undefined) {
        let patients : fhir.Patient[] = [];
        patients.push(this.eprService.patient);
        this.document.patients = patients;
      }
/*
      this.fhirService.getNHSDValueSet('NRLS-RecordType-1').subscribe(
        data => {
          this.documentType = data;
          //this.practiceSettings.compose.include[0].concept
        }
      );
      */

      this.documentType = {
        "resourceType": "ValueSet",
        "id": "NRLS-RecordType-1",
        "url": "https://fhir.nhs.uk/STU3/ValueSet/NRLS-RecordType-1",
        "version": "1.0.0",
        "name": "NRLS Record Type",
        "status": "draft",
        "date": "2018-05-25T00:00:00+00:00",
        "publisher": "NHS Digital",
        "contact": [
          {
            "name": "Interoperability Team",
            "telecom": [
              {
                "system": "email",
                "value": "interoperabilityteam@nhs.net",
                "use": "work"
              }
            ]
          }
        ],
        "description": "A code from the SNOMED Clinical Terminology UK coding system to represent the NRLS clinical record type.",
        "copyright": "This value set includes content from SNOMED CT, which is copyright © 2002+ International Health Terminology Standards Development Organisation (IHTSDO), and distributed by agreement between IHTSDO and HL7. Implementer use of SNOMED CT is not covered by this agreement.",
        "compose": {
          "include": [
            {
              "system": "http://snomed.info/sct",
              "concept": [
                {
                  "code": "736253002",
                  "display": "Mental health crisis plan (record artifact)"
                }
              ]
            }
          ]
        }
      };

    this.fhirService.getValueSet('c80-facilitycodes').subscribe(
      data => {
        this.facilityCodes = data;
      }
    );
    this.fhirService.getValueSet('c80-practice-codes').subscribe(
      data => {
        this.practiceSettings = data;
      }
    );

      // The form has two different sets of validation rules.

    this.fileName = new FormControl( this.document.file, [
      Validators.required
    ]);


    this.compositionFG = new FormGroup({
      'fileName' :  this.fileName});

    this.documentReferenceFG = new FormGroup({
      'fileName' : this.fileName,
    'subject': new FormControl({ value : this.document.patients, disabled : true}, [ Validators.required]),
    'custodian': new FormControl({ value : this.document.organisations, disabled : true}, [ Validators.required]),
    'author' : new FormControl({ value : this.document.practitioners, disabled : true}, [ Validators.required]),
    'type' : new FormControl(this.document.type, [ Validators.required]),
    'service' : new FormControl(this.document.service),
    'speciality' : new FormControl(this.document.speciality),
    'created' : new FormControl(this.document.docDate, [ Validators.required])

    });



    // Assign current form group
    console.log('composition validation');
    this.documentForm = this.compositionFG;

  }



  closeOrg(organization : fhir.Organization) {
    console.log("Selected Organisation "+organization.id);
    let organizations :fhir.Organization[] = [];
    organizations.push(organization);
    this.document.organisations = organizations;
  }

  closePrac(practitioner :fhir.Practitioner) {
    console.log("selected practitioner "+practitioner.id);
    let practitioners : fhir.Practitioner[] = [];
    practitioners.push(practitioner);
    this.document.practitioners = practitioners;
  }

  closePat(patient : fhir.Patient) {
    console.log("selected patient "+patient.id);
    let patients : fhir.Patient[] = [];
    patients.push(patient);
    this.document.patients = patients;

  }

  // https://stackoverflow.com/questions/40214772/file-upload-in-angular

   fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.document.file = file;
      this.formData = new FormData();
      this.formData.append('uploadFile', file, file.name);

      if (this.getContentType(file).lastIndexOf('fhir')==-1) {
        this.notFhir = true;
        this.documentForm = this.documentReferenceFG;
        console.log('documentReference validation');
      } else {
        this.notFhir = false;
        this.documentForm = this.compositionFG;
        console.log('composition validation');
      }
    }
  }
  public getContentType(file) : string {
    let ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    if (ext === 'xml' || ext==='XML') {
      return "application/fhir+xml";
    } else if (ext === 'json' || ext==='JSON') {
      return "application/fhir+json";
    }
    else {
      return file.type;
    }
  }
  onCheckClick(content) {
    this.getFormValidationErrors();
  }
  onSubmitClick() {
    this.progressBar = true;
    if (!this.getFormValidationErrors()) return;

    let file: File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = ' + file.name);

    if (!this.notFhir) {

      this.fhirService.postBundle(file, this.getContentType(file)).subscribe(data => {
          console.log(data);
          this.progressBar = false;
          this.eprService.documentReference = undefined;

          for (let entry of data.entry) {
            if (entry.resource.resourceType == 'Patient') {
              this.eprService.patient = <fhir.Patient> entry.resource;
            }
            if (entry.resource.resourceType == 'DocumentReference') {
              this.eprService.documentReference = <fhir.DocumentReference> entry.resource;
            }
          }
          if (this.eprService.documentReference !== undefined) {
            this.eprService.setSection('binary');
          } else {
            this.eprService.setSection('documents');
          }
        },
        err => {
          this.progressBar = false;
          console.log(err.error);

          this.response = err.error;
          if (this.response.issue != undefined && this.response.issue.length > 0) {
            if (this.response.issue[0].diagnostics!=undefined && this.response.issue[0].diagnostics.indexOf('FHIR Document already exists') > -1) {
             this.warnDuplicate();
            } else {
              this.showIssue(this.response) ;
            }
          } else {
            this.showIssue(this.response);
          }
        }
      );
    } else {
      this.file = file;
      this.buildBinary(file);
    }
  }

    buildBundle(base64file : string) :any {
      let binary: fhir.Binary = {
        id : uuid(),
        contentType: this.getContentType(this.file),
        content: base64file
      };

      console.log('service '+ this.document.service);
      console.log('service display '+ this.getDisplayFromCode(this.document.service,this.facilityCodes));

      binary.resourceType= 'Binary';
      let patient :fhir.Patient = undefined;
      if (this.eprService.patient != undefined) {
        patient = this.eprService.patient;
      } else {
        patient = this.document.patients[0];
      }
      let orignialPatientId = patient.id;
      patient.id = uuid();
      patient.resourceType = 'Patient';
      let organisation = this.document.organisations[0];
      organisation.id = uuid();
      organisation.resourceType = 'Organization';
      let practitioner = this.document.practitioners[0];
      practitioner.id = uuid();
      practitioner.resourceType = 'Practitioner';

      let documentReference : fhir.DocumentReference = <fhir.DocumentReference>{};
      documentReference.id = uuid();
      documentReference.subject = {};
      documentReference.subject.reference = 'urn:uuid:'+patient.id;

      let date = new Date(this.document.docDate.toString());
      console.log(date.toISOString());
      documentReference.created = date.toISOString();

      documentReference.type = {}
      documentReference.type.coding =[];
      documentReference.type.coding.push({
        "system": "http://snomed.info/sct",
          "code": this.document.type,
          "display": this.getDisplayFromCode(this.document.type,this.documentType)
      });

      documentReference.author = [];
      documentReference.author.push({
        "reference": "urn:uuid:"+practitioner.id
      });

      documentReference.custodian = {};
      documentReference.custodian.reference = 'urn:uuid:'+ organisation.id;

      documentReference.context = {};
      documentReference.context.practiceSetting = {};
      documentReference.context.practiceSetting.coding = [];

      documentReference.context.practiceSetting.coding.push({
        "system": "http://snomed.info/sct",
        "code": this.document.speciality,
        "display": this.getDisplayFromCode(this.document.speciality,this.practiceSettings)
      });

      documentReference.context.facilityType = {};
      documentReference.context.facilityType.coding = [];

      documentReference.context.facilityType.coding.push({
        "system": "http://snomed.info/sct",
        "code": this.document.service,
        "display": this.getDisplayFromCode(this.document.service,this.facilityCodes)
      });

      documentReference.content = [];
      documentReference.content.push({
        "attachment": {
          "contentType": binary.contentType,
          "url": "urn:uuid:"+binary.id
        }
      }) ;
      documentReference.resourceType ='DocumentReference';

      let bundle : fhir.Bundle = {
        type : 'collection',
        resourceType : 'Bundle'
      };
      bundle.entry = [];
      bundle.entry.push({
        fullUrl : "urn:uuid:"+documentReference.id,
        resource : documentReference
      } );
      bundle.entry.push({
        fullUrl : "urn:uuid:"+binary.id,
        resource : binary
      } );
      bundle.entry.push({
        fullUrl : "urn:uuid:"+patient.id,
        resource : patient
      } );
      bundle.entry.push({
        fullUrl : "urn:uuid:"+practitioner.id,
        resource : practitioner
      } );
      bundle.entry.push({
        fullUrl : "urn:uuid:"+organisation.id,
        resource : organisation
      } );


      this.fhirService.postBundle(bundle, 'application/json+fhir').subscribe(data  => {
          console.log(data);
          this.progressBar = false;
          for (let entry of data.entry) {
            if (entry.resource.resourceType == 'DocumentReference') {
              this.eprService.documentReference = <fhir.DocumentReference> entry.resource;
            }
            if (entry.resource.resourceType == 'Patient') {
              this.eprService.patient = <fhir.Patient> entry.resource;
            }
          }
          this.eprService.setSection('binary');
        },
        err => {
          this.progressBar = false;
          console.log(err.error);
          this.response = err.error;

          this.showIssue(this.response);

        }
      );
      console.log(bundle);
    }



  buildBinary(file) :string {
    let result="";
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    this.loadComplete.subscribe( (data) => {
      this.buildBundle(data);
      }
     );
    let me = this;
    reader.onload = function(this) {
      me.loadComplete.emit(btoa(reader.result));
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    return result;
  }


  specialityChanged(event) {
    console.log(event);
  }

  getDisplayFromCode(code : String, valueSet : fhir.ValueSet) {
    let display = "";
    for (let concept of valueSet.compose.include[0].concept) {
      //console.log(code + ' + ' + concept.code);
      if (code.indexOf(concept.code) !== -1 ) {
        display = concept.display;
      }
    }
    return display
  }

  onReplaceClick() {
    if (!this.getFormValidationErrors()) return;
    this.progressBar = true;
    //this.modalReference.close();
    let file : File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = '+file.name);

    this.fhirService.putBundle(file,this.getContentType(file)).subscribe( data => {
        console.log(data);
        this.progressBar = false;
        for (let entry of data.entry) {
          if (entry.resource.resourceType == 'Patient') {
            this.eprService.patient = <fhir.Patient> entry.resource;
          }
          if (entry.resource.resourceType == 'DocumentReference') {
            this.eprService.documentReference = <fhir.DocumentReference> entry.resource;
          }
        }
        this.eprService.setSection('binary');
      },
      err  => {
        this.progressBar = false;
        console.log(err.message );

        this.response = err.error;

        this.showIssue(this.response)

      } );

  }

  postOk(message : string) {
    let alertConfig : IAlertConfig = { message : message};
    alertConfig.disableClose =  false; // defaults to false
    alertConfig.viewContainerRef = this._viewContainerRef;
    alertConfig.title = 'Posted'; //OPTIONAL, hides if not provided
    alertConfig.closeButton = 'Ok'; //OPTIONAL, defaults to 'CLOSE'
    alertConfig.width = '400px'; //OPTIONAL, defaults to 400px
    this._dialogService.openAlert(alertConfig);
  }

  warnDuplicate() {
    let alertConfig : IConfirmConfig = { message : "The document already exists on the system. Do you wish to replace?" };
    alertConfig.disableClose =  false; // defaults to false
    alertConfig.viewContainerRef = this._viewContainerRef;
    alertConfig.title = 'Warning'; //OPTIONAL, hides if not provided
    alertConfig.cancelButton = 'No';
    alertConfig.acceptButton = 'Yes'; //OPTIONAL, defaults to 'ACCEPT'
    alertConfig.width = '400px'; //OPTIONAL, defaults to 400px
    this._dialogService.openConfirm(alertConfig).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.onReplaceClick();
      }
    } );
  }

  showIssue(operationOutcome : fhir.OperationOutcome) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      operationOutcome : operationOutcome
    };
    let resourceDialog : MatDialogRef<IssueDialogComponent> = this.dialog.open( IssueDialogComponent, dialogConfig);
  }

  getFormValidationErrors() :boolean {
    let result : boolean = true;
    Object.keys(this.documentForm.controls).forEach(key => {
      console.log(key);
      const controlErrors: ValidationErrors = this.documentForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          this.documentForm.get(key).markAsDirty();
          result = false;
        });
      }
    });
    return result;
  }




}

import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";
import {FhirService} from "../../service/fhir.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DocumentRef} from "../../model/document-ref";
import { v4 as uuid } from 'uuid';


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

  modalReference ;

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

  public loadComplete :EventEmitter<any> = new EventEmitter();


  @ViewChild('modalDuplicate') modalDuplicate;

  @ViewChild('modalIssue') modalIssue;

  @ViewChild('docCreated') inputCreated;

  constructor(private http: HttpClient
              ,private router: Router
  , public auth : AuthService
  , private fhirService : FhirService
  , public eprService : PatientEprService
  , private modalService : NgbModal) { }



  ngOnInit() :void {
      if (this.eprService.patient != undefined) {
        this.document.patient = this.eprService.patient;
      }

      this.fhirService.getNHSDValueSet('NRLS-RecordType-1').subscribe(
        data => {
          this.documentType = data;
          //this.practiceSettings.compose.include[0].concept
        }
      );
      /*
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
*/
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
    'subject': new FormControl({ value : this.document.patient, disabled : true}, [ Validators.required]),
    'custodian': new FormControl({ value : this.document.organisation, disabled : true}, [ Validators.required]),
    'author' : new FormControl({ value : this.document.practitioner, disabled : true}, [ Validators.required]),
    'type' : new FormControl(this.document.type, [ Validators.required]),
    'service' : new FormControl(this.document.service),
    'speciality' : new FormControl(this.document.speciality),
    'created' : new FormControl(this.document.docDate, [ Validators.required])

    });

    // Assign current form group
    console.log('composition validation');
    this.documentForm = this.compositionFG;

  }


  closeOrg(organization) {
    console.log("Selected Organisation "+organization.id);
    this.document.organisation = organization;
   // this.modalReference.close();
  }

  closePrac(practitioner) {
    console.log("selected practitioner "+practitioner.id);
    this.document.practitioner = practitioner;
    //this.modalReference.close();
  }

  closePat(patient) {
    console.log("selected patient "+patient.id);
    this.document.patient = patient;
    //this.modalReference.close();
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
    if (!this.getFormValidationErrors()) return;

    let file: File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = ' + file.name);

    if (!this.notFhir) {

      this.fhirService.postBundle(file, this.getContentType(file)).subscribe(data => {
          console.log(data);
          let resJson: fhir.OperationOutcome = data;
          this.response = data;
          if (resJson.id != undefined) {
            this.router.navigate(['doc/' + resJson.id]);
          }
        },
        err => {
         // console.log(err.statusText);
         // console.log(err.message);
          console.log(err.error);
          ///console.log(JSON.stringify(err));

          this.response = err.error;
          if (this.response.issue.length > 0) {
            if (this.response.issue[0].diagnostics.indexOf('FHIR Document already exists') > -1) {
              this.modalReference = this.modalService.open(this.modalDuplicate, {windowClass: 'dark-modal'});
            } else {
              this.modalReference = this.modalService.open(this.modalIssue, {windowClass: 'dark-modal'});
            }
          } else {
            this.modalReference = this.modalService.open(this.modalIssue, {windowClass: 'dark-modal'});
          }
        }
      );
    } else {
      this.file = file;
      this.buildBinary(file);
    }
  }

    buildBundle(base64file : string) :any {
      let binary : fhir.Binary = {
        id : uuid(),
        contentType: this.getContentType(this.file),
        content: base64file
      };

      console.log('service '+ this.document.service);
      console.log('service display '+ this.getDisplayFromCode(this.document.service,this.facilityCodes));

      binary.resourceType= 'Binary';
      let orignialPatientId = this.document.patient.id;
      this.document.patient.id = uuid();
      this.document.patient.resourceType = 'Patient';
      this.document.organisation.id = uuid();
      this.document.organisation.resourceType = 'Organization';
      this.document.practitioner.id = uuid();
      this.document.practitioner.resourceType = 'Practitioner';

      let documentReference : fhir.DocumentReference = <fhir.DocumentReference>{};
      documentReference.id = uuid();
      documentReference.subject = {};
      documentReference.subject.reference = 'urn:uuid:'+this.document.patient.id;

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
        "reference": "urn:uuid:"+this.document.practitioner.id
      });

      documentReference.custodian = {};
      documentReference.custodian.reference = 'urn:uuid:'+ this.document.organisation.id;

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
        fullUrl : "urn:uuid:"+this.document.patient.id,
        resource : this.document.patient
      } );
      bundle.entry.push({
        fullUrl : "urn:uuid:"+this.document.practitioner.id,
        resource : this.document.practitioner
      } );
      bundle.entry.push({
        fullUrl : "urn:uuid:"+this.document.organisation.id,
        resource : this.document.organisation
      } );


      this.fhirService.postBundle(bundle, 'application/json+fhir').subscribe(data => {
          console.log(data);
          let resJson: fhir.OperationOutcome = data;
          this.response = data;
          console.log(data);
          this.router.navigate(['epr/' + orignialPatientId]);
        },
        err => {

          console.log(err.error);
          this.response = err.error;

          this.modalReference = this.modalService.open(this.modalIssue, {windowClass: 'dark-modal'});

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

  onNoClick( ) {
    this.modalReference.close();
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

    this.modalReference.close();
    let file : File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = '+file.name);

    this.fhirService.putBundle(file,this.getContentType(file)).subscribe( data => {
        console.log(data);
        let resJson :fhir.OperationOutcome =data;
        this.response = data;
        if (resJson.id !=undefined) {
          this.router.navigate(['doc/'+resJson.id ] );
        } else {

          this.modalReference = this.modalService.open(this.modalIssue, {windowClass: 'dark-modal'});
        }
      },
      err  => {

        console.log(err.message );

        this.response = err.error;

        this.modalReference = this.modalService.open(this.modalIssue, {windowClass: 'dark-modal'});

      } );

  }


  onModalClick(content ) {
     console.log("Content = ");
     console.log(content);
     this.modalReference = this.modalService.open(content, {windowClass: 'dark-modal'});


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

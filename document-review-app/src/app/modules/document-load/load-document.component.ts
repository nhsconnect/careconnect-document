import {Component, Input, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";
import {FhirService} from "../../service/fhir.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DocumentRef} from "../../model/document-ref";


@Component({
  selector: 'app-load-document',
  templateUrl: './load-document.component.html',
  styleUrls: ['./load-document.component.css']
})
export class LoadDocumentComponent implements OnInit {

  response: fhir.OperationOutcome;

  formData: FormData = undefined;

  modalReference ;

  notFhir :boolean;


  document : DocumentRef = new DocumentRef();

  documentForm : FormGroup;

  compositionFG : FormGroup;
  documentReferenceFG : FormGroup;

  fileName : FormControl;


  constructor(private http: HttpClient
              ,private router: Router
  ,public auth : AuthService
  ,private fhirService : FhirService
  , public eprService : PatientEprService
  , private modalService : NgbModal) { }



  ngOnInit() :void {
      if (this.eprService.patient != undefined) {
        this.document.patient = this.eprService.patient;
      }

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
    'created' : new FormControl(this.document.docDate)

    });

    // Assign current form group
    console.log('composition validation');
    this.documentForm = this.compositionFG;

  }


  closeOrg(organization) {
    console.log("Selected Organisation "+organization.id);
    this.document.organisation = organization;
    this.modalReference.close();
  }

  closePrac(practitioner) {
    console.log("selected practitioner "+practitioner.id);
    this.document.practitioner = practitioner;
    this.modalReference.close();
  }

  closePat(patient) {
    console.log("selected patient "+patient.id);
    this.document.patient = patient;
    this.modalReference.close();
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
      return "application/pdf";
    }
  }
  onCheckClick(content) {
    this.getFormValidationErrors();
  }
  onSubmitClick(issueModal, duplicateModal ) {
    if (!this.getFormValidationErrors()) return;

    let file : File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = '+file.name);


    this.fhirService.postBundle(file,this.getContentType(file)).subscribe( data => {
        console.log(data);
        let resJson :fhir.OperationOutcome =data;
        this.response = data;
        if (resJson.id !=undefined) {
          this.router.navigate(['doc/'+resJson.id ] );
        }
      },
      err  => {
        console.log(err.statusText );
        console.log(err.message );
        console.log(err.error );
        ///console.log(JSON.stringify(err));

        this.response = err.error;
        if (this.response.issue.length>0) {
         if (this.response.issue[0].diagnostics.indexOf('FHIR Document already exists') > -1) {
           this.modalReference = this.modalService.open(duplicateModal, {windowClass: 'dark-modal'});
         } else {
           this.modalReference = this.modalService.open(issueModal, {windowClass: 'dark-modal'});
         }
        } else {
          this.modalReference = this.modalService.open(issueModal, {windowClass: 'dark-modal'});
        }
      } );

  }

  onReplaceClick(issueModal ) {
    if (!this.getFormValidationErrors()) return;

    let file : File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = '+file.name);


    this.fhirService.putBundle(file,this.getContentType(file)).subscribe( data => {
        console.log(data);
        let resJson :fhir.OperationOutcome =data;
        this.response = data;
        if (resJson.id !=undefined) {
          this.router.navigate(['doc/'+resJson.id ] );
        }
      },
      err  => {
        console.log(err.statusText );
        console.log(err.message );
        console.log(err.error );
        ///console.log(JSON.stringify(err));

        this.response = err.error;

        this.modalReference = this.modalService.open(issueModal, {windowClass: 'dark-modal'});

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

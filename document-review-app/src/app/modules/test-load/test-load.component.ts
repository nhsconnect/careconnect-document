import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DocumentRef} from "../../model/document-ref";
import {FhirService} from "../../service/fhir.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {error} from "../../model/error";

@Component({
  selector: 'app-test-load',
  templateUrl: './test-load.component.html',
  styleUrls: ['./test-load.component.css']
})
export class TestLoadComponent implements OnInit {

  response: fhir.OperationOutcome;

  formData: FormData = undefined;

  testForm : FormGroup;

  document : DocumentRef = new DocumentRef();

  fileName : FormControl;

  resJson : fhir.OperationOutcome;

  model : error  = new error();

  constructor(private fhirService : FhirService,
              private modalService: NgbModal) { }

  ngOnInit() {

    this.fileName = new FormControl( this.document.file, [
      Validators.required
    ]);


    this.testForm = new FormGroup({
      'fileName' :  this.fileName});

    // Assign current form group
    console.log('composition validation');


  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.document.file = file;
      this.formData = new FormData();
      this.formData.append('uploadFile', file, file.name);


    }
  }

  onSubmitClick(modalWait, modalError ) {

    let modalWaitRef = this.modalService.open(modalWait,{ windowClass: 'dark-modal' });
    if (!this.getFormValidationErrors()) return;

    let file : File = <File> this.formData.get('uploadFile');
    console.log('clicked FileName = '+file.name);


    this.fhirService.postBundleValidate(file,this.getContentType(file)).subscribe( data => {
        console.log(data);
        this.resJson =data;
        this.response = data;

      },
      err  => {
        modalWaitRef.close();
        this.modalService.open(modalError,{ windowClass: 'dark-modal' });
        console.log(err.statusText );
        console.log(err.message );
        console.log(err.error );
        ///console.log(JSON.stringify(err));

        this.response = err.error;

      },
      () => {
       modalWaitRef.close();
      });

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

  getFormValidationErrors() :boolean {
    let result : boolean = true;
    Object.keys(this.testForm.controls).forEach(key => {
      console.log(key);
      const controlErrors: ValidationErrors = this.testForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          this.testForm.get(key).markAsDirty();
          result = false;
        });
      }
    });
    return result;
  }




}
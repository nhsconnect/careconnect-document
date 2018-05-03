import {Component, Input, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";
import {FhirService} from "../../service/fhir.service";
import {Router} from "@angular/router";
import {PatientEprService} from "../../service/patient-epr.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-load-document',
  templateUrl: './load-document.component.html',
  styleUrls: ['./load-document.component.css']
})
export class LoadDocumentComponent implements OnInit {

  response: fhir.OperationOutcome;

  formData: FormData = undefined;

  patient : fhir.Patient;

  notFhir :boolean;

  constructor(private http: HttpClient
              ,private router: Router
  ,public auth : AuthService
  ,private fhirService : FhirService
  , public eprService : PatientEprService
  , private modalService : NgbModal) { }

  ngOnInit() {
      if (this.eprService.patient != undefined) {
        this.patient = this.patient;
      }
  }

  // https://stackoverflow.com/questions/40214772/file-upload-in-angular

  apiEndPoint : string;

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.formData = new FormData();
      this.formData.append('uploadFile', file, file.name);
      console.log("Find = "+this.getContentType(file).lastIndexOf('fhir'));
      if (this.getContentType(file).lastIndexOf('fhir')==-1) this.notFhir = true;
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
  onClick() {
    if (this.formData == undefined) {
      console.log('no document');
      return;
    }
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
        console.log(JSON.stringify(err));

        this.response = err.error;
      } );

  }

  onModalClick(content ) {
     console.log("Content = ");
     console.log(content);
     this.modalService.open(content, {windowClass: 'dark-modal'});


  }


}

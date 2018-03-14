import { Component, OnInit } from '@angular/core';
import {FileUploader} from "ng2-file-upload";
import {Router} from "@angular/router";



const URL = 'http://localhost:8181/STU3/Bundle?_format=application/json';

// https://github.com/valor-software/ng2-file-upload

@Component({
  selector: 'app-load-document-file',
  templateUrl: './load-document-file.component.html',
  styleUrls: ['./load-document-file.component.css'],
})
export class LoadDocumentFileComponent implements OnInit {

  ngOnInit() {
  }

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response: fhir.OperationOutcome;

  constructor (private router: Router){

    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.


    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.headers=  [{ name: 'Content-Type', value : this.getContentType(item) } ]
    }

    this.hasBaseDropZoneOver = true;
    this.hasAnotherDropZoneOver = false;

    this.response = undefined;

    this.uploader.response.subscribe( res => {

        let resJson :fhir.OperationOutcome = JSON.parse(res);

        this.response = res;
        if (resJson.id !=undefined) {
          router.navigate(['doc/'+resJson.id ] );
        }
      },
        err => {
          console.log("oopsie");
        });
  }

  public getContentType(item) {
    let ext = item._file.name.substr(item._file.name.lastIndexOf('.') + 1);
    if (ext === 'xml' || ext==='XML') {
      return "application/fhir+xml";
    } else {
      return "application/fhir+json";
    }
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }


}
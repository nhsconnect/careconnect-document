import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FileUploader} from "ng2-file-upload";

const URL = 'http://localhost:8182/STU3/Bundle/$validate';


@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.css']
})



export class LoadFileComponent implements OnInit {



  ngOnInit() {
  }

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response: any;
  resJson : fhir.OperationOutcome;

  constructor (private router: Router){

    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.


    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.headers=  [{ name: 'Content-Type', value : this.getContentType(item) }  ,{ name: 'Accept', value : 'application/fhir+json' }]
//
    }

    this.hasBaseDropZoneOver = true;
    this.hasAnotherDropZoneOver = false;

    this.response = undefined;

    this.uploader.response.subscribe( res => {

        this.resJson = JSON.parse(res);

        this.response = res;
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

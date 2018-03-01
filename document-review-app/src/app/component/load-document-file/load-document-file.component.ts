import { Component, OnInit } from '@angular/core';
import {FileUploader} from "ng2-file-upload";



const URL = 'http://localhost:8181/STU3/Bundle';

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
  response:string;

  constructor (){

    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.

      /*
      formatDataFunctionIsAsync: true,

      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
      */
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.headers=  [{ name: 'Content-Type', value : this.getContentType(item) } ]
    }

    this.hasBaseDropZoneOver = true;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );
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

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}

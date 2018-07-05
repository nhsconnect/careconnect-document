import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {EprService} from "../../../service/epr.service";
import {FhirService} from "../../../service/fhir.service";
import {IAlertConfig, TdDialogService} from "@covalent/core";

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrls: ['./binary.component.css']
})
export class BinaryComponent implements OnInit {



  private document : fhir.DocumentReference;

  public docType : string;

  public binaryId : string;

  constructor(public patientEprService : EprService,
              private fhirService : FhirService,
              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef) { }

  ngOnInit() {

     this.document = this.patientEprService.documentReference;

     if (this.document == undefined) {
       let alertConfig : IAlertConfig = { message : 'Unable to locate document.'};
       alertConfig.disableClose =  false; // defaults to false
       alertConfig.viewContainerRef = this._viewContainerRef;
       alertConfig.title = 'Alert'; //OPTIONAL, hides if not provided
       alertConfig.closeButton = 'Close'; //OPTIONAL, defaults to 'CLOSE'
       alertConfig.width = '400px'; //OPTIONAL, defaults to 400px
       this._dialogService.openAlert(alertConfig);
     }

     let array: string[] = this.document.content[0].attachment.url.split('/');
     this.binaryId = array[array.length - 1];

    if (this.binaryId != undefined) {
      if (this.document.content[0].attachment.contentType == 'application/fhir+xml') {
        this.docType = 'fhir';
      } else if (this.document.content[0].attachment.contentType == 'application/pdf') {
        this.docType = 'pdf';
      } else if (this.document.content[0].attachment.contentType.indexOf('image') != -1) {
        this.docType = 'img';
      }
    }

     console.log("DocumentRef Id = "+this.binaryId);


  }

}

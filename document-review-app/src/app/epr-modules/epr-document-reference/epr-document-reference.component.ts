import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {FhirService} from "../../service/fhir.service";
import {IAlertConfig, TdDialogService} from "@covalent/core";

@Component({
  selector: 'app-epr-document-reference',
  templateUrl: './epr-document-reference.component.html',
  styleUrls: ['./epr-document-reference.component.css']
})
export class EprDocumentReferenceComponent implements OnInit {

  @Input() documents :fhir.DocumentReference[];

  @Input() documentsTotal :number;


  constructor(private router: Router, private FhirService : FhirService,
              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

  selectDocument(document : fhir.DocumentReference) {
   // console.log("DocumentRef clicked = " + document.id);
    if (document.content != undefined && document.content.length> 0) {
      let array: string[] = document.content[0].attachment.url.split('/');
      let documentId: string = array[array.length - 1];
      // console.log("DocumentRef Id = "+documentId);

      if (documentId != undefined && document.content[0].attachment.contentType == 'application/fhir+xml') {
        this.router.navigate(['doc/' + documentId]);
      } else if (documentId != undefined && document.content[0].attachment.contentType == 'application/pdf') {
        this.router.navigate(['pdf/' + documentId]);
      } else if (documentId != undefined && document.content[0].attachment.contentType.indexOf('image') != -1) {
        this.router.navigate(['img/' + documentId]);
      }

      else {
        this.FhirService.getBinaryRaw(documentId).subscribe(
          (res) => {
            var fileURL = URL.createObjectURL(res);
            window.open(fileURL);
          }
        );
      }
    } else {
      let alertConfig : IAlertConfig = { message : 'Unable to locate document.'};
      alertConfig.disableClose =  false; // defaults to false
      alertConfig.viewContainerRef = this._viewContainerRef;
      alertConfig.title = 'Alert'; //OPTIONAL, hides if not provided
      alertConfig.closeButton = 'Close'; //OPTIONAL, defaults to 'CLOSE'
      alertConfig.width = '400px'; //OPTIONAL, defaults to 400px
      this._dialogService.openAlert(alertConfig);
    }
  }
}

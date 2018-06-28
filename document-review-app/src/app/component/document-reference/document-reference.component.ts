import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {FhirService} from "../../service/fhir.service";
import {IAlertConfig, TdDialogService} from "@covalent/core";
import {ConditionDataSource} from "../../data-source/condition-data-source";
import {DocumentReferenceDataSource} from "../../data-source/document-reference-data-source";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-document-reference',
  templateUrl: './document-reference.component.html',
  styleUrls: ['./document-reference.component.css']
})
export class DocumentReferenceComponent implements OnInit {

  @Input() documents :fhir.DocumentReference[];

  @Input() documentsTotal :number;

  @Input() patientId : string;

  dataSource : DocumentReferenceDataSource;

  displayedColumns = ['created','type','typelink', 'author', 'custodian', 'mime', 'status', 'open','resource'];

  constructor(private router: Router, private FhirService : FhirService,
              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef,
              public fhirService : FhirService,
              private linksService : LinksService,
              public dialog: MatDialog) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new DocumentReferenceDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new DocumentReferenceDataSource(this.fhirService, undefined, this.documents);
    }
  }

  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }

  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
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

  select(resource) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      resource: resource
    };
    let resourceDialog : MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
  }
}

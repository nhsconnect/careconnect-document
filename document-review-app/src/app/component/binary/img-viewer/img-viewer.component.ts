import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FhirService} from "../../../service/fhir.service";
import {ActivatedRoute} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IAlertConfig, TdDialogService} from "@covalent/core";

@Component({
  selector: 'app-img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.css']
})
export class ImgViewerComponent implements OnInit {

  imgSrc :string= 'http://yellow.testlab.nhs.uk/careconnect-ri/img/nhs_digital_logo.png';



  @Input() document : any;

  constructor(private route: ActivatedRoute,
          private fhirService : FhirService,
          private modalService: NgbModal,
              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef
              ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('binaryId');
    this.getDocument(id);
  }

  getDocument(id : string): void {

   // let modalWaitRef = this.modalService.open( this.modalWait,{ windowClass: 'dark-modal' });

    this.fhirService.getBinaryRaw(id).subscribe(
      (res) => {
        var fileURL = URL.createObjectURL(res);
        console.log(fileURL);
        this.imgSrc =fileURL;
        //modalWaitRef.close();
      },
      (err) => {
        this.showWarnDlg("Unable to load document");
      }

    );

  }

  showWarnDlg(message : string) {
    let alertConfig : IAlertConfig = { message : message};
    alertConfig.disableClose =  false; // defaults to false
    alertConfig.viewContainerRef = this._viewContainerRef;
    alertConfig.title = 'Warning'; //OPTIONAL, hides if not provided
    alertConfig.closeButton = 'Ok'; //OPTIONAL, defaults to 'CLOSE'
    alertConfig.width = '400px'; //OPTIONAL, defaults to 400px
    this._dialogService.openAlert(alertConfig);
  }
}

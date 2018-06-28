import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FhirService} from "../../../service/fhir.service";
import {ActivatedRoute} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.css']
})
export class ImgViewerComponent implements OnInit {

  imgSrc :string= 'http://yellow.testlab.nhs.uk/careconnect-ri/img/nhs_digital_logo.png';

  @ViewChild('modalWait') modalWait;

  @ViewChild('modalIssue') modalIssue;

  @Input() document : any;

  constructor(private route: ActivatedRoute
    , private fhirService : FhirService
    ,private modalService: NgbModal) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('binaryId');
    this.getDocument(id);
  }

  getDocument(id : string): void {

    let modalWaitRef = this.modalService.open( this.modalWait,{ windowClass: 'dark-modal' });

    this.fhirService.getBinaryRaw(id).subscribe(
      (res) => {
        var fileURL = URL.createObjectURL(res);
        console.log(fileURL);
        this.imgSrc =fileURL;
        modalWaitRef.close();
      }
    );

  }
}

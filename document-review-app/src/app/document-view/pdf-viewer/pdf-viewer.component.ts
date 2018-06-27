import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FhirService} from "../../service/fhir.service";
import {ActivatedRoute} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  docId : string;

  @ViewChild('modalWait') modalWait;

  @ViewChild('modalIssue') modalIssue;

  @Input() document : any;

  pdfSrc: string = '';

  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;

  constructor(private route: ActivatedRoute
    , private fhirService : FhirService
    ,private modalService: NgbModal) { }


  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('binaryId');
    this.getDocument(id);
  }


  getDocument(id : string): void {

    this.docId = id;

    let modalWaitRef = this.modalService.open( this.modalWait,{ windowClass: 'dark-modal' });

    this.fhirService.getBinaryRaw(id).subscribe(
      (res) => {
        var fileURL = URL.createObjectURL(res);
        this.pdfSrc=fileURL;
        modalWaitRef.close();
      }
    );

  }
  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

}

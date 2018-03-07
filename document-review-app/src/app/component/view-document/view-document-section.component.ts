import {Component, Input, OnInit} from '@angular/core';
import {SectionReferencesModalComponent} from "../section-references-modal/section-references-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Modal} from "ngx-modialog";

@Component({
  selector: 'app-view-document-section',
  templateUrl: './view-document-section.component.html',
  styleUrls: ['./view-document-section.component.css']
})
export class ViewDocumentSectionComponent implements OnInit {

  @Input() section : fhir.CompositionSection;

  @Input() structuredText : string;

  @Input() structuredTitle : string;

  constructor(
    //public modal: Modal
  ) { }

  ngOnInit() {
  }
  /*
  oonClick() {
    const dialogRef = this.modal.alert()
      .size('lg')
      .showClose(true)
      .title('A simple Alert style modal window')
      .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
      .open();

    dialogRef.result
      .then( result => alert(`The result is: ${result}`) );
  }*/

}
